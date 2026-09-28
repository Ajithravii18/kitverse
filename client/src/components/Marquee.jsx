import React, { useEffect, useRef, useState } from 'react';

export default function Marquee({ label, items, tone = 'citron', reverse = false }) {
  const ref = useRef(null);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setInView(true); return; }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section ref={ref} aria-label={label}
      className={'home-marquee home-marquee--' + tone}
      data-reverse={reverse} data-running={inView && !paused}>
      <div className="home-marquee-meta">
        <span>{label} / KITVERSE</span>
        <button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}
          aria-label={(paused ? 'Play ' : 'Pause ') + label + ' marquee'}>
          {paused ? 'PLAY ↗' : 'PAUSE Ⅱ'}
        </button>
      </div>
      <div className="home-marquee-window">
        <div className="home-marquee-track">
          {[0, 1].map(copy => (
            <div className="home-marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {items.map(item => <span className="home-marquee-item" key={item}>
                {item}<span className="home-marquee-star" aria-hidden="true">✳</span>
              </span>)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
