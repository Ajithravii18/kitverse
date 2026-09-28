const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');

const target = `</div></div><div className="w-full pt-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-white">`;
const replacement = `</div><div className="w-full pt-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-white">`;

if (c.includes(target)) {
  c = c.replace(target, replacement);
  fs.writeFileSync('client/src/pages/Storefront.jsx', c);
  console.log("Fixed the extra closing div!");
} else {
  console.log("Could not find the target string.");
}
