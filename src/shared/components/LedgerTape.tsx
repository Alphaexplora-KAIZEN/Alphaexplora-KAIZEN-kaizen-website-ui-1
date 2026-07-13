interface LedgerTapeProps {
  items: string[];
  className?: string;
}

/**
 * A running ledger tape — the homepage's one signature motion element,
 * distinct from the scroll-triggered fade-ups used everywhere else on the
 * page. It reads as an accountant's tape or a stock ticker: a continuous,
 * unbroken line, which is exactly the promise the copy in it is making
 * (property management + cleaning + aircon, on T.I.M.E., without gaps).
 * Content is passed in from real page data rather than invented filler, and
 * the row is duplicated once so the CSS animation loops seamlessly.
 */
export default function LedgerTape({ items, className = '' }: LedgerTapeProps) {
  const loop = [...items, ...items];

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden border-y border-gold/15 bg-navy-deep/70 bg-grain ${className}`}
    >
      <div className="flex w-max animate-ticker hover:[animation-play-state:paused]">
        {loop.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-3 py-3 pr-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/70">{item}</span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-gold/40" />
          </span>
        ))}
      </div>
    </div>
  );
}
