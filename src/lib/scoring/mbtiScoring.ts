import {
  MBTI_QUESTIONS,
  type MbtiAxis,
  type MbtiPole,
  type MbtiQuestion,
} from '../../data/mbtiQuestions';

export type MbtiAnswers = Record<string, 'A' | 'B'>;

const AXIS_POLES: Record<MbtiAxis, [MbtiPole, MbtiPole]> = {
  EI: ['E', 'I'],
  SN: ['S', 'N'],
  TF: ['T', 'F'],
  JP: ['J', 'P'],
};

export interface MbtiAxisResult {
  counts: Record<MbtiPole, number>;
  total: number;
  winner: MbtiPole;
  strength: number; // winner's share of this axis's answered questions, 0..1
  tie: boolean;
}

export interface MbtiScoreResult {
  axisResults: Record<MbtiAxis, MbtiAxisResult>;
  mbtiType: string;
}

export function scoreMbti(
  answers: MbtiAnswers,
  questions: MbtiQuestion[] = MBTI_QUESTIONS,
): MbtiScoreResult {
  const axisResults = {} as Record<MbtiAxis, MbtiAxisResult>;

  for (const axis of Object.keys(AXIS_POLES) as MbtiAxis[]) {
    const [poleA, poleB] = AXIS_POLES[axis];
    const axisQuestions = questions.filter((q) => q.axis === axis);
    const counts = { [poleA]: 0, [poleB]: 0 } as Record<MbtiPole, number>;

    for (const question of axisQuestions) {
      const letter = answers[question.id];
      if (!letter) continue;
      const pole =
        letter === 'A' ? question.optionA.pole : question.optionB.pole;
      counts[pole] += 1;
    }

    const total = counts[poleA] + counts[poleB];
    const tie = counts[poleA] === counts[poleB];
    // Documented canonical tiebreak: first pole of the axis (E, S, T, J).
    const winner = tie
      ? poleA
      : counts[poleA] > counts[poleB]
        ? poleA
        : poleB;
    const strength = total === 0 ? 0.5 : counts[winner] / total;

    axisResults[axis] = { counts, total, winner, strength, tie };
  }

  const mbtiType = (['EI', 'SN', 'TF', 'JP'] as MbtiAxis[])
    .map((axis) => axisResults[axis].winner)
    .join('');

  return { axisResults, mbtiType };
}
