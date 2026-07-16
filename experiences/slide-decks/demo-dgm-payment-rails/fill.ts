import { FILL_SCHEMA, type BlueprintDeckFill } from '../deck-dgm-blueprint/dgm-blueprint-fill.js';

/**
 * "/demo/payment-rails" — experience-composer run 2 (blueprint tour).
 * Brief: specify how a card payment actually moves — authorisation, clearing,
 * settlement — as engineering sheets for a payments platform team.
 * Composed via compose_slide_deck → dgm-blueprint; validated by validate_fill.
 */
export const paymentRailsFill: BlueprintDeckFill = FILL_SCHEMA.parse({
  deck: {
    code: 'DGM-PAY-01',
    world: 'THE DRAFTING BOARD',
    title: 'Inside a card payment',
    standfirst:
      'A tap takes two seconds; the money takes two days. These sheets draw the rails as built: the authorisation race, the batch that clears it, the settlement that finally moves value, and the ledgers that must agree at every joint.',
    notice: 'SYNTHETIC RAIL SPECIFICATION — DEMONSTRATION ONLY',
  },
  flow: {
    heading: 'Two seconds of yes-or-no',
    caption:
      'Authorisation is a promise, not a payment: the issuer gates on funds and fraud, and an approval only places a hold. Nothing moves until capture enters the evening batch.',
    title: 'The authorisation path',
    nodes: [
      { id: 'tap', label: 'Card tapped', kind: 'start' },
      { id: 'gateway', label: 'Gateway tokenises', kind: 'process' },
      { id: 'acquirer', label: 'Acquirer routes', kind: 'process' },
      { id: 'network', label: 'Card network switches', kind: 'process' },
      { id: 'issuer', label: 'Issuer: funds + fraud?', kind: 'decision' },
      { id: 'decline', label: 'Declined at terminal', kind: 'end' },
      { id: 'hold', label: 'Auth hold ledger', kind: 'data' },
      { id: 'approved', label: 'Approved — hold placed', kind: 'end' },
    ],
    edges: [
      { from: 'tap', to: 'gateway', step: 1 },
      { from: 'gateway', to: 'acquirer', step: 2 },
      { from: 'acquirer', to: 'network', step: 3 },
      { from: 'network', to: 'issuer', step: 4 },
      { from: 'issuer', to: 'decline', label: 'no', step: 5 },
      { from: 'issuer', to: 'hold', label: 'yes', step: 6 },
      { from: 'hold', to: 'approved', step: 7 },
    ],
  },
  sequence: {
    heading: 'The auth message, joint by joint',
    caption:
      'One ISO 8583 message travels four hops out and four hops back in under two seconds. Every party stamps it — that trail of stamps is what reconciliation will replay tomorrow.',
    title: 'Authorisation, end to end',
    actors: [
      { id: 'terminal', label: 'Terminal', kind: 'user' },
      { id: 'gw', label: 'Gateway', kind: 'service' },
      { id: 'net', label: 'Card network', kind: 'external' },
      { id: 'iss', label: 'Issuer', kind: 'store' },
    ],
    messages: [
      { from: 'terminal', to: 'gw', label: 'auth request (tokenised PAN)' },
      { from: 'gw', to: 'net', label: 'ISO 8583 0100', note: 'via the acquirer' },
      { from: 'net', to: 'iss', label: 'route to issuing bank' },
      { from: 'iss', to: 'iss', label: 'funds check + fraud score' },
      { from: 'iss', to: 'net', label: 'approve 00, auth code', reply: true },
      { from: 'net', to: 'gw', label: 'response relayed', reply: true },
      { from: 'gw', to: 'terminal', label: 'APPROVED in ~1.8s', reply: true },
    ],
  },
  layers: {
    heading: 'Five parties, one stack',
    caption:
      'Reading down: the merchant experiences, the gateway translates, the acquirer sponsors, the network switches, the issuer decides. Money and liability both climb this stack — fees peel off at every floor.',
    title: 'The payment stack',
    sideLabel: 'a transaction descends',
    layers: [
      { id: 'merchant', label: 'Merchant', detail: 'Checkout, terminal, receipts', items: ['POS', 'e-com'] },
      { id: 'gateway2', label: 'Gateway', detail: 'Tokenise, route, retry', items: ['vault', '3DS'] },
      { id: 'acquirer2', label: 'Acquirer', detail: 'Sponsors the merchant onto rails', items: ['MID', 'risk'] },
      { id: 'network2', label: 'Card network', detail: 'Switches and sets the rules', items: ['interchange', 'disputes'], tone: 'accent' },
      { id: 'issuer2', label: 'Issuer', detail: 'Holds the account, takes the loss', items: ['auth engine', 'fraud'] },
    ],
  },
  zones: {
    heading: 'The estate the money crosses',
    caption:
      'Four estates with hard boundaries: the merchant side never sees a real PAN, the network sees everything and stores nothing, and only the banks hold accounts. Every wire is a contract.',
    title: 'The rails estate',
    zones: [
      { id: 'merchantside', label: 'Merchant side', nodes: [{ id: 'pos', label: 'Terminal / checkout' }, { id: 'gw2', label: 'Gateway + vault' }] },
      { id: 'acq', label: 'Acquiring bank', nodes: [{ id: 'acqsw', label: 'Acquirer switch' }, { id: 'merchacct', label: 'Merchant account' }] },
      { id: 'rails', label: 'Network rails', nodes: [{ id: 'switch', label: 'Auth switch' }, { id: 'clearing', label: 'Clearing system' }, { id: 'settle2', label: 'Settlement service' }] },
      { id: 'issuing', label: 'Issuing bank', nodes: [{ id: 'authz', label: 'Auth engine' }, { id: 'cardacct', label: 'Cardholder account' }] },
    ],
    links: [
      { from: 'pos', to: 'gw2', label: 'token only' },
      { from: 'gw2', to: 'acqsw', label: 'auth 0100' },
      { from: 'acqsw', to: 'switch' },
      { from: 'switch', to: 'authz', label: '~150ms' },
      { from: 'clearing', to: 'merchacct', label: 'batch files' },
      { from: 'settle2', to: 'cardacct', label: 'net positions' },
    ],
  },
  cycle: {
    heading: 'The day the money actually moves',
    caption:
      'Authorisation is intraday theatre; the real machine runs on a daily wheel. Capture batches feed clearing, clearing nets to settlement, and reconciliation trues every ledger before the wheel turns again.',
    title: 'The settlement cycle',
    hubLabel: 'T+1',
    stages: [
      { id: 'capture', label: 'Capture', detail: 'Day’s approvals batched' },
      { id: 'clear', label: 'Clear', detail: 'Network exchanges files' },
      { id: 'net', label: 'Net', detail: 'Positions per bank' },
      { id: 'settle', label: 'Settle', detail: 'Value moves at the central bank' },
      { id: 'fund', label: 'Fund merchant', detail: 'Minus fees, next day' },
      { id: 'reconcile', label: 'Reconcile', detail: 'Three ledgers must agree' },
    ],
  },
  compare: {
    heading: 'Three verbs that sound alike',
    caption:
      'Authorise, clear, settle: the industry’s most-confused trio. The sheet fixes what each verb moves, when it runs, and whether you can take it back — memorise the reversibility column.',
    title: 'Authorise vs clear vs settle',
    columns: [
      { id: 'auth', label: 'Authorise', tone: 'accent' },
      { id: 'clearv', label: 'Clear' },
      { id: 'settlev', label: 'Settle' },
    ],
    rows: [
      { label: 'What moves', values: ['a promise (hold)', 'the data (files)', 'the money (net value)'] },
      { label: 'When', values: ['real time, ~2s', 'end of day batches', 'T+1 banking window'] },
      { label: 'Reversible?', values: ['yes — void the hold', 'yes — via returns', 'only by new transactions'] },
      { label: 'Who runs it', values: ['issuer decides', 'network exchanges', 'central bank finality'] },
    ],
    verdict: 'If a number surprises you, first ask which verb produced it — most payment bugs are verb confusion.',
  },
  cells: {
    heading: 'The drawing’s standard parts',
    caption:
      'Eight terms every payments engineer stamps onto designs. One line each, precise enough to survive a compliance review.',
    title: 'Rails vocabulary, sheet one',
    columnsHint: 4,
    cells: [
      { id: 'pan', label: 'PAN', detail: 'The card number — vaulted, never logged' },
      { id: 'token', label: 'Network token', detail: 'Stand-in PAN scoped to one merchant' },
      { id: 'interchange2', label: 'Interchange', detail: 'The issuer’s fee, set by the network' },
      { id: 'mid', label: 'MID', detail: 'The merchant’s identity on the rails' },
      { id: 'threeds', label: '3DS', detail: 'Issuer challenge that shifts liability' },
      { id: 'authcode', label: 'Auth code', detail: 'The issuer’s six-character promise' },
      { id: 'chargeback2', label: 'Chargeback', detail: 'The dispute rail, 120-day window' },
      { id: 'nsf', label: 'Code 51', detail: 'Insufficient funds — the honest decline' },
    ],
  },
  timeline: {
    heading: 'Fifty years on the same wire format',
    caption:
      'The rails evolved by accretion, never replacement: chips joined magstripes, tokens joined PANs, and ISO 8583 still carries most of it. The current era finally moves the message format itself.',
    title: 'The rails, era by era',
    nowIndex: 4,
    eras: [
      { id: 'zipzap', label: 'Imprinters', marker: '1970s', detail: 'Carbon paper and phone calls' },
      { id: 'magstripe', label: 'Magstripe + 8583', marker: '1980s', detail: 'Electronic auth is born' },
      { id: 'emv', label: 'EMV chip', marker: '2000s', detail: 'Cryptograms kill cloning' },
      { id: 'contactless', label: 'Contactless + wallets', marker: '2010s', detail: 'Tokens enter the rails' },
      { id: 'iso20022', label: 'ISO 20022 era', marker: 'now', detail: 'Rich data replaces fixed fields' },
    ],
  },
  close: {
    takeaways: [
      'Authorisation holds, clearing informs, settlement moves — keep the three verbs apart.',
      'The merchant side never touches a real PAN; tokens carry the whole journey.',
      'The daily wheel (capture → clear → net → settle → reconcile) is the actual product.',
      'Every hop stamps the message; reconciliation is replaying the stamps until ledgers agree.',
    ],
    signoff:
      'Trace one real transaction from tap to merchant payout in your own logs, naming the verb at every hop. Where you cannot name the verb, that is where your next incident is hiding.',
  },
});
