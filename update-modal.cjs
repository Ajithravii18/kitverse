const fs = require('fs');
let code = fs.readFileSync('client/src/components/ProductDetailModal.jsx', 'utf8');

code = code.replace(/<div className="detail-modal-shell">/g, '<div className="w-full max-w-[1200px] bg-background text-foreground flex flex-col md:flex-row overflow-hidden relative">');
code = code.replace(/<h2 className="detail-product-title">/g, '<h2 className="font-headline-md text-[clamp(44px,6vw,72px)] uppercase leading-[0.9] tracking-tight mb-2 mt-4">');
code = code.replace(/<span className="detail-price">/g, '<span className="font-price-currency text-xl font-bold block mb-4 border-b border-border pb-4">');
code = code.replace(/<div className="detail-info-col">/g, '<div className="flex-1 flex flex-col p-6 md:p-12 overflow-y-auto">');
code = code.replace(/<div className="detail-gallery-col">/g, '<div className="w-full md:w-1/2 relative bg-card flex flex-col border-r border-border min-h-[400px]">');
code = code.replace(/<button className="detail-submit-btn"/g, '<button className="w-full bg-foreground text-background py-5 font-label-mono-bold text-[14px] uppercase mt-8 hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent hover:border-foreground"');

code = code.replace(/<div className="detail-facts">/g, '<div className="grid grid-cols-3 gap-4 border-b border-border pb-6 mb-6 font-label-technical text-[11px] uppercase tracking-wider text-foreground/60">');
code = code.replace(/<div className="detail-header-tags">/g, '<div className="flex gap-2 font-label-technical text-[10px] uppercase mb-2">');

code = code.replace(/<fieldset className="size-fieldset">/g, '<fieldset className="mt-6 mb-4">');
code = code.replace(/<legend>/g, '<legend className="font-label-technical text-[11px] mb-3">');

// Sizes
code = code.replace(/<div className="detail-size-chips">/g, '<div className="grid grid-cols-3 gap-2">');
code = code.replace(/<button key=\{size\} type="button"[\s\S]*?className=\{`size-chip/g, "<button key={size} type=\"button\"\n                className={`border border-border py-3 px-2 flex flex-col items-center justify-center font-label-mono-bold hover:border-foreground transition-colors ${selectedSize === size ? 'bg-foreground text-background' : 'bg-transparent text-foreground'}`");

fs.writeFileSync('client/src/components/ProductDetailModal.jsx', code);
console.log("Modal updated");
