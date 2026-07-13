interface SectionDividerProps {
  id: string;
  index: number;
  label: string;
}

export default function SectionDivider({ id, index, label }: SectionDividerProps) {
  return (
    <div id={id} className="scroll-mt-36 bg-navy-deep">
      <div className="max-w-container-max-width mx-auto px-6 py-6 flex items-center gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-on-primary/10 font-headline-sm text-sm font-bold text-on-primary">
          {index}
        </span>
        <p className="font-label-bold text-label-bold text-on-primary uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}
