const fs = require('fs');
let content = fs.readFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/order-service.js', 'utf8');

const replacement = `          for(const item of validated.items){const line=await tx.reserve(item);lines.push(line);total+=line.price*line.qty;}
          
          let discountAmount = 0;
          if (discountCode) {
            const Discount = require('mongoose').model('Discount');
            const d = await Discount.findOne({ code: discountCode.toUpperCase(), active: true }); 
            if (d && (!d.expiry || d.expiry >= new Date()) && (!d.usageLimit || d.usedCount < d.usageLimit) && (!d.minSpend || total >= d.minSpend)) {
              discountAmount = d.type === 'fixed' ? d.value : Math.round(total * (d.value / 100));
              await Discount.updateOne({ _id: d._id }, { $inc: { usedCount: 1 } });
            }
          }
          const subtotal = total;
          total = Math.max(0, total - discountAmount);
          
          if(!Number.isSafeInteger(total))throw problem(400,'Invalid order total.');
          const order=await tx.create({`;

content = content.replace(/for\(const item of validated\.items\)\{const line=await tx\.reserve\(item\);lines\.push\(line\);total\+=line\.price\*line\.qty;\}\s*if\(!Number\.isSafeInteger\(total\)\)throw problem\(400,'Invalid order total\.'\);\s*const order=await tx\.create\(\{/, replacement);

// Also need to inject subtotal and discount logic into tx.create({ ... })
content = content.replace(/lines,\s*total,\s*paymentStatus:'pending',/, "lines,\n            subtotal,\n            discountCode: discountAmount > 0 ? discountCode.toUpperCase() : undefined,\n            discountAmount,\n            total,\n            paymentStatus:'pending',");

fs.writeFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/order-service.js', content);
