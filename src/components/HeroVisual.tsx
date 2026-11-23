import Image from "next/image";
import { images } from "@/config/images";

/** Hero visual: real photo when configured, otherwise a lightweight inline illustration (no layout shift). */
export function HeroVisual() {
  if (images.hero) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-card-hover">
        <Image src={images.hero.src} alt={images.hero.alt} fill priority sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
      </div>
    );
  }
  return (
    <div className="relative aspect-[4/3] w-full" role="img" aria-label="Illustration of a technician's workbench with a television being repaired">
      <svg viewBox="0 0 560 420" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="hv-screen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1A4677" />
            <stop offset="1" stopColor="#081A2E" />
          </linearGradient>
          <linearGradient id="hv-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F58220" stopOpacity="0.35" />
            <stop offset="1" stopColor="#F58220" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="560" height="420" rx="28" fill="#0D2744" />
        <circle cx="470" cy="70" r="120" fill="#12345A" />
        {/* TV */}
        <rect x="70" y="60" width="380" height="230" rx="14" fill="#0b1726" stroke="#2c5a8f" strokeWidth="4" />
        <rect x="84" y="74" width="352" height="202" rx="6" fill="url(#hv-screen)" />
        {/* Backlight strips being tested */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <rect x="104" y={92 + i * 36} width="312" height="8" rx="4" fill="#24507f" />
            {Array.from({ length: 9 }).map((_, j) => (
              <circle key={j} cx={124 + j * 34} cy={96 + i * 36} r="3.2" fill={i === 2 && j > 5 ? "#3b4a5c" : "#FFD9B5"} />
            ))}
          </g>
        ))}
        <rect x="84" y="74" width="352" height="90" fill="url(#hv-glow)" />
        {/* Stand */}
        <rect x="235" y="290" width="50" height="22" fill="#2c5a8f" />
        <rect x="190" y="310" width="140" height="10" rx="5" fill="#2c5a8f" />
        {/* Bench */}
        <rect x="30" y="330" width="500" height="14" rx="7" fill="#1A4677" />
        {/* Multimeter */}
        <g transform="translate(400 238)">
          <rect width="96" height="132" rx="14" fill="#F58220" />
          <rect x="12" y="14" width="72" height="34" rx="6" fill="#FFF4EA" />
          <text x="48" y="38" textAnchor="middle" fontFamily="monospace" fontSize="18" fontWeight="700" fill="#12345A">
            24.0V
          </text>
          <circle cx="48" cy="86" r="22" fill="#DE6F10" stroke="#FFF4EA" strokeWidth="4" />
          <line x1="48" y1="86" x2="62" y2="74" stroke="#FFF4EA" strokeWidth="4" strokeLinecap="round" />
        </g>
        {/* Probe leads */}
        <path d="M420 370 C 380 395, 330 380, 300 250" stroke="#ef4444" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M470 370 C 470 400, 360 410, 340 250" stroke="#0b1726" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Screwdriver */}
        <g transform="translate(60 352) rotate(-8)">
          <rect width="70" height="16" rx="8" fill="#F58220" />
          <rect x="70" y="5" width="60" height="6" rx="3" fill="#A9BFDA" />
        </g>
      </svg>
    </div>
  );
}
