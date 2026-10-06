const fs = require('fs');

let code = fs.readFileSync('client/src/pages/AdminProducts.jsx', 'utf8');

code = code.replace(
  /const \[loading, setLoading\] = useState\(true\);/,
  "const [loading, setLoading] = useState(true);\n  const [error, setError] = useState('');"
);

fs.writeFileSync('client/src/pages/AdminProducts.jsx', code);
