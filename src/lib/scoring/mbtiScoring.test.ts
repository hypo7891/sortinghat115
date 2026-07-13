import { describe, expect, it } from 'vitest';
import { scoreMbti, type MbtiAnswers } from './mbtiScoring';
import { MBTI_QUESTIONS } from '../../data/mbtiQuestions';

describe('scoreMbti', () => {
  it('scores all-A answers as ESTJ with full strength on each axis', () => {
    const answers: MbtiAnswers = {};
    for (const q of MBTI_QUESTIONS) answers[q.id] = 'A';

    const result = scoreMbti(answers);

    expect(result.mbtiType).toBe('ESTJ');
    expect(result.axisResults.EI.strength).toBe(1);
    expect(result.axisResults.SN.strength).toBe(1);
  });

  it('computes S/N strength out of 5 questions, not a hardcoded 6', () => {
    const answers: MbtiAnswers = {};
    for (const q of MBTI_QUESTIONS) answers[q.id] = 'A';

    const result = scoreMbti(answers);

    expect(result.axisResults.SN.total).toBe(5);
    expect(result.axisResults.SN.counts.S).toBe(5);
  });

  it('breaks a 3-3 tie toward the canonical first pole and reports 50% strength', () => {
    const eiQuestions = MBTI_QUESTIONS.filter((q) => q.axis === 'EI');
    const answers: MbtiAnswers = {};
    eiQuestions.forEach((q, i) => {
      answers[q.id] = i % 2 === 0 ? 'A' : 'B';
    });

    const result = scoreMbti(answers);

    expect(result.axisResults.EI.tie).toBe(true);
    expect(result.axisResults.EI.winner).toBe('E');
    expect(result.axisResults.EI.strength).toBe(0.5);
  });

  it('defaults an unanswered axis to 50% strength without throwing', () => {
    const result = scoreMbti({});
    expect(result.axisResults.EI.total).toBe(0);
    expect(result.axisResults.EI.strength).toBe(0.5);
  });
});
