const fs = require('fs');

let adminCode = fs.readFileSync('client/src/pages/AdminContent.jsx', 'utf8');

const oldHandleSelect = `
  const handleSelect = (key) => {
    setSelectedKey(key);
    const item = contentList.find(c => c.key === key);
    if (item && item.draftValue) {
      setDraftValue(typeof item.draftValue === 'object' ? JSON.stringify(item.draftValue, null, 2) : item.draftValue);
    } else if (item && item.publishedValue) {
      setDraftValue(typeof item.publishedValue === 'object' ? JSON.stringify(item.publishedValue, null, 2) : item.publishedValue);
    } else {
      setDraftValue('');
    }
  };
`;

const newHandleSelect = `
  const handleSelect = (key) => {
    setSelectedKey(key);
    const item = contentList.find(c => c.key === key);
    if (item && item.draftValue) {
      setDraftValue(typeof item.draftValue === 'object' ? JSON.stringify(item.draftValue, null, 2) : item.draftValue);
    } else if (item && item.publishedValue) {
      setDraftValue(typeof item.publishedValue === 'object' ? JSON.stringify(item.publishedValue, null, 2) : item.publishedValue);
    } else {
      // Auto-initialize empty sections with default schemas so the Easy Editor appears
      let defaultTemplate = {};
      if (key === 'shipping-info') {
        defaultTemplate = { title: "Shipping Policy", content: "We ship all orders within 2-3 business days. Tracking details will be provided via email.", isActive: true };
      } else if (key === 'returns-info') {
        defaultTemplate = { title: "Returns & Exchanges", content: "Returns are accepted within 14 days of delivery for unwashed and unworn items with tags attached.", isActive: true };
      } else if (key === 'size-guide') {
        defaultTemplate = { title: "Size Guide", description: "All our jerseys follow a standard athletic fit. We recommend sizing up for a looser streetwear fit.", isActive: true };
      } else if (key === 'featured-products') {
        defaultTemplate = { heading: "Featured Archive", category: "club", limit: "4", isActive: true };
      } else if (key === 'homepage-hero') {
        defaultTemplate = { aboutLabel: "ABOUT US:", aboutText: "Enter text...", title: "MATCHDAY ARCHIVE", subtitle: "2024 / 2025 REVEAL SPECIFICATION", registry: "REGISTRY // FROM 2024", headline: "ENGINEERED FOR THE MODERN ICON", cta: "EXPLORE THE ARCHIVE", isActive: true };
      } else if (key === 'announcement-bar') {
        defaultTemplate = { text: "Enter announcement here...", isActive: true };
      } else {
        defaultTemplate = { text: "Default content", isActive: true };
      }
      setDraftValue(JSON.stringify(defaultTemplate, null, 2));
    }
  };
`;

if (adminCode.includes('setDraftValue(\'\');')) {
  adminCode = adminCode.replace(oldHandleSelect.trim(), newHandleSelect.trim());
  fs.writeFileSync('client/src/pages/AdminContent.jsx', adminCode);
  console.log('Modified handleSelect successfully');
} else {
  console.log('Could not find handleSelect');
}
