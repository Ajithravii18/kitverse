const fs = require('fs');

let code = fs.readFileSync('client/src/pages/Checkout.jsx', 'utf8');

const oldCalc = `  const total = cart.reduce((n, x) => n + x.price * x.qty, 0);

  const handleApplyDiscount = async () => {`;

const newCalc = `  const subtotal = cart.reduce((n, x) => n + x.price * x.qty, 0);
  const shipping = subtotal >= 150000 ? 0 : 15000;
  const total = subtotal; // For backward compatibility in this file where 'total' was used as subtotal

  const handleApplyDiscount = async () => {`;

code = code.replace(oldCalc, newCalc);

const oldFinalTotal = `  const finalTotal = total - (discountResult ? discountResult.discountAmount : 0);`;
const newFinalTotal = `  const discountAmount = discountResult ? discountResult.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount) + shipping;`;

code = code.replace(oldFinalTotal, newFinalTotal);

const oldUi = `                <div className="flex justify-between items-center font-label-mono-bold text-[12px] text-on-surface-variant uppercase">
                  <span>SHIPPING</span>
                  <span>CALCULATED AT PAYMENT</span>
                </div>
                <div className="flex justify-between items-end border-t border-black pt-space-sm mt-1">
                  <span className="font-headline-sm text-[16px] text-on-surface uppercase">TOTAL</span>
                  <span className="font-price-currency text-[20px] font-bold text-on-surface">{money(total)}</span>
                </div>`;

const newUi = `                <div className="flex justify-between items-center font-label-mono-bold text-[12px] text-on-surface-variant uppercase">
                  <span>SHIPPING</span>
                  <span>{shipping === 0 ? 'FREE' : money(shipping)}</span>
                </div>
                <div className="flex justify-between items-end border-t border-black pt-space-sm mt-1">
                  <span className="font-headline-sm text-[16px] text-on-surface uppercase">TOTAL</span>
                  <span className="font-price-currency text-[20px] font-bold text-on-surface">{money(finalTotal)}</span>
                </div>`;

code = code.replace(oldUi, newUi);

// Wait, I should also make sure it uses finalTotal instead of total in the order creation if it does.
// Let's check how confirmPayment is called.
const oldConfirmCall = `confirmPayment(orderData.orderRef, {`;
const newConfirmCall = `// confirmPayment doesn't use the third argument properly in the old code if it passed total instead of finalTotal, but actually we use finalTotal on Razorpay from backend.
// Let's just make sure confirmPayment signature uses the correct orderTotal passed from backend.
confirmPayment(orderData.orderRef, {`;

fs.writeFileSync('client/src/pages/Checkout.jsx', code);
