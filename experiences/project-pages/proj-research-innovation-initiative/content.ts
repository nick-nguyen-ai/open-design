/**
 * "The Bet Book" — synthetic content for `proj-research-innovation-initiative`.
 * Exploratory research bets kept as a shared betting book: each bet a spread
 * with the hypothesis, the stake, the running odds, evidence entries as they
 * land, and the next experiment on the slip. Fictional bank: Meridian.
 * All content synthetic.
 */

export const BOOK = {
  masthead: 'MERIDIAN BANK · RESEARCH SYNDICATE',
  ref: 'THE BET BOOK · VOLUME III · OPENED JAN 2026',
  kicker: 'HYPOTHESES, STAKES, ODDS, EVIDENCE',
  title: 'Six bets. The odds move only when evidence lands.',
  subline:
    'The syndicate runs research as a betting book: every bet is a falsifiable hypothesis with a stake, opening odds, and a slip naming the next experiment. Evidence moves the odds; opinions do not. A lost bet that was cheap to settle is a win for the book — the sin is not losing, it is paying full price to learn nothing.',
  figures: [
    { label: 'BETS IN THE BOOK', value: '6' },
    { label: 'OPEN', value: '3' },
    { label: 'SETTLED — WON', value: '1' },
    { label: 'SETTLED — LOST', value: '1' },
  ],
  provenance: 'SYNTHETIC BET BOOK · DEMONSTRATION RESEARCH BETS, NOT A LIVE PORTFOLIO',
} as const;

export type BetStatus = 'open' | 'paying-out' | 'won' | 'lost';

export interface Bet {
  id: string;
  no: string;
  hypothesis: string;
  stake: string;
  openingOdds: string;
  currentOdds: string;
  status: BetStatus;
  /** Confidence track, 0–100 per checkpoint — drawn as the ink line. */
  track: readonly number[];
  evidence: readonly { date: string; entry: string }[];
  slip: string;
  margin: string;
}

export const BETS: readonly Bet[] = [
  {
    id: 'bet-1',
    no: 'BET 07',
    hypothesis: 'An LLM copilot can draft SME credit narratives that pass senior-underwriter review unchanged at least 60% of the time.',
    stake: '2 researchers · 1 quarter',
    openingOdds: '3/1 AGAINST',
    currentOdds: 'EVENS',
    status: 'open',
    track: [25, 32, 41, 48, 52],
    evidence: [
      { date: '8 JUL', entry: 'Third blind panel: 54% of drafts passed unchanged, up from 38% in May.' },
      { date: '12 JUN', entry: 'Structured-facts grounding cut hallucinated covenants to zero across 200 drafts.' },
    ],
    slip: 'NEXT EXPERIMENT · blind panel with 3 senior underwriters on 60 live-like cases · settles the bet by 15 AUG',
    margin: 'the odds moved on evidence, not enthusiasm',
  },
  {
    id: 'bet-2',
    no: 'BET 09',
    hypothesis: 'Graph features from payment networks improve mule-account detection recall by 15 points at fixed precision.',
    stake: '1 researcher · 2 quarters',
    openingOdds: '2/1 AGAINST',
    currentOdds: '4/6 ON',
    status: 'paying-out',
    track: [33, 45, 58, 66, 71],
    evidence: [
      { date: '1 JUL', entry: 'Offline replay on Q1 data: +19 points recall at fixed precision. Above the bet line.' },
      { date: '20 MAY', entry: 'Feature leakage found and fixed — earlier +26 result withdrawn honestly.' },
    ],
    slip: 'NEXT EXPERIMENT · shadow-mode run against live traffic for four weeks · pays out if the replay holds',
    margin: 'withdrew a good number for a true one',
  },
  {
    id: 'bet-3',
    no: 'BET 11',
    hypothesis: 'Synthetic transaction data can stand in for production data in fraud-model pretraining with under 2 points of loss.',
    stake: '1 researcher · 1 quarter',
    openingOdds: '5/1 AGAINST',
    currentOdds: '4/1 AGAINST',
    status: 'open',
    track: [17, 15, 19, 22],
    evidence: [
      { date: '3 JUL', entry: 'First generator run: distribution match good on amounts, poor on merchant sequences.' },
    ],
    slip: 'NEXT EXPERIMENT · sequence-aware generator vs baseline on the March holdout · cheap kill scheduled 30 JUL',
    margin: 'long odds — sized accordingly',
  },
  {
    id: 'bet-4',
    no: 'BET 12',
    hypothesis: 'A retrieval layer over policy documents lets branch staff answer regulated queries with zero escalation errors.',
    stake: '2 researchers · 6 weeks',
    openingOdds: '7/2 AGAINST',
    currentOdds: '3/1 AGAINST',
    status: 'open',
    track: [22, 28, 25],
    evidence: [
      { date: '10 JUL', entry: 'Pilot desk: 91% correct answers, but two escalation misses — the bet line is zero.' },
    ],
    slip: 'NEXT EXPERIMENT · adversarial query set written by the compliance team themselves · 8 AUG',
    margin: 'zero means zero',
  },
  {
    id: 'bet-5',
    no: 'BET 04',
    hypothesis: 'Weekly-refreshed features beat monthly for churn prediction by enough to fund the pipeline cost.',
    stake: '1 researcher · 1 quarter',
    openingOdds: 'EVENS',
    currentOdds: 'SETTLED',
    status: 'won',
    track: [50, 58, 70, 84, 100],
    evidence: [
      { date: '30 APR', entry: 'A/B against monthly baseline: +11% early-warning lift; pipeline cost recovered 3.2×.' },
      { date: '2 APR', entry: 'Feature freshness audit confirmed the effect is timing, not leakage.' },
    ],
    slip: 'SETTLED WON · 30 APR 2026 · pipeline funded and handed to the model foundry',
    margin: 'paid for the whole quarter',
  },
  {
    id: 'bet-6',
    no: 'BET 05',
    hypothesis: 'Voice-of-customer embeddings can predict complaint escalation three days ahead with useful precision.',
    stake: '1 researcher · 6 weeks',
    openingOdds: '2/1 AGAINST',
    currentOdds: 'SETTLED',
    status: 'lost',
    track: [33, 38, 24, 12, 0],
    evidence: [
      { date: '16 MAY', entry: 'Signal vanished under class rebalancing; precision at 3 days was coin-flip.' },
      { date: '25 APR', entry: 'Early lift traced to duplicate complaints in the training window.' },
    ],
    slip: 'SETTLED LOST · 16 MAY 2026 · six weeks, one researcher — the cheapest no in the book',
    margin: 'cheap loss, clean lesson',
  },
] as const;

export const STATUS_LABEL: Record<BetStatus, string> = {
  open: 'OPEN',
  'paying-out': 'PAYING OUT',
  won: 'SETTLED · WON',
  lost: 'SETTLED · LOST',
};

export const HOUSE_RULES = {
  title: 'House rules',
  sub: 'How the book is kept honest',
  rules: [
    {
      id: 'hr-1',
      rule: 'A bet must be falsifiable and dated.',
      note: 'If no experiment can settle it, it is a belief, not a bet, and it does not enter the book.',
    },
    {
      id: 'hr-2',
      rule: 'Odds move on evidence only.',
      note: 'Every odds change cites the evidence entry that moved it. Enthusiasm is free; it buys nothing here.',
    },
    {
      id: 'hr-3',
      rule: 'Losing cheap is winning.',
      note: 'Bet 05 settled lost in six weeks for one researcher. The book exists to make the noes cheap and the yesses early.',
    },
    {
      id: 'hr-4',
      rule: 'No doubling down without new evidence.',
      note: 'A stake may grow only when the odds have shortened for a written reason. Sunk cost is not a reason.',
    },
  ],
} as const;

export const FOOT = {
  note: 'The Bet Book — exploratory research kept as a betting book: falsifiable hypotheses, honest odds, evidence entries, and the next experiment on every slip. All bets are synthetic.',
  next: 'NEXT SETTLEMENT · BET 09 SHADOW RUN CLOSES 12 AUG 2026',
} as const;
