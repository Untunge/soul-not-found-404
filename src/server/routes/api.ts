import { Hono } from 'hono';
import { context, redis, reddit } from '@devvit/web/server';
import {
  DESTINATIONS,
  SOULS_PER_DAY,
  dailySouls,
  emptyVotes,
  majorityMatch,
  memoForDate,
  previousDayString,
  rankForPoints,
  todayUtcString,
} from '../../shared/game';
import type { Destination, Memo, Soul, VoteCounts } from '../../shared/game';
import type {
  ConsensusMap,
  ConsensusResponse,
  ErrorResponse,
  InitResponse,
  SubmitRequest,
  SubmitResponse,
} from '../../shared/api';

export const api = new Hono();

type StreakRecord = {
  lastDate: string;
  count: number;
};

type SubmissionRecord = {
  picks: Destination[];
  score: number;
  memoBonus: number;
};

function isDestination(value: unknown): value is Destination {
  return value === 'heaven' || value === 'hell' || value === 'limbo';
}

function isStreakRecord(value: unknown): value is StreakRecord {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!('lastDate' in value) || !('count' in value)) {
    return false;
  }
  return typeof value.lastDate === 'string' && typeof value.count === 'number';
}

function isSubmissionRecord(value: unknown): value is SubmissionRecord {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!('picks' in value) || !('score' in value) || !('memoBonus' in value)) {
    return false;
  }
  const { picks, score, memoBonus } = value;
  return (
    Array.isArray(picks) &&
    picks.length === SOULS_PER_DAY &&
    picks.every(isDestination) &&
    typeof score === 'number' &&
    typeof memoBonus === 'number'
  );
}

function isSubmitRequest(value: unknown): value is SubmitRequest {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!('picks' in value)) {
    return false;
  }
  const { picks } = value;
  return (
    Array.isArray(picks) &&
    picks.length === SOULS_PER_DAY &&
    picks.every(isDestination)
  );
}

function parseRecord(raw: string | undefined): unknown {
  if (raw === undefined) {
    return null;
  }
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function toInt(raw: string | undefined): number {
  if (raw === undefined) {
    return 0;
  }
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

async function readConsensus(
  date: string
): Promise<{ consensus: ConsensusMap; voters: number }> {
  const keys: string[] = [];
  for (let i = 0; i < SOULS_PER_DAY; i++) {
    for (const dest of DESTINATIONS) {
      keys.push(`soulnotfound:agg:${date}:${i}:${dest}`);
    }
  }
  keys.push(`soulnotfound:voters:${date}`);
  const values = await Promise.all(keys.map((key) => redis.get(key)));

  const consensus: ConsensusMap = {};
  for (let i = 0; i < SOULS_PER_DAY; i++) {
    const counts: VoteCounts = emptyVotes();
    DESTINATIONS.forEach((dest, j) => {
      counts[dest] = toInt(values[i * DESTINATIONS.length + j]);
    });
    consensus[i] = {
      ...counts,
      total: counts.heaven + counts.hell + counts.limbo,
    };
  }
  const voters = toInt(values[values.length - 1]);
  return { consensus, voters };
}

function computeScore(
  consensus: ConsensusMap,
  picks: readonly Destination[]
): number {
  let score = 0;
  picks.forEach((pick, i) => {
    const counts = consensus[i];
    if (counts !== undefined && majorityMatch(counts, pick)) {
      score++;
    }
  });
  return score;
}

function computeMemoBonus(
  souls: readonly Soul[],
  memo: Memo,
  picks: readonly Destination[]
): number {
  let bonus = 0;
  souls.forEach((soul, i) => {
    if (soul.tag === memo.tag && picks[i] === memo.destination) {
      bonus++;
    }
  });
  return bonus;
}

api.get('/init', async (c) => {
  const { postId } = context;

  if (!postId) {
    console.error('API Init Error: postId not found in devvit context');
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId is required but missing from context' },
      400
    );
  }

  try {
    const date = todayUtcString();
    const souls = dailySouls(date);
    const memo = memoForDate(date);
    const username = await reddit.getCurrentUsername();

    if (!username) {
      // Logged-out visitors can still play; nothing is persisted.
      return c.json<InitResponse>({
        type: 'init',
        postId,
        date,
        souls,
        memo,
        username: 'anonymous',
        guest: true,
        streak: 0,
        points: 0,
        rank: 'Intern',
        submitted: null,
      });
    }

    const [streakRaw, pointsRaw, submissionRaw] = await Promise.all([
      redis.get(`soulnotfound:streak:${username}`),
      redis.get(`soulnotfound:points:${username}`),
      redis.get(`soulnotfound:sub:${username}:${date}`),
    ]);

    const streakParsed = parseRecord(streakRaw);
    let streak = 0;
    if (isStreakRecord(streakParsed)) {
      // A streak only counts if the last shift was today or yesterday.
      if (
        streakParsed.lastDate === date ||
        streakParsed.lastDate === previousDayString(date)
      ) {
        streak = streakParsed.count;
      }
    }

    const points = toInt(pointsRaw);
    const submissionParsed = parseRecord(submissionRaw);
    let submitted: InitResponse['submitted'] = null;
    if (isSubmissionRecord(submissionParsed)) {
      const { consensus, voters } = await readConsensus(date);
      submitted = {
        picks: submissionParsed.picks,
        score: submissionParsed.score,
        memoBonus: submissionParsed.memoBonus,
        consensus,
        voters,
      };
    }

    return c.json<InitResponse>({
      type: 'init',
      postId,
      date,
      souls,
      memo,
      username,
      guest: false,
      streak,
      points,
      rank: rankForPoints(points),
      submitted,
    });
  } catch (error) {
    console.error(`API Init Error for post ${postId}:`, error);
    let errorMessage = 'Unknown error during initialization';
    if (error instanceof Error) {
      errorMessage = `Initialization failed: ${error.message}`;
    }
    return c.json<ErrorResponse>({ status: 'error', message: errorMessage }, 400);
  }
});

api.post('/submit', async (c) => {
  const { postId } = context;

  if (!postId) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId is required' },
      400
    );
  }

  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Log in to Reddit to file your verdicts.' },
        401
      );
    }

    let body: unknown;
    try {
      body = (await c.req.json()) as unknown;
    } catch {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Invalid request body' },
        400
      );
    }

    if (!isSubmitRequest(body)) {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Picks must be 5 valid destinations' },
        400
      );
    }

    const date = todayUtcString();
    const souls = dailySouls(date);
    const memo = memoForDate(date);

    const existing = await redis.get(`soulnotfound:sub:${username}:${date}`);
    if (existing !== undefined) {
      return c.json<ErrorResponse>(
        { status: 'error', message: "Today's verdicts are already filed." },
        409
      );
    }

    // Score against the consensus BEFORE this submission is counted, so the
    // result is stable and shareable immediately.
    const { consensus } = await readConsensus(date);
    const score = computeScore(consensus, body.picks);
    const memoBonus = computeMemoBonus(souls, memo, body.picks);

    await Promise.all(
      body.picks.map((pick, i) =>
        redis.incrBy(`soulnotfound:agg:${date}:${i}:${pick}`, 1)
      )
    );
    await redis.set(
      `soulnotfound:sub:${username}:${date}`,
      JSON.stringify({
        picks: body.picks,
        score,
        memoBonus,
      })
    );
    await redis.incrBy(`soulnotfound:voters:${date}`, 1);

    const streakRaw = await redis.get(`soulnotfound:streak:${username}`);
    const streakParsed = parseRecord(streakRaw);
    let streak = 1;
    if (isStreakRecord(streakParsed)) {
      if (streakParsed.lastDate === previousDayString(date)) {
        streak = streakParsed.count + 1;
      } else if (streakParsed.lastDate === date) {
        streak = streakParsed.count;
      }
    }
    await redis.set(
      `soulnotfound:streak:${username}`,
      JSON.stringify({ lastDate: date, count: streak })
    );

    const points = await redis.incrBy(
      `soulnotfound:points:${username}`,
      score + memoBonus
    );

    const fresh = await readConsensus(date);
    return c.json<SubmitResponse>({
      type: 'submit',
      score,
      memoBonus,
      points,
      streak,
      rank: rankForPoints(points),
      consensus: fresh.consensus,
      voters: fresh.voters,
    });
  } catch (error) {
    console.error(`API Submit Error for post ${postId}:`, error);
    let errorMessage = 'Unknown error during submit';
    if (error instanceof Error) {
      errorMessage = `Submit failed: ${error.message}`;
    }
    return c.json<ErrorResponse>({ status: 'error', message: errorMessage }, 400);
  }
});

api.get('/consensus', async (c) => {
  const { postId } = context;

  if (!postId) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId is required' },
      400
    );
  }

  try {
    const date = todayUtcString();
    const { consensus, voters } = await readConsensus(date);
    return c.json<ConsensusResponse>({
      type: 'consensus',
      date,
      consensus,
      voters,
    });
  } catch (error) {
    console.error(`API Consensus Error for post ${postId}:`, error);
    return c.json<ErrorResponse>(
      { status: 'error', message: 'Failed to load community results' },
      400
    );
  }
});
