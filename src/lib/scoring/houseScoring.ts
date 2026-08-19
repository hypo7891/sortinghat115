import { HOUSE_ORDER, type HouseId } from '../../data/houseTypes';
import { HOUSE_QUESTIONS, type HouseQuestion } from '../../data/houseQuestions';

export type HouseAnswers = Record<string, 'A' | 'B' | 'C' | 'D'>;

export interface HouseScoreResult {
  scores: Record<HouseId, number>;
  primaryHouse: HouseId;
  secondaryHouse: HouseId;
  houseTie: boolean;
}

export function scoreHouse(
  answers: HouseAnswers,
  questions: HouseQuestion[] = HOUSE_QUESTIONS,
): HouseScoreResult {
  const scores: Record<HouseId, number> = {
    courage: 0,
    wisdom: 0,
    patience: 0,
    composure: 0,
  };

  for (const question of questions) {
    const letter = answers[question.id];
    const option = question.options.find((o) => o.letter === letter);
    if (option) scores[option.house] += 1;
  }

  const ranked = [...HOUSE_ORDER].sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    return HOUSE_ORDER.indexOf(a) - HOUSE_ORDER.indexOf(b);
  });

  const [primaryHouse, secondaryHouse] = ranked;
  const houseTie = scores[primaryHouse] === scores[secondaryHouse];

  return { scores, primaryHouse, secondaryHouse, houseTie };
}
