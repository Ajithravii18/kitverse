const fs = require('fs');
let code = fs.readFileSync('client/src/pages/AdminContent.jsx', 'utf8');

const regex = /(<textarea\s*className="w-full h-96 p-4 border rounded font-mono text-sm bg-gray-50"\s*value=\{draftValue\}\s*onChange=\{e => setDraftValue\(e\.target\.value\)\}\s*\/>\s*)(<\/details>\s*)?<\/div>/;

if (regex.test(code)) {
  code = code.replace(regex, '$1</details>\n            </div>');
  fs.writeFileSync('client/src/pages/AdminContent.jsx', code);
  console.log('Fixed missing </details> tag');
} else {
  console.log('Regex did not match. Let us look at the file');
}
