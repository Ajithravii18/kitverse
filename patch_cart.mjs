import fs from 'fs';

let content = fs.readFileSync('client/src/components/CartDrawer.jsx', 'utf8');
content = content.replace(
  `  const updateQuantity = (key, delta) => {
    try {
      setCart(current => changeQuantity(current, key, delta, catalogue));
    } catch (e) {
      alert(e.message);
    }
  };`,
  `  const updateQuantity = (key, delta) => {
    setCart(current => {
      try {
        return changeQuantity(current, key, delta, catalogue);
      } catch (e) {
        alert(e.message);
        return current;
      }
    });
  };`
);
fs.writeFileSync('client/src/components/CartDrawer.jsx', content);
console.log('Fixed CartDrawer crash');
