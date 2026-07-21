import { useState } from 'react';
import { experienceById, grammarById } from '../data/registry.js';

/** The example experience whose screenshot backs a grammar when its specimen shot is missing. */
export function specimenFallbackId(grammarId: string): string | null {
  const grammar = grammarById.get(grammarId);
  return grammar?.exampleExperienceIds.find((id) => experienceById.has(id)) ?? null;
}

export interface GrammarSpecimenProps {
  grammarId: string;
  alt: string;
  className?: string;
}

/**
 * The grammar's specimen shot — the same content rendered in this grammar
 * (`/previews/grammar-<id>.jpg`). Falls back to the grammar's first example
 * screenshot, then to nothing, so callers keep their plate underneath
 * (same layering contract as `PreviewImage`).
 */
export function GrammarSpecimen({ grammarId, alt, className }: GrammarSpecimenProps) {
  const [source, setSource] = useState<'specimen' | 'example' | 'none'>('specimen');
  const exampleId = specimenFallbackId(grammarId);
  const id = source === 'specimen' ? `grammar-${grammarId}` : exampleId;
  if (source === 'none' || !id) return null;
  return (
    <img
      src={`/previews/${id}.jpg`}
      alt={alt}
      loading="lazy"
      onError={() => setSource(source === 'specimen' && exampleId ? 'example' : 'none')}
      className={className}
    />
  );
}
