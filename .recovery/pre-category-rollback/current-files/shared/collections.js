export const collectionsConfig = [
  { slug: 'first-copy-shorts', label: 'First copy + shorts', description: 'Complete kits ready for the pitch.', filter: { quality: 'First copy + shorts' }, image: '/images/first-copy.svg' },
  { slug: 'master-copy', label: 'Master copy', description: 'Premium replica kits.', filter: { quality: 'Master copy' }, image: '/images/master-copy.svg' },
  { slug: 'player-version', label: 'Player version', description: 'Authentic athletic fit. Exactly as worn by the pros.', filter: { quality: 'Player version' }, image: '/images/player-version.svg' },
  { slug: 'embroidery', label: 'Embroidery', description: 'Classic stitched details.', filter: { quality: 'Embroidery' }, image: '/images/embroidery.svg' },
  { slug: 'retro', label: 'Retro', description: 'Vintage styles from classic eras.', filter: { styleTags: ['retro'] }, image: '/images/retro.svg' },
  { slug: 'collar', label: 'Collar', description: 'Jerseys with a classic collar.', filter: { styleTags: ['collar'] }, image: '/images/collar.svg' },
  { slug: 'jerseys', label: 'Jerseys', description: 'All matchday jerseys.', filter: { productType: 'jersey' }, image: '/images/jersey.svg' },
  { slug: 'shorts', label: 'Shorts', description: 'Matchday shorts.', filter: { productType: 'shorts' }, image: '/images/shorts.svg' },
  { slug: 'track-pants', label: 'Track pants', description: 'Training and lifestyle track pants.', filter: { productType: 'track-pants' }, image: '/images/track-pants.svg' },
  { slug: 'club-teams', label: 'Club teams', description: 'Support your local or global club.', filter: { category: 'club' }, image: '/images/jersey-placeholder.svg' },
  { slug: 'national-teams', label: 'National teams', description: 'Represent your country on the world stage.', filter: { category: 'national' }, image: '/images/jersey-placeholder.svg' }
];

export function getCollectionBySlug(slug) {
  return collectionsConfig.find(c => c.slug === slug);
}
