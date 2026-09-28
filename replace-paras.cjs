const fs = require('fs');
let c = fs.readFileSync('./client/src/pages/Storefront.jsx', 'utf8');
c = c.replace(/<p data-home-reveal="" className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed mt-2 uppercase">DIRECT ATELIER ACCESS TO ALL 13 ARCHIVE PILLARS\. FILTER BY RUN WEIGHT, CONSTRUCTION GRADE, APPAREL SILHOUETTE, AND CONTINENTAL TOURNAMENT EDITIONS\.<\/p>/g, '');
c = c.replace(/<p data-home-reveal="" className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed mt-2 uppercase">A visual communication catalog for football culture collectors, typographers, and pitchside designers\. 4 advance specimens mapped on a strict geometric grid\.<\/p>/g, '');
fs.writeFileSync('./client/src/pages/Storefront.jsx', c);
