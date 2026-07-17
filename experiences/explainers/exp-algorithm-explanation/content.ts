/**
 * "The Assembly Line" — shipped content for `exp-algorithm-explanation`.
 *
 * MinHash near-duplicate detection explained as a workshop line: the same
 * work-piece (two complaint texts) visibly transformed at every station.
 * All data is synthetic and hand-checkable.
 */

export interface Station {
  id: string;
  no: string;
  name: string;
  operation: string;
  why: string;
  inputLabel: string;
  input: string[];
  outputLabel: string;
  output: string[];
}

export const LINE = {
  masthead: 'THE ASSEMBLY LINE · ALGORITHM WORKSHOP',
  jobRef: 'JOB: NEAR-DUPLICATE DETECTION (MINHASH) · SHEET 1 OF 1',
  provenance: 'SYNTHETIC WALKTHROUGH · HAND-CHECKABLE NUMBERS, NOT PRODUCTION DATA',
  kicker: 'ONE WORK-PIECE, SIX STATIONS',
  statement: 'Watch the data change shape at every station.',
  subline:
    'The service desk receives thousands of complaints; near-duplicates should land in the same case file. MinHash decides “are these the same complaint?” without comparing every word. Below, two real work-pieces ride the whole line — every station shows what enters, what the machine does, and what leaves.',
  figures: [
    { label: 'STATIONS', value: '6' },
    { label: 'HASH FUNCTIONS', value: '4' },
    { label: 'SIGNATURE SIZE', value: '4 × 32-BIT' },
    { label: 'FULL COMPARE AVOIDED', value: '100%' },
  ],
} as const;

export const BELT = {
  title: 'The line',
  sub: 'Goods in → shingle → hash → keep the minimum → compare → verdict',
} as const;

export const STATIONS: Station[] = [
  {
    id: 'st0',
    no: 'GOODS IN',
    name: 'Two complaints arrive',
    operation: 'The work-pieces: complaint A and complaint B, as written by two customers.',
    why: 'They read differently but describe the same event — exactly the case that exact matching misses.',
    inputLabel: 'COMPLAINT A',
    input: ['“charged twice for the same card payment on tuesday”'],
    outputLabel: 'COMPLAINT B',
    output: ['“i was charged twice for the same payment last tuesday”'],
  },
  {
    id: 'st1',
    no: 'STATION 1',
    name: 'Shingle',
    operation: 'Slide a 3-word window across each text; every window is one shingle.',
    why: 'Shingles preserve local word order, so shared phrasing survives even when sentences differ.',
    inputLabel: 'A, SHINGLED (6 OF 6)',
    input: [
      'charged twice for', 'twice for the', 'for the same',
      'the same card', 'same card payment', 'card payment on',
    ],
    outputLabel: 'B SHARES 3 OF ITS 7',
    output: ['twice for the', 'for the same', 'charged twice for', '… + 4 unshared'],
  },
  {
    id: 'st2',
    no: 'STATION 2',
    name: 'Hash every shingle',
    operation: 'Each shingle passes through 4 independent hash functions → 4 numbers per shingle.',
    why: 'Numbers compare in constant time; four independent views make one lucky collision harmless.',
    inputLabel: '“for the same” →',
    input: ['h₁ 0x2E41', 'h₂ 0x91B7', 'h₃ 0x0C58', 'h₄ 0x77A2'],
    outputLabel: '“the same card” →',
    output: ['h₁ 0x8D13', 'h₂ 0x44F0', 'h₃ 0x6A2B', 'h₄ 0x1E95'],
  },
  {
    id: 'st3',
    no: 'STATION 3',
    name: 'Keep only the minimum',
    operation: 'Per hash function, keep the SMALLEST value seen across all of a text’s shingles.',
    why: 'The minimum is a fair lottery: two texts sharing many shingles will often share the same winner. This is the whole trick.',
    inputLabel: 'SIGNATURE A',
    input: ['min h₁ 0x0A11', 'min h₂ 0x1BD0', 'min h₃ 0x0C58', 'min h₄ 0x02E7'],
    outputLabel: 'SIGNATURE B',
    output: ['min h₁ 0x0A11', 'min h₂ 0x1BD0', 'min h₃ 0x1F02', 'min h₄ 0x02E7'],
  },
  {
    id: 'st4',
    no: 'STATION 4',
    name: 'Compare signatures',
    operation: 'Line the two signatures up; count the positions that agree.',
    why: 'The agreement rate estimates Jaccard similarity — the share of shingles the texts have in common — without ever comparing shingles directly.',
    inputLabel: 'POSITION BY POSITION',
    input: ['h₁ 0x0A11 = 0x0A11 ✓', 'h₂ 0x1BD0 = 0x1BD0 ✓', 'h₃ 0x0C58 ≠ 0x1F02 ✕', 'h₄ 0x02E7 = 0x02E7 ✓'],
    outputLabel: 'AGREEMENT',
    output: ['3 of 4 positions agree → similarity ≈ 0.75'],
  },
  {
    id: 'st5',
    no: 'GOODS OUT',
    name: 'The verdict',
    operation: 'Estimated similarity 0.75 clears the 0.6 duplicate threshold.',
    why: 'Complaint B is filed into complaint A’s case; the customer is not asked to explain twice.',
    inputLabel: 'THRESHOLD',
    input: ['duplicate if ≥ 0.60'],
    outputLabel: 'VERDICT',
    output: ['NEAR-DUPLICATE · SAME CASE FILE'],
  },
];

export const VERDICT = {
  title: 'Why the trick works',
  sub: 'The honest print on the tin',
  points: [
    {
      id: 'v1',
      head: 'The minimum is a uniform lottery',
      body: 'Hashing makes every shingle equally likely to hold the minimum. If two texts share 75% of their shingles, each hash position agrees with probability 0.75 — so the agreement rate IS the similarity estimate.',
    },
    {
      id: 'v2',
      head: 'Four positions is a coarse estimate',
      body: 'Production lines use 64–128 hash functions; the estimate’s error shrinks like 1/√k. Four is used here so every number on this sheet can be checked by hand.',
    },
    {
      id: 'v3',
      head: 'The saving is the point',
      body: 'Comparing signatures is 4 integer comparisons regardless of text length. Comparing shingle sets directly grows with the texts — and across thousands of complaints, that difference is the whole budget.',
    },
  ],
} as const;

export const SHOP_NOTES = {
  title: 'Shop notes',
  sub: 'What the line does not do',
  items: [
    { id: 'n1', note: 'It does not understand meaning — “refund my card” and “give my money back” share no shingles and score near zero. Semantic matching is a different machine.' },
    { id: 'n2', note: 'Thresholds are calibrated per queue: legal complaints run at 0.8 to avoid false merges; outage floods run at 0.5 to collapse aggressively.' },
    { id: 'n3', note: 'Signatures are stored, not texts — the line re-compares any pair later without re-reading either complaint.' },
  ],
} as const;

export const FOOT = {
  note: 'Every number on this sheet is computable by hand from the two complaints at goods-in. If a station’s output cannot be reproduced, the sheet is wrong and gets fixed.',
  next: 'NEXT SHEET IN THE SERIES · LOCALITY-SENSITIVE BUCKETS',
} as const;
