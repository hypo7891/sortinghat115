export type HouseId = 'gryffindor' | 'ravenclaw' | 'hufflepuff' | 'slytherin';

export const HOUSE_ORDER: HouseId[] = [
  'gryffindor',
  'ravenclaw',
  'hufflepuff',
  'slytherin',
];

export const HOUSE_NAMES: Record<HouseId, string> = {
  gryffindor: '葛來分多',
  ravenclaw: '雷文克勞',
  hufflepuff: '赫夫帕夫',
  slytherin: '史萊哲林',
};
