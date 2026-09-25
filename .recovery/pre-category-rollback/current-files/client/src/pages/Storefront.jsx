import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../useScrollReveal.js';
import '../style.css';
import '../animations.css';
import Hero from '../components/shop/Hero.jsx';
import CategoryCircleNav from '../components/shop/CategoryCircleNav.jsx';
import ProductRail from '../components/shop/ProductRail.jsx';
import ProductDetailModal from '../components/ProductDetailModal.jsx';
import { BagContext } from '../main.jsx';

export default function Storefront() {
  const { cart, setCart, addItem, demo } = useContext(BagContext);
  const [selected, setSelected] = useState(null);
  const [storeData, setStoreData] = useState({ featured: [], all: [] });

  useScrollReveal([storeData.all.length]);

  useEffect(() => {
    async function fetchMerch() {
      try {
        const [featRes, allRes] = await Promise.all([
          fetch('/api/products?sort=featured&limit=8').then((r) => r.json()),
          fetch('/api/products?limit=100').then((r) => r.json())
        ]);

        setStoreData({
          featured: featRes.products || [],
          all: allRes.products || []
        });
      } catch (err) {
        console.error('Failed to load storefront products', err);
      }
    }

    fetchMerch();
  }, []);

  const featured = storeData.featured || [];
  const products = storeData.all || [];
  const kits2627 = products.filter(p => p.season === '26/27');

  return (
    <>
      <main className="home-page">
        <Hero products={featured} openProduct={setSelected} />

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            <span>FOOTBALL IS PERSONAL</span><b>&#9917;</b><span>CLUB LOYALTY. NATIONAL PRIDE.</span><b>&#9917;</b><span>FIND YOUR COLOURS</span><b>&#9917;</b>
            <span>FOOTBALL IS PERSONAL</span><b>&#9917;</b><span>CLUB LOYALTY. NATIONAL PRIDE.</span><b>&#9917;</b><span>FIND YOUR COLOURS</span><b>&#9917;</b>
            <span>FOOTBALL IS PERSONAL</span><b>&#9917;</b><span>CLUB LOYALTY. NATIONAL PRIDE.</span><b>&#9917;</b><span>FIND YOUR COLOURS</span><b>&#9917;</b>
          </div>
        </div>

        <CategoryCircleNav products={products} />

        <ProductRail title="FEATURED JERSEYS" subtitle="Explore a selection from the catalogue." products={featured.slice(0, 8)} linkTo="/shop?sort=featured" openProduct={setSelected} />
        {kits2627.length > 0 && (
          <ProductRail title="26/27 SEASON KITS" subtitle="The future of football is here." products={kits2627.slice(0, 8)} linkTo="/shop" openProduct={setSelected} />
        )}
        <ProductRail title="SHOP JERSEYS" products={products.filter((p) => p.productType !== 'shorts' && p.productType !== 'track-pants').slice(0, 4)} linkTo="/shop" openProduct={setSelected} />

        <section id="qualities" className="quality reveal">
          <div className="quality-intro">
            <div className="eyebrow">KNOW YOUR KIT</div>
            <h2>The details<br />make the difference.</h2>
            <p>Each jersey is listed in the quality we have in stock. Check its available sizes before adding it to your bag.</p>
          </div>
          <div className="quality-grid">
            {['Stitched details.', 'A coordinated jersey-and-shorts set.', 'Check each listing for fabric.', 'A closer-fitting style.'].map((text, i) => (
              <article key={i} className="reveal" style={{ '--i': i }}>
                <span>0{i + 1} / {['THE DETAIL', 'THE FULL KIT', 'THE FINISH', 'THE FIT'][i]}</span>
                <h3>{['Embroidery', 'First copy + shorts', 'Master copy', 'Player version'][i]}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="closing">
          <p className="eyebrow">A NEW WAY TO SHOP</p>
          <h2>Bring your A-game.</h2>
          <Link to="/shop" className="text-link">Explore the collection</Link>
        </div>
      </main>

      {selected && (
        <ProductDetailModal
          key={selected.slug}
          product={selected}
          products={products}
          onSelectRelated={(prod) => setSelected(prod)}
          onClose={() => setSelected(null)}
          onAdd={(prod, chosenSize) => {
            setCart(addItem(cart, prod, chosenSize));
            setSelected(null);
          }}
          cart={cart}
          demo={demo}
        />
      )}
    </>
  );
}
