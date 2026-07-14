import type { MbtiAxis, MbtiPole } from '../../data/mbtiQuestions';
import type { MbtiAxisResult } from '../../lib/scoring/mbtiScoring';

const AXIS_ANGLE: Record<MbtiAxis, number> = {
  EI: 0,
  SN: 90,
  TF: 180,
  JP: 270,
};

const AXIS_POLES: Record<MbtiAxis, [MbtiPole, MbtiPole]> = {
  EI: ['E', 'I'],
  SN: ['S', 'N'],
  TF: ['T', 'F'],
  JP: ['J', 'P'],
};

const WARM = '#ffb648';
const COOL = '#6fa8dc';
const DIM = '#8a7358';

function polarToXY(angleDeg: number, r: number, cx: number, cy: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

interface CorridorSceneProps {
  axisResults: Record<MbtiAxis, MbtiAxisResult>;
  activeAxis: MbtiAxis;
}

export function CorridorScene({ axisResults, activeAxis }: CorridorSceneProps) {
  const ringCenter = { x: 200, y: 553 };
  const ringRadius = 26;

  return (
    <div className="fixed inset-0 -z-10 bg-[#0b0812]">
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
          <radialGradient id="corridor-lantern-glow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#ffe9b0" />
            <stop offset="70%" stopColor="#c98a3a" />
            <stop offset="100%" stopColor="#5a3d1a" />
          </radialGradient>
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

        <g transform="translate(305,155) scale(0.6)">
          <ellipse cx="0" cy="60" rx="46" ry="14" fill="#000" opacity="0.35" />
          <path
            d="M-30,10 Q-45,-25 -15,-45 Q0,-58 15,-45 Q45,-25 30,10 Q30,45 0,55 Q-30,45 -30,10 Z"
            fill="#463a4e"
          />
          <path d="M-30,-10 L-58,-35 L-32,-18 Z" fill="#3a2f42" />
          <path d="M30,-10 L58,-35 L32,-18 Z" fill="#3a2f42" />
          <path d="M-14,-46 L-8,-64 L-2,-46 Z" fill="#463a4e" />
          <path d="M14,-46 L8,-64 L2,-46 Z" fill="#463a4e" />
          <circle cx="-10" cy="-18" r="4" fill="#f2b84a" />
          <circle cx="10" cy="-18" r="4" fill="#f2b84a" />
        </g>

        <g transform="translate(200,615)">
          <path d="M-18,90 Q-40,40 -30,-10 L30,-10 Q40,40 18,90 Z" fill="#2a2333" />
          <path d="M-30,-10 Q0,-28 30,-10" fill="none" stroke="#8a7a52" strokeWidth="6" strokeLinecap="round" />
          <rect x="-46" y="-95" width="92" height="90" rx="6" fill="#332a24" stroke="#8a7a52" strokeWidth="3" />
          <path d="M-38,-95 Q0,-120 38,-95" fill="none" stroke="#8a7a52" strokeWidth="5" strokeLinecap="round" />
          <circle cx="0" cy="-105" r="5" fill="#8a7a52" />
          <rect x="-36" y="-85" width="72" height="70" rx="4" fill="url(#corridor-lantern-glow)" />
        </g>

        {(Object.keys(AXIS_ANGLE) as MbtiAxis[]).map((axis) => {
          const baseAngle = AXIS_ANGLE[axis];
          const [poleA, poleB] = AXIS_POLES[axis];
          const result = axisResults[axis];
          const isActive = axis === activeAxis;
          const started = result.total > 0;

          return [poleA, poleB].map((pole, i) => {
            const angle = baseAngle + (i === 0 ? -16 : 16);
            const { x, y } = polarToXY(angle, ringRadius, ringCenter.x, ringCenter.y);
            const isWinner = started && result.winner === pole;
            const color = pole === poleA ? WARM : COOL;
            const opacity = !started ? 0.3 : isWinner ? 0.5 + 0.5 * result.strength : 0.25;

            return (
              <circle
                key={pole}
                cx={x}
                cy={y}
                r={isActive ? 4.5 : 3}
                fill={started ? color : DIM}
                opacity={opacity}
              />
            );
          });
        })}
      </svg>
    </div>
  );
}
