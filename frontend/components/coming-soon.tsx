export function ComingSoon({
  title,
  description,
  bullets,
}: {
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <div className="rise space-y-4">
      <h1 className="font-display text-xl font-semibold tracking-tight text-fg">{title}</h1>
      <div className="panel max-w-2xl p-6">
        <p className="eyebrow mb-3">In the next build phase</p>
        <p className="text-sm leading-relaxed text-fg-2">{description}</p>
        <ul className="mt-4 space-y-1.5">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2.5 text-sm text-fg-2">
              <span className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-accent" aria-hidden />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
