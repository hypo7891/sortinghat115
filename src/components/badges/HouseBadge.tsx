import type { HouseId } from '../../data/houseTypes';
import courageBanner from '../../assets/badges/courage.png';
import wisdomBanner from '../../assets/badges/wisdom.png';
import patienceBanner from '../../assets/badges/patience.png';
import composureBanner from '../../assets/badges/composure.png';

// Original banner artwork — one distinct icon motif per house (flame chevron
// / book+star / honeycomb / zigzag ribbon), deliberately avoiding the
// canonical lion/eagle/badger/serpent silhouettes.
const BANNERS: Record<HouseId, string> = {
  courage: courageBanner,
  wisdom: wisdomBanner,
  patience: patienceBanner,
  composure: composureBanner,
};

// Intrinsic aspect ratio of the source banner artwork (width / height).
const BANNER_ASPECT = 319 / 524;

interface HouseBadgeProps {
  house: HouseId;
  size?: number;
  className?: string;
  title?: string;
}

export function HouseBadge({ house, size = 96, className, title }: HouseBadgeProps) {
  return (
    <img
      src={BANNERS[house]}
      alt={title ?? house}
      className={className}
      style={{ height: size, width: size * BANNER_ASPECT, objectFit: 'contain' }}
    />
  );
}
