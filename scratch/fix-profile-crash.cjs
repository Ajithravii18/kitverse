const fs = require('fs');

let code = fs.readFileSync('client/src/pages/Profile.jsx', 'utf8');

const oldCode = `                            }}>
                              {order.status.replace('_', ' ')}
                            </div>`;

const newCode = `                            }}>
                              {(order.paymentStatus === 'paid' ? order.fulfilmentStatus : order.paymentStatus).replace('_', ' ')}
                            </div>`;

code = code.replace(oldCode, newCode);

fs.writeFileSync('client/src/pages/Profile.jsx', code);
