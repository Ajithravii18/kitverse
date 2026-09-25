import { useEffect } from 'react';

/**
 * useScrollReveal
 * Observes every element with class "reveal" and adds "is-visible"
 * when it enters the viewport. Instantly shows all if reduced-motion is on.
 * @param {Array} deps  - re-run when these change (e.g. [products.length])
 */
export default function useScrollReveal(deps = []) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    // Small delay so React has finished rendering new elements
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => obs.observe(el));
    }, 80);

    return () => {
      clearTimeout(timer);
      obs.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
