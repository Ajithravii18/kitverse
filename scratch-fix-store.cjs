const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf-8');

c = c.replace(/<Link to=\{`\/shop\?type=\$\{type\}`\}/g, function(match, offset, string) {
  // We need to look a bit before the match to see what section we are in
  const before = string.substring(0, offset);
  if (before.includes('id="shop-track-pants"')) {
    const afterTrack = before.substring(before.lastIndexOf('id="shop-track-pants"'));
    if (!afterTrack.includes('shop-shorts')) return '<Link to="/shop?type=track-pants"';
  }
  if (before.includes('id="shop-shorts"')) {
    const afterShorts = before.substring(before.lastIndexOf('id="shop-shorts"'));
    if (!afterShorts.includes('shop-collar')) return '<Link to="/shop?type=shorts"';
  }
  if (before.includes('id="shop-collar-tshirts"')) {
    return '<Link to="/shop?type=collar-tshirt"';
  }
  return match;
});

fs.writeFileSync('client/src/pages/Storefront.jsx', c);
console.log('Fixed Storefront.jsx');
