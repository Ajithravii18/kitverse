import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export default function PageTransition({ children }) {
  const location = useLocation();
  const containerRef = useRef(null);
  const currentPath = useRef(location.pathname);

  useEffect(() => {
    // Only animate on path change, not query string change (like filters)
    if (location.pathname !== currentPath.current) {
      currentPath.current = location.pathname;
      
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const element = containerRef.current;
      if (!element) return;

      // Brief fade with slight movement
      gsap.fromTo(element, 
        { opacity: 0, y: 16 }, 
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', clearProps: 'all' }
      );
    }
  }, [location.pathname]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
      {children}
    </div>
  );
}
