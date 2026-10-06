'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { Mountain } from 'lucide-react';

export function ParallaxComponent() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0
        }
      });

      const layers = [
        { layer: "1", yPercent: 70 },
        { layer: "2", yPercent: 55 },
        { layer: "3", yPercent: 40 },
        { layer: "4", y: 100 } // Changed to y or kept yPercent depending on styling, but following original
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          {
            yPercent: layerObj.yPercent,
            ease: "none"
          },
          idx === 0 ? undefined : "<"
        );
      });
    }

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Clean up GSAP and ScrollTrigger instances
      ScrollTrigger.getAll().forEach(st => st.kill());
      gsap.killTweensOf(triggerElement);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="parallax relative overflow-hidden bg-background min-h-screen" ref={parallaxRef}>
      <section className="parallax__header relative h-[150vh]">
        <div className="parallax__visuals sticky top-0 h-screen w-full overflow-hidden">
          <div className="parallax__black-line-overflow absolute inset-0 z-50 pointer-events-none"></div>
          <div data-parallax-layers className="parallax__layers w-full h-full relative flex items-center justify-center">
            {/* Background layer */}
            <img 
              src="https://images.unsplash.com/photo-1550596334-7bb40a71b6bc?auto=format&fit=crop&q=80&w=2000" 
              loading="eager" 
              data-parallax-layer="1" 
              alt="Stadium background" 
              className="parallax__layer-img absolute inset-0 w-full h-full object-cover object-top scale-110" 
            />
            {/* Midground layer */}
            <img 
              src="https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=2000" 
              loading="eager" 
              data-parallax-layer="2" 
              alt="Crowd cheering" 
              className="parallax__layer-img absolute inset-0 w-full h-full object-cover object-bottom opacity-80" 
            />
            {/* Title layer */}
            <div data-parallax-layer="3" className="parallax__layer-title absolute z-20 flex flex-col items-center justify-center">
              <h2 className="parallax__title text-6xl md:text-9xl font-headline-lg font-bold text-white uppercase drop-shadow-2xl tracking-tighter">
                Matchday
              </h2>
            </div>
            {/* Foreground layer */}
            <img 
              src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=2000" 
              loading="eager" 
              data-parallax-layer="4" 
              alt="Football close up" 
              className="parallax__layer-img absolute bottom-0 left-0 w-full h-3/4 object-cover object-bottom z-30" 
            />
          </div>
          <div className="parallax__fade absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-40"></div>
        </div>
      </section>
      
      <section className="parallax__content relative z-50 bg-background py-32 flex flex-col items-center justify-center border-t border-border">
        <Mountain className="w-24 h-24 text-foreground mb-6" />
        <p className="text-foreground/70 font-body-md uppercase tracking-widest">
          Scroll to explore the collection
        </p>
      </section>
    </div>
  );
}
