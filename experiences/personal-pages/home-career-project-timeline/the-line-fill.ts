/**
 * The typed **fill** for "The Line" world-template — the first (and currently
 * only) PERSONAL-PAGE world-template the MCP can compose.
 *
 * The template (`TheLineTemplate.tsx`) carries the whole craft — a career drawn
 * as ONE continuous luminous survey line running top→bottom down a dark slate
 * field: projects are STATIONS, promotions are GAUGE CHANGES where the line
 * visibly thickens, side-projects are BRANCH lines that terminate honestly or
 * rejoin carrying something back, and one honest SWITCHBACK records a two-year
 * detour reversed out of (the anomaly the eye goes to). Supporting: the identity
 * head, an interchanges panel, a next-station-under-survey terminus, and a dated
 * station-register table as the accessible mirror. This file carries only the
 * CONTENT contract: a Zod schema whose limits are derived from the shipped
 * instance's real magnitudes plus ~30% headroom, so ANY schema-valid fill still
 * yields a composed, non-broken page (the display statement never overflows, the
 * rail stays balanced, the table stays legible).
 *
 * THE GAUGE LADDER IS FIXED-SLOT. The line weight and station-dot size are a
 * template-fixed map over four gauges (1..4); the schema pins the gauge-role
 * label map to exactly those four rungs — a fill re-labels the rungs (analyst →
 * principal, or any four-rung ladder) but cannot add a fifth weight the geometry
 * has nowhere to draw. Honest bounds beat pretend flexibility.
 *
 * PERSONAL-PAGE HONESTY (surface rule): this surface presents a PERSON. The
 * schema never forces invented biography — the facts come from the source the
 * fill author was given; where entries are illustrative, the required provenance
 * notice (`chrome.syntheticMark`, echoed in the footer) says so plainly.
 *
 * Two craft slots are mandatory: exactly ONE line node carries `kind:
 * 'switchback'` — the single honest detour the whole page is arranged around
 * (its loop on the rail, its labelled lesson, its flagged row in the mirror
 * table) — and the provenance notice (`chrome.syntheticMark`) printed in the
 * chrome badge and footer.
 *
 * `THE_LINE_SECTIONS` re-states the same slots as the registry-serializable
 * `SectionSpec[]` the world-template descriptor advertises.
 */
import { z } from 'zod';
import type { SectionSpec } from '@enterprise-design/contracts';

/* ------------------------------------------------------------------ */
/* Fixed-slot vocabularies (template-owned geometry keys)              */
/* ------------------------------------------------------------------ */

/** The gauge ladder — line weight & dot size are a template-fixed map over 1..4. */
export const THE_LINE_GAUGES = [1, 2, 3, 4] as const;

/** A grade rung — line weight at a point; the line thickens as the career climbs. */
const Gauge = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]);
/** A node's role on the line — exactly one is the flagged `switchback` detour. */
const NodeKind = z.enum(['station', 'gauge-change', 'switchback', 'branch']);
/** A branch either dead-ends (marked) or comes back carrying something. */
const BranchFate = z.enum(['terminated', 'rejoined']);

/* ------------------------------------------------------------------ */
/* Fill schema — content slots only                                    */
/* ------------------------------------------------------------------ */

/** The person at the head of the line. Facts come from the provided source. */
const Person = z.object({
  name: z.string().min(1).max(30),
  role: z.string().min(1).max(34),
  team: z.string().min(1).max(34),
  location: z.string().min(1).max(24),
});

/** The sticky top chrome + footer identity, and the REQUIRED provenance notice. */
const Chrome = z.object({
  /** The document.title stem (assigned in JS); the template appends " — {name} — Live". */
  pageTitle: z.string().min(1).max(24),
  /** The world label on the top chrome, e.g. "THE LINE · PERSONAL PAGE". */
  world: z.string().min(1).max(34),
  /** The service line on the top chrome, e.g. "SERVICE · LINE OPEN 2014 · STILL RUNNING". */
  service: z.string().min(1).max(52),
  /** REQUIRED provenance notice: the synthetic mark badge in the chrome (and echoed below). */
  syntheticMark: z.string().min(1).max(42),
  /** The footer provenance line reinforcing the synthetic mark. */
  footerProvenance: z.string().min(1).max(88),
  /** The footer service line, e.g. "LINE OPEN 2014 · STILL RUNNING". */
  footerService: z.string().min(1).max(40),
});

/** An identity fact — a label/value pair in the hero definition list. */
const IdentityFact = z.object({
  label: z.string().min(1).max(20),
  value: z.string().min(1).max(28),
});

const Hero = z.object({
  /** The hero eyebrow, e.g. "THE LINE". */
  kicker: z.string().min(1).max(20),
  /** The display statement — one line per array entry (rendered as broken lines). */
  statementLines: z.array(z.string().min(1).max(24)).min(2).max(4),
  /** The person named at the head of the line. */
  person: Person,
  /** One reading of the career under the statement. */
  subline: z.string().min(1).max(270),
  /**
   * The illustrative-profile provenance paragraph (visually hidden, read by
   * assistive tech): states plainly that the profile is a demonstration.
   */
  syntheticNotice: z.string().min(1).max(200),
  facts: z.array(IdentityFact).min(3).max(6),
});

/** A branch node's detail — present iff kind is `branch`. */
const Branch = z.object({
  fate: BranchFate,
  /** What the branch dead-ended as, or what it carried back on rejoining. */
  carried: z.string().min(1).max(112),
});

/** The switchback's detail — present iff kind is `switchback`. */
const Detour = z.object({
  span: z.string().min(1).max(44),
  lesson: z.string().min(1).max(244),
});

/** A node on the line — a station on the rail and a row in the register table. */
const LineNode = z.object({
  id: z.string().min(1),
  /** STRUCTURAL flag: exactly one node is `switchback` (never a text match). */
  kind: NodeKind,
  /** Transit-style station code, mono, e.g. "DP-03". */
  code: z.string().min(1).max(14),
  year: z.string().min(1).max(16),
  name: z.string().min(1).max(46),
  /** The grade rung in force AT and BELOW this node (one of the four gauges). */
  gauge: Gauge,
  /** One-line outcome — should carry a real number. */
  outcome: z.string().min(1).max(80),
  /** The promotion recorded here — present iff kind is `gauge-change`. */
  promotion: z.string().min(1).max(44).optional(),
  /** Branch detail — present iff kind is `branch`. */
  branch: Branch.optional(),
  /** Switchback detail — present iff kind is `switchback`. */
  detour: Detour.optional(),
});

/** The next station under survey — stated as intent, not a promise. */
const Terminus = z.object({
  code: z.string().min(1).max(14),
  label: z.string().min(1).max(36),
  name: z.string().min(1).max(30),
  intent: z.string().min(1).max(214),
});

/** The four-rung gauge-role label map. FIXED-SLOT: exactly gauges 1..4. */
const GaugeRoles = z.object({
  1: z.string().min(1).max(24),
  2: z.string().min(1).max(24),
  3: z.string().min(1).max(24),
  4: z.string().min(1).max(24),
});

const Line = z.object({
  /** The §1 section heading, e.g. "THE LINE". */
  sectionTitle: z.string().min(1).max(20),
  /** The §1 section sub-line (the legend), e.g. "STATION = PROJECT · GAUGE = GRADE · …". */
  sectionSub: z.string().min(1).max(108),
  /** The origin marker label where the line opens, e.g. "LINE OPEN · 2014". */
  originLabel: z.string().min(1).max(28),
  /** The four grade-rung labels the gauge maps to (analyst → principal). */
  gaugeRoles: GaugeRoles,
  /**
   * The stations on the line, top (earliest) → bottom (now). Exactly ONE carries
   * kind "switchback" — the single honest detour the page is arranged around.
   * A gauge-change node carries a promotion; a branch node a branch; the
   * switchback a detour.
   */
  nodes: z
    .array(LineNode)
    .min(5)
    .max(14)
    .refine((rows) => rows.filter((n) => n.kind === 'switchback').length === 1, {
      message: 'Exactly one line node must carry kind "switchback" (the single honest detour the page is arranged around).',
    })
    .superRefine((rows, ctx) => {
      for (const node of rows) {
        if (node.kind === 'switchback' && !node.detour) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `line.nodes "${node.id}": a switchback must carry a detour (span + lesson).` });
        }
        if (node.kind === 'branch' && !node.branch) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `line.nodes "${node.id}": a branch must carry a branch note (fate + carried).` });
        }
        if (node.kind === 'gauge-change' && !node.promotion) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `line.nodes "${node.id}": a gauge-change must carry a promotion label.` });
        }
      }
    }),
  terminus: Terminus,
});

/** An interchange — where this line crossed another person's line. */
const Interchange = z.object({
  id: z.string().min(1),
  code: z.string().min(1).max(12),
  station: z.string().min(1).max(40),
  crossedWith: z.string().min(1).max(44),
  note: z.string().min(1).max(120),
});

const InterchangeSection = z.object({
  /** The §2 section heading, e.g. "INTERCHANGES". */
  sectionTitle: z.string().min(1).max(20),
  /** The §2 section sub-line, e.g. "WHERE THIS LINE CROSSED OTHER PEOPLE'S". */
  sectionSub: z.string().min(1).max(50),
  items: z.array(Interchange).min(2).max(6),
});

/** The §3 station register — the line as a dated table (the accessible mirror). */
const Register = z.object({
  /** The §3 section heading, e.g. "STATION REGISTER". */
  sectionTitle: z.string().min(1).max(24),
  /** The §3 section sub-line, e.g. "THE LINE AS A DATED TABLE — THE ACCESSIBLE MIRROR". */
  sectionSub: z.string().min(1).max(64),
  /** The accessible caption of the register table naming its columns. */
  caption: z.string().min(1).max(180),
});

export const TheLineFill = z.object({
  chrome: Chrome,
  hero: Hero,
  line: Line,
  interchange: InterchangeSection,
  register: Register,
});

export type TheLineFill = z.infer<typeof TheLineFill>;
export type TheLineNode = z.infer<typeof LineNode>;
export type TheLineGauge = z.infer<typeof Gauge>;
export type TheLineNodeKind = z.infer<typeof NodeKind>;
export type TheLineBranchFate = z.infer<typeof BranchFate>;
export type TheLineGaugeRoles = z.infer<typeof GaugeRoles>;

/* ------------------------------------------------------------------ */
/* Slot specs — the registry-serializable descriptor view             */
/* ------------------------------------------------------------------ */

export const THE_LINE_SECTIONS: SectionSpec[] = [
  {
    kind: 'chrome',
    purpose:
      'The sticky top chrome and footer identity of the personal page — the world label, the service line, and the REQUIRED synthetic-profile provenance notice.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'chrome.pageTitle', type: 'text', required: true, limits: { maxChars: 24 }, guidance: 'The browser-tab title stem (assigned in JS, derived byte-identically; the template appends " — {person name} — Live"), e.g. "The Line".' },
      { name: 'chrome.world', type: 'text', required: true, limits: { maxChars: 34 }, guidance: 'The world label on the top chrome, e.g. "THE LINE · PERSONAL PAGE".' },
      { name: 'chrome.service', type: 'text', required: true, limits: { maxChars: 52 }, guidance: 'The service line on the top chrome, e.g. "SERVICE · LINE OPEN 2014 · STILL RUNNING".' },
      { name: 'chrome.syntheticMark', type: 'text', required: true, limits: { maxChars: 42 }, guidance: 'REQUIRED provenance notice — the synthetic-mark badge in the chrome (and echoed in the footer). Must state the profile is illustrative/synthetic where entries are not real, e.g. "ILLUSTRATIVE PROFILE · SYNTHETIC".' },
      { name: 'chrome.footerProvenance', type: 'text', required: true, limits: { maxChars: 88 }, guidance: 'The footer provenance line reinforcing the synthetic mark, e.g. "ILLUSTRATIVE PROFILE · SYNTHETIC · SAMPLE CONTENT IS MARKED AS SUCH".' },
      { name: 'chrome.footerService', type: 'text', required: true, limits: { maxChars: 40 }, guidance: 'The footer service line, e.g. "LINE OPEN 2014 · STILL RUNNING".' },
    ],
  },
  {
    kind: 'hero',
    purpose: 'The editorial hero — the kicker, the multi-line display statement, the person identity line, the subline, the accessible synthetic-profile notice, and the identity facts.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'hero.kicker', type: 'text', required: true, limits: { maxChars: 20 }, guidance: 'The hero eyebrow, e.g. "THE LINE".' },
      { name: 'hero.statementLines', type: 'items', required: true, limits: { minItems: 2, maxItems: 4, maxChars: 24 }, guidance: 'Two-to-four display lines (one per array entry, rendered as broken lines) building the career thesis, e.g. "One line," / "twelve years," / "no gaps hidden.".' },
      { name: 'hero.person.name', type: 'text', required: true, limits: { maxChars: 30 }, guidance: 'The person at the head of the line; a fact from the provided source (illustrative names are covered by the provenance notice), e.g. "Marcus Adeyemi".' },
      { name: 'hero.person.role', type: 'text', required: true, limits: { maxChars: 34 }, guidance: 'The person\'s current role, e.g. "Principal ML Engineer".' },
      { name: 'hero.person.team', type: 'text', required: true, limits: { maxChars: 34 }, guidance: 'The person\'s current team, e.g. "Decisioning Platform".' },
      { name: 'hero.person.location', type: 'text', required: true, limits: { maxChars: 24 }, guidance: 'The person\'s location, e.g. "Melbourne".' },
      { name: 'hero.subline', type: 'longtext', required: true, limits: { maxChars: 270 }, guidance: 'One reading of the career under the statement, naming the honest detour, e.g. "A career is not a list of job titles — it is a single line that thickens where I grew, branches where I gambled, and once doubled back on itself. This is that line, drawn honestly, with the detour left in.".' },
      { name: 'hero.syntheticNotice', type: 'longtext', required: true, limits: { maxChars: 200 }, guidance: 'The accessible (visually hidden) provenance paragraph stating the profile is a demonstration, e.g. "This entire profile is illustrative and synthetic — a demonstration person, not a real member of staff. Projects, dates and figures are sample content.".' },
      { name: 'hero.facts', type: 'items', required: true, limits: { minItems: 3, maxItems: 6 }, guidance: 'Three-to-six identity facts (label, value) in the hero definition list, e.g. { label: "GAUGE", value: "analyst → principal" }.' },
    ],
  },
  {
    kind: 'line',
    purpose:
      'The commanding survey line — the stations top-to-bottom with the one honest switchback flagged, the four-rung gauge-role ladder, the origin marker, and the next-station-under-survey terminus. The gauge ladder is a template-fixed map over four rungs; the fill re-labels the rungs and writes the stations.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'line.sectionTitle', type: 'text', required: true, limits: { maxChars: 20 }, guidance: 'The §1 section heading, e.g. "THE LINE".' },
      { name: 'line.sectionSub', type: 'text', required: true, limits: { maxChars: 108 }, guidance: 'The §1 section sub-line (the legend), true of the line you supply, e.g. "STATION = PROJECT · GAUGE = GRADE · BRANCH = SIDE-PROJECT · ONE SWITCHBACK, LEFT IN".' },
      { name: 'line.originLabel', type: 'text', required: true, limits: { maxChars: 28 }, guidance: 'The origin marker label where the line opens, e.g. "LINE OPEN · 2014".' },
      { name: 'line.gaugeRoles', type: 'metric', required: true, limits: {}, guidance: 'The four grade-rung labels the gauge maps to (an object keyed 1..4, the line thickening as it climbs). FIXED-SLOT: exactly the four rungs, e.g. { "1": "Analyst", "2": "Senior Analyst", "3": "Lead", "4": "Principal" }.' },
      { name: 'line.nodes', type: 'tableRows', required: true, limits: { minItems: 5, maxItems: 14 }, guidance: 'Five-to-fourteen stations, earliest first (id, kind station|gauge-change|switchback|branch, code, year, name, gauge 1|2|3|4, outcome carrying a real number; promotion on a gauge-change; branch {fate terminated|rejoined, carried} on a branch; detour {span, lesson} on the switchback). Exactly ONE node is "switchback" — the single honest detour the page is arranged around, e.g. a two-year migration reversed out.' },
      { name: 'line.terminus.code', type: 'text', required: true, limits: { maxChars: 14 }, guidance: 'The terminus station code, e.g. "DP-10".' },
      { name: 'line.terminus.label', type: 'text', required: true, limits: { maxChars: 36 }, guidance: 'The terminus label, e.g. "NEXT STATION · UNDER SURVEY".' },
      { name: 'line.terminus.name', type: 'text', required: true, limits: { maxChars: 30 }, guidance: 'The next station under survey, e.g. "Causal decisioning".' },
      { name: 'line.terminus.intent', type: 'longtext', required: true, limits: { maxChars: 214 }, guidance: 'The terminus intent — stated as intent, not a promise, e.g. "Moving the bank from prediction to intervention — decisions that change outcomes, not just forecast them. Surveyed, not yet cut. Stated as intent, not as a promise.".' },
    ],
  },
  {
    kind: 'interchange',
    purpose: 'The §2 interchanges panel — where this line crossed other people\'s lines.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'interchange.sectionTitle', type: 'text', required: true, limits: { maxChars: 20 }, guidance: 'The §2 section heading, e.g. "INTERCHANGES".' },
      { name: 'interchange.sectionSub', type: 'text', required: true, limits: { maxChars: 50 }, guidance: "The §2 section sub-line, e.g. \"WHERE THIS LINE CROSSED OTHER PEOPLE'S\"." },
      { name: 'interchange.items', type: 'items', required: true, limits: { minItems: 2, maxItems: 6 }, guidance: 'Two-to-six interchanges (id, code, station, crossedWith, note), e.g. { code: "IX-B", station: "DP-06 · ML guild", crossedWith: "Priya Menon — Streaming Platform", note: "Her pipelines under my models; we shared an on-call rotation for a year." }.' },
    ],
  },
  {
    kind: 'register',
    purpose: 'The §3 station register — the line as a dated table (rendered from line.nodes + terminus); this section carries only its heading and the accessible caption.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'register.sectionTitle', type: 'text', required: true, limits: { maxChars: 24 }, guidance: 'The §3 section heading, e.g. "STATION REGISTER".' },
      { name: 'register.sectionSub', type: 'text', required: true, limits: { maxChars: 64 }, guidance: 'The §3 section sub-line, e.g. "THE LINE AS A DATED TABLE — THE ACCESSIBLE MIRROR".' },
      { name: 'register.caption', type: 'longtext', required: true, limits: { maxChars: 180 }, guidance: 'The accessible caption of the register table naming its columns, e.g. "Every station on the line in date order: code, year, project, grade in force, and outcome. The dated equivalent of the drawn line above.".' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Standard certifier aliases (Task 5)                                 */
/* ------------------------------------------------------------------ */

/** The world's fill Zod schema, by the certifier's standard name. */
export const FILL_SCHEMA = TheLineFill;
/** The registry-serializable section specs, by the certifier's standard name. */
export const SECTIONS = THE_LINE_SECTIONS;

/** The craft guarantees the template makes and the descriptor advertises. */
export const THE_LINE_GUIDANCE: string[] = [
  'A career staged as ONE continuous survey line on a dark slate cartographic field — cold and vertical, a single luminous aqua rail that thickens with grade (gauge), branches for side-projects, and once doubles back on itself. Station typography is mono; project names are an editorial serif.',
  'The commanding visual is THE LINE: every project placed as a STATION down the years, promotions drawn as GAUGE CHANGES where the rail visibly thickens, side-projects as BRANCH lines that terminate honestly or rejoin carrying something back. THE GAUGE LADDER IS FIXED-SLOT — line weight and dot size are a template-fixed map over four rungs, so the schema pins the gauge-role label map to exactly those four rungs; a fill re-labels the rungs (any four-rung ladder) but cannot add a fifth weight the geometry has nowhere to draw. Any schema-valid fill renders composed.',
  'Exactly one line node carries kind "switchback": the single honest detour the whole page is arranged around — a reversed-out chapter drawn as a loop on the rail and labelled with what it taught, and flagged in the mirror table. The flag is STRUCTURAL (a kind field the schema requires exactly one of), never a match on free-form text.',
  'PERSONAL-PAGE HONESTY: this surface presents a PERSON. The schema never forces invented biography — the facts (name, roles, projects, dates, figures) come from the source the fill author was given. Where entries are illustrative or synthetic, the REQUIRED provenance notice (chrome.syntheticMark) says so plainly; it prints as the chrome badge and is reinforced in the footer and the accessible hero notice. The one switchback is an honesty device — a career drawn with a real detour left in, not airbrushed.',
  'The drawn line is decorative (aria-hidden rail); the REAL content is the visible §3 station-register TABLE — the line as a dated register — so the world is fully legible without the rail. The terminus states the next station as INTENT, not a promise.',
  'Slot char caps and item counts are sized so any schema-valid fill stays composed — the display statement never overflows, the rail and its branches stay balanced, and the register table stays legible. Motion: the line draws in on a token easing (DataInkDraw, signature data-ink-draw); fully drawn and static under reduced motion. The mood is locked dark.',
];
