const fs = require('fs');
let code = fs.readFileSync('client/src/pages/ShopPage.jsx', 'utf8');
const badLineRegex = /\{isMobile && <dialog ref=\{filterDialog\}.*?<\/dialog>\}/;
const cleanLine = `{isMobile && <dialog ref={filterDialog} className="fixed inset-0 m-0 w-full h-full max-w-none max-h-none bg-background text-foreground z-50 p-6 overflow-y-auto" aria-label="Collection filters" onCancel={event=>{event.preventDefault();setMobilePanel(null);}} onClick={event=>{if(event.target===filterDialog.current && event.clientX>event.target.getBoundingClientRect().right)setMobilePanel(null);}}><button type="button" className="font-sans text-xs uppercase tracking-widest text-foreground hover:text-accent transition-colors pb-8" aria-label="Close filters" onClick={()=>setMobilePanel(null)}>← Back to Archive</button>{filterControls}</dialog>}`;
code = code.replace(badLineRegex, cleanLine);
fs.writeFileSync('client/src/pages/ShopPage.jsx', code);
console.log('Fixed dialog line');
