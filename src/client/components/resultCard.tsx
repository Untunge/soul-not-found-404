import { useState } from 'react';
import { showToast } from '@devvit/web/client';
import type { ConsensusMap } from '../../shared/api';
import type { Destination, RankName, Soul } from '../../shared/game';
import {
  DESTINATIONS,
  SOULS_PER_DAY,
  destinationEmoji,
  destinationLabel,
  nextRank,
  shareText,
} from '../../shared/game';

const BAR_COLORS: Record<Destination, string> = {
  heaven: 'bg-emerald-600 dark:bg-emerald-500',
  hell: 'bg-red-600 dark:bg-red-500',
  limbo: 'bg-amber-500 dark:bg-amber-400',
};

export type ResultCardProps = {
  date: string;
  souls: Soul[];
  picks: Destination[];
  score: number;
  memoBonus: number;
  rank: RankName;
  points: number;
  streak: number;
  consensus: ConsensusMap;
  voters: number;
  refreshing: boolean;
  onPractice: () => void;
  onRefresh: () => void;
};

export const ResultCard = ({
  date,
  souls,
  picks,
  score,
  memoBonus,
  rank,
  points,
  streak,
  consensus,
  voters,
  refreshing,
  onPractice,
  onRefresh,
}: ResultCardProps) => {
  const [copied, setCopied] = useState(false);
  const upcoming = nextRank(points);

  const copyResult = async () => {
    const text = shareText(date, picks, score, memoBonus, rank, streak);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Result copied — paste it in the comments!');
    } catch {
      showToast('Copy failed — long-press the result text to copy it manually.');
    }
  };

  return (
    <div className="animate-fade-up rounded-lg border border-[#d8d0bd] bg-[#fffdf7] p-4 shadow-sm dark:border-[#3a352b] dark:bg-[#221f1a]">
      <div className="border-b border-dashed border-[#d8d0bd] pb-2 text-center dark:border-[#3a352b]">
        <p className="font-mono text-[11px] tracking-widest text-[#6b6252] uppercase dark:text-[#a89e88]">
          Shift report — {date}
        </p>
        <p className="mt-2 text-3xl tracking-wide">
          {picks.map((pick) => destinationEmoji(pick)).join('')}
        </p>
        <p className="mt-2 text-lg font-bold text-[#2b2620] dark:text-[#ece5d3]">
          {score}/{SOULS_PER_DAY} match the community
        </p>
        <p className="mt-1 text-[13px] text-[#6b6252] dark:text-[#a89e88]">
          {memoBonus > 0
            ? `Memo followed · +${memoBonus} bonus point${memoBonus === 1 ? '' : 's'}`
            : 'Memo ignored · no bonus points'}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded bg-[#f4f0e6] px-1 py-2 dark:bg-[#17150f]">
          <p className="font-mono text-[10px] tracking-widest text-[#6b6252] uppercase dark:text-[#a89e88]">
            Rank
          </p>
          <p className="mt-0.5 text-[13px] leading-tight font-bold text-[#2b2620] dark:text-[#ece5d3]">
            {rank}
          </p>
        </div>
        <div className="rounded bg-[#f4f0e6] px-1 py-2 dark:bg-[#17150f]">
          <p className="font-mono text-[10px] tracking-widest text-[#6b6252] uppercase dark:text-[#a89e88]">
            Streak
          </p>
          <p className="mt-0.5 text-[13px] leading-tight font-bold text-[#2b2620] dark:text-[#ece5d3]">
            {streak} day{streak === 1 ? '' : 's'}
          </p>
        </div>
        <div className="rounded bg-[#f4f0e6] px-1 py-2 dark:bg-[#17150f]">
          <p className="font-mono text-[10px] tracking-widest text-[#6b6252] uppercase dark:text-[#a89e88]">
            Points
          </p>
          <p className="mt-0.5 text-[13px] leading-tight font-bold text-[#2b2620] dark:text-[#ece5d3]">
            {points}
          </p>
        </div>
      </div>

      {upcoming !== null && (
        <p className="mt-2 text-center text-[12px] text-[#6b6252] dark:text-[#a89e88]">
          {upcoming.minPoints - points} more point
          {upcoming.minPoints - points === 1 ? '' : 's'} to {upcoming.name}
        </p>
      )}

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] tracking-widest text-[#6b6252] uppercase dark:text-[#a89e88]">
            How the community voted
          </p>
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="cursor-pointer font-mono text-[11px] text-[#6b6252] underline disabled:cursor-default disabled:opacity-50 dark:text-[#a89e88]"
          >
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
        <p className="mt-1 text-[12px] text-[#6b6252] dark:text-[#a89e88]">
          {voters} clerk{voters === 1 ? '' : 's'} filed verdicts today
        </p>

        <div className="mt-2 flex flex-col gap-3">
          {souls.map((soul, i) => {
            const counts = consensus[i];
            const pick = picks[i];
            if (counts === undefined || pick === undefined) {
              return null;
            }
            return (
              <div key={soul.id}>
                <p className="text-[13px] font-bold text-[#2b2620] dark:text-[#ece5d3]">
                  {soul.name}{' '}
                  <span className="font-normal text-[#6b6252] dark:text-[#a89e88]">
                    — you filed {destinationEmoji(pick)} {destinationLabel(pick)}
                  </span>
                </p>
                {counts.total === 0 ? (
                  <p className="mt-1 text-[12px] text-[#6b6252] dark:text-[#a89e88]">
                    No votes yet — you set the precedent.
                  </p>
                ) : (
                  <div className="mt-1">
                    <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#e7e0cf] dark:bg-[#3a352b]">
                      {DESTINATIONS.map((destination) => {
                        const pct =
                          counts.total > 0
                            ? (counts[destination] / counts.total) * 100
                            : 0;
                        if (pct <= 0) {
                          return null;
                        }
                        return (
                          <div
                            key={destination}
                            className={BAR_COLORS[destination]}
                            style={{ width: `${pct}%` }}
                          />
                        );
                      })}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                      {DESTINATIONS.map((destination) => {
                        const pct =
                          counts.total > 0
                            ? Math.round(
                                (counts[destination] / counts.total) * 100
                              )
                            : 0;
                        return (
                          <span
                            key={destination}
                            className={`text-[12px] ${
                              destination === pick
                                ? 'font-bold text-[#2b2620] dark:text-[#ece5d3]'
                                : 'text-[#6b6252] dark:text-[#a89e88]'
                            }`}
                          >
                            {destinationEmoji(destination)} {pct}%
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <pre className="mt-4 overflow-x-auto rounded bg-[#f4f0e6] p-3 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-[#2b2620] dark:bg-[#17150f] dark:text-[#ece5d3]">
        {shareText(date, picks, score, memoBonus, rank, streak)}
      </pre>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => void copyResult()}
          className="cursor-pointer rounded-md bg-[#2b2620] px-3 py-2.5 text-[14px] font-bold text-[#f4f0e6] transition-colors hover:bg-[#4a4234] dark:bg-[#e8e2d4] dark:text-[#221f1a] dark:hover:bg-white"
        >
          {copied ? '✓ Copied!' : 'Copy result'}
        </button>
        <button
          type="button"
          onClick={onPractice}
          className="cursor-pointer rounded-md border-2 border-[#2b2620] px-3 py-2.5 text-[14px] font-bold text-[#2b2620] transition-colors hover:bg-[#f4f0e6] dark:border-[#e8e2d4] dark:text-[#e8e2d4] dark:hover:bg-[#2a2721]"
        >
          Practice mode
        </button>
      </div>

      <p className="mt-3 text-center text-[12px] text-[#6b6252] dark:text-[#a89e88]">
        New souls arrive tomorrow. Debate today&apos;s verdicts in the comments.
      </p>
    </div>
  );
};
