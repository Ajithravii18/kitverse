import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useHomeMotion(rootRef, ready = true) {
  useLayoutEffect(() => {
    if (!ready) return;
    const root = rootRef.current;
    if (!root) return;
    const media = gsap.matchMedia();
    let disposed = false;
    const refresh = () => { if (!disposed) ScrollTrigger.refresh(); };
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ease = 'power3.out';
      // Section titles lead; cards follow. No nested container/child reveals.
      const targets = [...root.querySelectorAll('[data-home-reveal]')]
        .filter(el => !el.closest('[data-home-hero]') && !el.parentElement.closest('[data-home-reveal]'));
      const pending = targets.filter(el => el.getBoundingClientRect().bottom > 0);
      gsap.set(pending, { opacity: 0, y: 24 });
      ScrollTrigger.batch(pending, {
        start: 'top 92%', once: true, interval: .08, batchMax: 4,
        onEnter: batch => {
          gsap.to(batch, {
            opacity: 1, y: 0, duration: .9, stagger: .085, ease,
            overwrite: 'auto', clearProps: 'opacity,transform',
          });
        },
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
    document.fonts?.ready.then(refresh);
    root.addEventListener('load', refresh, true);
    return () => {
      disposed = true;
      root.removeEventListener('load', refresh, true);
      media.revert();
    };
  }, [rootRef, ready]);
}
