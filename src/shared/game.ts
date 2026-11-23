// Shared game logic for "Error 404: Soul Not Found".
// Pure functions + content banks, used by both client and server so the
// daily batch is identical everywhere. No imports from @devvit/* here.

export type Destination = 'heaven' | 'hell' | 'limbo';

export const DESTINATIONS: readonly Destination[] = ['heaven', 'hell', 'limbo'];

export type DeathTag =
  | 'influencer'
  | 'food'
  | 'animal'
  | 'tech'
  | 'sport'
  | 'work'
  | 'vehicle'
  | 'fashion'
  | 'home'
  | 'nature'
  | 'music'
  | 'gaming'
  | 'money'
  | 'science'
  | 'travel'
  | 'holiday'
  | 'love'
  | 'art';

export type DeathCause = {
  cause: string;
  tag: DeathTag;
};

export type SoulDetail = {
  kind: 'occupation' | 'last-sin' | 'carrying';
  text: string;
};

export type Soul = {
  id: string;
  name: string;
  age: number;
  cause: string;
  tag: DeathTag;
  detail: SoulDetail;
};

export type Memo = {
  id: string;
  tag: DeathTag;
  destination: Destination;
  text: string;
};

export type RankName =
  | 'Intern'
  | 'Clerk'
  | 'Supervisor'
  | 'Department Head'
  | 'Director of the Afterlife';

export const SOULS_PER_DAY = 5;

export const RANKS: readonly { name: RankName; minPoints: number }[] = [
  { name: 'Intern', minPoints: 0 },
  { name: 'Clerk', minPoints: 5 },
  { name: 'Supervisor', minPoints: 15 },
  { name: 'Department Head', minPoints: 30 },
  { name: 'Director of the Afterlife', minPoints: 50 },
];

// ---------------------------------------------------------------------------
// Content bank. ALL fictional and absurd. Hard rules for every entry:
// no real people, no real tragedies, no suicide, no children, no gore or
// graphic description. Deadpan tone, never cruel.
// ---------------------------------------------------------------------------

export const DEATHS: readonly DeathCause[] = [
  // influencer
  { cause: 'Slipped on a banana peel while filming a TikTok outfit reveal', tag: 'influencer' },
  { cause: 'Mauled by a goose he had been taunting for content', tag: 'influencer' },
  { cause: 'Fell into a fountain while livestreaming a "hidden gem" restaurant review', tag: 'influencer' },
  { cause: 'Struck by a falling ring light during a 12-hour livestream', tag: 'influencer' },
  { cause: 'Drowned in a bathtub full of energy drink during a sponsorship stunt', tag: 'influencer' },
  { cause: 'Electrocuted by a bedazzled phone charger shaped like a crown', tag: 'influencer' },
  // food
  { cause: 'Choked on a single grape during a competitive eating livestream', tag: 'food' },
  { cause: 'Poisoned by his own home-brewed kombucha, batch #47', tag: 'food' },
  { cause: 'Crushed by a vending machine he was shaking for a stuck candy bar', tag: 'food' },
  { cause: 'Exploded a pressure cooker full of beans during a chili cook-off', tag: 'food' },
  { cause: 'Choked on a pizza slice folded the wrong way, according to Naples', tag: 'food' },
  { cause: 'Ate a ghost pepper, then a second ghost pepper, "for science"', tag: 'food' },
  { cause: 'Buried under a collapsed tower of pancakes at a pancake-eating contest', tag: 'food' },
  // animal
  { cause: 'Bitten by a radioactive spider, gained no powers, developed an allergy', tag: 'animal' },
  { cause: 'Stung by 47 bees while wearing a bee costume to a costume party', tag: 'animal' },
  { cause: 'Trampled by a herd of alpacas during a yoga retreat', tag: 'animal' },
  { cause: 'Pecked by the parrot he taught to say "help"', tag: 'animal' },
  { cause: 'Dragged into a pond by a swan he tried to hug for a photo', tag: 'animal' },
  { cause: 'Chased off a pier by a seagull that wanted his sandwich, and got it', tag: 'animal' },
  // tech
  { cause: 'Electrocuted by a phone charging in the bathtub during a video call', tag: 'tech' },
  { cause: 'Crushed by a server rack he was hugging "because it was warm"', tag: 'tech' },
  { cause: 'Struck by a delivery drone carrying his own order', tag: 'tech' },
  { cause: 'Tripped over a VR cable while dodging a virtual dragon', tag: 'tech' },
  { cause: 'Locked in a smart home that updated its firmware and forgot him', tag: 'tech' },
  { cause: 'Struck by a self-driving car that was, technically, parked', tag: 'tech' },
  // sport
  { cause: 'Hit by a golf cart driven by a golfer celebrating a hole-in-one', tag: 'sport' },
  { cause: 'Launched off a treadmill that was set to "marathon" by mistake', tag: 'sport' },
  { cause: 'Hit by his own boomerang, twice, same throw', tag: 'sport' },
  { cause: 'Tackled by the mascot during a halftime proposal', tag: 'sport' },
  { cause: 'Drowned in sports drink dumped on him after the big win', tag: 'sport' },
  { cause: 'Broke every bone in a charity fun run that was neither fun nor a run', tag: 'sport' },
  // work
  { cause: 'Drowned in a ball pit at a corporate team-building event', tag: 'work' },
  { cause: 'Buried alive under an avalanche of free conference tote bags', tag: 'work' },
  { cause: 'Fell from a ladder while hanging a "Safety First" banner', tag: 'work' },
  { cause: 'Buried under printed emails, all marked URGENT', tag: 'work' },
  { cause: 'Fell asleep in a meeting that never ended', tag: 'work' },
  { cause: 'Crushed by a falling filing cabinet labeled "DO NOT OPEN"', tag: 'work' },
  // vehicle
  { cause: 'Drove into a lake because the GPS said "you have arrived"', tag: 'vehicle' },
  { cause: 'Hit by a train of thought, then by an actual train', tag: 'vehicle' },
  { cause: 'Hit by a food truck while chasing a food truck', tag: 'vehicle' },
  { cause: 'Drove off a pier following a detour sign drawn by a prankster', tag: 'vehicle' },
  { cause: 'Crashed a bumper car into a real car', tag: 'vehicle' },
  { cause: 'Fell off a segway tour while leading a segway tour', tag: 'vehicle' },
  // fashion
  { cause: 'Tripped over his own red carpet at his own premiere', tag: 'fashion' },
  { cause: 'Strangled by his own scarf in a revolving door', tag: 'fashion' },
  { cause: 'Blinded by rhinestones, walked into a fountain', tag: 'fashion' },
  { cause: 'Tripped on platform shoes at a "flat shoes only" party', tag: 'fashion' },
  { cause: 'Buried under a collapsed walk-in closet', tag: 'fashion' },
  { cause: 'Allergic reaction to a spray tan, shade "Tropical Regret"', tag: 'fashion' },
  // home
  { cause: 'Crushed by a falling pile of unopened subscription boxes', tag: 'home' },
  { cause: 'Crushed by a flat-pack wardrobe assembled without the instructions', tag: 'home' },
  { cause: 'Drowned in a bathtub full of bath bombs, all fizzing at once', tag: 'home' },
  { cause: 'Electrocuted by a Christmas light display visible from space', tag: 'home' },
  { cause: 'Buried under a mountain of laundry, clean', tag: 'home' },
  { cause: 'Fell into a beanbag and never got out', tag: 'home' },
  // nature
  { cause: 'Struck by lightning twice in the same afternoon, second time while explaining the first', tag: 'nature' },
  { cause: 'Struck by a falling coconut while reading about coconut statistics', tag: 'nature' },
  { cause: 'Swept off a cliff by a gust while flying a kite the size of a car', tag: 'nature' },
  { cause: 'Frozen solid while waiting for the Northern Lights, in July, in Florida', tag: 'nature' },
  { cause: 'Buried by a sandcastle he built "to scale"', tag: 'nature' },
  { cause: 'Chased off a cliff by a cloud shaped like his ex', tag: 'nature' },
  // music
  { cause: 'Struck by a falling grand piano during a silent meditation retreat', tag: 'music' },
  { cause: 'Deafened by his own guitar solo, then by the silence', tag: 'music' },
  { cause: 'Crushed by a falling stack of vinyl records, all jazz', tag: 'music' },
  { cause: 'Struck by lightning while playing "Thunderstruck" on an outdoor stage', tag: 'music' },
  { cause: 'Drowned in a mosh pit at a lullaby concert', tag: 'music' },
  { cause: 'Choked on a harmonica during a one-man-band performance', tag: 'music' },
  // gaming
  { cause: 'Locked himself inside an escape room and refused all hints on principle', tag: 'gaming' },
  { cause: 'Rage-quit life after losing a 12-hour board game on the final roll', tag: 'gaming' },
  { cause: 'Crushed by a falling arcade cabinet he was tilting', tag: 'gaming' },
  { cause: 'Starved while waiting for a game update, 99% for three days', tag: 'gaming' },
  { cause: 'Fell off a chair during a VR horror game, the chair won', tag: 'gaming' },
  { cause: 'Struck by a thrown controller, his own, in slow motion', tag: 'gaming' },
  // money
  { cause: 'Crushed by a safe he was trying to crack "for fun"', tag: 'money' },
  { cause: 'Drowned in a vault of coins, all pennies', tag: 'money' },
  { cause: 'Struck by a falling stock ticker, literally', tag: 'money' },
  { cause: 'Buried under lottery tickets, all losers', tag: 'money' },
  { cause: 'Choked on a gold coin he was biting to test', tag: 'money' },
  { cause: 'Trampled during a Black Friday sale, for a toaster', tag: 'money' },
  // science
  { cause: 'Dissolved his own shoes in acid, then stood in the acid', tag: 'science' },
  { cause: 'Struck by a meteor he had just predicted would miss', tag: 'science' },
  { cause: 'Frozen by liquid nitrogen while making "instant ice cream"', tag: 'science' },
  { cause: 'Electrocuted by a Tesla coil he built "for the aesthetic"', tag: 'science' },
  { cause: 'Drowned in a ball pit full of water beads, for research', tag: 'science' },
  { cause: 'Turned himself into a pickle, as a joke, permanently', tag: 'science' },
  // travel
  { cause: 'Fell off a tour bus while taking a photo of the tour bus', tag: 'travel' },
  { cause: 'Struck by a falling suitcase on a luggage carousel', tag: 'travel' },
  { cause: 'Drowned in a hotel infinity pool that was, in fact, finite', tag: 'travel' },
  { cause: 'Lost in an airport for so long he became a local legend, then a statistic', tag: 'travel' },
  { cause: 'Crushed by a duty-free shopping bag avalanche', tag: 'travel' },
  { cause: 'Swept away by a wave while proposing on a cliff, ring included', tag: 'travel' },
  // holiday
  { cause: 'Swept away by a flash flood of foam at a foam party', tag: 'holiday' },
  { cause: 'Crushed by a falling Christmas tree, decorated with anvils', tag: 'holiday' },
  { cause: 'Drowned in eggnog at an office holiday party', tag: 'holiday' },
  { cause: 'Struck by a firework he lit "for a better view"', tag: 'holiday' },
  { cause: 'Buried under a collapsed gingerbread house, full scale', tag: 'holiday' },
  { cause: 'Choked on a candy cane the size of a cane', tag: 'holiday' },
  // love
  { cause: 'Fainted during a flash mob proposal, his own', tag: 'love' },
  { cause: 'Crushed by a heart-shaped balloon arch', tag: 'love' },
  { cause: 'Drowned in a chocolate fountain at a wedding', tag: 'love' },
  { cause: 'Struck by a bouquet thrown with professional force', tag: 'love' },
  { cause: 'Tripped over a red carpet rolled out for his date', tag: 'love' },
  { cause: 'Choked on a ring hidden in a cake, his own ring', tag: 'love' },
  // art
  { cause: 'Fell off a stage while accepting an award for graceful movement', tag: 'art' },
  { cause: 'Crushed by a sculpture of himself, commissioned by himself', tag: 'art' },
  { cause: 'Drowned in a vat of blue paint, "for the experience"', tag: 'art' },
  { cause: 'Strangled by a boa at a performance art piece about freedom', tag: 'art' },
  { cause: 'Fell off a ladder painting a mural of a ladder', tag: 'art' },
  { cause: 'Buried under a collapsed installation called "The Weight of Art"', tag: 'art' },
];

export const NAMES: readonly string[] = [
  'Brenda Kowalski', 'Gary Plumb', 'Denise Wobble', 'Kevin Thatch',
  'Margaret Fenn', 'Douglas Pine', 'Priya Nair', 'Tom Okafor',
  'Linda Marsh', 'Steve Bickle', 'Harold Brisk', 'Nancy Doodle',
  'Frank Zibble', 'Rosa Puddle', 'Timothy Gnat', 'Susan Wrench',
  'Carl Bumble', 'Edith Spool', 'Walter Grime', 'Betty Crumb',
  'Oscar Fennel', 'Gloria Thimble', 'Ralph Nudge', 'Mabel Crank',
  'Ernie Plank', 'Vera Dusk', 'Stanley Moth', 'Iris Blunt',
  'Gus Tumble', 'Penny Latch', 'Harvey Quill', 'Doris Fable',
  'Norman Sleet', 'Agnes Pout', 'Felix Bramble', 'Cora Wisp',
  'Milton Gripe', 'Hazel Prune', 'Clyde Bumper', 'Opal Tread',
  'Vernon Ditch', 'Lulu Parch', 'Gordon Flask', 'Maude Kettle',
  'Rex Tangle', 'Sylvia Nook', 'Burt Wallow', 'Fern Hollow',
  'Alvin Crust', 'Greta Muffle', 'Owen Pippin', 'Sadie Lark',
  'Hugo Fritter', 'Nora Biscuit', 'Elmer Soot', 'Tess Brine',
  'Wilbur Hinge', 'Pearl Doss',
];

export const DETAILS: readonly SoulDetail[] = [
  { kind: 'occupation', text: 'Professional line-stander' },
  { kind: 'occupation', text: 'Influencer (12 followers)' },
  { kind: 'occupation', text: 'Part-time wizard' },
  { kind: 'occupation', text: 'Museum gift-shop manager' },
  { kind: 'occupation', text: 'Competitive napper' },
  { kind: 'occupation', text: 'Self-described visionary' },
  { kind: 'occupation', text: 'Retired kazoo enthusiast' },
  { kind: 'occupation', text: 'Amateur cloud namer' },
  { kind: 'occupation', text: 'Full-time coupon clipper' },
  { kind: 'occupation', text: 'Assistant to the regional manager' },
  { kind: 'occupation', text: 'Freelance meeting attendee' },
  { kind: 'occupation', text: 'Sock-pairing consultant' },
  { kind: 'last-sin', text: 'Replied "k" to a heartfelt message' },
  { kind: 'last-sin', text: 'Ate the last slice and denied it' },
  { kind: 'last-sin', text: 'Left a shopping cart in a parking space' },
  { kind: 'last-sin', text: 'Spoiled a season finale at a wedding' },
  { kind: 'last-sin', text: 'Used "reply all" on purpose' },
  { kind: 'last-sin', text: 'Took the last parking spot, slowly' },
  { kind: 'last-sin', text: 'Pretended to be on the phone to avoid a neighbor' },
  { kind: 'last-sin', text: 'Ate cereal with a fork, twice' },
  { kind: 'last-sin', text: 'Said "you too" when the waiter said "enjoy your meal"' },
  { kind: 'last-sin', text: 'Ghosted a group chat about brunch' },
  { kind: 'last-sin', text: 'Clapped when the plane landed' },
  { kind: 'last-sin', text: 'Reheated fish in the office microwave' },
  { kind: 'carrying', text: 'A tote bag full of tote bags' },
  { kind: 'carrying', text: 'One (1) rubber duck, ceremonial' },
  { kind: 'carrying', text: 'A coupon expired in 2019' },
  { kind: 'carrying', text: 'A half-eaten sandwich, evidence' },
  { kind: 'carrying', text: '47 loyalty cards, none stamped' },
  { kind: 'carrying', text: 'An umbrella, indoors' },
  { kind: 'carrying', text: 'A kazoo, loaded' },
  { kind: 'carrying', text: 'A participation trophy, engraved' },
  { kind: 'carrying', text: 'Three (3) identical hats' },
  { kind: 'carrying', text: 'A map of a mall that no longer exists' },
  { kind: 'carrying', text: 'A portable fan, decorative' },
  { kind: 'carrying', text: 'A jar of pickles, emergency' },
];

export const MEMOS: readonly Memo[] = [
  { id: 'MEMO-001', tag: 'influencer', destination: 'limbo', text: 'All influencers are to be held in Limbo pending follower verification. Verification takes 400–600 years.' },
  { id: 'MEMO-002', tag: 'food', destination: 'heaven', text: 'Deaths involving food are to be fast-tracked to Heaven. The cafeteria upstairs has questions.' },
  { id: 'MEMO-003', tag: 'animal', destination: 'heaven', text: 'Anyone killed by an animal they provoked is to be sent to Heaven. The animal has already filed a complaint.' },
  { id: 'MEMO-004', tag: 'tech', destination: 'hell', text: 'Deaths involving smart devices are to be routed to Hell. IT has been notified. IT is also in Hell.' },
  { id: 'MEMO-005', tag: 'sport', destination: 'limbo', text: 'Sports-related deaths go to Limbo until the replay is reviewed. The replay is always under review.' },
  { id: 'MEMO-006', tag: 'work', destination: 'heaven', text: 'Deaths that occurred while on the clock qualify for immediate Heaven. HR insisted.' },
  { id: 'MEMO-007', tag: 'vehicle', destination: 'limbo', text: 'All vehicle-related souls to Limbo. The Department of Roads has misplaced the paperwork.' },
  { id: 'MEMO-008', tag: 'fashion', destination: 'hell', text: 'Fashion-related deaths go to Hell. The dress code downstairs is strict.' },
  { id: 'MEMO-009', tag: 'home', destination: 'heaven', text: 'Deaths at home qualify for Heaven. Home is where the afterlife starts, apparently.' },
  { id: 'MEMO-010', tag: 'nature', destination: 'heaven', text: 'Deaths by natural causes (broadly defined) go to Heaven. The weather department apologizes.' },
  { id: 'MEMO-011', tag: 'music', destination: 'limbo', text: 'Music-related souls to Limbo. The choir is at capacity.' },
  { id: 'MEMO-012', tag: 'gaming', destination: 'hell', text: 'Gaming deaths go to Hell. There are no continues downstairs.' },
  { id: 'MEMO-013', tag: 'money', destination: 'hell', text: 'Deaths involving money go to Hell. The finance department has questions about the paperwork.' },
  { id: 'MEMO-014', tag: 'science', destination: 'heaven', text: 'Deaths in the name of science go to Heaven. Peer review is pending.' },
  { id: 'MEMO-015', tag: 'travel', destination: 'limbo', text: 'Travel-related souls to Limbo. Their luggage has not arrived.' },
  { id: 'MEMO-016', tag: 'holiday', destination: 'heaven', text: 'Holiday deaths go to Heaven. The decorations committee is thrilled.' },
  { id: 'MEMO-017', tag: 'love', destination: 'heaven', text: 'Deaths in the name of love go to Heaven. Even the embarrassing ones. Especially the embarrassing ones.' },
  { id: 'MEMO-018', tag: 'art', destination: 'limbo', text: 'Art-related souls to Limbo. The critics are still deliberating.' },
];

// ---------------------------------------------------------------------------
// Deterministic randomness (mulberry32 over an FNV-1a hash of the date).
// ---------------------------------------------------------------------------

export function hashSeed(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sample<T>(rng: () => number, arr: readonly T[]): T {
  const item = arr[Math.floor(rng() * arr.length)];
  if (item === undefined) {
    throw new Error('sample from empty pool');
  }
  return item;
}

function shuffled<T>(rng: () => number, arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const a = copy[i];
    const b = copy[j];
    if (a === undefined || b === undefined) {
      throw new Error('shuffle index out of range');
    }
    copy[i] = b;
    copy[j] = a;
  }
  return copy;
}

// ---------------------------------------------------------------------------
// Dates (UTC everywhere, so every player shares one "today").
// ---------------------------------------------------------------------------

export function todayUtcString(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function dayOfYear(dateStr: string): number {
  const date = new Date(`${dateStr}T00:00:00.000Z`);
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  return Math.floor((date.getTime() - start) / 86400000) + 1;
}

export function previousDayString(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function memoForDate(dateStr: string): Memo {
  const memo = MEMOS[(dayOfYear(dateStr) - 1) % MEMOS.length];
  if (memo === undefined) {
    throw new Error('memo rotation out of range');
  }
  return memo;
}

function makeSoul(
  rng: () => number,
  id: string,
  death: DeathCause,
  name: string,
  detail: SoulDetail
): Soul {
  return {
    id,
    name,
    age: 19 + Math.floor(rng() * 70),
    cause: death.cause,
    tag: death.tag,
    detail,
  };
}

/** The 5 souls for a given date. Deterministic: same date, same souls. */
export function dailySouls(dateStr: string): Soul[] {
  const rng = mulberry32(hashSeed(`soul-not-found-404:${dateStr}`));
  const memo = memoForDate(dateStr);

  // Guarantee at least one soul the memo applies to, so the memo matters.
  const memoPool = DEATHS.filter((d) => d.tag === memo.tag);
  const first = sample(rng, memoPool);
  const rest = shuffled(
    rng,
    DEATHS.filter((d) => d !== first)
  ).slice(0, SOULS_PER_DAY - 1);
  const deaths = shuffled(rng, [first, ...rest]);

  const names = shuffled(rng, NAMES).slice(0, SOULS_PER_DAY);
  const details = shuffled(rng, DETAILS).slice(0, SOULS_PER_DAY);

  return deaths.map((death, i) => {
    const name = names[i];
    const detail = details[i];
    if (name === undefined || detail === undefined) {
      throw new Error('dailySouls ran out of names or details');
    }
    return makeSoul(rng, `${dateStr}-${i}`, death, name, detail);
  });
}

/** One random soul for practice mode (no scoring, no streak). */
export function randomSoul(rng: () => number, id: string): Soul {
  return makeSoul(
    rng,
    id,
    sample(rng, DEATHS),
    sample(rng, NAMES),
    sample(rng, DETAILS)
  );
}

// ---------------------------------------------------------------------------
// Scoring, ranks, display helpers.
// ---------------------------------------------------------------------------

export type VoteCounts = { heaven: number; hell: number; limbo: number };

export function emptyVotes(): VoteCounts {
  return { heaven: 0, hell: 0, limbo: 0 };
}

/**
 * Does a pick match the community consensus? The pick matches when it is
 * already a leading verdict (ties count in the player's favor), or when
 * nobody has voted yet — the player sets the precedent.
 */
export function majorityMatch(counts: VoteCounts, pick: Destination): boolean {
  const total = counts.heaven + counts.hell + counts.limbo;
  if (total === 0) {
    return true;
  }
  const picked = counts[pick];
  return picked >= counts.heaven && picked >= counts.hell && picked >= counts.limbo;
}

export function rankForPoints(points: number): RankName {
  let rank: RankName = 'Intern';
  for (const entry of RANKS) {
    if (points >= entry.minPoints) {
      rank = entry.name;
    }
  }
  return rank;
}

export function nextRank(points: number): { name: RankName; minPoints: number } | null {
  for (const entry of RANKS) {
    if (points < entry.minPoints) {
      return entry;
    }
  }
  return null;
}

export function destinationEmoji(destination: Destination): string {
  switch (destination) {
    case 'heaven':
      return '☁️';
    case 'hell':
      return '🔥';
    case 'limbo':
      return '🌫️';
  }
}

export function destinationLabel(destination: Destination): string {
  switch (destination) {
    case 'heaven':
      return 'Heaven';
    case 'hell':
      return 'Hell';
    case 'limbo':
      return 'Limbo';
  }
}

export function destinationStamp(destination: Destination): string {
  switch (destination) {
    case 'heaven':
      return 'APPROVED';
    case 'hell':
      return 'DENIED';
    case 'limbo':
      return 'PENDING';
  }
}

export function shareText(
  dateStr: string,
  picks: readonly Destination[],
  score: number,
  memoBonus: number,
  rank: RankName,
  streak: number
): string {
  const grid = picks.map((p) => destinationEmoji(p)).join('');
  const memoLine = memoBonus > 0 ? `Memo followed (+${memoBonus})` : 'Memo ignored';
  return [
    `Error 404: Soul Not Found — ${dateStr}`,
    grid,
    `Score: ${score}/${SOULS_PER_DAY} match the community · ${memoLine}`,
    `Rank: ${rank} · Streak: ${streak} day${streak === 1 ? '' : 's'}`,
  ].join('\n');
}
