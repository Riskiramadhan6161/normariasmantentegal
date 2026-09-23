import { useEffect, useRef } from 'react';

/**
 * useReveal — Intersection Observer hook for scroll reveal animations.
 * Adds/removes .visible class on elements with .reveal class.
 * Uses IntersectionObserver (no scroll listener = zero jank).
 */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/**
 * useStaggerReveal — Stagger delays for child elements.
 * Call after data is loaded.
 */
export function useStaggerReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal-stagger');
    els.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.1}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
