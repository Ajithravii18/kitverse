const fs = require('fs');

let code = fs.readFileSync('server/order-service.js', 'utf8');

const oldCalc = `          const subtotal = total;
          total = Math.max(0, total - discountAmount);`;

const newCalc = `          const subtotal = total;
          const shippingFee = subtotal >= 150000 ? 0 : 15000;
          total = Math.max(0, subtotal - discountAmount) + shippingFee;`;

code = code.replace(oldCalc, newCalc);

const oldCreate = `            subtotal,
            discountCode: discountAmount > 0 ? discountCode.toUpperCase() : undefined,
            discountAmount,
            total,`;

const newCreate = `            subtotal,
            discountCode: discountAmount > 0 ? discountCode.toUpperCase() : undefined,
            discountAmount,
            shippingFee,
            total,`;

code = code.replace(oldCreate, newCreate);

fs.writeFileSync('server/order-service.js', code);
