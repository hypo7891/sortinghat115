import type { ReactNode } from 'react';

interface PageCardProps {
  children: ReactNode;
  className?: string;
}

// Shared "content sits on a card" treatment used across every screen so the
// app reads as one product instead of each page inventing its own container.
export function PageCard({ children, className = '' }: PageCardProps) {
  return (
    <div
      className={`rounded-2xl border border-[var(--color-parchment)]/15 bg-[var(--color-night-deep)]/55 p-6 shadow-2xl backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}
