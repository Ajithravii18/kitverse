const fs = require('fs');
const { JSDOM } = require('jsdom');

function htmlToJsx(htmlString) {
  let jsx = htmlString.replace(/class=/g, 'className=');
  
  jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
    const styleObj = {};
    p1.split(';').forEach(rule => {
      if (!rule.trim()) return;
      const [key, value] = rule.split(':').map(s => s.trim());
      if (key && value) {
        const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
        styleObj[camelKey] = value;
      }
    });
    return `style={${JSON.stringify(styleObj)}}`;
  });
  
  const selfClosing = ['img', 'input', 'br', 'hr', 'rect', 'path', 'circle', 'link', 'meta', 'polygon', 'polyline', 'ellipse', 'line'];
  for (const tag of selfClosing) {
    // If it was already self-closing in some places or had a closing tag
    // First, remove the closing tags if any exist
    const closeRegex = new RegExp(`</${tag}>`, 'gi');
    jsx = jsx.replace(closeRegex, '');
    
    // Then make the opening tag self-closing if it's not already
    const openRegex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi');
    jsx = jsx.replace(openRegex, `<${tag}$1 />`);
  }
  
  jsx = jsx.replace(/viewbox=/gi, 'viewBox=');
  jsx = jsx.replace(/stroke-width=/gi, 'strokeWidth=');
  jsx = jsx.replace(/stroke-linecap=/gi, 'strokeLinecap=');
  jsx = jsx.replace(/stroke-linejoin=/gi, 'strokeLinejoin=');
  jsx = jsx.replace(/fill-rule=/gi, 'fillRule=');
  jsx = jsx.replace(/clip-rule=/gi, 'clipRule=');
  jsx = jsx.replace(/for=/gi, 'htmlFor=');
  jsx = jsx.replace(/tabindex=/gi, 'tabIndex=');
  jsx = jsx.replace(/<!--[\s\S]*?-->/g, ''); 
  
  return jsx;
}

let extraCss = '';

function processFile(inputFile, outputFile, componentName) {
  const html = fs.readFileSync(inputFile, 'utf-8');
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  const scriptTags = Array.from(document.querySelectorAll('script'));
  for (const script of scriptTags) {
    script.remove();
  }
  
  const styleTags = Array.from(document.querySelectorAll('style'));
  for (const style of styleTags) {
    extraCss += '\\n' + style.textContent;
    style.remove();
  }

  const metaLinks = Array.from(document.querySelectorAll('meta, link'));
  for (const ml of metaLinks) {
    ml.remove();
  }
  
  const body = document.body;
  let innerHtml = body.innerHTML;
  let jsxContent = htmlToJsx(innerHtml);
  
  const componentCode = `import React from 'react';

export default function ${componentName}() {
  return (
    <>
      ${jsxContent}
    </>
  );
}
`;

  fs.writeFileSync(outputFile, componentCode);
  console.log(`Successfully created ${outputFile}`);
}

processFile('scratch-home.html', 'client/src/pages/Storefront.jsx', 'Storefront');
processFile('scratch-shop.html', 'client/src/pages/Shop.jsx', 'Shop');
processFile('scratch-auth.html', 'client/src/pages/Auth.jsx', 'Auth');

if (extraCss.trim()) {
  fs.appendFileSync('client/src/style.css', '\\n/* Added from Stitch */\\n' + extraCss);
  console.log('Appended styles to style.css');
}
