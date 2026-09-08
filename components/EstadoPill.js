const STYLES = {
  nuevo: "bg-gold-soft text-gold-dark",
  contactado: "bg-paper-3 text-ink",
  agendado: "bg-paper-3 text-ink",
  cerrado: "bg-paper-2 text-ink-faint",
};

export default function EstadoPill({ estado }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${STYLES[estado] || STYLES.nuevo}`}>
      {estado}
    </span>
  );
}
