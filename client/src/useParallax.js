import { useEffect } from 'react';

export default function useParallax() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const scrolled = window.scrollY;
      document.querySelectorAll('.parallax').forEach((el) => {
        const speed = el.getAttribute('data-speed') || 0.15;
        // Calculate offset based on scroll position vs element position to make it subtle
        const rect = el.parentElement?.getBoundingClientRect();
        if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
          const yPos = (rect.top - window.innerHeight / 2) * speed;
          el.style.transform = `translateY(${yPos}px) scale(1.1)`; // scale 1.1 prevents gaps
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once on load
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}
