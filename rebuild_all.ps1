git checkout client/src/pages/Storefront.jsx client/src/pages/Shop.jsx client/index.html client/src/style.css client/src/useScrollReveal.js

$pyCode = @"
import sys
tf = r'c:\Users\AJITH\OneDrive\Documents\New project\client\src\pages\Storefront.jsx'
start = 11
end = 14
repl = """<header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md"><div className="h-24 w-full px-margin-desktop flex flex-col justify-between py-space-xs">"""
with open(tf, 'r', encoding='utf-8') as sf:
    lines = sf.readlines()
if start <= len(lines):
    s = start - 1
    e = end
    new_lines = lines[:s] + [repl + ('\n' if not repl.endswith('\n') else '')] + lines[e:]
    with open(tf, 'w', encoding='utf-8') as sf:
        sf.writelines(new_lines)
"@
$pyCode | python -c "import sys; exec(sys.stdin.read())"


$pyCode = @"
import sys
tf = r'c:\Users\AJITH\OneDrive\Documents\New project\client\src\pages\Storefront.jsx'
start = 11
end = 14
repl = """<main className="w-full bg-surface"><div className="flex flex-col w-full">"""
with open(tf, 'r', encoding='utf-8') as sf:
    lines = sf.readlines()
if start <= len(lines):
    s = start - 1
    e = end
    new_lines = lines[:s] + [repl + ('\n' if not repl.endswith('\n') else '')] + lines[e:]
    with open(tf, 'w', encoding='utf-8') as sf:
        sf.writelines(new_lines)
"@
$pyCode | python -c "import sys; exec(sys.stdin.read())"


$pyCode = @"
import sys
tf = r'c:\Users\AJITH\OneDrive\Documents\New project\client\src\pages\Shop.jsx'
start = 13
end = 13
repl = """<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/15 shadow-sm">"""
with open(tf, 'r', encoding='utf-8') as sf:
    lines = sf.readlines()
if start <= len(lines):
    s = start - 1
    e = end
    new_lines = lines[:s] + [repl + ('\n' if not repl.endswith('\n') else '')] + lines[e:]
    with open(tf, 'w', encoding='utf-8') as sf:
        sf.writelines(new_lines)
"@
$pyCode | python -c "import sys; exec(sys.stdin.read())"


$pyCode = @"
import sys
tf = r'c:\Users\AJITH\OneDrive\Documents\New project\client\src\pages\Shop.jsx'
start = 81
end = 81
repl = """<main className="w-full bg-surface"><div className="flex flex-col w-full">"""
with open(tf, 'r', encoding='utf-8') as sf:
    lines = sf.readlines()
if start <= len(lines):
    s = start - 1
    e = end
    new_lines = lines[:s] + [repl + ('\n' if not repl.endswith('\n') else '')] + lines[e:]
    with open(tf, 'w', encoding='utf-8') as sf:
        sf.writelines(new_lines)
"@
$pyCode | python -c "import sys; exec(sys.stdin.read())"


$pyCode = @"
import sys
tf = r'c:\Users\AJITH\OneDrive\Documents\New project\client\src\pages\Storefront.jsx'
start = 12
end = 12
repl = """<header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md"><div className="h-16 w-full px-margin-desktop flex flex-col justify-between py-1">"""
with open(tf, 'r', encoding='utf-8') as sf:
    lines = sf.readlines()
if start <= len(lines):
    s = start - 1
    e = end
    new_lines = lines[:s] + [repl + ('\n' if not repl.endswith('\n') else '')] + lines[e:]
    with open(tf, 'w', encoding='utf-8') as sf:
        sf.writelines(new_lines)
"@
$pyCode | python -c "import sys; exec(sys.stdin.read())"


$pyCode = @"
import sys
tf = r'c:\Users\AJITH\OneDrive\Documents\New project\client\src\pages\Storefront.jsx'
start = 11
end = 14
repl = """<main className="w-full pt-24 bg-surface"><div className="flex flex-col w-full">"""
with open(tf, 'r', encoding='utf-8') as sf:
    lines = sf.readlines()
if start <= len(lines):
    s = start - 1
    e = end
    new_lines = lines[:s] + [repl + ('\n' if not repl.endswith('\n') else '')] + lines[e:]
    with open(tf, 'w', encoding='utf-8') as sf:
        sf.writelines(new_lines)
"@
$pyCode | python -c "import sys; exec(sys.stdin.read())"


$pyCode = @"
import sys
tf = r'c:\Users\AJITH\OneDrive\Documents\New project\client\src\pages\Shop.jsx'
start = 13
end = 13
repl = """<header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/15 shadow-sm">"""
with open(tf, 'r', encoding='utf-8') as sf:
    lines = sf.readlines()
if start <= len(lines):
    s = start - 1
    e = end
    new_lines = lines[:s] + [repl + ('\n' if not repl.endswith('\n') else '')] + lines[e:]
    with open(tf, 'w', encoding='utf-8') as sf:
        sf.writelines(new_lines)
"@
$pyCode | python -c "import sys; exec(sys.stdin.read())"


$pyCode = @"
import sys
tf = r'c:\Users\AJITH\OneDrive\Documents\New project\client\src\pages\Shop.jsx'
start = 81
end = 81
repl = """<main className="w-full pt-[82px] bg-surface"><div className="flex flex-col w-full">"""
with open(tf, 'r', encoding='utf-8') as sf:
    lines = sf.readlines()
if start <= len(lines):
    s = start - 1
    e = end
    new_lines = lines[:s] + [repl + ('\n' if not repl.endswith('\n') else '')] + lines[e:]
    with open(tf, 'w', encoding='utf-8') as sf:
        sf.writelines(new_lines)
"@
$pyCode | python -c "import sys; exec(sys.stdin.read())"


$pyCode = @"
import sys
tf = r'c:\Users\AJITH\OneDrive\Documents\New project\client\src\pages\Storefront.jsx'
start = 1
end = 8
repl = """import React, { useEffect } from 'react';
import useScrollReveal from '../useScrollReveal.js';

export default function Storefront() {
  useScrollReveal();"""
with open(tf, 'r', encoding='utf-8') as sf:
    lines = sf.readlines()
if start <= len(lines):
    s = start - 1
    e = end
    new_lines = lines[:s] + [repl + ('\n' if not repl.endswith('\n') else '')] + lines[e:]
    with open(tf, 'w', encoding='utf-8') as sf:
        sf.writelines(new_lines)
"@
$pyCode | python -c "import sys; exec(sys.stdin.read())"

node scratch-remove-borders.cjs
node -e "const fs = require('fs'); const lines = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8').split('\n'); lines.forEach((line, i) => { if (line.toLowerCase().includes('26/27') || line.toLowerCase().includes('26-27')) console.log(i + 1 + ': ' + line.substring(0, 100)); });"
node scratch-editorial.cjs
node scratch-editorial-replace.cjs

$pyCode = @"
import sys
tf = r'c:\Users\AJITH\OneDrive\Documents\New project\client\src\pages\Storefront.jsx'
start = 562
end = 562
repl = """</div><div className="w-full pt-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-white">"""
with open(tf, 'r', encoding='utf-8') as sf:
    lines = sf.readlines()
if start <= len(lines):
    s = start - 1
    e = end
    new_lines = lines[:s] + [repl + ('\n' if not repl.endswith('\n') else '')] + lines[e:]
    with open(tf, 'w', encoding='utf-8') as sf:
        sf.writelines(new_lines)
"@
$pyCode | python -c "import sys; exec(sys.stdin.read())"

node -e "const fs = require('fs'); const lines = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8').split('\n'); lines.forEach((line, i) => { if (line.toLowerCase().includes('track') || line.toLowerCase().includes('pant')) console.log(i + 1 + ': ' + line.substring(0, 100)); });"
node -e "const fs = require('fs'); const lines = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8').split('\n'); lines.forEach((line, i) => { if (line.includes('track-pants')) console.log(i + 1 + ': ' + line.substring(0, 100)); });"
node scratch-trackpants.cjs
node -e "const fs = require('fs'); let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); c = c.replace(/<\/div><\/div><div className=\"w-full pt-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-white\"><div className=\"flex flex-col gap-1\"><div className=\"flex items-center gap-2\"><span className=\"w-2 h-2 rounded-full bg-primary inline-block\"><\/span><span className=\"font-label-technical text-label-technical tracking-widest text-black uppercase font-bold\">\[ ARCHIVE RUN/g, '</div><div className=\"w-full pt-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-white\"><div className=\"flex flex-col gap-1\"><div className=\"flex items-center gap-2\"><span className=\"w-2 h-2 rounded-full bg-primary inline-block\"></span><span className=\"font-label-technical text-label-technical tracking-widest text-black uppercase font-bold\">[ ARCHIVE RUN'); fs.writeFileSync('client/src/pages/Storefront.jsx', c);"
node fix-div.cjs
node -e "const fs = require('fs'); const lines = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8').split('\n'); lines.forEach((line, i) => { if (line.includes('SHOP BY CLUB')) console.log(i + 1 + ': ' + line.substring(0, 100)); });"
node -e "const fs = require('fs'); let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); console.log(c.match(/<div className=\"lg:col-span-8.*?>/g));"
node make-scrollable.cjs
node -e "const fs = require('fs'); let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); c = c.replace('<div className=\"lg:col-span-8 flex', '<style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style><div className=\"lg:col-span-8 flex'); fs.writeFileSync('client/src/pages/Storefront.jsx', c);"
node hide-scroll.cjs
node -e "const fs = require('fs'); let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); console.log(c.match(/<a className=\"relative p-space-lg/g)?.length);"
node check-links.cjs
node -e "const fs = require('fs'); let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); console.log(c.substring(c.indexOf('SHOP BY CLUB & COUNTRY') - 200, c.indexOf('SHOP BY CLUB & COUNTRY') + 1000));"
node -e "const fs = require('fs'); let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); c = c.replace('<div className=\"lg:col-span-8 flex overflow-x-auto gap-space-md pb-4 snap-x snap-mandatory scrollbar-hide\"', '<div className=\"lg:col-span-8 grid grid-rows-2 grid-flow-col auto-cols-[85vw] sm:auto-cols-[320px] md:auto-cols-[360px] overflow-x-auto gap-space-md pb-4 snap-x snap-mandatory scrollbar-hide\"'); fs.writeFileSync('client/src/pages/Storefront.jsx', c);"
node update-grid.cjs
node update-grid2.cjs
npm install gsap
node -e "const fs = require('fs'); let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); c = c.replace(/className=\"lg:col-span-8 grid grid-rows-2/g, 'className=\"lg:col-span-8 grid grid-rows-2 pamidor-list'); c = c.replace(/className=\"relative p-space-lg rounded-none transition-all duration-300 flex/g, 'className=\"relative p-space-lg rounded-none transition-all duration-300 flex pamidor-item'); fs.writeFileSync('client/src/pages/Storefront.jsx', c);"
node apply-pamidor.cjs
node apply-pamidor-2.cjs
node -e "const fs = require('fs'); const c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); console.log('pamidor-list matches:', (c.match(/pamidor-list/g) || []).length); console.log('pamidor-item matches:', (c.match(/pamidor-item/g) || []).length);"
node -e "const fs = require('fs'); const c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); console.log('section tags:', (c.match(/<section/g) || []).length);"
node -e "const fs = require('fs'); const c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); const lines = c.split('\n'); lines.forEach((l, i) => { if(l.includes('pamidor-list')) console.log(i + ': ' + l.substring(0, 100)); });"
node -e "const fs = require('fs'); const c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); const lines = c.split('\n'); lines.forEach((l, i) => { if(l.includes('pamidor-item')) console.log(i + ': ' + l.substring(0, 100)); });"
node -e "const fs = require('fs'); const c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); console.log('reveal count:', (c.match(/reveal/g) || []).length);"
node add-reveals.cjs
node -e "const fs = require('fs'); const c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); console.log('pamidor-item reveal count:', (c.match(/pamidor-item reveal/g) || []).length);"
node -e "const fs = require('fs'); const lines = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8').split('\n'); lines.forEach((line, i) => { if (line.includes('CLUB TEAMS') || line.includes('National Teams')) console.log(i + 1 + ': ' + line.substring(0, 150)); });"
node -e "const fs = require('fs'); const c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); const start = c.indexOf('EXPLORE BY CATEGORY'); const end = c.indexOf('</section>', start); console.log((c.substring(start, end).match(/<button className=\"group relative flex flex-col/g) || []).length);"
node check-cards.cjs
node remove-cards.cjs
node check-cards.cjs
node -e "const fs = require('fs'); let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); c = c.replace(/className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop pamidor-list\"/g, 'className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-gutter-desktop pamidor-list\"'); fs.writeFileSync('client/src/pages/Storefront.jsx', c);"
node change-grid.cjs
node check-cards.cjs
node -e "require('child_process').execSync('npx eslint client/src/pages/Storefront.jsx', {stdio: 'inherit'})"
node -e "const fs = require('fs'); const c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); const start = c.indexOf('TRACK PANTS'); console.log(c.substring(start, start + 800));"
node -e "const fs = require('fs'); const c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); const idx = c.indexOf('</section><section id=\"selection\"'); console.log(c.substring(idx - 100, idx + 50));"
node -e "const fs = require('fs'); const c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); const idx = c.indexOf('</section><section id=\"selection\"'); console.log(c.substring(idx - 200, idx));"
node fix-divs.cjs
node adjust-shop-all.cjs
node -e "const fs = require('fs'); const c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); const startIdx = c.indexOf('<button className=\"lg:col-span-3'); const endIdx = c.indexOf('</button>', startIdx) + 9; console.log(c.substring(startIdx, endIdx));"
node fetch-card.cjs
node restyle-shop-all.cjs
node -e "const fs = require('fs'); let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8'); c = c.replace(/className=\"lg:col-span-3 sm:col-span-2 group relative w-full h-\[320px\] lg:h-full bg-black overflow-hidden flex flex-col text-left\"/g, 'className=\"lg:col-span-3 sm:col-span-2 group relative w-full h-[320px] lg:h-full bg-black overflow-hidden flex flex-col text-left pamidor-item reveal\"'); fs.writeFileSync('client/src/pages/Storefront.jsx', c);"
node add-classes.cjs
node split-card.cjs
npm install -D tailwindcss postcss autoprefixer
node -e "const fs = require('fs'); const content = fs.readFileSync('client/src/style.css', 'utf8'); fs.writeFileSync('client/src/style.css', '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n' + content);"
node -e "const fs = require('fs'); let html = fs.readFileSync('client/index.html', 'utf8'); html = html.replace('<script src=\"https://cdn.tailwindcss.com\"></script>', ''); html = html.replace(/<script id=\"tailwind-config\">.*?<\/script>/s, ''); fs.writeFileSync('client/index.html', html);"
node remove-cdn.cjs
npm install -D @tailwindcss/postcss
npm install -D tailwindcss@^3.4.1 && npm uninstall -D @tailwindcss/postcss
npm install -D tailwindcss@^3.4.1
mv postcss.config.js client/postcss.config.js
npm uninstall -D @tailwindcss/postcss
git status
git diff client/src/style.css
git restore client/index.html
node -e "const fs = require('fs'); let css = fs.readFileSync('client/src/style.css', 'utf8'); css = css.replace(/@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n/g, ''); fs.writeFileSync('client/src/style.css', css);"
npm uninstall -D tailwindcss postcss autoprefixer
rm postcss.config.js client/tailwind.config.js client/postcss.config.js -Force -ErrorAction SilentlyContinue
rm postcss.config.js, client/tailwind.config.js, client/postcss.config.js -Force -ErrorAction SilentlyContinue
node restore-cdn.cjs
node restore-fonts.cjs
