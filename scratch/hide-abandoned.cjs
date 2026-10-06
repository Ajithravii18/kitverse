const fs = require('fs');

let code = fs.readFileSync('server/app.js', 'utf8');

const oldProfileOrders = `const orders = await Order.find({ userId: req.session.userId }).sort({ createdAt: -1 });`;
const newProfileOrders = `const orders = await Order.find({ userId: req.session.userId, paymentStatus: { $nin: ['pending', 'cancelled'] } }).sort({ createdAt: -1 });`;
code = code.replace(oldProfileOrders, newProfileOrders);

const oldProfile = `const pastOrders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });`;
const newProfile = `const pastOrders = await Order.find({ userId: user._id, paymentStatus: { $nin: ['pending', 'cancelled'] } }).sort({ createdAt: -1 });`;
code = code.replace(oldProfile, newProfile);

fs.writeFileSync('server/app.js', code);
