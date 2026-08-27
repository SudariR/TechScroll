'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export function useActiveClip(count: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  /* which clip is on screen */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = Array.from(
      container.querySelectorAll<HTMLElement>('[data-clip-index]')
    );
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(Number(entry.target.getAttribute('data-clip-index')));
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [count]);

  /* imperative navigation */
  const scrollToClip = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container) return;

      const clamped = Math.max(0, Math.min(index, count - 1));
      const target = container.querySelector<HTMLElement>(
        `[data-clip-index="${clamped}"]`
      );
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [count]
  );

  /* up / down arrows move between clips */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToClip(activeIndex + 1);
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToClip(activeIndex - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, scrollToClip]);

  return { containerRef, activeIndex, scrollToClip };
}