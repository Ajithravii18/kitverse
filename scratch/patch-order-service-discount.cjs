const fs = require('fs');
let content = fs.readFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/order-service.js', 'utf8');

const discountLogic = `
          for(const item of validated.items){const line=await tx.reserve(item);lines.push(line);total+=line.price*line.qty;}
          
          let discountAmount = 0;
          if (discountCode) {
            const Discount = mongoose.model('Discount');
            const d = await Discount.findOne({ code: discountCode.toUpperCase(), active: true }).session(session);
            if (d && (!d.expiry || d.expiry >= new Date()) && (!d.usageLimit || d.usedCount < d.usageLimit) && (!d.minSpend || total >= d.minSpend)) {
              discountAmount = d.type === 'fixed' ? d.value : Math.round(total * (d.value / 100));
              await Discount.updateOne({ _id: d._id }, { $inc: { usedCount: 1 } }, { session });
            }
          }
          const subtotal = total;
          total = Math.max(0, total - discountAmount);
          
          if(!Number.isSafeInteger(total))throw problem(400,'Invalid order total.');
          const order=await tx.create({
            orderRef:\`ORD-\${randomUUID().replaceAll('-','').slice(0,20).toUpperCase()}\`,
            userId,
            checkoutKey,
            fingerprint,
            customer:validated.customer,
            lines,
            subtotal,
            discountCode: discountAmount > 0 ? discountCode.toUpperCase() : undefined,
            discountAmount,
            total
          });
`;

content = content.replace(/for\(const item of validated\.items\)\{const line=await tx\.reserve\(item\);lines\.push\(line\);total\+=line\.price\*line\.qty;\}\s*if\(!Number\.isSafeInteger\(total\)\)throw problem\(400,'Invalid order total\.'\);\s*const order=await tx\.create\(\{[\s\S]*?userId,\s*checkoutKey,\s*fingerprint,\s*customer:validated\.customer,\s*lines: items,\s*total,\s*subtotal: total\s*\}\);/, discountLogic.trim());

fs.writeFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/order-service.js', content);
