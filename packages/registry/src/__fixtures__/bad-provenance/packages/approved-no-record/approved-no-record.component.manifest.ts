import { buildComponent, DEFAULT_PROVENANCE } from '../../../_builders.js';

// approved but licence not reviewed and no review record → PROV_PROVENANCE.
export default buildComponent({
  id: 'comp.approved-no-record',
  name: 'Approved Without Record',
  provenance: { ...DEFAULT_PROVENANCE, licenceReviewed: false, reviewRecord: '' },
});
