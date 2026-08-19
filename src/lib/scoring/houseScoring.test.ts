import { describe, expect, it } from 'vitest';
import { scoreHouse, type HouseAnswers } from './houseScoring';
import { HOUSE_QUESTIONS } from '../../data/houseQuestions';

describe('scoreHouse', () => {
  it('scores 12 straight-A answers as a clean Courage win', () => {
    const answers: HouseAnswers = {};
    for (const q of HOUSE_QUESTIONS) answers[q.id] = 'A';

    const result = scoreHouse(answers);

    expect(result.scores.courage).toBe(12);
    expect(result.primaryHouse).toBe('courage');
    expect(result.houseTie).toBe(false);
  });

  it('breaks a tie using the documented house priority order', () => {
    const answers: HouseAnswers = {};
    HOUSE_QUESTIONS.forEach((q, i) => {
      // Alternate A/B for a 6-6 tie between courage and wisdom.
      answers[q.id] = i % 2 === 0 ? 'A' : 'B';
    });

    const result = scoreHouse(answers);

    expect(result.scores.courage).toBe(6);
    expect(result.scores.wisdom).toBe(6);
    expect(result.primaryHouse).toBe('courage');
    expect(result.secondaryHouse).toBe('wisdom');
    expect(result.houseTie).toBe(true);
  });

  it('ignores missing answers rather than throwing', () => {
    const result = scoreHouse({});
    expect(result.scores).toEqual({
      courage: 0,
      wisdom: 0,
      patience: 0,
      composure: 0,
    });
    expect(result.houseTie).toBe(true);
  });
});
