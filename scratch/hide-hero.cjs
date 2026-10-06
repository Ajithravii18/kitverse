const fs = require('fs');

let storefrontCode = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');

const oldHero = `<section data-home-hero="" className="mb-12 w-full px-margin-desktop pt-space-xl pb-space-lg flex flex-col gap-space-lg">`;
const newHero = `{cms['homepage-hero']?.isActive !== false && (
<section data-home-hero="" className="mb-12 w-full px-margin-desktop pt-space-xl pb-space-lg flex flex-col gap-space-lg">`;

const oldHeroEnd = `</div>
</section><Marquee label="The matchday edit"`;

const newHeroEnd = `</div>
</section>
)}<Marquee label="The matchday edit"`;

if (storefrontCode.includes(oldHero) && storefrontCode.includes(oldHeroEnd)) {
  storefrontCode = storefrontCode.replace(oldHero, newHero);
  storefrontCode = storefrontCode.replace(oldHeroEnd, newHeroEnd);
  fs.writeFileSync('client/src/pages/Storefront.jsx', storefrontCode);
  console.log('Modified Storefront.jsx successfully');
} else {
  console.log('Could not find hero markers in Storefront.jsx');
}
