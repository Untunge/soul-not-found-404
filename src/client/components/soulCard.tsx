import type { Destination, Memo, Soul } from '../../shared/game';
import {
  DESTINATIONS,
  destinationEmoji,
  destinationLabel,
  destinationStamp,
} from '../../shared/game';

const BUTTON_STYLES: Record<Destination, { base: string; selected: string }> = {
  heaven: {
    base: 'border-emerald-800/60 text-emerald-900 hover:bg-emerald-100 dark:border-emerald-500/60 dark:text-emerald-100 dark:hover:bg-emerald-950',
    selected:
      'bg-emerald-700 text-white border-emerald-700 dark:bg-emerald-600 dark:border-emerald-600',
  },
  hell: {
    base: 'border-red-800/60 text-red-900 hover:bg-red-100 dark:border-red-500/60 dark:text-red-100 dark:hover:bg-red-950',
    selected:
      'bg-red-700 text-white border-red-700 dark:bg-red-600 dark:border-red-600',
  },
  limbo: {
    base: 'border-amber-800/60 text-amber-900 hover:bg-amber-100 dark:border-amber-500/60 dark:text-amber-100 dark:hover:bg-amber-950',
    selected:
      'bg-amber-600 text-white border-amber-600 dark:bg-amber-500 dark:border-amber-500',
  },
};

const STAMP_STYLES: Record<Destination, string> = {
  heaven:
    'text-emerald-700 border-emerald-700 dark:text-emerald-400 dark:border-emerald-400',
  hell: 'text-red-700 border-red-700 dark:text-red-400 dark:border-red-400',
  limbo:
    'text-amber-700 border-amber-700 dark:text-amber-400 dark:border-amber-400',
};

const DETAIL_LABELS: Record<Soul['detail']['kind'], string> = {
  occupation: 'Occupation',
  'last-sin': 'Last minor sin',
  carrying: 'Carrying at time of death',
};

export type SoulCardProps = {
  soul: Soul;
  index: number;
  total: number;
  memo: Memo;
  selected: Destination | null;
  stamped: Destination | null;
  disabled: boolean;
  onSelect: (destination: Destination) => void;
};

export const SoulCard = ({
  soul,
  index,
  total,
  memo,
  selected,
  stamped,
  disabled,
  onSelect,
}: SoulCardProps) => {
  const memoApplies = soul.tag === memo.tag;

  return (
    <div className="relative rounded-lg border border-[#d8d0bd] bg-[#fffdf7] p-4 shadow-sm dark:border-[#3a352b] dark:bg-[#221f1a]">
      <div className="flex items-center justify-between border-b border-dashed border-[#d8d0bd] pb-2 dark:border-[#3a352b]">
        <span className="font-mono text-[11px] tracking-widest text-[#6b6252] uppercase dark:text-[#a89e88]">
          Form 404 — File {index + 1} of {total}
        </span>
        <span className="font-mono text-[11px] text-[#6b6252] dark:text-[#a89e88]">
          No. {soul.id}
        </span>
      </div>

      <h2 className="mt-3 text-xl font-bold text-[#2b2620] dark:text-[#ece5d3]">
        {soul.name}, {soul.age}
      </h2>

      <div className="mt-3">
        <p className="font-mono text-[11px] tracking-widest text-[#6b6252] uppercase dark:text-[#a89e88]">
          Cause of death
        </p>
        <p className="mt-1 text-[15px] leading-snug text-[#2b2620] dark:text-[#ece5d3]">
          {soul.cause}
        </p>
      </div>

      <div className="mt-3">
        <p className="font-mono text-[11px] tracking-widest text-[#6b6252] uppercase dark:text-[#a89e88]">
          {DETAIL_LABELS[soul.detail.kind]}
        </p>
        <p className="mt-1 text-[15px] leading-snug text-[#2b2620] dark:text-[#ece5d3]">
          {soul.detail.text}
        </p>
      </div>

      {memoApplies && (
        <div className="mt-3 rounded border border-amber-700/50 bg-amber-50 px-3 py-2 dark:border-amber-500/40 dark:bg-amber-950/60">
          <p className="font-mono text-[11px] font-bold tracking-widest text-amber-800 uppercase dark:text-amber-300">
            ⚠ {memo.id} applies to this soul
          </p>
          <p className="mt-1 text-[13px] leading-snug text-amber-900 dark:text-amber-100">
            {memo.text}
          </p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2">
        {DESTINATIONS.map((destination) => {
          const isSelected = selected === destination;
          const styles = BUTTON_STYLES[destination];
          return (
            <button
              key={destination}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(destination)}
              className={`flex cursor-pointer flex-col items-center gap-1 rounded-md border-2 px-1 py-3 transition-colors disabled:cursor-default ${
                isSelected ? styles.selected : styles.base
              }`}
            >
              <span className="text-2xl leading-none">
                {destinationEmoji(destination)}
              </span>
              <span className="text-[13px] font-bold">
                {destinationLabel(destination)}
              </span>
              <span className="font-mono text-[10px] tracking-wider opacity-70">
                {destinationStamp(destination)}
              </span>
            </button>
          );
        })}
      </div>

      {stamped !== null && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            className={`animate-stamp-in rounded border-4 px-4 py-1 font-mono text-2xl font-black tracking-widest ${STAMP_STYLES[stamped]}`}
          >
            {destinationStamp(stamped)}
          </span>
        </div>
      )}
    </div>
  );
};
