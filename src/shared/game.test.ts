import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  DEATHS,
  DETAILS,
  MEMOS,
  NAMES,
  SOULS_PER_DAY,
  dailySouls,
  dayOfYear,
  majorityMatch,
  memoForDate,
  mulberry32,
  randomSoul,
  rankForPoints,
} from './game.js';

test('daily batch is deterministic for the same date', () => {
  const a = dailySouls('2026-11-23');
  const b = dailySouls('2026-11-23');
  assert.deepEqual(a, b);
});

test('daily batch differs across dates', () => {
  const a = dailySouls('2026-11-23');
  const b = dailySouls('2026-11-24');
  assert.notDeepEqual(
    a.map((s) => s.id),
    b.map((s) => s.id)
  );
});

test('daily batch has 5 unique souls with unique names', () => {
  for (const date of ['2026-11-23', '2026-12-01', '2027-01-15']) {
    const souls = dailySouls(date);
    assert.equal(souls.length, SOULS_PER_DAY);
    assert.equal(new Set(souls.map((s) => s.cause)).size, SOULS_PER_DAY);
    assert.equal(new Set(souls.map((s) => s.name)).size, SOULS_PER_DAY);
    for (const soul of souls) {
      assert.ok(soul.age >= 19 && soul.age <= 88);
    }
  }
});

test('daily batch always contains a soul the memo applies to', () => {
  for (let day = 1; day <= 60; day++) {
    const date = `2026-11-${String(day).padStart(2, '0')}`;
    if (day > 30) {
      continue;
    }
    const memo = memoForDate(date);
    const souls = dailySouls(date);
    assert.ok(
      souls.some((s) => s.tag === memo.tag),
      `no memo-tagged soul on ${date}`
    );
  }
});

test('memo rotates through all memos across the year', () => {
  const seen = new Set<string>();
  for (let doy = 1; doy <= 365; doy++) {
    const date = new Date(Date.UTC(2026, 0, doy)).toISOString().slice(0, 10);
    assert.equal(dayOfYear(date), doy);
    seen.add(memoForDate(date).id);
  }
  assert.equal(seen.size, MEMOS.length);
});

test('content bank has 100+ deaths and every memo tag is covered', () => {
  assert.ok(DEATHS.length >= 100, `only ${DEATHS.length} deaths`);
  for (const memo of MEMOS) {
    assert.ok(
      DEATHS.some((d) => d.tag === memo.tag),
      `no deaths for tag ${memo.tag}`
    );
  }
  assert.ok(NAMES.length >= 40);
  assert.ok(DETAILS.length >= 30);
});

test('content bank contains no banned terms', () => {
  const banned = ['suicide', 'kill yourself', 'hang himself', 'hang herself'];
  const corpus = [...DEATHS.map((d) => d.cause), ...NAMES].join(' ').toLowerCase();
  for (const term of banned) {
    assert.ok(!corpus.includes(term), `banned term found: ${term}`);
  }
});

test('majorityMatch: empty votes match, leader matches, trailing loses', () => {
  assert.equal(
    majorityMatch({ heaven: 0, hell: 0, limbo: 0 }, 'heaven'),
    true
  );
  assert.equal(
    majorityMatch({ heaven: 10, hell: 3, limbo: 2 }, 'heaven'),
    true
  );
  assert.equal(
    majorityMatch({ heaven: 10, hell: 3, limbo: 2 }, 'hell'),
    false
  );
  // Ties count in the player's favor.
  assert.equal(
    majorityMatch({ heaven: 5, hell: 5, limbo: 1 }, 'hell'),
    true
  );
});

test('rank thresholds', () => {
  assert.equal(rankForPoints(0), 'Intern');
  assert.equal(rankForPoints(4), 'Intern');
  assert.equal(rankForPoints(5), 'Clerk');
  assert.equal(rankForPoints(14), 'Clerk');
  assert.equal(rankForPoints(15), 'Supervisor');
  assert.equal(rankForPoints(29), 'Supervisor');
  assert.equal(rankForPoints(30), 'Department Head');
  assert.equal(rankForPoints(49), 'Department Head');
  assert.equal(rankForPoints(50), 'Director of the Afterlife');
  assert.equal(rankForPoints(500), 'Director of the Afterlife');
});

test('randomSoul produces valid souls', () => {
  const rng = mulberry32(42);
  for (let i = 0; i < 20; i++) {
    const soul = randomSoul(rng, `practice-${i}`);
    assert.equal(soul.id, `practice-${i}`);
    assert.ok(soul.name.length > 0);
    assert.ok(soul.cause.length > 0);
    assert.ok(soul.age >= 19 && soul.age <= 88);
  }
});
