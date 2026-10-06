const fs = require('fs');

let code = fs.readFileSync('client/src/useHomeMotion.js', 'utf8');

const heroCodeBlock = `
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
        const img = frame.querySelector('img');
        if (img) gsap.set(img, { filter: 'grayscale(100%)' });
        
        gsap.fromTo(frame, { clipPath: 'inset(0% 0% 100% 0%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut',
          delay: initial ? .35 + index * .12 : 0,
          scrollTrigger: initial ? undefined : { trigger: frame, start: 'top 94%', once: true },
          onComplete: () => gsap.set(frame, { clearProps: 'clipPath' }),
        });

        if (img) {
          if (initial) {
            gsap.to(img, {
              filter: 'grayscale(0%)', duration: 1.5, ease: 'power2.inOut',
              scrollTrigger: { trigger: document.body, start: 'top -10px', toggleActions: 'play none none reverse' }
            });
          } else {
            gsap.to(img, {
              filter: 'grayscale(0%)', duration: 1.5, ease: 'power2.inOut',
              scrollTrigger: { trigger: frame, start: 'top 75%', once: true },
              onComplete: () => gsap.set(img, { clearProps: 'filter' })
            });
          }
        }
      });
`;

const newHeroCodeBlock = `
      const ease = 'power3.out';
      const hero = root.querySelector('[data-home-hero]');
      if (hero) {
        const select = gsap.utils.selector(hero);
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
          const img = frame.querySelector('img');
          if (img) gsap.set(img, { filter: 'grayscale(100%)' });
          
          gsap.fromTo(frame, { clipPath: 'inset(0% 0% 100% 0%)' }, {
            clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut',
            delay: initial ? .35 + index * .12 : 0,
            scrollTrigger: initial ? undefined : { trigger: frame, start: 'top 94%', once: true },
            onComplete: () => gsap.set(frame, { clearProps: 'clipPath' }),
          });

          if (img) {
            if (initial) {
              gsap.to(img, {
                filter: 'grayscale(0%)', duration: 1.5, ease: 'power2.inOut',
                scrollTrigger: { trigger: document.body, start: 'top -10px', toggleActions: 'play none none reverse' }
              });
            } else {
              gsap.to(img, {
                filter: 'grayscale(0%)', duration: 1.5, ease: 'power2.inOut',
                scrollTrigger: { trigger: frame, start: 'top 75%', once: true },
                onComplete: () => gsap.set(img, { clearProps: 'filter' })
              });
            }
          }
        });
      }
`;

code = code.replace(heroCodeBlock.trim(), newHeroCodeBlock.trim());

fs.writeFileSync('client/src/useHomeMotion.js', code);
