import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QUIZ_NODES, TOTAL_QUESTIONS } from '../data/mapZones';
import type { HouseAnswers } from './scoring/houseScoring';
import type { MbtiAnswers } from './scoring/mbtiScoring';

interface QuizState {
  studentName: string;
  classId: string | null;
  joinCode: string | null;
  startedAt: number | null;
  currentQuestionIndex: number; // 0..TOTAL_QUESTIONS (TOTAL_QUESTIONS = finished)
  houseAnswers: HouseAnswers;
  mbtiAnswers: MbtiAnswers;

  startQuiz: (studentName: string, classId: string, joinCode: string) => void;
  answerCurrent: (letter: 'A' | 'B' | 'C' | 'D') => void;
  revisitNode: (index: number) => void;
  reset: () => void;
  isComplete: () => boolean;
}

const initialAnswerState = {
  studentName: '',
  classId: null,
  joinCode: null,
  startedAt: null,
  currentQuestionIndex: 0,
  houseAnswers: {} as HouseAnswers,
  mbtiAnswers: {} as MbtiAnswers,
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      ...initialAnswerState,

      startQuiz: (studentName, classId, joinCode) =>
        set({
          ...initialAnswerState,
          studentName,
          classId,
          joinCode,
          startedAt: Date.now(),
        }),

      answerCurrent: (letter) => {
        const { currentQuestionIndex, houseAnswers, mbtiAnswers } = get();
        if (currentQuestionIndex >= TOTAL_QUESTIONS) return;

        const node = QUIZ_NODES[currentQuestionIndex];
        if (node.kind === 'house') {
          set({
            houseAnswers: {
              ...houseAnswers,
              [node.questionId]: letter as 'A' | 'B' | 'C' | 'D',
            },
            currentQuestionIndex: currentQuestionIndex + 1,
          });
        } else {
          set({
            mbtiAnswers: {
              ...mbtiAnswers,
              [node.questionId]: letter as 'A' | 'B',
            },
            currentQuestionIndex: currentQuestionIndex + 1,
          });
        }
      },

      revisitNode: (index) => {
        const { currentQuestionIndex } = get();
        if (index >= 0 && index <= currentQuestionIndex) {
          set({ currentQuestionIndex: index });
        }
      },

      reset: () => set(initialAnswerState),

      isComplete: () => get().currentQuestionIndex >= TOTAL_QUESTIONS,
    }),
    { name: 'sortinghat-quiz-progress', storage: sessionStorageAdapter() },
  ),
);

function sessionStorageAdapter() {
  return {
    getItem: (name: string) => {
      const value = sessionStorage.getItem(name);
      return value ? JSON.parse(value) : null;
    },
    setItem: (name: string, value: unknown) => {
      sessionStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name: string) => sessionStorage.removeItem(name),
  };
}
