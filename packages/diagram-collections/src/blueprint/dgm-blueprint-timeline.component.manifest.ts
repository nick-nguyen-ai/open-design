import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'blueprint',
  familyName: 'Blueprint',
  kind: 'timeline',
  description: 'Drafting-table timeline: a dimensioned datum line with alternating stations and a marked now.',
  searchText: 'blueprint drafting technical timeline datum evolution eras roadmap dimension',
  grammarId: 'drafting-board',
  sourceFile: 'packages/diagram-collections/src/blueprint/BlueprintTimeline.tsx',
  exportName: 'BlueprintTimeline',
  motionLevel: 1,
  themeModes: ['dark'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Connector routing is midpoint-elbow Manhattan, not obstacle-avoiding.',
  ],
});
