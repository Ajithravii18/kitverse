const fs = require('fs');

const file = 'client/src/pages/Storefront.jsx';
let content = fs.readFileSync(file, 'utf8');

// The grid container
// Change: <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-desktop">
// To: <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-y border-black"> (editorial grid flush look)
// Wait, I will just change gap-gutter-desktop to gap-4 or gap-0. Let's just do gap-0.
content = content.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-desktop">/g,
  '<div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-y border-black">'
);

// We need to replace each of the 4 cards.
// We can use a replacer function to match the cards and inject distinct colors and heights.

let cardIndex = 0;
const editorialColors = [
  'bg-[#F2EFE9]', // Card 1: Warm stone
  'bg-[#E9EDF2]', // Card 2: Cool steel
  'bg-[#F2E9E9]', // Card 3: Dusty rose
  'bg-[#E9F2EC]'  // Card 4: Soft mint
];

content = content.replace(/<div className="group relative flex flex-col bg-white transition-all duration-300">/g, (match) => {
  const color = editorialColors[cardIndex % 4];
  cardIndex++;
  return `<div className="group relative flex flex-col ${color} transition-all duration-300 border-x border-b border-black">`;
});

// Reset index for the inner text container
let textIndex = 0;
content = content.replace(/<div className="p-space-lg flex flex-col gap-space-md bg-white flex-1 justify-between">/g, (match) => {
  const color = editorialColors[textIndex % 4];
  textIndex++;
  return `<div className="p-space-lg flex flex-col gap-space-md ${color} flex-1 justify-between">`;
});

// Change h-[520px] to aspect-[3/4] h-auto
let imgIndex = 0;
content = content.replace(/<div className="relative w-full h-\[520px\] bg-\[#f2f0f0\] overflow-hidden">/g, (match) => {
  if (imgIndex < 4) { // Only do this for the 4 editorial cards
    imgIndex++;
    return `<div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-[#f2f0f0] overflow-hidden border-b border-black">`;
  }
  return match;
});

// If there are any other h-[520px] outside this section (like Lookbook), they won't match if we limit.
// Actually, the lookbook cards on the top also use h-[520px]. Let's make sure we only replace the ones in the 26/27 section.
// The regex approach above might hit the top hero cards too if they match exactly!
// Let's check if the top cards use `<div className="group relative flex flex-col bg-white transition-all duration-300">`.
// The top cards used `<div className="flex flex-col gap-space-sm group">`. So they won't match our first regex.
// Let's verify and apply.

fs.writeFileSync(file, content);
console.log("Updated editorial grid.");
