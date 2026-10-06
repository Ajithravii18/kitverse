const fs = require('fs');

let code = fs.readFileSync('client/src/useHomeMotion.js', 'utf8');

code = code.replace(
  /export default function useHomeMotion\(rootRef\) \{/,
  'export default function useHomeMotion(rootRef, ready = true) {'
);

code = code.replace(
  /useLayoutEffect\(\(\) => \{/,
  'useLayoutEffect(() => {\n    if (!ready) return;'
);

code = code.replace(
  /\}, \[rootRef\]\);/,
  '}, [rootRef, ready]);'
);

fs.writeFileSync('client/src/useHomeMotion.js', code);
