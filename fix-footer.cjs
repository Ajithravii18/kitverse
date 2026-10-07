const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');

const footerRegex = /<footer className="w-full bg-white text-on-surface">[\s\S]*?<\/footer>/;
const newFooter = `<footer className="w-full bg-foreground text-background py-24 px-6 md:px-12 border-t border-border mt-auto">
  <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
    <div className="flex flex-col md:flex-row justify-between gap-12">
      <div className="flex flex-col gap-6 max-w-sm">
        <h2 className="font-display text-4xl uppercase m-0 leading-none">KITVERSE</h2>
        <p className="font-sans text-sm text-background/60">
          A high-tension football culture publication, garment registry, and pitchside artifact atelier. Fusing football culture with European publishing standards.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-12 md:gap-24">
        <div className="flex flex-col gap-4">
          <span className="font-sans text-xs uppercase tracking-widest text-background/50">Archive</span>
          <a href="/shop" className="font-sans text-sm hover:text-accent transition-colors">All Products</a>
          <a href="/shop?category=club" className="font-sans text-sm hover:text-accent transition-colors">Club Kits</a>
          <a href="/shop?category=national" className="font-sans text-sm hover:text-accent transition-colors">National Teams</a>
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-sans text-xs uppercase tracking-widest text-background/50">Support</span>
          <a href="/profile" className="font-sans text-sm hover:text-accent transition-colors">Your Account</a>
          <a href="mailto:hello@kitverse.in" className="font-sans text-sm hover:text-accent transition-colors">Contact Us</a>
          <span className="font-sans text-sm text-background/60">Dispatch: India</span>
        </div>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-background/20">
      <span className="font-sans text-xs uppercase tracking-widest text-background/50">© 2026 KITVERSE. All rights reserved.</span>
      <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="font-sans text-xs uppercase tracking-widest hover:text-accent transition-colors">
        Back to Top ↑
      </a>
    </div>
  </div>
</footer>`;

code = code.replace(footerRegex, newFooter);
fs.writeFileSync('client/src/pages/Storefront.jsx', code);
console.log('Updated footer in Storefront.jsx');
