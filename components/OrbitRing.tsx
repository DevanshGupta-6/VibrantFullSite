/**
 * The recurring fine-line "orbit" motif referenced throughout the
 * brief — a single thin circle, used occasionally (Hero, About,
 * Prize Pool, Organizers, final CTA) as a quiet visual signature.
 * Never filled, never glowing, never decorative-for-its-own-sake.
 */
export default function OrbitRing({
  size = 420,
  color = "vibeesta",
  className = "",
  dashed = false,
}: {
  size?: number;
  color?: "vibeesta" | "shrinik" | "neutral";
  className?: string;
  dashed?: boolean;
}) {
  const stroke =
    color === "vibeesta"
      ? "rgba(168,85,247,0.22)"
      : color === "shrinik"
      ? "rgba(185,28,61,0.22)"
      : "rgba(124,118,144,0.14)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="50"
        cy="50"
        r="49"
        fill="none"
        stroke={stroke}
        strokeWidth="0.4"
        strokeDasharray={dashed ? "1.4 3" : undefined}
      />
    </svg>
  );
}