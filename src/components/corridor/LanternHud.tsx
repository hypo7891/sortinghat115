import { motion } from 'framer-motion';
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

interface LanternHudProps {
  axisResults: Record<MbtiAxis, MbtiAxisResult>;
  activeAxis: MbtiAxis;
}

// Rendered above QuestionCard's modal backdrop (z-45, between the card's
// z-40 and ZoneIntro's z-50) so the light-up moment is never dimmed out by
// the card's own bg-black/60 overlay, which covers the whole viewport.
export function LanternHud({ axisResults, activeAxis }: LanternHudProps) {
  const ringCenter = { x: 60, y: 62 };
  const ringRadius = 25;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[45] flex justify-center">
      <svg width="120" height="132" viewBox="0 0 120 132" role="img" aria-hidden="true">
        <defs>
          <radialGradient id="hud-lantern-glow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#ffe9b0" />
            <stop offset="70%" stopColor="#c98a3a" />
            <stop offset="100%" stopColor="#5a3d1a" />
          </radialGradient>
        </defs>

        <g transform="translate(60,102)">
          <path d="M-28,-70 Q0,-88 28,-70" fill="none" stroke="#8a7a52" strokeWidth="4" strokeLinecap="round" />
          <rect x="-34" y="-70" width="68" height="64" rx="5" fill="#332a24" stroke="#8a7a52" strokeWidth="2" />
          <rect x="-26" y="-62" width="52" height="48" rx="3" fill="url(#hud-lantern-glow)" />
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
              <motion.circle
                key={pole}
                cx={x}
                cy={y}
                animate={{
                  r: isActive ? 5 : 3.2,
                  opacity,
                  fill: started ? color : DIM,
                }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            );
          });
        })}
      </svg>
    </div>
  );
}
