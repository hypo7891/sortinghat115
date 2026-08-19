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

// Submissions recorded before the house-id rename still have these values
// stored in Firestore (primaryHouse/secondaryHouse/houseScores keys).
// Old data is normalized to the new ids at read time rather than migrated
// in place, so nothing needs to write to already-submitted student records.
const LEGACY_HOUSE_ALIASES: Record<string, HouseId> = {
  gryffindor: 'courage',
  ravenclaw: 'wisdom',
  hufflepuff: 'patience',
  slytherin: 'composure',
};

export function normalizeHouseId(id: string): HouseId {
  return (LEGACY_HOUSE_ALIASES[id] ?? id) as HouseId;
}
