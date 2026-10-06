import React, { useEffect, useRef } from 'react';
import Hero from '../components/home/Hero.jsx';
import PageLoader from '../components/PageLoader.jsx';
import Categories from '../components/home/Categories.jsx';
import SeasonKits from '../components/home/SeasonKits.jsx';
import FeaturedProducts from '../components/home/FeaturedProducts.jsx';
import ClubsDirectory from '../components/home/ClubsDirectory.jsx';
import Shorts from '../components/home/Shorts.jsx';
import TrackPants from '../components/home/TrackPants.jsx';
import Specs from '../components/home/Specs.jsx';
import Navbar from '../components/Navbar.jsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useHomeMotion from '../useHomeMotion.js';
import '../home-motion.css';
import { products } from '../../../shared/catalog.js';
import { teamData } from '../teamData.js';
import ProductDetailModal from '../components/ProductDetailModal.jsx';
import useBag from '../useBag.js';
import { addItem } from '../../../shared/inventory.js';
import { money } from '../format.js';

const allTeams = [...new Set(products.map(p => p.team))].filter(Boolean);
export default function Storefront() {
 const homeRef = useRef(null);
 const clubsCarouselRef = useRef(null);
 const { cart, setCart, restore, storageWarning } = useBag();
 const [catalogue, setCatalogue] = React.useState([]);
 const [catalogueDemo, setCatalogueDemo] = React.useState(true);
 const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [networkError, setNetworkError] = React.useState(false);
 const [cartNotice, setCartNotice] = React.useState('');
 const cartItemCount = cart.reduce((total, item) => total + item.qty, 0);
 const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);
 const location = useLocation();
 const navigate = useNavigate();
 const [signedInNotice, setSignedInNotice] = React.useState('');

 const [cmsLoaded, setCmsLoaded] = React.useState(false);
 const [cms, setCms] = React.useState({
   'homepage-hero': {
     aboutLabel: "ABOUT US:",
     aboutText: "AT KITVERSE WE LIVE AND BREATHE FOOTBALL ARCHIVE CULTURE. WE ARE NOT MERELY ENTHUSIASTS; WE ARE STORYTELLERS OF KITVERSE LEGACY.",
     title: "MATCHDAY ARCHIVE",
     subtitle: "2024 / 2025 REVEAL SPECIFICATION",
     registry: "REGISTRY // FROM 2024",
     headline: "ENGINEERED FOR THE MODERN ICON",
     cta: "EXPLORE THE ARCHIVE",
     isActive: true
   },
   'announcement-bar': {
     text: "FREE SHIPPING ON ORDERS OVER ₹1500 / USE CODE EXTRA10 FOR 10% OFF",
     isActive: false
   }
 });

 React.useEffect(() => {
   const controller = new AbortController();
   const timeout = setTimeout(() => controller.abort(), 1800);
   let mounted = true;
   fetch('/api/content?keys=homepage-hero,announcement-bar,featured-products', {signal: controller.signal})
     .then(r => {if (!r.ok) throw new Error('Content unavailable'); return r.json();})
     .then(data => {
       if (mounted && data.content) {
         setCms(prev => ({ ...prev, ...data.content,
           'homepage-hero': {...prev['homepage-hero'], ...data.content['homepage-hero']}
         }));
       }
     })
     .catch(() => {})
     .finally(() => {clearTimeout(timeout); if (mounted) setCmsLoaded(true);});
   return () => {mounted = false; clearTimeout(timeout); controller.abort();};
 }, []);

 React.useLayoutEffect(() => {
   if (!location.hash) window.scrollTo({top: 0, left: 0, behavior: 'instant'});
 }, []);


 React.useEffect(() => {
   if (!location.state?.signedIn) return;
   const username = location.state.username?.trim();
   setSignedInNotice(username ? `SIGNED IN / WELCOME BACK, ${username.toUpperCase()}` : 'SIGNED IN / WELCOME BACK TO THE ARCHIVE');
   navigate('/', { replace: true, state: null });
 }, [location.state, navigate]);

 React.useEffect(() => {
   if (!signedInNotice) return undefined;
   const timeout = window.setTimeout(() => setSignedInNotice(''), 3600);
   return () => window.clearTimeout(timeout);
 }, [signedInNotice]);

 React.useEffect(() => {
   const controller = new AbortController();
   fetch('/api/products', { signal: controller.signal })
     .then(async response => {
       const data = await response.json().catch(() => ({}));
       if (!response.ok || !Array.isArray(data.products)) throw new Error('Catalogue unavailable');
       if (controller.signal.aborted) return;
       setCatalogue(data.products);
       setCatalogueDemo(Boolean(data.demo));
       restore(data.products);
     })
     .catch(() => {
       if (controller.signal.aborted) return;
       setNetworkError(true);
       // Do not reconcile against demo products so the cart is preserved.
     });
   return () => controller.abort();
 }, []);

 React.useEffect(() => {
   if (!cartNotice) return undefined;
   const timeout = window.setTimeout(() => setCartNotice(''), 3200);
   return () => window.clearTimeout(timeout);
 }, [cartNotice]);

 React.useEffect(() => {
   if (location.hash) {
     const id = location.hash.substring(1);
     const element = document.getElementById(id);
     if (element) {
       setTimeout(() => {
         element.scrollIntoView({ behavior: 'smooth' });
       }, 100);
     }
   }
 }, [location.hash, catalogue]);

 const openHomeProduct = (search, productType = 'jersey') => {
   const normalizedSearch = search.toLowerCase();
   const candidates = catalogue.filter(product => (product.productType || 'jersey') === productType);
   const product = candidates.find(candidate => candidate.slug === search)
     || candidates.find(candidate => candidate.name.toLowerCase().includes(normalizedSearch));
   if (product) setSelectedProduct(product);
   else setCartNotice('THIS ITEM IS NOT AVAILABLE IN THE LIVE CART CATALOGUE.');
 };

 const handleHomeAdd = (product, size) => {
   setCart(addItem(cart, product, size));
   setSelectedProduct(null);
   setCartNotice(`${product.name.toUpperCase()} / SIZE ${size} ADDED TO CART`);
 };

 const scrollClubs = (direction) => {
    if (clubsCarouselRef.current) {
      const scrollAmount = 356; // 340px width + 16px gap
      clubsCarouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
 };

 const [isDragging, setIsDragging] = React.useState(false);
 const [startX, setStartX] = React.useState(0);
 const [scrollLeft, setScrollLeft] = React.useState(0);
 const [dragDistance, setDragDistance] = React.useState(0);

 const handleMouseDown = (e) => {
   setIsDragging(true);
   setStartX(e.pageX - clubsCarouselRef.current.offsetLeft);
   setScrollLeft(clubsCarouselRef.current.scrollLeft);
   setDragDistance(0);
 };

 const handleMouseLeave = () => {
   setIsDragging(false);
 };

 const handleMouseUp = () => {
   setIsDragging(false);
 };

 const handleMouseMove = (e) => {
   if (!isDragging) return;
   e.preventDefault();
   const x = e.pageX - clubsCarouselRef.current.offsetLeft;
   const walk = (x - startX) * 2; // scroll speed
   clubsCarouselRef.current.scrollLeft = scrollLeft - walk;
   setDragDistance(prev => prev + Math.abs(x - startX));
 };

 const handleClickCapture = (e) => {
   if (dragDistance > 10) {
     e.stopPropagation();
     e.preventDefault();
   }
 };
 useHomeMotion(homeRef, cmsLoaded);
 
    return (
   <div className="home-storefront">
     <Navbar />
     <div className="home-page" ref={homeRef}>

 {cms['announcement-bar']?.isActive && (
   <div className="bg-black text-white text-xs font-bold text-center py-2 tracking-widest uppercase">
     {cms['announcement-bar']?.text}
   </div>
 )}

 {cartNotice && <div className="home-session-notice" role="status">{cartNotice}</div>}
 {storageWarning && <p role="alert">{storageWarning}</p>}
 {selectedProduct && <ProductDetailModal key={selectedProduct.slug} product={selectedProduct} products={catalogue} cart={cart} demo={catalogueDemo} onClose={() => setSelectedProduct(null)} onAdd={handleHomeAdd} onSelectRelated={setSelectedProduct} />}
 {signedInNotice && <div className="home-session-notice" role="status"><span className="material-symbols-outlined" aria-hidden="true">check_circle</span><span>{signedInNotice}</span></div>}
 <svg aria-hidden="true"className="inline-defs-container"style={{"position":"absolute","width":"0","height":"0","overflow":"hidden"}}></svg>
<main className="w-full bg-surface"><div className="flex flex-col w-full">

{cms['homepage-hero']?.isActive !== false && <Hero cms={cms} catalogue={catalogue} />}

<Categories /><SeasonKits catalogue={catalogue} openHomeProduct={openHomeProduct} />

  {cms['featured-products']?.isActive !== false && cms['featured-products']?.heading && <FeaturedProducts cms={cms} catalogue={catalogue} setSelectedProduct={setSelectedProduct} />}






<ClubsDirectory 
  allTeams={allTeams} 
  clubsCarouselRef={clubsCarouselRef} 
  handleMouseDown={handleMouseDown} 
  handleMouseLeave={handleMouseLeave} 
  handleMouseUp={handleMouseUp} 
  handleMouseMove={handleMouseMove} 
  handleClickCapture={handleClickCapture} 
  scrollClubs={scrollClubs} 
/>

<Shorts openHomeProduct={openHomeProduct} /><TrackPants openHomeProduct={openHomeProduct} /><Specs />



</div></main><footer className="w-full bg-white text-on-surface">
  {/* Mobile-optimized utility banner */}
  <div className="w-full bg-black text-white px-margin-desktop py-2.5 overflow-hidden">
    <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 sm:gap-space-sm font-label-technical text-label-technical uppercase tracking-widest text-[9px] text-center sm:text-left">
      <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
        <span className="w-2 h-2 rounded-full bg-primary inline-block shrink-0"></span>
        <span className="font-bold text-white">DELHI CENTRAL ATELIER DISPATCH ACTIVE</span>
      </div>
      <div className="hidden lg:flex items-center gap-1.5 text-white/80">
        <span className="material-symbols-outlined text-[13px] text-primary">lock</span>
        <span>SECURE 256-BIT ENCRYPTION</span>
      </div>
      <div className="hidden md:flex items-center gap-1.5 text-white/80">
        <span className="material-symbols-outlined text-[13px] text-primary">verified</span>
        <span>RAZORPAY VERIFIED GATEWAY</span>
      </div>
      <div className="flex items-center justify-center gap-1.5 text-white/80 w-full sm:w-auto mt-1 sm:mt-0">
        <span className="material-symbols-outlined text-[13px] text-primary">local_shipping</span>
        <span>ALL INDIA EXPRESS TRANSIT: 48-72 HOURS</span>
      </div>
    </div>
  </div>

  {/* Main footer body with responsive padding */}
  <div className="w-full px-margin-desktop py-12 md:py-space-3xl flex flex-col gap-12 md:gap-space-2xl">
    
    <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 md:gap-space-md pb-8 md:pb-space-lg border-b border-black/5 lg:border-none">
      <div className="flex flex-col">
        <span className="font-display-xl text-display-xl-mobile md:text-display-xl tracking-tight uppercase text-black leading-none select-none">KITVERSE</span>
        <span className="font-label-mono-bold text-label-mono-bold text-black uppercase tracking-wider mt-2 md:mt-1">ATELIER RUN: ISSUE 04 // 2026-2027 ARCHIVE</span>
      </div>
      <div className="flex flex-col items-start lg:items-end gap-2 max-w-md mt-4 lg:mt-0">
        <span className="font-label-technical text-label-technical text-on-surface-variant uppercase tracking-widest border border-black/10 px-2 py-1 inline-block">EDITORIAL MASTHEAD & PRODUCTION MANIFESTO</span>
        <p data-home-reveal="" className="font-body-sm text-body-sm text-on-surface-variant uppercase text-left lg:text-right leading-relaxed mt-2">A high-tension football culture publication, garment registry, and pitchside artifact atelier. Fusing football culture with European high-fashion publishing standards.</p>
      </div>
    </div>

    <div className="bg-surface p-6 md:p-space-lg flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 md:gap-space-md border border-black/5">
      <div className="flex flex-col gap-2">
        <span className="font-label-mono-bold text-label-mono-bold uppercase text-secondary tracking-wider">MANIFESTO ENTRY #04 // CITRON PITCH SPECIFICATION</span>
        <p data-home-reveal="" className="font-title-editorial text-title-editorial text-on-surface">"Matchday is an open-air runway. Fabric carries heritage, nylon carries glory."</p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-shrink-0 w-full lg:w-auto pt-4 lg:pt-0 border-t border-black/5 lg:border-none">
        <div className="flex flex-col items-start lg:items-end">
          <span className="font-label-technical text-label-technical uppercase text-on-surface-variant">AUTHENTICATED KITVERSE APPAREL</span>
          <span className="font-label-mono-bold text-label-mono-bold text-black mt-0.5">EDITION 04/500 // VERIFIED</span>
        </div>
        <div className="px-3 py-1.5 bg-primary-container text-on-primary-fixed font-label-mono-bold text-label-mono-bold border border-transparent shadow-sm">ISO 9001 SPEC</div>
      </div>
    </div>

    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 md:gap-space-md pt-8 md:pt-space-sm border-t border-black/10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-space-md w-full lg:w-auto">
        <div className="flex flex-col">
          <svg className="w-32 md:w-36 h-7 text-black fill-current" viewBox="0 0 160 30">
            <rect height="30" width="3" x="0" y="0"/><rect height="30" width="2" x="6" y="0"/><rect height="30" width="6" x="11" y="0"/><rect height="30" width="2" x="20" y="0"/><rect height="30" width="4" x="25" y="0"/><rect height="30" width="2" x="32" y="0"/><rect height="30" width="5" x="37" y="0"/><rect height="30" width="2" x="45" y="0"/><rect height="30" width="7" x="50" y="0"/><rect height="30" width="3" x="60" y="0"/><rect height="30" width="1" x="66" y="0"/><rect height="30" width="4" x="70" y="0"/><rect height="30" width="6" x="77" y="0"/><rect height="30" width="2" x="86" y="0"/><rect height="30" width="4" x="91" y="0"/><rect height="30" width="6" x="98" y="0"/><rect height="30" width="2" x="107" y="0"/><rect height="30" width="7" x="112" y="0"/><rect height="30" width="2" x="122" y="0"/><rect height="30" width="4" x="127" y="0"/><rect height="30" width="3" x="134" y="0"/><rect height="30" width="6" x="140" y="0"/><rect height="30" width="2" x="149" y="0"/><rect height="30" width="5" x="154" y="0"/>
          </svg>
          <span className="font-label-technical text-label-technical tracking-widest text-black mt-1.5">KV-2026-IND-04 // VERIFIED</span>
        </div>
        <div className="font-label-technical text-label-technical uppercase text-on-surface-variant max-w-[200px] sm:max-w-none leading-relaxed">© 2025-2026 KITVERSE MAGAZINE ARCHIVE.<br className="hidden sm:block" /> ALL FOOTBALL CULTURE & DESIGN RIGHTS RESERVED.</div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full lg:w-auto gap-6 md:gap-space-md pt-6 sm:pt-0 border-t border-black/5 lg:border-none">
        <div className="flex flex-wrap items-center gap-4 md:gap-space-md font-label-mono-bold text-label-mono-bold uppercase text-on-surface-variant">
          <a href="#" onClick={(e) => { e.preventDefault(); alert("Terms of Supply: Coming soon."); }} className="hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5">TERMS OF SUPPLY</a>
          <a href="#" onClick={(e) => { e.preventDefault(); alert("Authenticity Guarantee: Coming soon."); }} className="hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5">AUTHENTICITY</a>
          <a href="#" onClick={(e) => { e.preventDefault(); alert("Newsletter subscription opening soon."); }} className="hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5">SUBSCRIBE</a>
        </div>
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-200 text-black border border-black/10 hover:border-black" title="Return to Top">
          <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
        </a>
      </div>
    </div>
  </div>
</footer>



















 </div>
   </div>
  );
}
