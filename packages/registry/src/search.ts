import type {
  ComponentManifest,
  ExperienceManifest,
  DesignGrammar,
  MotionSequence,
  SearchDocument,
  SearchFacets,
} from '@enterprise-design/contracts';
import { normalizeText, sortBy } from './util.js';

/**
 * Transform every entity into a `SearchDocument` for Task 9's lexical index.
 * `text` is a lowercase lexical blob; `facets` carry the structured filters
 * relevant to that entity type; `summary` is a short human-facing description.
 */
export function buildSearchDocuments(input: {
  components: ComponentManifest[];
  experiences: ExperienceManifest[];
  grammars: DesignGrammar[];
  motionSequences: MotionSequence[];
}): SearchDocument[] {
  const docs: SearchDocument[] = [
    ...input.components.map(componentDocument),
    ...input.experiences.map(experienceDocument),
    ...input.grammars.map(grammarDocument),
    ...input.motionSequences.map(motionDocument),
  ];
  return sortBy(docs, (doc) => doc.id);
}

function componentDocument(component: ComponentManifest): SearchDocument {
  // Components carry array-valued density/corporateSuitability; emit the full
  // arrays so the component is discoverable under every value it supports (a
  // `['low','medium']` component must match both a low and a medium filter).
  const facets: SearchFacets = {
    category: component.category,
    density: component.density,
    motionLevel: component.motionLevel,
    corporateSuitability: component.corporateSuitability,
    renderingCost: component.performance.renderingCost,
    usesCanvas: component.performance.usesCanvas,
    usesWebGL: component.performance.usesWebGL,
    approval: component.approval.state,
    themeModes: component.themeModes,
  };
  if (component.audiences.length > 0) facets.audiences = component.audiences;

  return {
    id: component.id,
    entityType: 'component',
    title: component.name,
    summary: component.description,
    text: normalizeText([
      component.name,
      component.description,
      component.subcategory,
      component.category,
      ...component.tags,
      ...component.businessIntents,
      ...component.designGrammars,
      component.searchText,
    ]),
    tags: component.tags,
    facets,
    route: component.previewRoute,
  };
}

function experienceDocument(experience: ExperienceManifest): SearchDocument {
  // Experiences carry single density/corporateSuitability values; wrap them as
  // one-element arrays so the facet shape is uniform with components.
  const facets: SearchFacets = {
    surface: experience.surface,
    audiences: experience.audiences,
    grammarId: experience.grammarId,
    density: [experience.density],
    motionLevel: experience.motionLevel,
    corporateSuitability: [experience.corporateSuitability],
    approval: experience.approval.state,
    themeModes: experience.themeModes,
  };

  const doc: SearchDocument = {
    id: experience.id,
    entityType: 'experience',
    title: experience.title,
    summary: experience.designThesis,
    text: normalizeText([
      experience.title,
      experience.designThesis,
      ...experience.tags,
      ...experience.businessIntents,
      experience.searchText,
    ]),
    tags: experience.tags,
    facets,
  };
  if (experience.previewRoute !== undefined) doc.route = experience.previewRoute;
  return doc;
}

function grammarDocument(grammar: DesignGrammar): SearchDocument {
  return {
    id: grammar.id,
    entityType: 'grammar',
    title: grammar.name,
    summary: grammar.intent,
    text: normalizeText([
      grammar.name,
      grammar.intent,
      ...grammar.layoutRules,
      ...grammar.typographyRules,
      ...grammar.motionRules,
      ...grammar.surfaceRules,
    ]),
    tags: [],
    facets: { grammarId: grammar.id },
  };
}

function motionDocument(motion: MotionSequence): SearchDocument {
  return {
    id: motion.sequenceId,
    entityType: 'motion',
    title: motion.name,
    summary: motion.description,
    text: normalizeText([
      motion.name,
      motion.description,
      motion.trigger,
      ...motion.order,
      motion.reducedMotionVariant,
    ]),
    tags: [],
    facets: {},
  };
}
