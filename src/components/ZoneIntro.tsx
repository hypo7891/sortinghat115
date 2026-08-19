import { motion } from 'framer-motion';

interface ZoneIntroProps {
  label: string;
  intro: string;
  onContinue: () => void;
}

export function ZoneIntro({ label, intro, onContinue }: ZoneIntroProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-night-deep)]/95 p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <h2 className="mb-4 font-serif text-2xl font-semibold text-[var(--color-patience-light)]">
          {label}
        </h2>
        <p className="mb-8 leading-relaxed text-[var(--color-parchment)]/90">{intro}</p>
        <button
          type="button"
          onClick={onContinue}
          className="rounded-full border border-[var(--color-parchment)]/40 px-6 py-2 text-sm font-medium tracking-wide hover:bg-[var(--color-parchment)]/10"
        >
          繼續前進
        </button>
      </motion.div>
    </div>
  );
}
