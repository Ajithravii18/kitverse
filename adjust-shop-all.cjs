const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');

// 1. Revert the grid columns back to 4
c = c.replace(/className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-gutter-desktop pamidor-list"/g, 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop pamidor-list"');

// 2. Add col-span to the ALL PRODUCTS button
// We need to match the specific ALL PRODUCTS button
// It's the first button after <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop pamidor-list">
// The button starts with <button className="group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300 hover:scale-[1.01] text-left overflow-hidden">
// Let's replace only the first occurrence of this button in the EXPLORE BY CATEGORY section.

const startIdx = c.indexOf('EXPLORE BY CATEGORY');
const gridStartIdx = c.indexOf('<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', startIdx);
const firstBtnIdx = c.indexOf('<button className="group relative flex flex-col', gridStartIdx);

// The original class string
const origClass = 'className="group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300 hover:scale-[1.01] text-left overflow-hidden"';
const newClass = 'className="lg:col-span-3 sm:col-span-2 group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300 hover:scale-[1.01] text-left overflow-hidden"';

// Find the origClass exactly at firstBtnIdx (or close to it)
let beforeBtn = c.substring(0, firstBtnIdx);
let afterBtn = c.substring(firstBtnIdx);
afterBtn = afterBtn.replace(origClass, newClass);

fs.writeFileSync('client/src/pages/Storefront.jsx', beforeBtn + afterBtn);
console.log("Successfully adjusted the SHOP ALL card size and reverted grid.");
