const fs = require('fs');
let content = fs.readFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/order-service.js', 'utf8');

const targetStr = `          for(const item of validated.items){const line=await tx.reserve(item);lines.push(line);total+=line.price*line.qty;}
          if(!Number.isSafeInteger(total))throw problem(400,'Invalid order total.');
          const order=await tx.create({
            orderRef:\`ORD-\${randomUUID().replaceAll('-','').slice(0,20).toUpperCase()}\`,
            userId,
            checkoutKey,
            fingerprint,
            customer:validated.customer,
            lines,
            total,
            paymentStatus:'pending',
            fulfilmentStatus:'unfulfilled',
            stockReleased:false,
            expiresAt:new Date(+now()+20*60000),
            activityHistory: [{ action: 'created', timestamp: now() }]
          });`;

const replacement = `          for(const item of validated.items){const line=await tx.reserve(item);lines.push(line);total+=line.price*line.qty;}
          
          let discountAmount = 0;
          if (discountCode) {
            const Discount = require('mongoose').model('Discount');
            const d = await Discount.findOne({ code: discountCode.toUpperCase(), active: true }); // intentionally not in session to prevent locking, or you can pass session
            if (d && (!d.expiry || d.expiry >= new Date()) && (!d.usageLimit || d.usedCount < d.usageLimit) && (!d.minSpend || total >= d.minSpend)) {
              discountAmount = d.type === 'fixed' ? d.value : Math.round(total * (d.value / 100));
              await Discount.updateOne({ _id: d._id }, { $inc: { usedCount: 1 } });
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
            total,
            paymentStatus:'pending',
            fulfilmentStatus:'unfulfilled',
            stockReleased:false,
            expiresAt:new Date(+now()+20*60000),
            activityHistory: [{ action: 'created', timestamp: now() }]
          });`;

content = content.replace(targetStr, replacement);
fs.writeFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/order-service.js', content);
