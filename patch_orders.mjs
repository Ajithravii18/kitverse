import fs from 'fs';

let content = fs.readFileSync('server/app.js', 'utf8');

const orderOld = `      let total = 0;
      const lines = [];

      // P1.3: Atomic conditional updates with manual rollback
      for (const item of items) {
        if (!Number.isSafeInteger(item.qty) || item.qty <= 0 || !item.size || !item.slug) {
          throw new Error('Invalid item data');
        }

        const updatedProduct = await Product.findOneAndUpdate(
          { slug: item.slug, published: true, [\`stock.\${item.size}\`]: { $gte: item.qty } },
          { $inc: { [\`stock.\${item.size}\`]: -item.qty } },
          { new: true }
        );

        if (!updatedProduct) {
          // Rollback previously decremented items
          for (const rollbackItem of lines) {
            await Product.findOneAndUpdate(
              { slug: rollbackItem.slug },
              { $inc: { [\`stock.\${rollbackItem.size}\`]: rollbackItem.qty } }
            );
          }
          return res.status(400).json({ error: \`Insufficient stock or unavailable: \${item.name || item.slug} (Size: \${item.size})\` });
        }

        const linePrice = updatedProduct.price; 
        total += linePrice * item.qty;
        lines.push({
          slug: updatedProduct.slug, name: updatedProduct.name, productType: updatedProduct.productType || 'jersey', 
          quality: updatedProduct.quality || '', size: item.size,
          price: linePrice, qty: item.qty
        });
      }

      const orderRef = 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      let paymentIntentId = '';
      
      if (razorpay) {
        const rzpOrder = await razorpay.orders.create({
          amount: total, 
          currency: 'INR',
          receipt: orderRef
        });
        paymentIntentId = rzpOrder.id;
      }

      const order = new Order({
        orderRef, customer, lines, total, status: 'pending_payment', paymentIntentId,
        userId: req.session.userId
      });

      await order.save();
      res.json({ success: true, orderRef, paymentIntentId, razorpayKeyId: process.env.RAZORPAY_KEY_ID });

    } catch (error) { next(error); }`;

const orderNew = `      let total = 0;
      const lines = [];
      const decremented = [];

      try {
        for (const item of items) {
          if (!Number.isSafeInteger(item.qty) || item.qty <= 0 || !item.size || !item.slug) {
            throw new Error('Invalid item data');
          }

          const updatedProduct = await Product.findOneAndUpdate(
            { slug: item.slug, published: true, [\`stock.\${item.size}\`]: { $gte: item.qty } },
            { $inc: { [\`stock.\${item.size}\`]: -item.qty } },
            { new: true }
          );

          if (!updatedProduct) {
            throw new Error(\`Insufficient stock or unavailable: \${item.name || item.slug} (Size: \${item.size})\`);
          }

          decremented.push({ slug: item.slug, size: item.size, qty: item.qty });
          const linePrice = updatedProduct.price; 
          total += linePrice * item.qty;
          lines.push({
            slug: updatedProduct.slug, name: updatedProduct.name, productType: updatedProduct.productType || 'jersey', 
            quality: updatedProduct.quality || '', size: item.size,
            price: linePrice, qty: item.qty
          });
        }

        const orderRef = 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        let paymentIntentId = '';
        
        if (razorpay) {
          const rzpOrder = await razorpay.orders.create({
            amount: total, 
            currency: 'INR',
            receipt: orderRef
          });
          paymentIntentId = rzpOrder.id;
        }

        const order = new Order({
          orderRef, customer, lines, total, status: 'pending_payment', paymentIntentId,
          userId: req.session.userId
        });

        await order.save();
        res.json({ success: true, orderRef, paymentIntentId, razorpayKeyId: process.env.RAZORPAY_KEY_ID });
      } catch (innerError) {
        // Rollback all decremented items if anything fails (validation, provider, db)
        for (const rollbackItem of decremented) {
          await Product.findOneAndUpdate(
            { slug: rollbackItem.slug },
            { $inc: { [\`stock.\${rollbackItem.size}\`]: rollbackItem.qty } }
          );
        }
        if (innerError.message.includes('Insufficient stock')) {
          return res.status(400).json({ error: innerError.message });
        }
        throw innerError;
      }
    } catch (error) { next(error); }`;

content = content.replace(orderOld, orderNew);

// Add Webhook route
const webhookCode = `
  app.post('/api/orders/webhook', async (req, res, next) => {
    try {
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
      if (!secret) return res.status(500).json({ error: 'Webhook not configured' });

      const signature = req.headers['x-razorpay-signature'];
      const expectedSignature = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
      if (signature !== expectedSignature) return res.status(400).json({ error: 'Invalid signature' });

      if (req.body.event === 'payment.captured') {
        const payment = req.body.payload.payment.entity;
        const order = await Order.findOne({ paymentIntentId: payment.order_id });
        if (order && order.status === 'pending_payment') {
          order.status = 'paid';
          await order.save();
        }
      } else if (req.body.event === 'payment.failed') {
        const payment = req.body.payload.payment.entity;
        const order = await Order.findOne({ paymentIntentId: payment.order_id });
        if (order && order.status === 'pending_payment') {
          order.status = 'cancelled';
          await order.save();
          // Restore stock
          for (const item of order.lines) {
            await Product.findOneAndUpdate(
              { slug: item.slug },
              { $inc: { [\`stock.\${item.size}\`]: item.qty } }
            );
          }
        }
      }
      res.json({ success: true });
    } catch (err) { next(err); }
  });
`;

if (!content.includes('/api/orders/webhook')) {
  content = content.replace(
    "app.post('/api/orders/verify-payment'",
    webhookCode + "\n  app.post('/api/orders/verify-payment'"
  );
}

fs.writeFileSync('server/app.js', content);
console.log('Fixed rollback and added webhook');
