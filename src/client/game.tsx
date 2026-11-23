import './index.css';

import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { ConsensusMap, SubmitResponse } from '../shared/api';
import type { Destination, RankName } from '../shared/game';
import {
  SOULS_PER_DAY,
  destinationEmoji,
  destinationLabel,
} from '../shared/game';
import { useGame } from './hooks/useGame';
import { SoulCard } from './components/soulCard';
import { ResultCard } from './components/resultCard';
import { Practice } from './components/practice';

type Phase = 'sorting' | 'review' | 'practice';
type EffectivePhase = Phase | 'done';

type DoneData = {
  picks: Destination[];
  score: number;
  memoBonus: number;
  rank: RankName;
  points: number;
  streak: number;
};

const EMPTY_PICKS: (Destination | null)[] = [null, null, null, null, null];

export const App = () => {
  const {
    init,
    loading,
    error,
    submitting,
    submitError,
    refresh,
    submit,
    refreshConsensus,
  } = useGame();

  const [phase, setPhase] = useState<Phase>('sorting');
  const [picks, setPicks] = useState<(Destination | null)[]>(EMPTY_PICKS);
  const [filedPicks, setFiledPicks] = useState<Destination[] | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stamped, setStamped] = useState<Destination | null>(null);
  const [consensusOverride, setConsensusOverride] = useState<{
    consensus: ConsensusMap;
    voters: number;
  } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Derived during render — no effect sync needed. Once verdicts exist
  // (fresh submit or a returning player), the result screen shows.
  const doneData: DoneData | null =
    submitResult !== null && filedPicks !== null
      ? {
          picks: filedPicks,
          score: submitResult.score,
          memoBonus: submitResult.memoBonus,
          rank: submitResult.rank,
          points: submitResult.points,
          streak: submitResult.streak,
        }
      : init !== null && init.submitted !== null
        ? {
            picks: init.submitted.picks,
            score: init.submitted.score,
            memoBonus: init.submitted.memoBonus,
            rank: init.rank,
            points: init.points,
            streak: init.streak,
          }
        : null;

  const effectivePhase: EffectivePhase =
    phase === 'practice'
      ? 'practice'
      : doneData !== null
        ? 'done'
        : phase;

  const liveConsensus: ConsensusMap | null =
    consensusOverride?.consensus ??
    submitResult?.consensus ??
    init?.submitted?.consensus ??
    null;
  const liveVoters: number =
    consensusOverride?.voters ??
    submitResult?.voters ??
    init?.submitted?.voters ??
    0;

  const handleSelect = (destination: Destination) => {
    if (stamped !== null || init === null) {
      return;
    }
    setPicks((prev) => {
      const next = [...prev];
      next[currentIndex] = destination;
      return next;
    });
    setStamped(destination);
    timerRef.current = window.setTimeout(() => {
      setStamped(null);
      if (currentIndex + 1 < SOULS_PER_DAY) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setPhase('review');
      }
    }, 550);
  };

  const handleReviewSubmit = async () => {
    if (init === null || init.guest) {
      return;
    }
    const allPicked = picks.every(
      (pick): pick is Destination => pick !== null
    );
    if (!allPicked) {
      return;
    }
    const result = await submit(picks);
    if (result !== null) {
      setFiledPicks(picks);
      setSubmitResult(result);
    }
  };

  const handleRefreshConsensus = async () => {
    setRefreshing(true);
    const data = await refreshConsensus();
    if (data !== null) {
      setConsensusOverride({ consensus: data.consensus, voters: data.voters });
    }
    setRefreshing(false);
  };

  const currentSoul =
    init !== null ? init.souls[currentIndex] : undefined;
  const currentPick = picks[currentIndex] ?? null;

  return (
    <div className="min-h-screen bg-[#f4f0e6] text-[#2b2620] dark:bg-[#17150f] dark:text-[#e8e2d4]">
      <header className="bg-[#2b2620] px-4 py-3 text-[#f4f0e6] dark:bg-[#0e0d0a]">
        <div className="mx-auto max-w-md">
          <p className="font-mono text-[10px] tracking-[0.2em] text-[#b8ae96] uppercase">
            Dept. of Afterlife Affairs — Form 404
          </p>
          <h1 className="mt-0.5 text-lg leading-tight font-black">
            ERROR 404: SOUL NOT FOUND
          </h1>
          {init !== null && !init.guest && (
            <p className="mt-1 font-mono text-[11px] text-[#b8ae96]">
              Clerk {init.username} · {init.rank} · 🔥 {init.streak}-day streak
            </p>
          )}
        </div>
      </header>

      <main className="mx-auto flex max-w-md flex-col gap-3 px-4 py-4">
        {loading && (
          <div className="animate-fade-up rounded-lg border border-[#d8d0bd] bg-[#fffdf7] p-6 text-center shadow-sm dark:border-[#3a352b] dark:bg-[#221f1a]">
            <p className="font-mono text-[12px] tracking-widest text-[#6b6252] uppercase dark:text-[#a89e88]">
              Processing Form 404…
            </p>
            <p className="mt-2 text-[15px] text-[#2b2620] dark:text-[#ece5d3]">
              Retrieving today&apos;s souls from the queue.
            </p>
          </div>
        )}

        {error !== null && (
          <div className="animate-fade-up rounded-lg border border-red-800/50 bg-[#fffdf7] p-6 text-center shadow-sm dark:border-red-500/40 dark:bg-[#221f1a]">
            <p className="font-mono text-[12px] tracking-widest text-red-800 uppercase dark:text-red-300">
              Bureaucratic error
            </p>
            <p className="mt-2 text-[15px] text-[#2b2620] dark:text-[#ece5d3]">
              {error}
            </p>
            <button
              type="button"
              onClick={() => void refresh()}
              className="mt-3 cursor-pointer rounded-md bg-[#2b2620] px-4 py-2 text-[14px] font-bold text-[#f4f0e6] dark:bg-[#e8e2d4] dark:text-[#221f1a]"
            >
              Try again
            </button>
          </div>
        )}

        {init !== null && !loading && effectivePhase === 'practice' && (
          <Practice
            memo={init.memo}
            onBack={() => setPhase('sorting')}
          />
        )}

        {init !== null &&
          !loading &&
          effectivePhase === 'done' &&
          doneData !== null &&
          liveConsensus !== null && (
            <ResultCard
              date={init.date}
              souls={init.souls}
              picks={doneData.picks}
              score={doneData.score}
              memoBonus={doneData.memoBonus}
              rank={doneData.rank}
              points={doneData.points}
              streak={doneData.streak}
              consensus={liveConsensus}
              voters={liveVoters}
              refreshing={refreshing}
              onPractice={() => setPhase('practice')}
              onRefresh={() => void handleRefreshConsensus()}
            />
          )}

        {init !== null && !loading && effectivePhase === 'sorting' && (
          <>
            <div className="rounded border border-[#2b2620]/30 bg-[#fffdf7] px-3 py-2 dark:border-[#e8e2d4]/20 dark:bg-[#221f1a]">
              <p className="font-mono text-[11px] font-bold tracking-widest text-[#6b6252] uppercase dark:text-[#a89e88]">
                📋 Memo of the day — {init.memo.id}
              </p>
              <p className="mt-1 text-[13px] leading-snug">{init.memo.text}</p>
            </div>

            {init.guest && (
              <p className="rounded border border-dashed border-[#d8d0bd] bg-[#f4f0e6] px-3 py-2 text-[13px] text-[#6b6252] dark:border-[#3a352b] dark:bg-[#17150f] dark:text-[#a89e88]">
                You are browsing as a guest. Log in to Reddit to file verdicts
                and keep a streak — or warm up in practice mode.
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] text-[#6b6252] dark:text-[#a89e88]">
                File {currentIndex + 1} of {SOULS_PER_DAY} · {init.date}
              </span>
              <div className="flex gap-1.5">
                {picks.map((pick, i) => (
                  <span
                    key={i}
                    className={`h-2.5 w-2.5 rounded-full border ${
                      pick !== null
                        ? 'border-[#2b2620] bg-[#2b2620] dark:border-[#e8e2d4] dark:bg-[#e8e2d4]'
                        : 'border-[#b8ae96] bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            {currentSoul !== undefined && (
              <SoulCard
                soul={currentSoul}
                index={currentIndex}
                total={SOULS_PER_DAY}
                memo={init.memo}
                selected={currentPick}
                stamped={stamped}
                disabled={stamped !== null}
                onSelect={handleSelect}
              />
            )}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0 || stamped !== null}
                className="cursor-pointer font-mono text-[12px] text-[#6b6252] underline disabled:cursor-default disabled:opacity-40 dark:text-[#a89e88]"
              >
                ← Previous file
              </button>
              <button
                type="button"
                onClick={() => setPhase('practice')}
                className="cursor-pointer font-mono text-[12px] text-[#6b6252] underline dark:text-[#a89e88]"
              >
                Practice mode
              </button>
            </div>
          </>
        )}

        {init !== null && !loading && effectivePhase === 'review' && (
          <div className="animate-fade-up flex flex-col gap-3">
            <div className="rounded-lg border border-[#d8d0bd] bg-[#fffdf7] p-4 shadow-sm dark:border-[#3a352b] dark:bg-[#221f1a]">
              <p className="font-mono text-[11px] tracking-widest text-[#6b6252] uppercase dark:text-[#a89e88]">
                Review before filing
              </p>
              <p className="mt-1 text-[14px] text-[#2b2620] dark:text-[#ece5d3]">
                Tap a file to change its verdict. Once filed, verdicts are
                final — the Department does not accept appeals.
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {init.souls.map((soul, i) => {
                  const pick = picks[i];
                  return (
                    <button
                      key={soul.id}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(i);
                        setPhase('sorting');
                      }}
                      className="flex cursor-pointer items-center justify-between gap-2 rounded border border-[#d8d0bd] bg-[#f4f0e6] px-3 py-2 text-left transition-colors hover:bg-[#efe9d8] dark:border-[#3a352b] dark:bg-[#17150f] dark:hover:bg-[#2a2721]"
                    >
                      <span className="text-[13px] font-bold text-[#2b2620] dark:text-[#ece5d3]">
                        {soul.name}
                        <span className="block text-[12px] font-normal text-[#6b6252] dark:text-[#a89e88]">
                          {soul.cause}
                        </span>
                      </span>
                      <span className="shrink-0 text-[13px] font-bold whitespace-nowrap">
                        {pick !== null && pick !== undefined
                          ? `${destinationEmoji(pick)} ${destinationLabel(pick)}`
                          : '—'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {submitError !== null && (
              <p className="rounded border border-red-800/50 bg-red-50 px-3 py-2 text-[13px] text-red-900 dark:border-red-500/40 dark:bg-red-950/60 dark:text-red-100">
                {submitError}
              </p>
            )}

            {init.guest ? (
              <p className="rounded border border-dashed border-[#d8d0bd] bg-[#f4f0e6] px-3 py-2 text-center text-[13px] text-[#6b6252] dark:border-[#3a352b] dark:bg-[#17150f] dark:text-[#a89e88]">
                Log in to Reddit to file today&apos;s verdicts. Guests can still
                train in practice mode.
              </p>
            ) : (
              <button
                type="button"
                onClick={() => void handleReviewSubmit()}
                disabled={submitting}
                className="cursor-pointer rounded-md bg-[#2b2620] px-3 py-3 text-[15px] font-bold text-[#f4f0e6] transition-colors hover:bg-[#4a4234] disabled:cursor-default disabled:opacity-60 dark:bg-[#e8e2d4] dark:text-[#221f1a] dark:hover:bg-white"
              >
                {submitting ? 'Filing…' : 'FILE ALL 5 VERDICTS ✓'}
              </button>
            )}
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-md px-4 pb-6">
        <p className="text-center font-mono text-[11px] leading-relaxed text-[#6b6252] dark:text-[#a89e88]">
          All souls are fictional. Any resemblance to actual deceased persons
          is purely coincidental and frankly impressive.
        </p>
      </footer>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
