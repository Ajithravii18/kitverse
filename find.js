const fs=require('fs');const c=fs.readFileSync('client/src/pages/Storefront.jsx','utf8');const endOfGrid=c.indexOf('</section><Marquee');console.log(c.substring(endOfGrid-100, endOfGrid+20));
