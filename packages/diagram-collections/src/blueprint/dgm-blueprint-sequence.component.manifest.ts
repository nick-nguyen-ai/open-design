import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'blueprint',
  familyName: 'Blueprint',
  kind: 'sequence',
  description: 'Drafting-table sequence diagram: stencil actor plates, ruled lifelines, ticked orthogonal message wires.',
  searchText: 'blueprint drafting drawio technical sequence diagram lifelines messages protocol schematic',
  grammarId: 'drafting-board',
  sourceFile: 'packages/diagram-collections/src/blueprint/BlueprintSequence.tsx',
  exportName: 'BlueprintSequence',
  motionLevel: 1,
  themeModes: ['dark'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Connector routing is midpoint-elbow Manhattan, not obstacle-avoiding.',
  ],
});
