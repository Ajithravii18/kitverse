const fs = require('fs');
const c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');

const startIdx = c.indexOf('EXPLORE BY CATEGORY');
const endIdx = c.indexOf('</section>', startIdx);
let sectionHtml = c.substring(startIdx, endIdx);

// The cards are all `<button className="group relative flex flex-col justify-between bg-surface-container-low ...`
const buttons = sectionHtml.split('<button className="group relative flex flex-col');

// Keep buttons that do NOT contain "CLUB TEAMS" or "National Teams Federation Archive" or "NATIONAL TEAMS"
const newButtons = buttons.filter(btn => !btn.includes('CLUB TEAMS') && !btn.includes('NATIONAL TEAMS'));

sectionHtml = newButtons.join('<button className="group relative flex flex-col');

// Replace the section in the original file
let newC = c.substring(0, startIdx) + sectionHtml + c.substring(endIdx);

fs.writeFileSync('client/src/pages/Storefront.jsx', newC);
console.log("Removed the 2 cards.");
