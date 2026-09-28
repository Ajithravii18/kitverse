import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useHomeMotion(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = gsap.matchMedia();
    let disposed = false;
    const refresh = () => { if (!disposed) ScrollTrigger.refresh(); };
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const hero = root.querySelector('[data-home-hero]');
      const select = gsap.utils.selector(hero);
      const ease = 'power3.out';
      // The masthead has its own sequence; it never waits for a scroll event.
      if (hero.getBoundingClientRect().bottom > 0) {
        gsap.timeline({ defaults: { ease } })
          .from(select('[data-hero-meta] > div'), { opacity: 0, y: 10, duration: .65, stagger: .06 }, 0)
          .from(select('.hero-letter'), { yPercent: 115, duration: 1.15, stagger: .045, ease: 'expo.out' }, .12)
          .from(select('[data-hero-caption]'), { opacity: 0, y: 12, duration: .7 }, .5)
          .from(select('[data-hero-badge]'), { opacity: 0, scale: .85, duration: .7 }, .95);
      }
      select('[data-hero-frame]').forEach((frame, index) => {
        const initial = frame.getBoundingClientRect().top < window.innerHeight;
        gsap.fromTo(frame, { clipPath: 'inset(0% 0% 100% 0%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut',
          delay: initial ? .35 + index * .12 : 0,
          scrollTrigger: initial ? undefined : { trigger: frame, start: 'top 94%', once: true },
          onComplete: () => gsap.set(frame, { clearProps: 'clipPath' }),
        });
      });
      // Section titles lead; cards follow. No nested container/child reveals.
      const targets = [...root.querySelectorAll('[data-home-reveal]')]
        .filter(el => !el.closest('[data-home-hero]') && !el.parentElement.closest('[data-home-reveal]'));
      const pending = targets.filter(el => el.getBoundingClientRect().bottom > 0);
      gsap.set(pending, { opacity: 0, y: 32 });
      ScrollTrigger.batch(pending, {
        start: 'top 92%', once: true, interval: .08, batchMax: 4,
        onEnter: batch => gsap.to(batch, {
          opacity: 1, y: 0, duration: .9, stagger: .085, ease,
          overwrite: 'auto', clearProps: 'opacity,transform',
        }),
      });
      // Focus must reveal a link immediately even before its scroll trigger fires.
      const onFocus = event => {
        const target = event.target.closest('[data-home-reveal]');
        if (target && !target.closest('[data-home-hero]')) {
          gsap.killTweensOf(target);
          gsap.set(target, { clearProps: 'opacity,transform' });
        }
      };
      root.addEventListener('focusin', onFocus);
      return () => root.removeEventListener('focusin', onFocus);
    }, root);
    media.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
      root.querySelectorAll('[data-hero-frame] > img').forEach(img => {
        // A small scroll-linked drift stays inside the fixed image frame.
        gsap.fromTo(img, { yPercent: -2, scale: 1.06 }, {
          yPercent: 2, scale: 1.06, ease: 'none',
          scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: .65 },
        });
      });
    }, root);
    document.fonts?.ready.then(refresh);
    root.addEventListener('load', refresh, true);
    return () => {
      disposed = true;
      root.removeEventListener('load', refresh, true);
      media.revert();
    };
  }, [rootRef]);
}
