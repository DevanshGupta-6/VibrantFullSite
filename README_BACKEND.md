# VIBRANT 2K26 — Supabase Backend

This version uses Supabase end-to-end for the backend layer:

- Supabase Auth for admin authentication and secure cookie sessions.
- Supabase Postgres/Data API for application data.
- Row Level Security (RLS) for public/own-profile access.
- A server-only Supabase secret key for privileged admin mutations after application-level permission checks.
- Upstash Redis for authentication and mutation rate limiting.

## Setup

1. Create a Supabase project.
2. In SQL Editor, run `supabase/migrations/001_initial.sql`.
3. Create a publishable key and a secret key in Supabase API Keys.
4. Copy `.env.example` to `.env.local` and populate the variables.
5. Run `npm install`.
6. Run `npm run supabase:seed`.
7. Run `npm run dev`.

The seed imports the existing JSON content into Supabase and is idempotent for roles/permissions and deterministic content where IDs are available.

## First SUPER_ADMIN

Set `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD` only in the local/server environment, then run `npm run supabase:seed`. The seed creates the first Supabase Auth user and links it to the `SUPER_ADMIN` role. Never put these credentials in source control.

Public registration always creates a `PENDING` COORDINATOR account. A client cannot select `SUPER_ADMIN` during registration.

## Runtime architecture

Browser/Server Components -> Supabase SSR client -> Supabase Auth/PostgREST -> RLS/Postgres.

Protected admin mutations first call `requireAuth()` and `requirePermission()` and then use the server-only Supabase secret client. The secret key never reaches the browser.

## Migration from the old project

The old `data/*.json` files remain only as seed/reference material. Runtime reads and writes are performed through Supabase. No Prisma client or NextAuth dependency remains.

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `INITIAL_ADMIN_EMAIL`
- `INITIAL_ADMIN_PASSWORD`
- `NEXT_PUBLIC_SITE_URL`

Legacy `SUPABASE_SERVICE_ROLE_KEY` is accepted as a fallback in the server client, but new projects should use `SUPABASE_SECRET_KEY`.
