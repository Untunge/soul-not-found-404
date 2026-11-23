import './index.css';

import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { context, requestExpandedMode } from '@devvit/web/client';
import type { InitResponse } from '../shared/api';

export const Splash = () => {
  const [init, setInit] = useState<InitResponse | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/init');
        if (!res.ok) {
          return;
        }
        const data: InitResponse = await res.json();
        setInit(data);
      } catch {
        // Splash stays usable with static copy if the API is unreachable.
      }
    };
    void load();
  }, []);

  const filed = init?.submitted !== null && init?.submitted !== undefined;

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#f4f0e6] px-4 py-5 text-[#2b2620] dark:bg-[#17150f] dark:text-[#e8e2d4]">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-lg border border-[#d8d0bd] bg-[#fffdf7] p-4 shadow-sm dark:border-[#3a352b] dark:bg-[#221f1a]">
          <p className="font-mono text-[10px] tracking-[0.2em] text-[#6b6252] uppercase dark:text-[#a89e88]">
            Dept. of Afterlife Affairs — Form 404
          </p>
          <h1 className="mt-1 text-xl leading-tight font-black">
            ERROR 404: SOUL NOT FOUND
          </h1>
          <p className="mt-2 text-[14px] leading-snug text-[#4a4234] dark:text-[#cfc7b2]">
            You are the new intern in afterlife administration. Five souls
            arrived today, all with ridiculous deaths. Sort them into Heaven,
            Hell, or Limbo — and try to agree with the rest of the department.
          </p>

          {init !== null && (
            <div className="mt-3 rounded border border-dashed border-[#d8d0bd] bg-[#f4f0e6] px-3 py-2 dark:border-[#3a352b] dark:bg-[#17150f]">
              <p className="font-mono text-[11px] font-bold tracking-widest text-[#6b6252] uppercase dark:text-[#a89e88]">
                📋 Memo of the day — {init.memo.id}
              </p>
              <p className="mt-1 text-[13px] leading-snug">{init.memo.text}</p>
              {!init.guest && init.streak > 0 && (
                <p className="mt-2 font-mono text-[11px] text-[#6b6252] dark:text-[#a89e88]">
                  {init.rank} · 🔥 {init.streak}-day streak
                </p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={(e) => void requestExpandedMode(e.nativeEvent, 'game')}
            className="mt-4 w-full cursor-pointer rounded-md bg-[#2b2620] px-3 py-3 text-[15px] font-bold text-[#f4f0e6] transition-colors hover:bg-[#4a4234] dark:bg-[#e8e2d4] dark:text-[#221f1a] dark:hover:bg-white"
          >
            {filed ? 'View today’s shift report →' : 'Begin today’s shift →'}
          </button>

          <p className="mt-3 text-center font-mono text-[11px] text-[#6b6252] dark:text-[#a89e88]">
            {context.username
              ? `Clerk ${context.username} reporting for duty.`
              : 'New shift starts every day. Five souls. Three destinations.'}
          </p>
        </div>
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
