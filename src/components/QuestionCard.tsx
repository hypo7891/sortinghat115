import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface QuestionOption {
  letter: string;
  text: string;
}

interface QuestionCardProps {
  questionKey: string;
  title?: string;
  text: string;
  options: QuestionOption[];
  progressLabel: string;
  onAnswer: (letter: string) => void;
}

export function QuestionCard({
  questionKey,
  title,
  text,
  options,
  progressLabel,
  onAnswer,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (letter: string) => {
    if (selected) return;
    setSelected(letter);
    window.setTimeout(() => onAnswer(letter), 420);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={questionKey}
          initial={{ opacity: 0, rotateY: -90, scale: 0.85 }}
          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
          exit={{ opacity: 0, rotateY: 90, scale: 0.85 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-md rounded-2xl border border-[var(--color-parchment-dark)]/40 bg-[var(--color-parchment)] p-6 text-[var(--color-ink)] shadow-2xl"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <p className="mb-2 text-xs font-medium tracking-wide text-[var(--color-ink)]/60">
            {progressLabel}
          </p>
          {title && <h2 className="mb-1 font-serif text-lg font-semibold">{title}</h2>}
          <p className="mb-5 text-base leading-relaxed">{text}</p>

          <div className="flex flex-col gap-3">
            {options.map((opt) => {
              const isSelected = selected === opt.letter;
              const isDimmed = selected !== null && !isSelected;
              return (
                <motion.button
                  key={opt.letter}
                  type="button"
                  disabled={selected !== null}
                  onClick={() => handleSelect(opt.letter)}
                  animate={{ opacity: isDimmed ? 0.4 : 1, scale: isSelected ? 1.03 : 1 }}
                  className="flex items-start gap-3 rounded-xl border border-[var(--color-ink)]/15 bg-white/60 px-4 py-3 text-left transition-colors hover:bg-white disabled:cursor-default"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)]/10 text-sm font-bold">
                    {opt.letter}
                  </span>
                  <span className="text-sm leading-snug">{opt.text}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
