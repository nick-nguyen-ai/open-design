import { useMemo } from 'react';
import { motion } from 'motion/react';
import { cssVar } from '@enterprise-design/design-tokens';
import { EmptyState, ErrorState, Skeleton, VisuallyHidden } from '@enterprise-design/primitives';
import { buildFlowDiagramLayout, buildFlowDiagramOutline } from './buildFlowDiagramLayout.js';
import type { FlowDiagramData } from './buildFlowDiagramLayout.js';
import { NodeShape } from './NodeShape.js';
import { useThreadTrace } from './useThreadTrace.js';

export type FlowDiagramState = 'default' | 'loading' | 'empty' | 'error';

export interface FlowDiagramProps {
  data: FlowDiagramData;
  title: string;
  sourceNote?: string;
  state?: FlowDiagramState;
  errorMessage?: string;
  onRetry?: () => void;
  className?: string;
}

const NODE_TEXT = cssVar('diagram-node-text');
const EDGE = cssVar('diagram-edge');
const EDGE_STRONG = cssVar('diagram-edge-strong');

function FlowDiagramOutline({ title, lines }: { title: string; lines: readonly string[] }) {
  return (
    <VisuallyHidden as="div">
      <p>{title} — diagram outline</p>
      <ol>
        {lines.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ol>
    </VisuallyHidden>
  );
}

export function FlowDiagram({ data, title, sourceNote, state, errorMessage, onRetry, className }: FlowDiagramProps) {
  const resolvedState = state ?? (data.nodes.length === 0 ? 'empty' : 'default');

  const layout = useMemo(() => buildFlowDiagramLayout(data), [data]);
  const outline = useMemo(() => buildFlowDiagramOutline(data), [data]);
  const ranks = useMemo(() => [...new Set(layout.nodes.map((n) => n.rank))].sort((a, b) => a - b), [layout]);
  const rankByNodeId = useMemo(() => new Map(layout.nodes.map((n) => [n.id, n.rank])), [layout]);
  const { stepsByRank, reduced } = useThreadTrace(ranks);

  if (resolvedState === 'loading') {
    return (
      <div className={className} role="status" aria-label={`Loading ${title}`}>
        <Skeleton shape="rectangular" height={240} className="w-full" />
        <VisuallyHidden>Loading {title}…</VisuallyHidden>
      </div>
    );
  }

  if (resolvedState === 'error') {
    return (
      <ErrorState
        title={`Couldn't load ${title}`}
        description={errorMessage}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  if (resolvedState === 'empty') {
    return (
      <EmptyState title="No diagram data" description={`${title} has no nodes yet.`} className={className} />
    );
  }

  return (
    <figure className={className}>
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        width="100%"
        height={layout.height}
        data-testid="flow-diagram-svg"
        data-motion-sequence="thread-trace"
        data-motion-variant={reduced ? 'reduced' : 'full'}
      >
        <defs>
          <marker
            id="flow-diagram-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill={EDGE_STRONG} />
          </marker>
        </defs>

        <g data-testid="flow-diagram-edges">
          {layout.edges.map((edge) => {
            const step = stepsByRank.get(rankByNodeId.get(edge.to) ?? 0);
            return (
              <motion.g
                key={edge.id}
                data-testid={`flow-diagram-edge-${edge.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={
                  step
                    ? { delay: step.delayMs / 1000, duration: step.durationMs / 1000, ease: step.ease }
                    : undefined
                }
              >
                <line
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  stroke={EDGE}
                  strokeWidth={1.5}
                  markerEnd="url(#flow-diagram-arrow)"
                />
                {edge.label ? (
                  <text
                    x={(edge.x1 + edge.x2) / 2}
                    y={(edge.y1 + edge.y2) / 2 - 6}
                    textAnchor="middle"
                    fontSize={11}
                    fill={NODE_TEXT}
                  >
                    {edge.label}
                  </text>
                ) : null}
              </motion.g>
            );
          })}
        </g>

        <g data-testid="flow-diagram-nodes">
          {layout.nodes.map((node) => {
            const step = stepsByRank.get(node.rank);
            return (
              <motion.g
                key={node.id}
                data-testid={`flow-diagram-node-${node.id}`}
                data-node-kind={node.kind}
                transform={`translate(${node.x},${node.y})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={
                  step
                    ? { delay: step.delayMs / 1000, duration: step.durationMs / 1000, ease: step.ease }
                    : undefined
                }
              >
                <NodeShape kind={node.kind} width={node.width} height={node.height} />
                <text x={node.width / 2} y={node.height / 2 - 6} textAnchor="middle" fontSize={13} fill={NODE_TEXT}>
                  {node.label}
                </text>
                <text
                  x={node.width / 2}
                  y={node.height / 2 + 12}
                  textAnchor="middle"
                  fontSize={10}
                  opacity={0.65}
                  fill={NODE_TEXT}
                >
                  {node.kind}
                </text>
              </motion.g>
            );
          })}
        </g>
      </svg>

      <FlowDiagramOutline title={title} lines={outline} />

      <figcaption className="mt-2 text-xs text-text-muted">
        {title}
        {sourceNote ? ` — ${sourceNote}` : ''}
      </figcaption>
    </figure>
  );
}
