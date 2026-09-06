/**
 * Layered background atmosphere: two offset color blobs + a diagonal
 * light leak, optionally a smoke/fog base. This is what gives the
 * hero, prize pool and final CTA their "energy render" quality
 * instead of a flat single-color radial wash. Kept as one component
 * so the same treatment is consistent everywhere it's used.
 */
export default function Atmosphere({
  variant = "fusion",
  fog = false,
  className = "",
}: {
  variant?: "fusion" | "tech" | "creative";
  fog?: boolean;
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      {fog && <div className="absolute inset-0 smoke-fog" />}

      {(variant === "fusion" || variant === "tech") && (
        <div
          className="absolute atmosphere-violet"
          style={{
            width: "60%",
            height: "70%",
            left: variant === "fusion" ? "-8%" : "20%",
            top: "-10%",
          }}
        />
      )}
      {(variant === "fusion" || variant === "creative") && (
        <div
          className="absolute atmosphere-crimson"
          style={{
            width: "55%",
            height: "65%",
            right: variant === "fusion" ? "-10%" : "15%",
            bottom: "-15%",
          }}
        />
      )}
      <div className="absolute inset-0 light-leak" />
    </div>
  );
}