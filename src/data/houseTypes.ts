export type HouseId = 'courage' | 'wisdom' | 'patience' | 'composure';

export const HOUSE_ORDER: HouseId[] = [
  'courage',
  'wisdom',
  'patience',
  'composure',
];

export const HOUSE_NAMES: Record<HouseId, string> = {
  courage: '勇氣',
  wisdom: '聰敏',
  patience: '耐心',
  composure: '沉穩',
};
