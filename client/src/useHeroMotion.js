import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useHeroMotion(ref, ready) {
  useLayoutEffect(() => {
    const hero = ref.current;
    if (!hero || !ready) return;
    
    const media = gsap.matchMedia();
    let disposed = false;
    const refresh = () => { if (!disposed) ScrollTrigger.refresh(); };
    
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const select = gsap.utils.selector(hero);
      const cards = select('[data-hero-card]');
      
      // Safety check: wait until cards are actually in the DOM
      if (cards.length === 0) return;
      
      if (hero.getBoundingClientRect().bottom > 0) {
        // Animate the text and the 3D fan of cards
        // IMPORTANT: We do NOT clearProps for transforms on the cards, because their 
        // inline layout transforms (from React) would be cleared, causing them to stack at 0,0.
        // We only clear opacity.
        const tl = gsap.timeline();
        
        tl.fromTo(select('h1'), 
          { opacity: 0, scale: 1.1 }, 
          { opacity: 1, scale: 1, duration: 2, ease: 'power2.out', clearProps: 'opacity,scale' }, 0)
        
        tl.fromTo(cards,
          { y: 300, opacity: 0, rotateX: 20 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1.5, stagger: 0.1, ease: 'expo.out', clearProps: 'opacity,rotateX' }, 0.2)
          
        tl.fromTo(select('[data-hero-text], [data-hero-cta]'), 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power2.out', clearProps: 'all' }, 0.8);
      }
    }, hero);
    
    hero.addEventListener('load', refresh, true);
    document.fonts?.ready.then(refresh);
    
    return () => {
      disposed = true;
      hero.removeEventListener('load', refresh, true);
      media.revert();
    };
  }, [ref, ready]);
}
