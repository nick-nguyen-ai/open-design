/**
 * "The Counterparty Agreement" — shipped content for
 * `exp-api-integration-contract`.
 *
 * A synthetic API integration contract for a fictional payments platform.
 * Every endpoint, error, and amendment is invented.
 */

export interface Endpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  purpose: string;
  auth: string;
  rateLimit: string;
}

export interface Remedy {
  id: string;
  code: string;
  meaning: string;
  remedy: string;
  retrySafe: 'yes' | 'no' | 'with backoff';
}

export interface Amendment {
  id: string;
  version: string;
  date: string;
  nature: string;
  sunset?: string;
}

export const AGREEMENT = {
  masthead: 'INTEGRATION AGREEMENT · REF API-2026-114',
  office: 'PREPARED BY THE PAYMENTS PLATFORM TEAM · MERIDIAN ENGINEERING',
  provenance: 'SYNTHETIC SPECIFICATION · A DEMONSTRATION CONTRACT, NOT A LIVE API',
  kicker: 'MADE THIS 14TH DAY OF JULY 2026',
  title: 'Payments Initiation API',
  subtitle: 'between the Payments Platform (“the Provider”) and any consuming team (“the Consumer”)',
  intent:
    'This agreement is written so the Consumer can build against it unsupervised. If a question requires a support call, that is a defect in this document — raise it as one.',
} as const;

export const RECITALS = [
  'WHEREAS the Provider operates the payment-initiation service at api.meridian.internal/payments and warrants the behaviours described herein;',
  'WHEREAS the Consumer intends to initiate payments and read their outcomes without knowledge of the Provider’s internals;',
  'WHEREAS both parties prefer an exact document to a fast answer;',
  'NOW THEREFORE the parties agree as follows.',
] as const;

export const DEFINITIONS = {
  clause: 'CLAUSE 1 · DEFINITIONS',
  terms: [
    { id: 'df1', term: 'Payment', meaning: 'A single instruction to move funds, identified by the Provider-issued payment_id.' },
    { id: 'df2', term: 'Idempotency-Key', meaning: 'A Consumer-generated UUID v4 header making POST retries safe for 24 hours.' },
    { id: 'df3', term: 'Terminal state', meaning: 'One of settled, failed, or cancelled. A Payment in a terminal state never changes again.' },
    { id: 'df4', term: 'Business day', meaning: 'A London clearing day as published by the scheme calendar endpoint.' },
  ],
} as const;

export const SCHEDULE_A = {
  clause: 'CLAUSE 2 · THE SERVICE',
  lead: 'The Provider shall operate the following endpoints (together, “Schedule A”). Paths are relative to https://api.meridian.internal/payments/v3.',
  caption: 'Schedule A — the five endpoints of the service with method, purpose, authentication, and rate limit.',
  endpoints: [
    { id: 'e1', method: 'POST', path: '/payments', purpose: 'Initiate a Payment', auth: 'mTLS + OAuth2 payments:write', rateLimit: '50/s per client' },
    { id: 'e2', method: 'GET', path: '/payments/{payment_id}', purpose: 'Read one Payment', auth: 'OAuth2 payments:read', rateLimit: '200/s per client' },
    { id: 'e3', method: 'GET', path: '/payments?cursor=…', purpose: 'List Payments (cursor-paged)', auth: 'OAuth2 payments:read', rateLimit: '20/s per client' },
    { id: 'e4', method: 'POST', path: '/payments/{payment_id}/cancel', purpose: 'Request cancellation before settlement', auth: 'OAuth2 payments:write', rateLimit: '10/s per client' },
    { id: 'e5', method: 'GET', path: '/calendar', purpose: 'Scheme business-day calendar', auth: 'OAuth2 payments:read', rateLimit: '5/s per client' },
  ] as Endpoint[],
} as const;

export const EXHIBIT_A = {
  clause: 'EXHIBIT A · THE SHAPE OF A PAYMENT',
  lead: 'A conforming initiation request and the Provider’s reply. Field order is not significant; unknown fields in replies MUST be ignored (Clause 5.3).',
  request: `POST /payments/v3/payments
Idempotency-Key: 5f0c…a411
Content-Type: application/json

{
  "amount":        { "value": "2500.00", "currency": "GBP" },
  "debtor_ref":    "ACC-004417",
  "creditor":      { "iban": "GB29NWBK60161331926819",
                     "name": "Halcyon Supplies Ltd" },
  "execute_after": "2026-07-15",
  "reference":     "INV-2026-0713"
}`,
  response: `201 Created
Location: /payments/v3/payments/pay_8c22e1

{
  "payment_id": "pay_8c22e1",
  "state":      "accepted",
  "amount":     { "value": "2500.00", "currency": "GBP" },
  "created_at": "2026-07-14T09:12:04Z",
  "state_reasons": []
}`,
} as const;

export const REMEDIES = {
  clause: 'CLAUSE 3 · FAILURES AND REMEDIES',
  lead: 'The Provider fails loudly and specifically. For each failure the Consumer’s remedy is stated; no other remedy should be improvised.',
  caption: 'Failure table — status codes with their meaning, the Consumer’s remedy, and retry safety.',
  items: [
    { id: 'r1', code: '400 invalid_request', meaning: 'The request violates Schedule A or Exhibit A.', remedy: 'Fix the request. Do not retry unchanged.', retrySafe: 'no' },
    { id: 'r2', code: '401 / 403', meaning: 'Credentials absent, expired, or lacking scope.', remedy: 'Refresh token; verify scopes against Clause 2.', retrySafe: 'yes' },
    { id: 'r3', code: '409 duplicate_payment', meaning: 'Same Idempotency-Key with a different body.', remedy: 'Treat as a Consumer bug; generate keys per logical payment.', retrySafe: 'no' },
    { id: 'r4', code: '422 unprocessable', meaning: 'Well-formed but unpayable (e.g. closed account).', remedy: 'Surface state_reasons to the operator. Do not retry.', retrySafe: 'no' },
    { id: 'r5', code: '429 rate_limited', meaning: 'Clause 2 rate limit exceeded; Retry-After is authoritative.', remedy: 'Back off for Retry-After seconds, then resume.', retrySafe: 'with backoff' },
    { id: 'r6', code: '5xx / timeout', meaning: 'The Provider is unwell; the Payment state is unknown.', remedy: 'Retry the SAME Idempotency-Key with exponential backoff; reconcile via GET.', retrySafe: 'with backoff' },
  ] as Remedy[],
} as const;

export const AMENDMENTS = {
  clause: 'CLAUSE 4 · AMENDMENTS AND VERSIONS',
  lead: 'The Provider amends this agreement only by version. Within a major version, changes are additive: new optional fields, new endpoints, new enum values consumers MUST tolerate.',
  sunsetPolicy: 'A deprecated major version runs for 180 days after its successor ships, with sunset dates published below and in the Sunset response header.',
  items: [
    { id: 'a1', version: 'v3.2 (current)', date: '02 JUN 2026', nature: 'Added execute_after scheduling and the /calendar endpoint.' },
    { id: 'a2', version: 'v3.1', date: '11 FEB 2026', nature: 'Added state_reasons[] to Payment replies (additive).' },
    { id: 'a3', version: 'v3.0', date: '03 NOV 2025', nature: 'Cursor pagination replaced page numbers; cancellation became explicit.' },
    { id: 'a4', version: 'v2', date: '2024', nature: 'Superseded.', sunset: 'SUNSET COMPLETED 01 MAY 2026' },
  ] as Amendment[],
} as const;

export const SIGNATURES = {
  clause: 'IN WITNESS WHEREOF',
  lead: 'the parties commit to this contract in their pipelines, where it is enforced by schema tests on every merge.',
  provider: { role: 'FOR THE PROVIDER', name: 'Payments Platform Team', mark: 'CONTRACT TESTS GREEN · BUILD #4118' },
  consumer: { role: 'FOR THE CONSUMER', name: 'Any team, unsupervised', mark: 'COUNTERSIGN BY PASSING THE CONFORMANCE PACK' },
} as const;

export const FOOT = {
  note: 'This agreement is generated from the OpenAPI source of truth and re-published on every change; the rendered document and the schema cannot drift because they are the same artefact.',
  next: 'CONFORMANCE PACK: run `make api-conformance` in the consumer template',
} as const;
