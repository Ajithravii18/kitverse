const fs = require('fs');

let content = fs.readFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/app.js', 'utf8');

// Force imports
const importLine = "import mountStage3 from './stage3-routes.js';";
if (!content.includes(importLine)) {
  content = importLine + "\n" + content;
}

// Force Content and Review and Discount models import
if (!content.includes('Content, Review, Discount')) {
  content = content.replace("import { Product, User, Order } from './models.js';", "import { Product, User, Order, Content, Review, Discount } from './models.js';");
}

fs.writeFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/app.js', content);
