/** Paw-print glyph, decorative. Inherits colour from `currentColor`. */
export default function Paw({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="currentColor">
      <ellipse cx="12" cy="16" rx="6.5" ry="5.5" />
      <ellipse cx="4" cy="8" rx="2.6" ry="3.4" />
      <ellipse cx="9" cy="3.6" rx="2.6" ry="3.4" />
      <ellipse cx="15" cy="3.6" rx="2.6" ry="3.4" />
      <ellipse cx="20" cy="8" rx="2.6" ry="3.4" />
    </svg>
  );
}

/**
 * A row of paw prints that "walk" across the section one after another.
 * Purely decorative; static (all visible) under reduced motion.
 */
export function PawTrail({ count = 9, className = "" }: { count?: number; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none flex items-end gap-6 sm:gap-10 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`inline-block ${i % 2 ? "-translate-y-3 rotate-[100deg]" : "rotate-[80deg]"}`}>
          <span className="block motion-safe:animate-paw-step" style={{ animationDelay: `${i * 0.35}s` }}>
            <Paw className="h-6 w-6 sm:h-7 sm:w-7" />
          </span>
        </span>
      ))}
    </div>
  );
}
