const fs = require('fs');
let hero = fs.readFileSync('client/src/components/home/Hero.jsx', 'utf8');
hero = hero.replace(/<h1 className=/g, '<h1 data-home-reveal="" className=');
hero = hero.replace(/<p className=/g, '<p data-home-reveal="" className=');
hero = hero.replace(/<div className="flex flex-col sm:flex-row/g, '<div data-home-reveal="" className="flex flex-col sm:flex-row');
hero = hero.replace(/<div className="relative z-10 md:w-1\/2 flex flex-col group/g, '<div data-home-reveal="" className="relative z-10 md:w-1/2 flex flex-col group');
fs.writeFileSync('client/src/components/home/Hero.jsx', hero);
