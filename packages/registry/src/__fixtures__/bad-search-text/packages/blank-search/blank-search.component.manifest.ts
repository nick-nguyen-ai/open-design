import { buildComponent } from '../../../_builders.js';

// Whitespace-only searchText passes the schema (min length 1) but the compiler
// rejects it as empty → SEARCH_EMPTY_TEXT.
export default buildComponent({
  id: 'comp.blank-search',
  name: 'Blank Search',
  searchText: '   ',
});
