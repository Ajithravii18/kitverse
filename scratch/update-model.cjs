const fs = require('fs');

let code = fs.readFileSync('server/models.js', 'utf8');

code = code.replace(
  /discountAmount: \{ type: Number, default: 0 \},/,
  'discountAmount: { type: Number, default: 0 },\n    shippingFee: { type: Number, default: 0 },'
);

fs.writeFileSync('server/models.js', code);
