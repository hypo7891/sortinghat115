import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HouseBadge } from '../components/badges/HouseBadge';
import { HOUSE_NAMES, HOUSE_ORDER } from '../data/houseTypes';
import { HOUSE_TRAITS, SORTING_DECLARATION } from '../data/houseTraits';
import { MBTI_AXIS_EXPLANATIONS } from '../data/mbtiQuestions';
import type { HouseScoreResult } from '../lib/scoring/houseScoring';
import type { MbtiScoreResult } from '../lib/scoring/mbtiScoring';
import { useQuizStore } from '../lib/quizStore';

interface ResultsLocationState {
  houseResult: HouseScoreResult;
  mbtiResult: MbtiScoreResult;
}

const AXIS_LABELS: Record<string, string> = {
  EI: 'E 外向 / I 內向',
  SN: 'S 實感 / N 直覺',
  TF: 'T 思考 / F 情感',
  JP: 'J 判斷 / P 感知',
};

export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const reset = useQuizStore((s) => s.reset);
  const state = location.state as ResultsLocationState | null;

  if (!state) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 text-center text-[var(--color-parchment)]">
        <p>還沒有測驗結果。</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-full border border-[var(--color-parchment)]/40 px-6 py-2"
        >
          回到首頁
        </button>
      </div>
    );
  }

  const { houseResult, mbtiResult } = state;
  const primaryTrait = HOUSE_TRAITS[houseResult.primaryHouse];
  const secondaryTrait = HOUSE_TRAITS[houseResult.secondaryHouse];

  return (
    <div className="mx-auto max-w-lg px-6 py-10 text-[var(--color-parchment)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center"
      >
        <HouseBadge house={houseResult.primaryHouse} size={140} />
        <h1 className="mt-4 font-serif text-2xl font-bold">
          {HOUSE_NAMES[houseResult.primaryHouse]}
        </h1>
        {houseResult.houseTie && (
          <p className="mt-1 text-sm text-[var(--color-parchment)]/70">
            你在兩個學院之間非常平衡
          </p>
        )}
        <p className="mt-2 text-sm text-[var(--color-parchment)]/70">
          {primaryTrait.keywords}
        </p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed">
          {primaryTrait.description}
        </p>

        <div className="mt-6 flex items-center gap-2 text-sm text-[var(--color-parchment)]/70">
          <HouseBadge house={houseResult.secondaryHouse} size={40} />
          <span>
            次要學院：{HOUSE_NAMES[houseResult.secondaryHouse]} — {secondaryTrait.keywords}
          </span>
        </div>
      </motion.div>

      <section className="mt-10">
        <h2 className="mb-3 font-serif text-lg font-semibold">四學院分數</h2>
        <div className="flex flex-col gap-2">
          {HOUSE_ORDER.map((house) => {
            const score = houseResult.scores[house];
            return (
              <div key={house} className="flex items-center gap-3 text-sm">
                <span className="w-20 shrink-0">{HOUSE_NAMES[house]}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[var(--color-hufflepuff-light)]"
                    style={{ width: `${(score / 12) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right">{score}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-1 font-serif text-lg font-semibold">
          MBTI 少年版：{mbtiResult.mbtiType}
        </h2>
        <p className="mb-4 text-xs text-[var(--color-parchment)]/60">
          與學院結果是兩種互補、但未經驗證關聯的觀察角度，僅供參考。
        </p>
        <div className="flex flex-col gap-3">
          {(['EI', 'SN', 'TF', 'JP'] as const).map((axis) => {
            const r = mbtiResult.axisResults[axis];
            return (
              <div key={axis} className="text-sm">
                <div className="mb-1 flex items-center justify-between">
                  <span>{AXIS_LABELS[axis]}</span>
                  <span className="font-semibold">
                    {r.winner}（{Math.round(r.strength * 100)}%）
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[var(--color-ravenclaw-light)]"
                    style={{ width: `${r.strength * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-[var(--color-parchment)]/60">
                  {MBTI_AXIS_EXPLANATIONS[axis][0]}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10 text-sm leading-relaxed text-[var(--color-parchment)]/80">
        {SORTING_DECLARATION.map((line) => (
          <p key={line} className="mb-2">
            {line}
          </p>
        ))}
      </section>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={() => {
            reset();
            navigate('/');
          }}
          className="rounded-full border border-[var(--color-parchment)]/40 px-6 py-2 text-sm"
        >
          換下一位同學作答
        </button>
      </div>
    </div>
  );
}
