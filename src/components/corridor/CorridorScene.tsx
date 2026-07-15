import gargoyleImg from '../../assets/gargoyle.png';

// Static first-person corridor backdrop (walls, vanishing point, gargoyle).
// The lantern + its light ring live in LanternHud instead, rendered above
// the QuestionCard's modal backdrop so it stays visible while answering.
export function CorridorScene() {
  return (
    <div className="fixed inset-y-0 left-1/2 -z-10 w-full max-w-md -translate-x-1/2 bg-[#0b0812]">
      <svg
        className="h-full w-full"
        viewBox="0 0 400 700"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="corridor-vp-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f4d999" />
            <stop offset="55%" stopColor="#8a6a2f" />
            <stop offset="100%" stopColor="#241b12" />
          </radialGradient>
          <linearGradient id="corridor-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a4058" />
            <stop offset="100%" stopColor="#221c2c" />
          </linearGradient>
          <linearGradient id="corridor-ceiling" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2236" />
            <stop offset="100%" stopColor="#1a1522" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="400" height="700" fill="#0b0812" />

        <polygon points="20,650 380,650 230,300 170,300" fill="url(#corridor-floor)" />
        <polygon points="20,50 380,50 230,220 170,220" fill="url(#corridor-ceiling)" />
        <polygon points="20,650 20,50 170,220 170,300" fill="#332b40" stroke="#463a54" strokeWidth="1" />
        <polygon points="380,650 380,50 230,220 230,300" fill="#3d3249" stroke="#524361" strokeWidth="1" />

        <line x1="20" y1="650" x2="170" y2="300" stroke="#5a4c6b" strokeWidth="1" opacity="0.5" />
        <line x1="380" y1="650" x2="230" y2="300" stroke="#5a4c6b" strokeWidth="1" opacity="0.5" />
        <line x1="60" y1="500" x2="160" y2="290" stroke="#5a4c6b" strokeWidth="0.5" opacity="0.3" />
        <line x1="340" y1="500" x2="240" y2="290" stroke="#5a4c6b" strokeWidth="0.5" opacity="0.3" />

        <path d="M170,300 L170,235 Q200,195 230,235 L230,300 Z" fill="url(#corridor-vp-glow)" />

        <path
          d="M50,600 L50,150 Q120,110 190,150 L190,255"
          fill="none"
          stroke="#221c2c"
          strokeWidth="4"
          opacity="0.7"
        />
        <path
          d="M350,600 L350,150 Q280,110 210,150 L210,255"
          fill="none"
          stroke="#221c2c"
          strokeWidth="4"
          opacity="0.7"
        />

        <ellipse cx="302" cy="200" rx="52" ry="12" fill="#000" opacity="0.35" />
        <image href={gargoyleImg} x="245" y="56" width="115" height="144" preserveAspectRatio="xMidYMid meet" />
      </svg>
    </div>
  );
}
