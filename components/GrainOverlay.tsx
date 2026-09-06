/**
 * A single, site-wide, extremely faint noise layer. This exists for
 * one reason only: to stop the interface from reading as perfectly
 * flat digital gradients — the single biggest tell of an
 * AI-generated template. It is rendered once via SVG turbulence
 * (no image download, no runtime cost) and never redrawn.
 */
export default function GrainOverlay() {
  return (
    <svg
      className="grain-overlay"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="vibrant-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#vibrant-grain)" />
    </svg>
  );
}