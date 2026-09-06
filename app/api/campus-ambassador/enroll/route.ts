import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";

import {
  campusAmbassadorRedis,
  AMBASSADOR_COUNTER_KEY,
  AMBASSADOR_SET_KEY,
  ambassadorKey,
  type Ambassador,
} from "@/lib/campusAmbassador/redis";

const enrollmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name is too long."),

  contact: z
    .string()
    .trim()
    .min(5, "Please enter valid contact details.")
    .max(100, "Contact details are too long."),

  branch: z
    .string()
    .trim()
    .min(2, "Branch is required.")
    .max(50, "Branch is too long."),
});

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function duplicateKey(
  name: string,
  contact: string,
  branch: string
) {
  return crypto
    .createHash("sha256")
    .update(
      `${normalize(name)}|${normalize(contact)}|${normalize(branch)}`
    )
    .digest("hex");
}

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const parsed = enrollmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid enrollment data.",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, contact, branch } = parsed.data;

    const duplicateHash = duplicateKey(
      name,
      contact,
      branch
    );

    const duplicateRedisKey =
      `ca:duplicate:${duplicateHash}`;

    /*
     * Reserve this enrollment atomically.
     *
     * NX means:
     * "Create only if this key does not already exist."
     */
    const reserved = await campusAmbassadorRedis.set(
      duplicateRedisKey,
      "1",
      {
        nx: true,
        ex: 365 * 24 * 60 * 60,
      }
    );

    if (reserved !== "OK") {
      return NextResponse.json(
        {
          error:
            "You are already registered as a Campus Ambassador.",
        },
        { status: 409 }
      );
    }

    /*
     * INCR is atomic.
     *
     * Multiple simultaneous registrations cannot receive
     * the same number.
     */
    const numericId = await campusAmbassadorRedis.incr(
      AMBASSADOR_COUNTER_KEY
    );

    const referralCode =
      `CA${String(numericId).padStart(3, "0")}`;

    const ambassador: Ambassador = {
      name,
      contact,
      branch,
      code: referralCode,
      enrolledAt: new Date().toISOString(),
    };

    /*
     * Store the actual ambassador as an individual Redis hash.
     */
    await campusAmbassadorRedis.hset(
      ambassadorKey(referralCode),
      {
        name: ambassador.name,
        contact: ambassador.contact,
        branch: ambassador.branch,
        code: ambassador.code,
        enrolledAt: ambassador.enrolledAt,
      }
    );

    /*
     * Keep a SET containing all ambassador codes.
     */
    await campusAmbassadorRedis.sadd(
      AMBASSADOR_SET_KEY,
      referralCode
    );

    return NextResponse.json({
      success: true,
      referralCode,
    });
  } catch (error) {
    console.error(
      "Campus ambassador enrollment failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to complete enrollment. Please try again later.",
      },
      { status: 500 }
    );
  }
}