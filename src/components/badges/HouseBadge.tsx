import type { HouseId } from '../../data/houseTypes';

// Original badge system — one shared shield frame, four distinct abstract
// icon motifs (flame chevron / book+star / honeycomb / zigzag ribbon)
// deliberately avoiding the canonical lion/eagle/badger/serpent silhouettes.
const SHIELD_PATH =
  'M64 8 L116 28 L116 70 Q116 106 64 122 Q12 106 12 70 L12 28 Z';

interface BadgeStyle {
  primary: string;
  secondary: string;
  icon: (idPrefix: string) => React.ReactNode;
}

function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');
}

const BADGE_STYLES: Record<HouseId, BadgeStyle> = {
  courage: {
    primary: '#7f1d2b',
    secondary: '#e8c468',
    icon: (idPrefix) => (
      <g stroke={`url(#${idPrefix}-icon)`} strokeWidth={4} strokeLinejoin="round" fill="none">
        <path d="M64 38 L92 90 L64 76 L36 90 Z" />
        <path d="M64 52 L80 86 L64 78 L48 86 Z" />
      </g>
    ),
  },
  wisdom: {
    primary: '#1f3a63',
    secondary: '#c9d3ef',
    icon: (idPrefix) => (
      <g stroke={`url(#${idPrefix}-icon)`} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M64 40 L69 52 L82 52 L71 59 L75 71 L64 64 L53 71 L57 59 L46 52 L59 52 Z" />
        <path d="M40 92 C40 66 52 60 64 64 C76 60 88 66 88 92" />
        <path d="M64 64 L64 96" />
      </g>
    ),
  },
  patience: {
    primary: '#a9722a',
    secondary: '#fbe2a0',
    icon: (idPrefix) => (
      <g stroke={`url(#${idPrefix}-icon)`} strokeWidth={4} strokeLinejoin="round" fill="none">
        <polygon points={hexPoints(64, 70, 16)} />
        <polygon points={hexPoints(46, 50, 11)} />
        <polygon points={hexPoints(82, 50, 11)} />
      </g>
    ),
  },
  composure: {
    primary: '#1c5c40',
    secondary: '#cfe3d4',
    icon: (idPrefix) => (
      <g stroke={`url(#${idPrefix}-icon)`} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M42 40 L64 56 L42 72 L64 88 L86 72" />
      </g>
    ),
  },
};

interface HouseBadgeProps {
  house: HouseId;
  size?: number;
  className?: string;
  title?: string;
}

export function HouseBadge({ house, size = 96, className, title }: HouseBadgeProps) {
  const style = BADGE_STYLES[house];
  const idPrefix = `badge-${house}`;

  return (
    <svg
      viewBox="0 0 128 128"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={title ?? house}
    >
      <defs>
        <linearGradient id={`${idPrefix}-frame`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={style.primary} />
          <stop offset="100%" stopColor="#0b0812" />
        </linearGradient>
        <linearGradient id={`${idPrefix}-icon`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={style.secondary} />
          <stop offset="100%" stopColor={style.primary} />
        </linearGradient>
      </defs>
      <path
        d={SHIELD_PATH}
        fill={`url(#${idPrefix}-frame)`}
        stroke={style.secondary}
        strokeWidth={3}
      />
      {style.icon(idPrefix)}
    </svg>
  );
}
