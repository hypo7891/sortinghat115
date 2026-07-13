import { HOUSE_QUESTIONS } from './houseQuestions';
import { MBTI_QUESTIONS, type MbtiAxis } from './mbtiQuestions';

export type ZoneId = 'trials' | 'EI' | 'SN' | 'TF' | 'JP';

export interface MapZone {
  id: ZoneId;
  label: string;
  intro: string;
  themeColor: string;
  questionIds: string[];
}

const mbtiIdsForAxis = (axis: MbtiAxis) =>
  MBTI_QUESTIONS.filter((q) => q.axis === axis).map((q) => q.id);

export const MAP_ZONES: MapZone[] = [
  {
    id: 'trials',
    label: '分類試煉庭院',
    intro: '歡迎來到霍格華茲！穿過庭院，完成十二道分類試煉，看看你最常展現哪個學院的特質。',
    themeColor: 'var(--color-parchment-dark)',
    questionIds: HOUSE_QUESTIONS.map((q) => q.id),
  },
  {
    id: 'EI',
    label: 'E / I 迴廊',
    intro: '你完成了分類試煉！接下來，測試你的性格傾向——先走進 E / I 迴廊。',
    themeColor: 'var(--color-gryffindor)',
    questionIds: mbtiIdsForAxis('EI'),
  },
  {
    id: 'SN',
    label: 'S / N 迴廊',
    intro: '繼續前進，來到 S / N 迴廊。',
    themeColor: 'var(--color-ravenclaw)',
    questionIds: mbtiIdsForAxis('SN'),
  },
  {
    id: 'TF',
    label: 'T / F 迴廊',
    intro: '快到了，這是 T / F 迴廊。',
    themeColor: 'var(--color-hufflepuff)',
    questionIds: mbtiIdsForAxis('TF'),
  },
  {
    id: 'JP',
    label: 'J / P 迴廊',
    intro: '最後一段路，J / P 迴廊。走完這裡，你的旅程就完成了。',
    themeColor: 'var(--color-slytherin)',
    questionIds: mbtiIdsForAxis('JP'),
  },
];

export interface QuizNode {
  globalIndex: number;
  zoneId: ZoneId;
  kind: 'house' | 'mbti';
  questionId: string;
}

export const QUIZ_NODES: QuizNode[] = MAP_ZONES.flatMap((zone) =>
  zone.questionIds.map((questionId) => ({
    zoneId: zone.id,
    kind: zone.id === 'trials' ? ('house' as const) : ('mbti' as const),
    questionId,
    globalIndex: -1, // filled below
  })),
).map((node, i) => ({ ...node, globalIndex: i }));

export const TOTAL_QUESTIONS = QUIZ_NODES.length;

export function zoneStartIndex(zoneId: ZoneId): number {
  return QUIZ_NODES.findIndex((n) => n.zoneId === zoneId);
}
