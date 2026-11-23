import { useCallback, useEffect, useState } from 'react';
import type {
  ConsensusResponse,
  InitResponse,
  SubmitResponse,
} from '../../shared/api';
import type { Destination } from '../../shared/game';

type GameState = {
  init: InitResponse | null;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  submitError: string | null;
};

function errorMessage(data: unknown, fallback: string): string {
  if (typeof data === 'object' && data !== null && 'message' in data) {
    const message = data.message;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }
  return fallback;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const data: unknown = await res.json();
    throw new Error(errorMessage(data, `Request failed (HTTP ${res.status})`));
  }
  return await res.json();
}

export const useGame = () => {
  const [state, setState] = useState<GameState>({
    init: null,
    loading: true,
    error: null,
    submitting: false,
    submitError: null,
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchJson<InitResponse>('/api/init');
      setState((prev) => ({ ...prev, init: data, loading: false }));
    } catch (err) {
      console.error('Failed to load game', err);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load game',
      }));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = useCallback(
    async (picks: Destination[]): Promise<SubmitResponse | null> => {
      setState((prev) => ({ ...prev, submitting: true, submitError: null }));
      try {
        const data = await fetchJson<SubmitResponse>('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ picks }),
        });
        setState((prev) => ({ ...prev, submitting: false }));
        return data;
      } catch (err) {
        console.error('Failed to submit verdicts', err);
        setState((prev) => ({
          ...prev,
          submitting: false,
          submitError: err instanceof Error ? err.message : 'Submit failed',
        }));
        return null;
      }
    },
    []
  );

  const refreshConsensus = useCallback(async (): Promise<ConsensusResponse | null> => {
    try {
      return await fetchJson<ConsensusResponse>('/api/consensus');
    } catch (err) {
      console.error('Failed to refresh consensus', err);
      return null;
    }
  }, []);

  return {
    ...state,
    refresh: load,
    submit,
    refreshConsensus,
  } as const;
};
