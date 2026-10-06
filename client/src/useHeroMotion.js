import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useHeroMotion(ref) {
  useLayoutEffect(() => {
    const hero = ref.current;
    if (!hero) return;
    
    const media = gsap.matchMedia();
    let disposed = false;
    const refresh = () => { if (!disposed) ScrollTrigger.refresh(); };
    
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const select = gsap.utils.selector(hero);
      
      if (hero.getBoundingClientRect().bottom > 0) {
        // Prepare line mask for headline
        const headline = select('[data-hero-headline]')[0];
        if (headline) {
          // simple line wrapping isn't perfect without a library like SplitText, 
          // but we can wrap the whole text in a mask container or animate it as a block reveal.
          gsap.set(headline, { yPercent: 100, opacity: 0 });
        }
        
        gsap.timeline({ defaults: { ease: 'power3.out', clearProps: 'opacity,transform,yPercent,filter' } })
          // 1. Image settles into place
          .fromTo(select('[data-hero-image-wrap]'), 
            { opacity: 0, y: 30, scale: 0.98, filter: 'blur(10px)' }, 
            { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.2 }, 0)
          
          // 2. Headline reveals (upwards with slight opacity)
          .to(select('[data-hero-headline]'), 
            { yPercent: 0, opacity: 1, duration: 1 }, 0.3)
            
          // 3. Supporting text and CTA
          .from(select('[data-hero-text]'), { opacity: 0, y: 16, duration: 0.8 }, 0.6)
          .from(select('[data-hero-cta]'), { opacity: 0, y: 16, duration: 0.8 }, 0.7)
          .from(select('[data-hero-badge]'), { opacity: 0, y: 10, duration: 0.6 }, 0.9);
      }
    }, hero);
    
    hero.addEventListener('load', refresh, true);
    document.fonts?.ready.then(refresh);
    
    return () => {
      disposed = true;
      hero.removeEventListener('load', refresh, true);
      media.revert();
    };
  }, [ref]);
}
