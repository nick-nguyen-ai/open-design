import { lazy, Suspense, useEffect, useRef, useState } from 'react';

/** The design width a component preview renders at before being scaled into the frame. */
const PREVIEW_DESIGN_WIDTH = 560;

/**
 * The fixtures module pulls in every component package (charts, diagrams, all
 * five diagram-collection families), so it stays out of the landing bundle
 * until a component card actually needs it.
 */
const LazyLivePreview = lazy(async () => {
  const m = await import('../routes/previews/componentFixtures.js');
  return {
    default: function LiveFixture({ componentId, scale }: { componentId: string; scale: number }) {
      if (!m.hasLivePreview(componentId)) return null;
      return (
        <div data-testid="component-live-preview" className="absolute inset-0 bg-surface-sunken">
          <div
            className="p-3"
            style={{
              width: PREVIEW_DESIGN_WIDTH,
              transformOrigin: 'top left',
              transform: `scale(${scale})`,
            }}
          >
            <m.ComponentLivePreview componentId={componentId} />
          </div>
        </div>
      );
    },
  };
});

/**
 * The live component fixture, scaled into a browse-card preview frame.
 * Decorative only (`aria-hidden`, no pointer events) — the card itself is the
 * interactive element. Mounts lazily when the card nears the viewport, and
 * leaves the typographic plate underneath as the loading/fallback state.
 */
export function ComponentPreviewFrame({ componentId }: { componentId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const width = el.getBoundingClientRect().width;
    // Zero width means an unlaid-out environment (tests) whose observer will
    // never fire either; render unscaled and immediately.
    setScale(width > 0 ? width / PREVIEW_DESIGN_WIDTH : 1);

    if (width === 0 || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {inView && scale !== null && (
        <Suspense fallback={null}>
          <LazyLivePreview componentId={componentId} scale={scale} />
        </Suspense>
      )}
    </div>
  );
}
