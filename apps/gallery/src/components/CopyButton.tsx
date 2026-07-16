import { useEffect, useRef, useState } from 'react';

export interface CopyButtonProps {
  /** The exact text written to the clipboard. */
  text: string;
  label?: string;
}

/** A small copy-to-clipboard button with a transient "Copied" confirmation. */
export function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API unavailable (e.g. insecure context): textarea fallback.
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-7 shrink-0 items-center gap-1 rounded-md border border-border-subtle bg-surface-raised px-2 font-mono text-[0.62rem] font-medium uppercase tracking-wider text-text-secondary transition-colors duration-feedback ease-settle hover:bg-surface-sunken hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    >
      {copied ? 'Copied ✓' : label}
    </button>
  );
}
