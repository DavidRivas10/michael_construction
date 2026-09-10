// ---------------------------------------------------------------------------
// Lightweight decorative illustrations used to fill spots that would
// otherwise be blank placeholder boxes (hero image, service-area block)
// until real photos/maps are added. Pure inline SVG — no external images,
// no network requests, matches the site's own palette (gold/charcoal/paper).
// ---------------------------------------------------------------------------

export function HeroArt({ className = "" }) {
  return (
    <svg viewBox="0 0 480 420" className={className} role="img" aria-label="Illustration of a home being painted">
      <rect width="480" height="420" fill="#F6F7F5" />
      <rect width="480" height="420" fill="url(#hero-dots)" opacity="0.5" />

      {/* Gold brush stroke sweeping across the top-right corner */}
      <path
        d="M480 0 C 380 20, 340 70, 360 130 C 375 175, 440 180, 480 150 Z"
        fill="#F3E7CD"
      />
      <path
        d="M480 0 C 400 15, 365 55, 378 105 C 388 145, 440 150, 480 128 Z"
        fill="#B8862E"
        opacity="0.9"
      />

      {/* House */}
      <g transform="translate(90 150)">
        <path d="M0 130 H300" stroke="#DBDFD9" strokeWidth="3" strokeLinecap="round" />
        <path d="M20 130 V60 L150 -10 L280 60 V130" fill="none" stroke="#1B1E1B" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" />
        <rect x="60" y="80" width="55" height="50" fill="none" stroke="#1B1E1B" strokeWidth="5" />
        <rect x="185" y="80" width="55" height="50" fill="none" stroke="#1B1E1B" strokeWidth="5" />
        <rect x="135" y="90" width="30" height="40" fill="#B8862E" />
      </g>

      {/* Paint roller + drip, bottom-left accent */}
      <g transform="translate(40 300)">
        <rect x="0" y="18" width="70" height="26" rx="4" fill="#8F6A22" />
        <rect x="70" y="26" width="10" height="10" fill="#8F6A22" />
        <path d="M80 31 h34" stroke="#1B1E1B" strokeWidth="6" strokeLinecap="round" />
        <path d="M114 31 v-40" stroke="#1B1E1B" strokeWidth="6" strokeLinecap="round" />
        <circle cx="26" cy="60" r="4" fill="#B8862E" />
        <circle cx="46" cy="70" r="3" fill="#B8862E" />
      </g>

      <defs>
        <pattern id="hero-dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="#DBDFD9" />
        </pattern>
      </defs>
    </svg>
  );
}

export function InteriorArt({ className = "" }) {
  return (
    <svg viewBox="0 0 480 420" className={className} role="img" aria-label="Illustration of interior wall painting">
      <rect width="480" height="420" fill="#F6F7F5" />
      <rect width="480" height="420" fill="url(#interior-dots)" opacity="0.5" />

      {/* Wall panel, half already painted (the "reveal" motif) */}
      <rect x="70" y="60" width="340" height="230" fill="none" stroke="#DBDFD9" strokeWidth="3" />
      <rect x="73" y="63" width="164" height="224" fill="#F3E7CD" />

      {/* Ladder */}
      <g transform="translate(290 60)">
        <path d="M0 230 L20 0 M60 230 L40 0" stroke="#1B1E1B" strokeWidth="6" strokeLinecap="round" />
        <path d="M4 190 H56 M8 150 H52 M12 110 H48 M16 70 H44 M20 30 H40" stroke="#1B1E1B" strokeWidth="5" />
      </g>

      {/* Roller on extension pole, mid-stroke over the painted/unpainted line */}
      <g transform="translate(150 150) rotate(-18)">
        <rect x="-6" y="0" width="12" height="150" rx="5" fill="#8F6A22" />
        <rect x="-34" y="140" width="68" height="34" rx="8" fill="#B8862E" />
      </g>

      {/* Paint can + drips at the base */}
      <g transform="translate(90 250)">
        <rect x="0" y="10" width="56" height="42" rx="3" fill="#1B1E1B" />
        <rect x="0" y="10" width="56" height="10" fill="#B8862E" />
        <path d="M6 0 h44 l-6 10 h-32 z" fill="#1B1E1B" />
        <circle cx="70" cy="56" r="4" fill="#B8862E" />
        <circle cx="84" cy="48" r="3" fill="#B8862E" />
      </g>

      <defs>
        <pattern id="interior-dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="#DBDFD9" />
        </pattern>
      </defs>
    </svg>
  );
}

export function RepairArt({ className = "" }) {
  return (
    <svg viewBox="0 0 480 420" className={className} role="img" aria-label="Illustration of home repair tools">
      <rect width="480" height="420" fill="#F6F7F5" />
      <rect width="480" height="420" fill="url(#repair-dots)" opacity="0.5" />

      {/* Toolbox */}
      <g transform="translate(150 220)">
        <rect x="0" y="30" width="180" height="90" rx="6" fill="#1B1E1B" />
        <rect x="0" y="30" width="180" height="14" fill="#B8862E" />
        <path d="M60 30 V0 h60 v30" fill="none" stroke="#1B1E1B" strokeWidth="8" strokeLinejoin="round" />
        <rect x="20" y="70" width="50" height="34" fill="#F6F7F5" opacity="0.15" />
        <rect x="110" y="70" width="50" height="34" fill="#F6F7F5" opacity="0.15" />
      </g>

      {/* Wrench, large accent */}
      <g transform="translate(120 80) rotate(28)">
        <path
          d="M0 26 a26 26 0 1 1 26 26 a26 26 0 0 1 -18-7 l-70 70 -14-14 70-70 a26 26 0 0 1 6-31Z"
          fill="#B8862E"
        />
        <circle cx="26" cy="26" r="11" fill="#F6F7F5" />
      </g>

      {/* Screwdriver */}
      <g transform="translate(300 70) rotate(15)">
        <rect x="0" y="0" width="14" height="80" rx="3" fill="#8F6A22" />
        <rect x="-3" y="80" width="20" height="60" rx="3" fill="#1B1E1B" />
        <rect x="1" y="145" width="12" height="30" fill="#DBDFD9" />
      </g>

      <circle cx="380" cy="260" r="5" fill="#B8862E" />
      <circle cx="360" cy="290" r="3.5" fill="#B8862E" />

      <defs>
        <pattern id="repair-dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="#DBDFD9" />
        </pattern>
      </defs>
    </svg>
  );
}

export function MapArt({ className = "" }) {
  return (
    <svg viewBox="0 0 400 260" className={className} role="img" aria-label="Illustration of a service area map">
      <rect width="400" height="260" fill="#ECEEEA" />
      <rect width="400" height="260" fill="url(#map-dots)" />

      {/* Winding roads */}
      <path d="M-10 60 C 90 30, 140 90, 230 70 S 380 20, 420 40" fill="none" stroke="#fff" strokeWidth="10" />
      <path d="M-10 60 C 90 30, 140 90, 230 70 S 380 20, 420 40" fill="none" stroke="#DBDFD9" strokeWidth="2" strokeDasharray="6 6" />

      <path d="M-10 190 C 100 220, 180 150, 260 190 S 360 240, 420 210" fill="none" stroke="#fff" strokeWidth="10" />
      <path d="M-10 190 C 100 220, 180 150, 260 190 S 360 240, 420 210" fill="none" stroke="#DBDFD9" strokeWidth="2" strokeDasharray="6 6" />

      <path d="M120 -10 C 150 60, 90 120, 130 190 S 180 260, 160 280" fill="none" stroke="#fff" strokeWidth="10" />

      {/* Coverage circle */}
      <circle cx="200" cy="128" r="70" fill="#B8862E" opacity="0.12" />
      <circle cx="200" cy="128" r="70" fill="none" stroke="#B8862E" strokeWidth="1.5" strokeDasharray="4 5" />

      {/* Pin */}
      <g transform="translate(200 128)">
        <path d="M0 -34 C 18 -34 32 -20 32 -2 C 32 22 0 46 0 46 C 0 46 -32 22 -32 -2 C -32 -20 -18 -34 0 -34 Z" fill="#1B1E1B" />
        <circle cx="0" cy="-2" r="12" fill="#F6F7F5" />
      </g>

      <defs>
        <pattern id="map-dots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#DBDFD9" />
        </pattern>
      </defs>
    </svg>
  );
}