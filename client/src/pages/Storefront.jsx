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



</div></main><footer className="w-full bg-foreground text-background py-24 px-6 md:px-12 border-t border-border mt-auto">
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
</footer>



















 </div>
   </div>
  );
}
