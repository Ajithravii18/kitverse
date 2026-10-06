const fs = require('fs');
const path = 'client/src/pages/Storefront.jsx';
let code = fs.readFileSync(path, 'utf8');

const heroMatch = code.match(/\{cms\['homepage-hero'\]\?.isActive !== false && \([\s\S]*?<\/section>\n\)/);
const catMatch = code.match(/<section id="filter-index"[\s\S]*?<\/section>/);
const selMatch = code.match(/<section id="selection"[\s\S]*?<\/section>/);
const featMatch = code.match(/\{cms\['featured-products'\]\?\.isActive !== false && cms\['featured-products'\]\?\.heading && \([\s\S]*?<\/section>\n\s*\)/);
const clubsMatch = code.match(/<section className="w-full px-margin-desktop bg-surface py-8 md:py-10"id="clubs-directory">[\s\S]*?<\/section>/);
const shortsMatch = code.match(/<section id="shorts"[\s\S]*?<\/section>/);
const trackMatch = code.match(/<section id="track-pants"[\s\S]*?<\/section>/);
const specsMatch = code.match(/<section className="w-full px-margin-desktop py-space-3xl bg-surface-container">[\s\S]*?<\/section>/);
const reviewsMatch = code.match(/<section id="community-reviews"[\s\S]*?<\/section>/);

console.log('heroMatch:', !!heroMatch);
console.log('catMatch:', !!catMatch);
console.log('selMatch:', !!selMatch);
console.log('featMatch:', !!featMatch);
console.log('clubsMatch:', !!clubsMatch);
console.log('shortsMatch:', !!shortsMatch);
console.log('trackMatch:', !!trackMatch);
console.log('specsMatch:', !!specsMatch);
console.log('reviewsMatch:', !!reviewsMatch);

// We can also automate extraction
let imports = [];

if (heroMatch) {
  const compCode = `import React from 'react';
import { money } from '../../format.js';
import { Link } from 'react-router-dom';

export default function Hero({ cms, catalogue }) {
  return (
    ${heroMatch[0]}
  );
}`;
  fs.writeFileSync('client/src/components/home/Hero.jsx', compCode);
  code = code.replace(heroMatch[0], `<Hero cms={cms} catalogue={catalogue} />`);
  imports.push(`import Hero from '../components/home/Hero.jsx';`);
}

if (catMatch) {
  const compCode = `import React from 'react';
import { Link } from 'react-router-dom';

export default function Categories() {
  return (
    ${catMatch[0]}
  );
}`;
  fs.writeFileSync('client/src/components/home/Categories.jsx', compCode);
  code = code.replace(catMatch[0], `<Categories />`);
  imports.push(`import Categories from '../components/home/Categories.jsx';`);
}

if (selMatch) {
  const compCode = `import React from 'react';
import { money } from '../../format.js';
import { Link } from 'react-router-dom';

export default function SeasonKits({ catalogue, openHomeProduct }) {
  return (
    ${selMatch[0]}
  );
}`;
  fs.writeFileSync('client/src/components/home/SeasonKits.jsx', compCode);
  code = code.replace(selMatch[0], `<SeasonKits catalogue={catalogue} openHomeProduct={openHomeProduct} />`);
  imports.push(`import SeasonKits from '../components/home/SeasonKits.jsx';`);
}

if (featMatch) {
  const compCode = `import React from 'react';
import { Link } from 'react-router-dom';

export default function FeaturedProducts({ cms, catalogue, setSelectedProduct }) {
  return (
    ${featMatch[0]}
  );
}`;
  fs.writeFileSync('client/src/components/home/FeaturedProducts.jsx', compCode);
  code = code.replace(featMatch[0], `<FeaturedProducts cms={cms} catalogue={catalogue} setSelectedProduct={setSelectedProduct} />`);
  imports.push(`import FeaturedProducts from '../components/home/FeaturedProducts.jsx';`);
}

// Notice the club carousel logic - we'll skip ClubsDirectory for a moment if it has complex logic, or we can just leave the logic in Storefront and pass refs.
// Wait, passing refs to carousel logic is easy.
if (clubsMatch) {
  const compCode = `import React from 'react';
import { Link } from 'react-router-dom';
import { teamData } from '../../teamData.js';

export default function ClubsDirectory({ 
  allTeams, 
  clubsCarouselRef, 
  handleMouseDown, 
  handleMouseLeave, 
  handleMouseUp, 
  handleMouseMove, 
  handleClickCapture, 
  scrollClubs 
}) {
  return (
    ${clubsMatch[0]}
  );
}`;
  fs.writeFileSync('client/src/components/home/ClubsDirectory.jsx', compCode);
  code = code.replace(clubsMatch[0], `<ClubsDirectory 
  allTeams={allTeams} 
  clubsCarouselRef={clubsCarouselRef} 
  handleMouseDown={handleMouseDown} 
  handleMouseLeave={handleMouseLeave} 
  handleMouseUp={handleMouseUp} 
  handleMouseMove={handleMouseMove} 
  handleClickCapture={handleClickCapture} 
  scrollClubs={scrollClubs} 
/>`);
  imports.push(`import ClubsDirectory from '../components/home/ClubsDirectory.jsx';`);
}

if (shortsMatch) {
  const compCode = `import React from 'react';
import { Link } from 'react-router-dom';

export default function Shorts({ openHomeProduct }) {
  return (
    ${shortsMatch[0]}
  );
}`;
  fs.writeFileSync('client/src/components/home/Shorts.jsx', compCode);
  code = code.replace(shortsMatch[0], `<Shorts openHomeProduct={openHomeProduct} />`);
  imports.push(`import Shorts from '../components/home/Shorts.jsx';`);
}

if (trackMatch) {
  const compCode = `import React from 'react';
import { Link } from 'react-router-dom';

export default function TrackPants({ openHomeProduct }) {
  return (
    ${trackMatch[0]}
  );
}`;
  fs.writeFileSync('client/src/components/home/TrackPants.jsx', compCode);
  code = code.replace(trackMatch[0], `<TrackPants openHomeProduct={openHomeProduct} />`);
  imports.push(`import TrackPants from '../components/home/TrackPants.jsx';`);
}

if (specsMatch) {
  const compCode = `import React from 'react';

export default function Specs() {
  return (
    ${specsMatch[0]}
  );
}`;
  fs.writeFileSync('client/src/components/home/Specs.jsx', compCode);
  code = code.replace(specsMatch[0], `<Specs />`);
  imports.push(`import Specs from '../components/home/Specs.jsx';`);
}

if (reviewsMatch) {
  const compCode = `import React from 'react';

export default function Reviews() {
  return (
    ${reviewsMatch[0]}
  );
}`;
  fs.writeFileSync('client/src/components/home/Reviews.jsx', compCode);
  code = code.replace(reviewsMatch[0], `<Reviews />`);
  imports.push(`import Reviews from '../components/home/Reviews.jsx';`);
}

code = code.replace("import React, { useEffect, useRef } from 'react';", "import React, { useEffect, useRef } from 'react';\n" + imports.join('\n'));

fs.writeFileSync('client/src/pages/Storefront.jsx', code);
console.log('Refactoring complete.');
