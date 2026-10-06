const fs = require('fs');

let code = fs.readFileSync('client/src/pages/Profile.jsx', 'utf8');

// 1. Map orders when setting state so order.status exists
const oldSetOrders = `setOrders(orderData.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));`;
const newSetOrders = `setOrders(orderData.orders.map(o => ({ ...o, status: o.paymentStatus === 'paid' ? o.fulfilmentStatus : o.paymentStatus })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));`;
code = code.replace(oldSetOrders, newSetOrders);

// 2. Fix the crash I just introduced in fix-profile-crash.cjs 
// because I replaced it inline but now I'm adding it to the object.
// Actually, using the mapped property is cleaner. Let's revert the inline fix.
const oldInline = `{(order.paymentStatus === 'paid' ? order.fulfilmentStatus : order.paymentStatus).replace('_', ' ')}`;
const newInline = `{order.status.replace('_', ' ')}`;
code = code.replace(oldInline, newInline);

// 3. Fix the totalSpent logic which expected order.status to be 'paid' or 'fulfilled'
// We will just check paymentStatus directly.
const oldTotalSpent = `const totalSpent = orders.reduce((sum, order) => sum + (['paid','fulfilled','payment_review'].includes(order.status) ? order.total || 0 : 0), 0);`;
const newTotalSpent = `const totalSpent = orders.reduce((sum, order) => sum + (['paid','partially_refunded'].includes(order.paymentStatus) ? order.total || 0 : 0), 0);`;
code = code.replace(oldTotalSpent, newTotalSpent);

const oldPaidOrders = `const paidOrders = orders.filter(order => ['paid', 'fulfilled'].includes(order.status)).length;`;
const newPaidOrders = `const paidOrders = orders.filter(order => ['paid', 'partially_refunded'].includes(order.paymentStatus)).length;`;
code = code.replace(oldPaidOrders, newPaidOrders);

fs.writeFileSync('client/src/pages/Profile.jsx', code);
