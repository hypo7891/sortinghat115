import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { MAP_ZONES, type QuizNode } from '../data/mapZones';
import courtyardBg from '../assets/courtyard-bg.png';

const NODE_SPACING = 96;
const AMPLITUDE = 32;

function nodePosition(index: number) {
  const x = 50 + Math.sin(index * 0.85) * AMPLITUDE;
  const y = 60 + index * NODE_SPACING;
  return { x, y };
}

interface MapScreenProps {
  nodes: QuizNode[];
  currentIndex: number;
  onSelectNode: (index: number) => void;
}

export function MapScreen({ nodes, currentIndex, onSelectNode }: MapScreenProps) {
  const pathHeight = 60 + (nodes.length - 1) * NODE_SPACING + 80;
  const avatarPos = nodePosition(Math.min(currentIndex, nodes.length - 1));
  const containerRef = useRef<HTMLDivElement>(null);

  const zoneColor = (zoneId: string) =>
    MAP_ZONES.find((z) => z.id === zoneId)?.themeColor ?? '#888';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const targetTop = avatarPos.y - container.clientHeight / 2;
    container.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
  }, [avatarPos.y]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto max-w-md overflow-x-hidden overflow-y-auto px-4 pb-32"
      style={{ height: '100dvh' }}
    >
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(11,8,18,0.2), rgba(11,8,18,0.5)), url(${courtyardBg})`,
          backgroundSize: '100% 100%, auto 160%',
          backgroundPosition: 'center, center 70%',
        }}
      />

      <div className="relative" style={{ height: pathHeight }}>
        <svg
          className="pointer-events-none absolute left-0 top-0"
          width="100%"
          height={pathHeight}
          viewBox={`0 0 100 ${pathHeight}`}
          preserveAspectRatio="none"
        >
          <polyline
            points={nodes.map((_, i) => {
              const p = nodePosition(i);
              return `${p.x},${p.y}`;
            }).join(' ')}
            fill="none"
            stroke="var(--color-parchment)"
            strokeOpacity={0.25}
            strokeWidth={2}
          />
        </svg>

        {nodes.map((node, i) => {
          const { x, y } = nodePosition(i);
          const done = i < currentIndex;
          const isCurrent = i === currentIndex;
          const locked = i > currentIndex;
          const color = zoneColor(node.zoneId);

          return (
            <button
              key={node.questionId}
              type="button"
              disabled={locked}
              onClick={() => onSelectNode(i)}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xs font-semibold transition-transform disabled:cursor-not-allowed"
              style={{
                left: `${x}%`,
                top: y,
                width: isCurrent ? 40 : 28,
                height: isCurrent ? 40 : 28,
                background: done || isCurrent ? color : 'rgba(255,255,255,0.08)',
                border: `2px solid ${done || isCurrent ? color : 'rgba(255,255,255,0.2)'}`,
                color: done || isCurrent ? '#0b0812' : 'rgba(255,255,255,0.4)',
                boxShadow: isCurrent ? `0 0 0 6px ${color}33` : 'none',
              }}
              aria-label={`第 ${i + 1} 題`}
            >
              {done ? '✓' : i + 1}
            </button>
          );
        })}

        <motion.div
          className="absolute z-10 -translate-x-1/2 -translate-y-[130%] text-2xl"
          animate={{ left: `${avatarPos.x}%`, top: avatarPos.y }}
          transition={{ type: 'spring', stiffness: 120, damping: 16 }}
        >
          🧙
        </motion.div>
      </div>
    </div>
  );
}
