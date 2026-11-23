import { useState } from 'react';
import type { Destination, Memo, Soul } from '../../shared/game';
import { mulberry32, randomSoul } from '../../shared/game';
import { SoulCard } from './soulCard';

export type PracticeProps = {
  memo: Memo;
  onBack: () => void;
};

type PracticeState = {
  rng: () => number;
  soul: Soul;
  processed: number;
};

export const Practice = ({ memo, onBack }: PracticeProps) => {
  // One lazy initializer owns the RNG and the first soul, so no impure
  // work happens during render and no ref is read during render.
  const [practice, setPractice] = useState<PracticeState>(() => {
    const rng = mulberry32((Date.now() % 2147483647) + 1);
    return { rng, soul: randomSoul(rng, 'practice-0'), processed: 0 };
  });
  const [selected, setSelected] = useState<Destination | null>(null);
  const [stamped, setStamped] = useState<Destination | null>(null);

  const handleSelect = (destination: Destination) => {
    if (selected !== null) {
      return;
    }
    setSelected(destination);
    setStamped(destination);
  };

  const handleNext = () => {
    setPractice((prev) => {
      const next = prev.processed + 1;
      return {
        rng: prev.rng,
        soul: randomSoul(prev.rng, `practice-${next}`),
        processed: next,
      };
    });
    setSelected(null);
    setStamped(null);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer font-mono text-[12px] text-[#6b6252] underline dark:text-[#a89e88]"
        >
          ← Back to today&apos;s shift
        </button>
        <span className="font-mono text-[12px] text-[#6b6252] dark:text-[#a89e88]">
          Practice souls filed: {practice.processed}
        </span>
      </div>

      <p className="rounded border border-dashed border-[#d8d0bd] bg-[#f4f0e6] px-3 py-2 text-[13px] text-[#6b6252] dark:border-[#3a352b] dark:bg-[#17150f] dark:text-[#a89e88]">
        Training files only. Practice verdicts don&apos;t affect your score,
        streak, or rank.
      </p>

      <SoulCard
        soul={practice.soul}
        index={0}
        total={1}
        memo={memo}
        selected={selected}
        stamped={stamped}
        disabled={selected !== null}
        onSelect={handleSelect}
      />

      {selected !== null && (
        <button
          type="button"
          onClick={handleNext}
          className="animate-fade-up cursor-pointer rounded-md bg-[#2b2620] px-3 py-2.5 text-[14px] font-bold text-[#f4f0e6] transition-colors hover:bg-[#4a4234] dark:bg-[#e8e2d4] dark:text-[#221f1a] dark:hover:bg-white"
        >
          Process next soul →
        </button>
      )}
    </div>
  );
};
