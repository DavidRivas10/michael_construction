// ---------------------------------------------------------------------------
// Marca "Maykar Professional Painting" — reinterpretada en SVG a partir del
// concepto final aprobado en el moodboard (roofline de dos aguas
// superpuestas + ventana central, wordmark condensado en dos líneas y
// tagline "Quality Spaces. Stronger Lives."). Vive como componente inline
// en vez de un archivo de imagen exportado para poder recolorearla según
// el fondo (variant "dark" = marca azul-marino/gris para header/footer
// claros, "light" = marca blanca para el hero con foto y fondos oscuros)
// sin mantener múltiples PNG ni arrastrar nunca un rectángulo blanco
// detrás del logo.
// ---------------------------------------------------------------------------

export function LogoIcon({ className = "h-8 w-8", variant = "dark" }) {
  const front = variant === "light" ? "#FFFFFF" : "#1C2D4A";
  const back = variant === "light" ? "rgba(255,255,255,0.5)" : "#9098A8";
  const punch = variant === "light" ? "#0A0F1C" : "#FFFFFF";

  return (
    <svg viewBox="0 0 64 52" className={className} role="img" aria-hidden="true">
      {/* Segunda agua (gris), desplazada a la derecha y más alta — se asoma
          detrás del techo principal */}
      <path d="M25 30 L41 6 L57 30 Z" fill={back} />
      {/* Agua principal (azul marino / blanca), al frente y a la izquierda */}
      <path d="M3 32 L27 9 L51 32 Z" fill={front} />
      {/* Ventana de 4 paneles en el punto donde se cruzan ambas aguas */}
      <rect x="21" y="21" width="12" height="11" rx="0.5" fill={punch} />
      <path d="M27 21 V32 M21 26.5 H33" stroke={front} strokeWidth="1.3" />
    </svg>
  );
}

export function LogoMark({ className = "", variant = "dark", tagline = false, size = "md" }) {
  const textColor = variant === "light" ? "text-white" : "text-navy";
  const subColor = variant === "light" ? "text-white/60" : "text-ink-faint";
  const taglineColor = variant === "light" ? "text-white/45" : "text-ink-faint";
  const iconSize = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const nameSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-lg";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon className={`${iconSize} shrink-0`} variant={variant} />
      <div className="leading-[1.05]">
        <div className={`font-display ${nameSize} font-bold uppercase tracking-wide ${textColor}`}>
          Maykar
        </div>
        <div className={`-mt-0.5 font-sans text-[0.34em] font-semibold uppercase tracking-[0.28em] ${subColor}`}>
          Professional Painting
        </div>
        {tagline && (
          <div className={`mt-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${taglineColor}`}>
            Quality Spaces. Stronger Lives.
          </div>
        )}
      </div>
    </div>
  );
}
