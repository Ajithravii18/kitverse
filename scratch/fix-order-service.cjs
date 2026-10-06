const fs = require('fs');
let content = fs.readFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/order-service.js', 'utf8');

const targetStr = `            const Discount = require('mongoose').model('Discount');
            const d = await Discount.findOne({ code: discountCode.toUpperCase(), active: true }); 
            if (d && (!d.expiry || d.expiry >= new Date()) && (!d.usageLimit || d.usedCount < d.usageLimit) && (!d.minSpend || total >= d.minSpend)) {
              discountAmount = d.type === 'fixed' ? d.value : Math.round(total * (d.value / 100));
              await Discount.updateOne({ _id: d._id }, { $inc: { usedCount: 1 } });
            }`;

const replacementStr = `            const Discount = mongoose.model('Discount');
            const d = await tx.findDiscount ? await tx.findDiscount({ code: discountCode.toUpperCase(), active: true }) : await Discount.findOne({ code: discountCode.toUpperCase(), active: true }).session(session); 
            if (d && (!d.expiry || d.expiry >= new Date()) && (!d.usageLimit || d.usedCount < d.usageLimit) && (!d.minSpend || total >= d.minSpend)) {
              discountAmount = d.type === 'fixed' ? d.value : Math.round(total * (d.value / 100));
              if (tx.updateDiscount) await tx.updateDiscount(d._id, { $inc: { usedCount: 1 } });
              else await Discount.updateOne({ _id: d._id }, { $inc: { usedCount: 1 } }, { session });
            }`;

content = content.replace(targetStr, replacementStr);

// Wait! tx.findDiscount and tx.updateDiscount don't exist yet! I need to define them in the repository object inside order-service.js.
const repoTarget = `      save: order => order.save({session}),
      create: async data => (await Order.create([data], {session}))[0],`;

const repoReplacement = `      save: order => order.save({session}),
      create: async data => (await Order.create([data], {session}))[0],
      findDiscount: async query => mongoose.model('Discount').findOne(query).session(session),
      updateDiscount: async (id, update) => mongoose.model('Discount').updateOne({_id:id}, update, {session}),`;

content = content.replace(repoTarget, repoReplacement);

fs.writeFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/order-service.js', content);
