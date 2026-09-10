export default function BeforeAfter({ title, location, height = "h-44" }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white">
      <div className={`grid grid-cols-2 ${height}`}>
        <div className="placeholder-photo flex items-center justify-center text-[11px] font-bold tracking-wide text-ink-muted">
          ANTES
        </div>
        <div className="flex items-center justify-center bg-orange-soft text-[11px] font-bold tracking-wide text-orange-dark">
          DESPUÉS
        </div>
      </div>
      <div className="p-4">
        <div className="font-bold text-navy">{title}</div>
        <div className="text-[13px] text-ink-muted">{location}</div>
      </div>
    </div>
  );
}
