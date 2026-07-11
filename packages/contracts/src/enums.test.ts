import { describe, expect, it } from 'vitest';
import {
  ApprovalState,
  Audience,
  ComponentCategory,
  CompositionRole,
  ContentDensity,
  CorporateSuitability,
  EntityType,
  MotionLevel,
  SurfaceType,
  ThemeMode,
} from './enums.js';

describe('enums', () => {
  it('accepts every documented SurfaceType value', () => {
    for (const value of [
      'dashboard',
      'project-page',
      'slide-deck',
      'personal-page',
      'technical-explainer',
    ]) {
      expect(SurfaceType.parse(value)).toBe(value);
    }
  });

  it('rejects a SurfaceType value outside the enum', () => {
    const result = SurfaceType.safeParse('kanban-board');
    expect(result.success).toBe(false);
  });

  it('accepts every documented Audience value', () => {
    for (const value of [
      'executive',
      'business',
      'risk-and-governance',
      'technical',
      'mixed',
      'personal-internal',
    ]) {
      expect(Audience.parse(value)).toBe(value);
    }
  });

  it('accepts MotionLevel 0 through 3 and rejects 4', () => {
    expect(MotionLevel.parse(0)).toBe(0);
    expect(MotionLevel.parse(1)).toBe(1);
    expect(MotionLevel.parse(2)).toBe(2);
    expect(MotionLevel.parse(3)).toBe(3);
    const result = MotionLevel.safeParse(4);
    expect(result.success).toBe(false);
  });

  it('rejects a non-integer MotionLevel', () => {
    const result = MotionLevel.safeParse(1.5);
    expect(result.success).toBe(false);
  });

  it('accepts every documented ContentDensity value', () => {
    for (const value of ['low', 'medium', 'high', 'adaptive']) {
      expect(ContentDensity.parse(value)).toBe(value);
    }
  });

  it('accepts every documented ThemeMode value', () => {
    for (const value of ['light', 'dark', 'adaptive']) {
      expect(ThemeMode.parse(value)).toBe(value);
    }
  });

  it('accepts every documented ApprovalState value', () => {
    for (const value of ['experimental', 'reviewed', 'approved', 'deprecated']) {
      expect(ApprovalState.parse(value)).toBe(value);
    }
  });

  it('accepts every documented CorporateSuitability value', () => {
    for (const value of ['restricted', 'standard', 'expressive']) {
      expect(CorporateSuitability.parse(value)).toBe(value);
    }
  });

  it('accepts every documented ComponentCategory value', () => {
    for (const value of [
      'shell',
      'navigation',
      'layout',
      'content',
      'status',
      'chart',
      'diagram',
      'table',
      'interaction',
      'motion',
      'presentation',
      'utility',
    ]) {
      expect(ComponentCategory.parse(value)).toBe(value);
    }
  });

  it('accepts every documented CompositionRole value', () => {
    for (const value of [
      'shell',
      'navigation',
      'hero',
      'summary',
      'primary-visual',
      'secondary-visual',
      'detail',
      'evidence',
      'decision',
      'footer',
      'transition',
    ]) {
      expect(CompositionRole.parse(value)).toBe(value);
    }
  });

  it('accepts every documented EntityType value', () => {
    for (const value of ['component', 'experience', 'grammar', 'motion']) {
      expect(EntityType.parse(value)).toBe(value);
    }
  });

  it('rejects an EntityType value outside the enum', () => {
    const result = EntityType.safeParse('widget');
    expect(result.success).toBe(false);
  });
});
