// API contract between the Devvit client and the Hono server.
// Types only — no runtime code, so both sides stay in sync.

import type {
  Destination,
  Memo,
  RankName,
  Soul,
  VoteCounts,
} from './game';

export type ConsensusMap = Record<number, VoteCounts & { total: number }>;

export type SubmittedRecord = {
  picks: Destination[];
  score: number;
  memoBonus: number;
  consensus: ConsensusMap;
  voters: number;
};

export type InitResponse = {
  type: 'init';
  postId: string;
  date: string;
  souls: Soul[];
  memo: Memo;
  username: string;
  guest: boolean;
  streak: number;
  points: number;
  rank: RankName;
  submitted: SubmittedRecord | null;
};

export type SubmitRequest = {
  picks: Destination[];
};

export type SubmitResponse = {
  type: 'submit';
  score: number;
  memoBonus: number;
  points: number;
  streak: number;
  rank: RankName;
  consensus: ConsensusMap;
  voters: number;
};

export type ConsensusResponse = {
  type: 'consensus';
  date: string;
  consensus: ConsensusMap;
  voters: number;
};

export type ErrorResponse = {
  status: 'error';
  message: string;
};
