import fs from 'fs';

const path = 'server/order-service.js';
let content = fs.readFileSync(path, 'utf8');

const reconcileReplacement = `
      if (order.paymentId && order.refunds.some(r => r.status === 'pending')) {
        try {
          let providerRefunds = [];
          let skip = 0;
          while (true) {
            const refundRes = await gateway.payments.fetchRefunds(order.paymentId, { skip, count: 100 });
            const items = Array.isArray(refundRes.items) ? refundRes.items : (Array.isArray(refundRes) ? refundRes : []);
            providerRefunds.push(...items);
            if (items.length < 100 || !refundRes.has_more) break;
            skip += 100;
          }
          
          for (const r of order.refunds) {
            if (r.status === 'pending') {
              const match = providerRefunds.find(pr => pr.notes && pr.notes.idempotencyKey === r.idempotencyKey);
              if (match) {
                if (match.id) r.providerRefundId = match.id;
                r.status = match.status === 'processed' ? 'processed' : (match.status === 'failed' ? 'failed' : 'pending');
                changed = true;
              }
            }
          }
        } catch (err) {
          // ignore provider fetch errors
        }
      }
`;

content = content.replace(/if \(order\.paymentId && order\.refunds\.some\(r => r\.status === 'pending'\)\) \{[\s\S]*?\} catch \(err\) \{\s*\/\/ ignore provider fetch errors\s*\}\s*\}/, reconcileReplacement.trim());

fs.writeFileSync(path, content, 'utf8');
