export default function LoadingScreen({
  label = "Loading",
}: {
  label?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-[#07070B]"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="flex w-full max-w-sm flex-col items-center px-6 text-center">
        {/* VIBRANT wordmark */}
        <div className="relative overflow-hidden">
          <h1 className="font-display text-5xl font-black tracking-[0.18em] text-ink-0 sm:text-6xl">
            VIBRANT
          </h1>

          {/* Shimmer sweep */}
          <div
            className="pointer-events-none absolute inset-y-0 left-[-60%] w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-loading-shimmer"
            aria-hidden="true"
          />
        </div>

        {/* Loading text */}
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-ink-500">
          {label}
        </p>

        {/* Shimmer loading bar */}
        <div className="relative mt-6 h-[2px] w-48 overflow-hidden rounded-full bg-ink-800">
          <div
            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-vibeesta-400 to-transparent animate-loading-bar"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}