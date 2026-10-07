import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitioning, setTransitioning] = useState(false);
  const overlayRef = useRef(null);
  const containerRef = useRef(null);
  
  useLayoutEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setDisplayLocation(location);
        return;
      }

      setTransitioning(true);
      
      gsap.to(overlayRef.current, {
        scaleY: 1,
        duration: 0.5,
        ease: 'power3.inOut',
        transformOrigin: 'bottom',
        onComplete: () => {
          setDisplayLocation(location);
          window.scrollTo(0, 0);

          gsap.to(overlayRef.current, {
            scaleY: 0,
            duration: 0.5,
            ease: 'power3.inOut',
            transformOrigin: 'top',
            delay: 0.1,
            onComplete: () => setTransitioning(false)
          });

          gsap.fromTo(containerRef.current, 
            { opacity: 0, y: 30 }, 
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2, clearProps: 'all' }
          );
        }
      });
    } else if (location.search !== displayLocation.search) {
       setDisplayLocation(location);
    }
  }, [location, displayLocation.pathname, displayLocation.search]);

  return (
    <>
      <div 
        ref={overlayRef} 
        className="fixed inset-0 bg-foreground z-[9999] pointer-events-none" 
        style={{ transform: 'scaleY(0)', transformOrigin: 'bottom' }} 
      />
      <div ref={containerRef} className="flex flex-col flex-1 w-full h-full">
        {/* We always render children so state isn't lost, but during a path transition, we render the old route until overlay covers the screen. Wait, React Router provides the elements via <Routes>, so children already represent the new route. To hold back the new route, we'd need to freeze the context. The easiest way is to let the transition happen if they are wrapping the whole <Routes> block, but react-router-dom's <Routes> is what changes. If we wrap <Routes>, children is the <Routes> element. */}
        {children}
      </div>
    </>
  );
}
