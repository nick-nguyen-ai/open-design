import { useEffect } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { documentById } from '../data/registry.js';
import { detailRoute } from '../data/routes.js';
import { ENTITY_LABEL } from '../data/labels.js';
import { browseStateFromParams, activeFilterCount } from '../state/browseState.js';
import { MetaGrid, Page, Section } from '../components/Page.js';
import { writeStorage } from '../state/safeStorage.js';

const HANDOFF_KEY = 'gallery.blueprintHandoff';

/**
 * Stub route. It receives the handoff selection (query, filters, focused item)
 * from the URL, persists it to localStorage, and displays it — the full lab is
 * a later task.
 */
export default function BlueprintLab() {
  const [params] = useSearchParams();
  const state = browseStateFromParams(params);
  const focusId = params.get('focus');
  const focusDoc = focusId ? documentById.get(focusId) : undefined;

  useEffect(() => {
    writeStorage(HANDOFF_KEY, params.toString());
  }, [params]);

  const filterCount = activeFilterCount(state.filters);

  return (
    <Page
      eyebrow="Preview"
      title="Blueprint Lab"
      description="The lab receives your discovery selection so you can compose it into a blueprint. The full composition experience is a later task — this page confirms the handoff."
      backTo="/browse"
      backLabel="Back to browse"
    >
      <div className="flex flex-col gap-10">
        <div className="rounded-lg border border-dashed border-border-strong bg-surface-raised p-4 text-sm text-text-secondary">
          Stub route — the full Blueprint Lab arrives in a later task. Your selection below is
          preserved in the URL and localStorage.
        </div>

        <Section title="Handoff selection">
          <MetaGrid
            rows={[
              { label: 'Query', value: state.query || '—' },
              { label: 'Mode', value: state.mode },
              { label: 'Active filters', value: filterCount === 0 ? 'None' : String(filterCount) },
              {
                label: 'Focused item',
                value: focusDoc ? (
                  <RouterLink
                    to={detailRoute(focusDoc.entityType, focusDoc.id)}
                    className="text-accent hover:underline"
                  >
                    {focusDoc.title} ({ENTITY_LABEL[focusDoc.entityType]})
                  </RouterLink>
                ) : (
                  '—'
                ),
              },
            ]}
          />
        </Section>
      </div>
    </Page>
  );
}
