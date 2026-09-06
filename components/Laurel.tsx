export default function Laurel({ flip = false, className = "" }: { flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 90"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      fill="none"
      stroke="#C9A24B"
      strokeWidth="0.9"
      aria-hidden="true"
    >
      {Array.from({ length: 7 }).map((_, i) => {
        const y = 8 + i * 11;
        return (
          <path
            key={i}
            d={`M 34 ${y} C 20 ${y - 4}, 12 ${y + 2}, 4 ${y + 6}`}
            opacity={0.55 + i * 0.05}
          />
        );
      })}
      <path d="M 34 4 C 20 30, 14 55, 10 82" opacity="0.5" />
    </svg>
  );
}