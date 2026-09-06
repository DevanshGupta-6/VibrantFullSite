/**
 * Each event gets a small, bespoke, thin-line motif rather than a
 * generic icon-library glyph — reinforcing that these are individual
 * "event posters," not interchangeable dashboard cards. Monochrome,
 * inherits currentColor, never filled.
 */
export default function EventMotif({ id, className = "" }: { id: string; className?: string }) {
  const common = {
    viewBox: "0 0 40 40",
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 0.8,
    "aria-hidden": true as const,
  };

  switch (id) {
    case "hackathon":
      // circuit / code structure
      return (
        <svg {...common}>
          <path d="M6 12 L14 12 L14 20 L26 20 L26 28 L34 28" />
          <circle cx="6" cy="12" r="1.4" />
          <circle cx="34" cy="28" r="1.4" />
          <path d="M10 30 L16 34 L10 38" />
        </svg>
      );
    case "prompt-war":
      // fragmented type marks
      return (
        <svg {...common}>
          <path d="M6 10 H20 M6 16 H28 M6 22 H14" />
          <path d="M24 24 L34 34 M34 24 L24 34" />
        </svg>
      );
    case "bug-bounty":
      // security grid
      return (
        <svg {...common}>
          <rect x="8" y="8" width="24" height="24" />
          <path d="M8 16 H32 M8 24 H32 M16 8 V32 M24 8 V32" />
        </svg>
      );
    case "ideathon":
      // abstract lightbulb geometry
      return (
        <svg {...common}>
          <circle cx="20" cy="16" r="9" />
          <path d="M16 25 H24 M17 29 H23 M20 7 V3" />
        </svg>
      );
    case "fashion-modeling":
      // abstract silhouette
      return (
        <svg {...common}>
          <path d="M20 6 C24 6 26 10 24 14 C30 18 30 30 26 34 H14 C10 30 10 18 16 14 C14 10 16 6 20 6 Z" />
        </svg>
      );
    case "film-making":
      // film-frame geometry
      return (
        <svg {...common}>
          <rect x="6" y="10" width="28" height="20" />
          <path d="M6 15 H12 M6 25 H12 M34 15 H28 M34 25 H28" />
        </svg>
      );
    case "music-competition":
      // minimal waveform
      return (
        <svg {...common}>
          <path d="M6 20 H10 V14 H14 V26 H18 V10 H22 V30 H26 V16 H30 V24 H34 V20" />
        </svg>
      );
    case "choreography":
      // motion line figure
      return (
        <svg {...common}>
          <circle cx="20" cy="9" r="2.4" />
          <path d="M20 13 V22 M20 16 L12 20 M20 16 L28 12 M20 22 L14 32 M20 22 L27 30" />
        </svg>
      );
    case "art-showcase":
      // brush / abstract line
      return (
        <svg {...common}>
          <path d="M8 30 C14 18 18 26 22 16 C26 8 30 12 33 6" />
          <circle cx="33" cy="6" r="1.2" />
        </svg>
      );
    case "open-mic":
      // mic with soundwave
      return (
        <svg {...common}>
          <rect x="17" y="6" width="6" height="12" rx="3" />
          <path d="M12 16 C12 22 16 25 20 25 C24 25 28 22 28 16 M20 25 V32 M15 32 H25" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="20" cy="20" r="10" />
        </svg>
      );
  }
}