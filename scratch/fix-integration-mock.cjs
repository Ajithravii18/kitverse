const fs = require('fs');
let content = fs.readFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/order-integration.test.js', 'utf8');
content = content.replace(
  /const gateway=\{orders:\{create:async\(\)=>\(\{id:`provider-\$\{\+\+seq\}`\}\),fetchPayments:async\(\)=>\(\{items:\[\]\}\)\}\};/,
  "const gateway={orders:{create:async()=>({id:`provider-${++seq}`}),fetchPayments:async()=>({items:[]})},payments:{refund:async()=>({id:'ref-1',status:'processed'})}};"
);
fs.writeFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/order-integration.test.js', content);
