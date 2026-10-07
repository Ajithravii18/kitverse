import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useScrollReveal(deps = [], options = {}) {
  const { scroller, selector = '[data-home-reveal]' } = options;

  useEffect(() => {
    let ctx = gsap.context(() => {});
    
    const timer = setTimeout(() => {
      ctx.add(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const elements = Array.from(document.querySelectorAll(selector));
        
        if (prefersReducedMotion) {
          elements.forEach(el => gsap.set(el, { opacity: 1, y: 0, clearProps: 'all' }));
          return;
        }

        const groups = new Map();
        elements.forEach(el => {
          if (el.dataset.revealed) return;
          const parent = el.closest('section') || el.closest('.flex-1') || el.parentElement;
          if (!groups.has(parent)) groups.set(parent, []);
          groups.get(parent).push(el);
        });

        groups.forEach((groupEls, parent) => {
          groupEls.forEach(el => el.dataset.revealed = "true");
          
          gsap.set(groupEls, { opacity: 0, y: 20 });

          ScrollTrigger.create({
            trigger: parent,
            scroller: scroller || window,
            start: 'top 90%',
            onEnter: () => {
              gsap.to(groupEls, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: 'power3.out',
                clearProps: 'opacity,y,transform'
              });
            }
          });
        });
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, deps); 
}
