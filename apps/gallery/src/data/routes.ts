import type { EntityType } from '@enterprise-design/contracts';

/** Detail-route path for a catalogue item, by entity type. */
export function detailRoute(entityType: EntityType, id: string): string {
  switch (entityType) {
    case 'experience':
      return `/templates/${id}`;
    case 'component':
      return `/components/${id}`;
    case 'grammar':
      return `/grammars/${id}`;
    default:
      return '/browse';
  }
}
