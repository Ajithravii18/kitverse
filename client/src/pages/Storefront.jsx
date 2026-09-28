import React, { useRef } from 'react';
import useHomeMotion from '../useHomeMotion.js';
import Marquee from '../components/Marquee.jsx';
import '../home-motion.css';

export default function Storefront() {
 const homeRef = useRef(null);
 useHomeMotion(homeRef);
 return (
 <div className="home-page" ref={homeRef}>
 <svg aria-hidden="true"className="inline-defs-container"style={{"position":"absolute","width":"0","height":"0","overflow":"hidden"}}></svg>
<header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md"><div className="h-24 w-full px-margin-desktop flex flex-col justify-between py-space-xs"><div className="flex items-center justify-between"><div className="flex items-center gap-space-md"><span className="font-headline-sm text-headline-sm uppercase text-on-surface">+ KITVERSE</span><span className="font-label-technical text-label-technical tracking-widest text-on-surface-variant uppercase px-space-xs py-0.5 bg-surface-container">ISSUE 04 // MATCHDAY EDITORIAL</span></div><div className="flex items-center gap-space-lg"><div className="hidden md:flex items-center gap-space-xs font-label-technical text-label-technical text-on-surface-variant"><svg className="w-12 h-4 text-on-surface fill-current"viewBox="0 0 100 24"><rect height="24"width="3"x="0"y="0"/><rect height="24"width="2"x="6"y="0"/><rect height="24"width="6"x="11"y="0"/><rect height="24"width="2"x="20"y="0"/><rect height="24"width="4"x="25"y="0"/><rect height="24"width="1"x="32"y="0"/><rect height="24"width="5"x="36"y="0"/><rect height="24"width="2"x="44"y="0"/><rect height="24"width="7"x="49"y="0"/><rect height="24"width="3"x="59"y="0"/><rect height="24"width="1"x="65"y="0"/><rect height="24"width="4"x="69"y="0"/><rect height="24"width="5"x="76"y="0"/><rect height="24"width="2"x="84"y="0"/><rect height="24"width="3"x="89"y="0"/><rect height="24"width="5"x="95"y="0"/></svg><span className="font-label-mono-bold text-label-mono-bold">KV-2025-04</span></div><span className="font-price-currency text-price-currency text-on-surface">[INR ₹]</span><span className="font-label-mono-bold text-label-mono-bold bg-primary-container text-on-primary-fixed px-space-sm py-1">BAG (02)</span><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div><div className="flex items-center justify-between pt-space-xs"><nav className="flex items-center gap-space-lg"data-active-classes="bg-primary-container text-on-primary-fixed font-bold"><a className="font-label-mono-bold text-label-mono-bold uppercase text-on-surface-variant hover:text-on-surface transition-colors py-1 px-space-xs bg-primary-container text-on-primary-fixed"data-path="26-27-kits"href="#selection">26/27 KITS</a><a className="font-label-mono-bold text-label-mono-bold uppercase text-on-surface-variant hover:text-on-surface transition-colors py-1 px-space-xs"data-path="collections"href="#">COLLECTIONS</a><a className="font-label-mono-bold text-label-mono-bold uppercase text-on-surface-variant hover:text-on-surface transition-colors py-1 px-space-xs"data-path="shop-all"href="#">SHOP ALL</a><a className="font-label-mono-bold text-label-mono-bold uppercase text-on-surface-variant hover:text-on-surface transition-colors py-1 px-space-xs"data-path="shorts"href="#shorts">SHORTS</a><a className="font-label-mono-bold text-label-mono-bold uppercase text-on-surface-variant hover:text-on-surface transition-colors py-1 px-space-xs"data-path="track-pants"href="#track-pants">TRACK PANTS</a><a className="font-label-mono-bold text-label-mono-bold uppercase text-on-surface-variant hover:text-on-surface transition-colors py-1 px-space-xs"data-path="teams"href="#">TEAMS</a><a className="font-label-mono-bold text-label-mono-bold uppercase text-on-surface-variant hover:text-on-surface transition-colors py-1 px-space-xs"data-path="lookbook"href="#">LOOKBOOK</a><a className="font-label-mono-bold text-label-mono-bold uppercase text-on-surface-variant hover:text-on-surface transition-colors py-1 px-space-xs"data-path="know-your-kit"href="#">KNOW YOUR KIT</a><a className="font-label-mono-bold text-label-mono-bold uppercase text-on-surface-variant hover:text-on-surface transition-colors py-1 px-space-xs"data-path="community-reviews"href="#community-reviews">REVIEWS</a></nav><div className="hidden lg:flex items-center gap-space-md"><span className="font-label-technical text-label-technical uppercase text-on-surface-variant">COORDINATES: 53.4808° N, 2.2426° W // ATELIER RUN 500</span></div></div></div></header><main className="w-full pt-24 bg-surface"><div className="flex flex-col w-full">

<section data-home-hero="" className="mb-12 w-full px-margin-desktop pt-space-xl pb-space-lg flex flex-col gap-space-lg">

<div data-hero-meta="" className="grid grid-cols-1 md:grid-cols-12 gap-gutter-desktop items-start">
<div className="md:col-span-4 flex flex-col gap-space-xs">
<span className="font-label-mono-bold text-label-mono-bold text-on-surface uppercase tracking-wider">ABOUT US:</span>
<p data-home-reveal="" className="font-body-sm text-body-sm text-on-surface-variant uppercase max-w-xs leading-relaxed">
 AT KITVERSE WE LIVE AND BREATHE FOOTBALL ARCHIVE CULTURE. WE ARE NOT MERELY ENTHUSIASTS; WE ARE STORYTELLERS OF TERRACE LEGACY.
 </p>
</div>
<div className="md:col-span-4 flex flex-col items-start md:items-center text-left md:text-center pt-2 md:pt-0">
<span className="font-label-mono-bold text-label-mono-bold text-on-surface uppercase tracking-widest">MATCHDAY ARCHIVE</span>
<span className="font-label-technical text-label-technical text-on-surface-variant uppercase mt-1">2024 / 2025 REVEAL SPECIFICATION</span>
</div>
<div className="md:col-span-4 flex flex-col items-start md:items-end pt-2 md:pt-0">
<span className="font-label-technical text-label-technical text-on-surface-variant uppercase mb-1">REGISTRY // FROM 2024</span>
<div className="flex flex-col items-start md:items-end">
<svg className="w-36 h-9 text-on-surface fill-current"viewBox="0 0 160 36">
<rect height="36"width="4"x="0"y="0"/>
<rect height="36"width="2"x="7"y="0"/>
<rect height="36"width="8"x="13"y="0"/>
<rect height="36"width="2"x="25"y="0"/>
<rect height="36"width="6"x="31"y="0"/>
<rect height="36"width="3"x="41"y="0"/>
<rect height="36"width="7"x="48"y="0"/>
<rect height="36"width="2"x="59"y="0"/>
<rect height="36"width="5"x="65"y="0"/>
<rect height="36"width="9"x="74"y="0"/>
<rect height="36"width="2"x="87"y="0"/>
<rect height="36"width="6"x="93"y="0"/>
<rect height="36"width="4"x="103"y="0"/>
<rect height="36"width="8"x="111"y="0"/>
<rect height="36"width="3"x="123"y="0"/>
<rect height="36"width="7"x="130"y="0"/>
<rect height="36"width="2"x="141"y="0"/>
<rect height="36"width="5"x="147"y="0"/>
<rect height="36"width="4"x="156"y="0"/>
</svg>
<span className="font-label-technical text-label-technical tracking-widest text-on-surface mt-1">(01)01234567890123</span>
</div>
</div>
</div>

<div className="w-full flex items-center justify-between pt-space-md pb-space-sm select-none overflow-hidden">
<h1 aria-label="KITVERSE" data-hero-title="" className="font-display-xl text-display-xl tracking-tight text-on-surface uppercase w-full text-center scale-y-110 leading-none">
 {Array.from("KITVERSE").map((letter, index) => <span className="hero-letter-mask" aria-hidden="true" key={index}><span className="hero-letter">{letter}</span></span>)}
 </h1>
</div>

<div data-hero-caption="" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-space-sm pb-space-md">
<span className="font-label-mono-bold text-label-mono-bold text-on-surface-variant uppercase tracking-wider">
 WELCOME TO THE ARCHIVE OF HISTORIC KITS AND TERRACE APPAREL
 </span>
<span className="font-label-mono-bold text-label-mono-bold text-on-surface uppercase tracking-wider">
 HIGH-VELOCITY MATCHDAY EDITION
 </span>
</div>

<div className="relative w-full grid grid-cols-1 md:grid-cols-2 gap-gutter-desktop mt-space-xs">

<div data-home-reveal="" className="flex flex-col gap-space-sm group">
<div data-hero-frame="" className="relative w-full h-[520px] bg-surface-container overflow-hidden">
<img className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700 ease-out"data-alt="Editorial lookbook photograph of a stylish model wearing the classic Liverpool 23 24 red football shirt with crisp white embroidery and yellow accents, shot pitchside in natural morning light, medium close-up, sharp textures and high fashion aesthetic, minimal studio backdrop."src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHM2ycEQFJKMsH-ejKJVEGrUjkrvMjO6WTHS_frV69yFOUUPb6oIAu0BFvGTETkrm_k9YdtMIwIt7EDlnHcW-BQabWy6pHG6HCn-N2wfDk3wjZZEmCobbGF7rG8xsrIPE6IuZTp_hdg67de2mqmaUYTeOFtE6JFjVmUlRVYmsq-qtgdVmgaRQFPLaTKmGGb0Vo-vW79EtERMqE2-9aAX1AcRKAQrMNJ71F1nSpJfrgR2fbZ2ZgB8gw0g"/>
<div className="absolute bottom-0 left-0 p-space-md bg-surface/90 backdrop-blur-sm">
<span className="font-label-mono-bold text-label-mono-bold text-on-surface uppercase block">LIVERPOOL FC 23/24</span>
<span className="font-label-technical text-label-technical text-on-surface-variant block mt-0.5">TERRACE EMBROIDERY // BATCH 01</span>
</div>
<div className="absolute top-space-md right-space-md bg-primary-container px-space-sm py-1">
<span className="font-price-currency text-price-currency text-on-primary-fixed">₹799.00</span>
</div>
</div>
<div className="flex justify-between items-center px-1">
<span className="font-label-technical text-label-technical text-on-surface-variant uppercase">LOOK 01 / ANFIELD RED</span>
<span className="font-label-mono-bold text-label-mono-bold text-on-surface uppercase">PRE-SEASON DROP</span>
</div>
</div>

<div data-home-reveal="" className="flex flex-col gap-space-sm group">
<div data-hero-frame="" className="relative w-full h-[520px] bg-surface-container overflow-hidden">
<img className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700 ease-out"data-alt="Avant-garde editorial fashion model wearing the Real Madrid 24 25 white home football kit with gold typography accents and technical tailored shorts, cinematic portrait lighting, high-end European print publication photography style with warm terracotta and white palette."src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQz28BjXXmK5VyRdXu_oZKeK_-njkhRcuGA8ebtuaHRYDnIm2MjnHqy35sptZcZYcn9sO7ssfeQOJ25jKJsCxBaW1XpfB1qIilW8HSaK6YDx5L0rgeWtYk-vwmHRFHh_lbKoliJlbRwu-0Bep44qKLrOdc9AG_RtywJuM22SLwKjUicM_kyF3hXTrxn_5T2kbSiOeZalbtq8zUPun5AM-Bz4BP_pAFinBjETJGq7kRsdohfzNIvn6j6w"/>
<div className="absolute bottom-0 left-0 p-space-md bg-surface/90 backdrop-blur-sm">
<span className="font-label-mono-bold text-label-mono-bold text-on-surface uppercase block">REAL MADRID 24/25</span>
<span className="font-label-technical text-label-technical text-on-surface-variant block mt-0.5">FIRST COPY + SHORTS SUITE</span>
</div>
<div className="absolute top-space-md right-space-md bg-on-surface px-space-sm py-1">
<span className="font-price-currency text-price-currency text-surface">₹1,099.00</span>
</div>
</div>
<div className="flex justify-between items-center px-1">
<span className="font-label-technical text-label-technical text-on-surface-variant uppercase">LOOK 02 / BERNABÉU BLANCO</span>
<span className="font-label-mono-bold text-label-mono-bold text-on-surface uppercase">ATELIER REGISTRATION</span>
</div>
</div>

<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
<a data-hero-badge="" className="group/badge relative flex items-center justify-center w-28 h-28 transform transition-transform duration-300 hover:scale-110 active:scale-95"href="#selection">

<svg className="w-full h-full text-tertiary fill-current "viewBox="0 0 100 100">
<path d="M50 0 L61 24 L87 13 L82 39 L100 50 L82 61 L87 87 L61 76 L50 100 L39 76 L13 87 L18 61 L0 50 L18 39 L13 13 L39 24 Z"/>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
<span className="font-label-mono-bold text-label-mono-bold text-on-tertiary tracking-widest uppercase">SHOP</span>
<span className="font-label-technical text-label-technical text-on-tertiary opacity-80 uppercase mt-0.5">NOW</span>
</div>
</a>
</div>
</div>
</section><Marquee label="The matchday edit" items={["FOOTBALL IS CULTURE", "WEAR YOUR ALLEGIANCE", "KITVERSE ARCHIVE"]} />
<section id="filter-index"className="w-full px-margin-desktop relative bg-white overflow-hidden py-8 md:py-10"><div className="flex flex-col gap-space-2xl relative z-10"><div className="flex flex-col gap-space-md pb-space-lg"><div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm"><div className="flex items-center gap-space-sm flex-wrap"><span className="font-label-technical text-label-technical tracking-widest uppercase bg-black text-white px-2.5 py-1 font-bold">CHAPTER // 02 — ARCHIVE TAXONOMY &amp; CLASSIFICATION MATRIX</span><span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-container text-on-primary-fixed font-label-mono-bold text-label-mono-bold tracking-wider uppercase"><span className="w-2 h-2 rounded-full bg-secondary inline-block "></span>LIVE SYSTEM</span><span className="font-label-technical text-label-technical uppercase text-on-surface-variant tracking-wider hidden sm:inline-block">[SWISS MODULAR CLASSIFIER // 13 PILLARS]</span></div><div className="flex items-center gap-2 font-label-technical text-label-technical uppercase text-on-surface"><span className="w-2 h-2 rounded-full bg-primary inline-block"></span><span className="font-bold">142 ARCHIVE SPECIMENS READY</span></div></div><div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pt-2"><div className="flex flex-col"><h2 data-home-reveal="" className="font-headline-lg text-4xl sm:text-5xl lg:text-6xl uppercase text-black font-extrabold tracking-tighter leading-none">EXPLORE BY CATEGORY</h2><p data-home-reveal="" className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed mt-2 uppercase">DIRECT ATELIER ACCESS TO ALL 13 ARCHIVE PILLARS. FILTER BY RUN WEIGHT, CONSTRUCTION GRADE, APPAREL SILHOUETTE, AND CONTINENTAL TOURNAMENT EDITIONS.</p></div><div className="flex items-center gap-space-xs font-label-mono-bold text-label-mono-bold uppercase tracking-wider text-black px-3 py-2 bg-surface-container"><span className="material-symbols-outlined text-[18px] text-primary">category</span><span className="">13-TIER SYSTEM</span></div></div></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
<a href="/shop" data-home-reveal="" className="category-card category-shop-all group" aria-label="Shop all kits and apparel">
 <span className="category-shop-kicker">KITVERSE / THE COMPLETE ARCHIVE</span>
 <div className="category-shop-center"><h3>SHOP<br/>ALL<span aria-hidden="true">↗</span></h3><p>Every kit. Every colour.<br/>Find your matchday.</p></div>
 <span className="category-shop-bottom">EXPLORE THE COLLECTION <span aria-hidden="true">→</span></span>
</a>


<button type="button" data-home-reveal="" className="category-card group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300  text-left overflow-hidden">
 <div className="relative w-full h-44 bg-[#1c1b1c] overflow-hidden">
 <img className="w-full h-full object-cover object-center grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-700"src="https://lh3.googleusercontent.com/aida/AEtjO1VZOmIoI71hdM_2LuOBBfY5T8izkALlYBl5dnoc-mCIRKH2IatfWWn3qBEAslPvpfdCfWhK7yEcX5BxPFdRH5I6VxRUa04KB1j0pVrXB6k5QfR3SI-UZY_XcF08FCUv02cF5rUREv_4i1oosEP5nzBDVW7GJxgc12YYSvjBnPENIbbjwZ7OIjyxcgiKazMO-j7-dJz8YmK69hS7S8csMMBNI8acw987sUyADM7mImEAlErzWUi1GEp0B2E"alt="Authentic Football Matchday Jersey"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-black text-white font-label-mono-bold text-[10px] uppercase tracking-wider">
 <span className="">J</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm font-price-currency text-[11px] font-bold text-black">
 86 UNITS
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between text-white font-label-technical text-[9px] uppercase tracking-widest">
 <span className="text-white/90 font-bold">MATCHDAY TOPS</span>
 <span className="text-primary-container font-bold">PRE-SEASON</span>
 </div>
 </div>
 <div className="p-space-md flex flex-col justify-between flex-1 gap-2">
 <div className="flex flex-col gap-0.5">
 <div className="flex justify-between items-baseline">
 <span className="font-headline-sm text-[18px] uppercase text-black group-hover:text-primary transition-colors">JERSEYS</span>
 <span className="font-label-technical text-on-surface-variant uppercase text-[9px]">TIER 01-04</span>
 </div>
 <span className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[10px]">MATCHDAY &amp; PRE-SEASON TOPS</span>
 </div>
 <div className="flex items-center justify-between pt-2 mt-1">
 <span className="font-label-technical text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">FROM ₹799</span>
 <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
 </div>
 </div>
</button>


<button type="button" data-home-reveal="" className="category-card group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300  text-left overflow-hidden">
 <div className="relative w-full h-44 bg-[#f2f0f0] overflow-hidden">
 <img className="w-full h-full object-cover object-center grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-700"src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYcIKoAv6LRWpxZAEi-SIMTIE1vh7xYKk0smkWGW8kP79dl-hzPWyOtBLDfnGmi7kcP041zxiEp8rtHCCtbGqxNSoy4exM3_gV7YPvAr0H_7hV73jBMx5ZcLG7heCsMim4qxk2KdT5j7oL2-96JXa75tXsE4fD6KWJOJrp7GB8kFWGBNlAR2jlgQXhekJPIBcPC40_k79PMmXzM_yLooqXuSnWxKNfpvzkD8QTjMwRAVJFj4s-h6WktMRfNl8WhY5tjW4"alt="Direct Needle Embroidery Detail"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-black text-white font-label-mono-bold text-[10px] uppercase tracking-wider">
 <span className="">E</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm font-price-currency text-[11px] font-bold text-black">
 24 UNITS
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between text-white font-label-technical text-[9px] uppercase tracking-widest">
 <span className="text-white/90 font-bold">NEEDLE DENSITY</span>
 <span className="text-primary-container font-bold">160GSM</span>
 </div>
 </div>
 <div className="p-space-md flex flex-col justify-between flex-1 gap-2">
 <div className="flex flex-col gap-0.5">
 <div className="flex justify-between items-baseline">
 <span className="font-headline-sm text-[18px] uppercase text-black group-hover:text-primary transition-colors">EMBROIDERY</span>
 <span className="font-label-technical text-on-surface-variant uppercase text-[9px]">NEEDLE SPEC</span>
 </div>
 <span className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[10px]">HIGH-TENSILE DIRECT NEEDLE CREST</span>
 </div>
 <div className="flex items-center justify-between pt-2 mt-1">
 <span className="font-label-technical text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">TIER 01 STANDARD</span>
 <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
 </div>
 </div>
</button>


<button type="button" data-home-reveal="" className="category-card group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300  text-left overflow-hidden">
 <div className="relative w-full h-44 bg-[#f2f0f0] overflow-hidden">
 <img className="w-full h-full object-cover object-top grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-700"src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQz28BjXXmK5VyRdXu_oZKeK_-njkhRcuGA8ebtuaHRYDnIm2MjnHqy35sptZcZYcn9sO7ssfeQOJ25jKJsCxBaW1XpfB1qIilW8HSaK6YDx5L0rgeWtYk-vwmHRFHh_lbKoliJlbRwu-0Bep44qKLrOdc9AG_RtywJuM22SLwKjUicM_kyF3hXTrxn_5T2kbSiOeZalbtq8zUPun5AM-Bz4BP_pAFinBjETJGq7kRsdohfzNIvn6j6w"alt="1st Copy Kit and Shorts Ensemble"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-black text-white font-label-mono-bold text-[10px] uppercase tracking-wider">
 <span className="">F</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm font-price-currency text-[11px] font-bold text-black">
 19 SETS
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between text-white font-label-technical text-[9px] uppercase tracking-widest">
 <span className="text-white/90 font-bold">COMPLETE SUITE</span>
 <span className="text-primary-container font-bold">MATCH BOX</span>
 </div>
 </div>
 <div className="p-space-md flex flex-col justify-between flex-1 gap-2">
 <div className="flex flex-col gap-0.5">
 <div className="flex justify-between items-baseline">
 <span className="font-headline-sm text-[18px] uppercase text-black group-hover:text-primary transition-colors">1ST COPY + SHORTS</span>
 <span className="font-label-technical text-on-surface-variant uppercase text-[9px]">KIT COMBO</span>
 </div>
 <span className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[10px]">COMPLETE MATCHDAY UNIFORM SUITE</span>
 </div>
 <div className="flex items-center justify-between pt-2 mt-1">
 <span className="font-label-technical text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">TIER 02 SETS // ₹1,099</span>
 <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
 </div>
 </div>
</button>


<button type="button" data-home-reveal="" className="category-card group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300  text-left overflow-hidden">
 <div className="relative w-full h-44 bg-[#1c1b1c] overflow-hidden">
 <img className="w-full h-full object-cover object-center grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-700"src="https://lh3.googleusercontent.com/aida/AEtjO1VZOmIoI71hdM_2LuOBBfY5T8izkALlYBl5dnoc-mCIRKH2IatfWWn3qBEAslPvpfdCfWhK7yEcX5BxPFdRH5I6VxRUa04KB1j0pVrXB6k5QfR3SI-UZY_XcF08FCUv02cF5rUREv_4i1oosEP5nzBDVW7GJxgc12YYSvjBnPENIbbjwZ7OIjyxcgiKazMO-j7-dJz8YmK69hS7S8csMMBNI8acw987sUyADM7mImEAlErzWUi1GEp0B2E"alt="Master Copy 1:1 Heat-Sealed Chassis"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-black text-white font-label-mono-bold text-[10px] uppercase tracking-wider">
 <span className="">M</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm font-price-currency text-[11px] font-bold text-black">
 22 UNITS
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between text-white font-label-technical text-[9px] uppercase tracking-widest">
 <span className="text-white/90 font-bold">1:1 HEAT SEAL</span>
 <span className="text-primary-container font-bold">THERMO-TRANSFER</span>
 </div>
 </div>
 <div className="p-space-md flex flex-col justify-between flex-1 gap-2">
 <div className="flex flex-col gap-0.5">
 <div className="flex justify-between items-baseline">
 <span className="font-headline-sm text-[18px] uppercase text-black group-hover:text-primary transition-colors">MASTER COPY</span>
 <span className="font-label-technical text-on-surface-variant uppercase text-[9px]">CALIBRATED</span>
 </div>
 <span className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[10px]">1:1 THERMO-TRANSFER ATELIER SPEC</span>
 </div>
 <div className="flex items-center justify-between pt-2 mt-1">
 <span className="font-label-technical text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">TIER 03 ATELIER // ₹1,249</span>
 <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
 </div>
 </div>
</button>


<button type="button" data-home-reveal="" className="category-card group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300  text-left overflow-hidden">
 <div className="relative w-full h-44 bg-[#f2f0f0] overflow-hidden">
 <img className="w-full h-full object-cover object-top grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-700"src="https://luxornix.com/cdn/shop/files/FC_Barcelona_2026-27_away_new_kit.webp?v=1787226653"alt="Player Version Aerodynamic Spec"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-primary-container text-black font-label-mono-bold text-[10px] uppercase tracking-wider font-bold">
 <span className="">P</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm font-price-currency text-[11px] font-bold text-black">
 16 UNITS
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between text-white font-label-technical text-[9px] uppercase tracking-widest">
 <span className="text-white/90 font-bold">110GSM SLIM</span>
 <span className="text-primary-container font-bold">AEROREADY</span>
 </div>
 </div>
 <div className="p-space-md flex flex-col justify-between flex-1 gap-2">
 <div className="flex flex-col gap-0.5">
 <div className="flex justify-between items-baseline">
 <span className="font-headline-sm text-[18px] uppercase text-black group-hover:text-primary transition-colors">PLAYER VERSION</span>
 <span className="font-label-technical text-on-surface-variant uppercase text-[9px]">ELITE ON-PITCH</span>
 </div>
 <span className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[10px]">110GSM AERODYNAMIC MICRO-PERF</span>
 </div>
 <div className="flex items-center justify-between pt-2 mt-1">
 <span className="font-label-technical text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">ELITE SPEC // ₹1,499</span>
 <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
 </div>
 </div>
</button>


<button type="button" data-home-reveal="" className="category-card group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300  text-left overflow-hidden">
 <div className="relative w-full h-44 bg-[#f2f0f0] overflow-hidden">
 <img className="w-full h-full object-cover object-bottom grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-700"src="https://lh3.googleusercontent.com/aida/AEtjO1XnfMuUO14GewY2L994ZYlsaLEWXP16mrV56VRXy8a-iVDo6k6HqEKZvfv3Cd89lQxd7PAnY65Jx8cbNYBjndYyLtm9LJAFHl3GtmEfP5tniqPXmwEYSswBOxQxoxpef_VW3_lpg0hFa6mVu1KmoS_mVOMXyAxy08A0l0QjDJbFTjI4qlASzZCFO8wxMTKVg07co0UsscFvlUNx7Lr415XKr8_VC3MMIxwM9yWgzmGR7MTePAeWOFvi0wbP"alt="Historic Vintage Football Kits Archive"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-black text-white font-label-mono-bold text-[10px] uppercase tracking-wider">
 <span className="">R</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm font-price-currency text-[11px] font-bold text-black">
 31 UNITS
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between text-white font-label-technical text-[9px] uppercase tracking-widest">
 <span className="text-white/90 font-bold">80S &amp; 90S ERA</span>
 <span className="text-primary-container font-bold">HISTORIC RUN</span>
 </div>
 </div>
 <div className="p-space-md flex flex-col justify-between flex-1 gap-2">
 <div className="flex flex-col gap-0.5">
 <div className="flex justify-between items-baseline">
 <span className="font-headline-sm text-[18px] uppercase text-black group-hover:text-primary transition-colors">RETRO ARCHIVE</span>
 <span className="font-label-technical text-on-surface-variant uppercase text-[9px]">VINTAGE</span>
 </div>
 <span className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[10px]">80S &amp; 90S HISTORIC CLASSICS</span>
 </div>
 <div className="flex items-center justify-between pt-2 mt-1">
 <span className="font-label-technical text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">TERRACE LEGACY EDITIONS</span>
 <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
 </div>
 </div>
</button>


<button type="button" data-home-reveal="" className="category-card group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300  text-left overflow-hidden">
 <div className="relative w-full h-44 bg-[#f2f0f0] overflow-hidden">
 <img className="w-full h-full object-cover object-top grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-700"src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScImW5oUQMJmu5eLWKy6GPuUNpPPmVrq-Aw19WjaaN_fWFxU2ntaPxZi2w&amp;s=10"alt="Collar T-Shirts &amp; Tailored Terrace Polos"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-black text-white font-label-mono-bold text-[10px] uppercase tracking-wider">
 <span className="">C</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm font-price-currency text-[11px] font-bold text-black">
 12 UNITS
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between text-white font-label-technical text-[9px] uppercase tracking-widest">
 <span className="text-white/90 font-bold">RIBBED POLO</span>
 <span className="text-primary-container font-bold">CASUAL CUT</span>
 </div>
 </div>
 <div className="p-space-md flex flex-col justify-between flex-1 gap-2">
 <div className="flex flex-col gap-0.5">
 <div className="flex justify-between items-baseline">
 <span className="font-headline-sm text-[18px] uppercase text-black group-hover:text-primary transition-colors">COLLAR T-SHIRTS</span>
 <span className="font-label-technical text-on-surface-variant uppercase text-[9px]">TAILORED</span>
 </div>
 <span className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[10px]">RIBBED POLO &amp; CASUAL CUTS</span>
 </div>
 <div className="flex items-center justify-between pt-2 mt-1">
 <span className="font-label-technical text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">TAILORED STREETWEAR</span>
 <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
 </div>
 </div>
</button>


<button type="button" data-home-reveal="" className="category-card group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300  text-left overflow-hidden">
 <div className="relative w-full h-44 bg-[#ecebff] overflow-hidden flex items-center justify-center p-2">
 <img className="w-full h-full object-contain object-center grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-700"src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-5_bv7NBglxcsLXV-uHxkOwyKgOmJqMHLFHAsiaTAWg2E14Z9hWQaQDsrZkgqoDRJv9HHTlDjusT4IW-sNxfabOrU_1sFH9okP6wAqQVDvIdX9dtah_hTgmQKgxPeaw4-wyuTJ6NKDUMThbAXDsOI6gZBT8Iza1bOwgJdm6K0m1aCnoMHm6w_wCzYp0ZrpcE3W71WqTrPSKYzcP6uJGVLZ6yUpYjfNdOlk9On4MX5cVIuUFP1rn1LJXoYtZ7XtJyC0SY"alt="Authentic Club Performance Shorts"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-black text-white font-label-mono-bold text-[10px] uppercase tracking-wider">
 <span className="">S</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm font-price-currency text-[11px] font-bold text-black">
 28 UNITS
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between text-white font-label-technical text-[9px] uppercase tracking-widest">
 <span className="text-white/90 font-bold">POLY-MESH</span>
 <span className="text-primary-container font-bold">DRAWCORD</span>
 </div>
 </div>
 <div className="p-space-md flex flex-col justify-between flex-1 gap-2">
 <div className="flex flex-col gap-0.5">
 <div className="flex justify-between items-baseline">
 <span className="font-headline-sm text-[18px] uppercase text-black group-hover:text-primary transition-colors">SHORTS</span>
 <span className="font-label-technical text-on-surface-variant uppercase text-[9px]">REPERTOIRE</span>
 </div>
 <span className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[10px]">POLY-MESH PERFORMANCE REPERTOIRE</span>
 </div>
 <div className="flex items-center justify-between pt-2 mt-1">
 <span className="font-label-technical text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">FROM ₹250</span>
 <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
 </div>
 </div>
</button>


<button type="button" data-home-reveal="" className="category-card category-card-wide group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300  text-left overflow-hidden">
 <div className="relative w-full h-44 bg-[#f2f0f0] overflow-hidden">
 <img className="w-full h-full object-cover object-top grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-700"src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW5cTjXiwi8Ccgntot0ycBHjBMw2U3IIIYQz6AzT_BOp-yxGIFCM0ktn1n2WEKMxqtrwj09NNS7lVhqTmjOOPRM77Ucbkp6dUd41O5a0inCr1WupYS1461YLZkoSwqxbCTf3IzPOHUaRyBpvV_pABLpAqQJAmunw00ztGlMjsgmBjLBSAtBHWixXiU3mydoAbnBuDzzMKTSQZntYmvJp1FIZNUd7dNaWNIaJDTJ--zliODbASnn4HS5csYrBXzx3AmsCI"alt="Track Pants &amp; Technical Runners"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-black text-white font-label-mono-bold text-[10px] uppercase tracking-wider">
 <span className="">T</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm font-price-currency text-[11px] font-bold text-black">
 18 UNITS
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between text-white font-label-technical text-[9px] uppercase tracking-widest">
 <span className="text-white/90 font-bold">CRINKLE NYLON</span>
 <span className="text-primary-container font-bold">TEARAWAY</span>
 </div>
 </div>
 <div className="p-space-md flex flex-col justify-between flex-1 gap-2">
 <div className="flex flex-col gap-0.5">
 <div className="flex justify-between items-baseline">
 <span className="font-headline-sm text-[18px] uppercase text-black group-hover:text-primary transition-colors">TRACK PANTS</span>
 <span className="font-label-technical text-on-surface-variant uppercase text-[9px]">RUNNERS</span>
 </div>
 <span className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[10px]">240GSM CRINKLE NYLON &amp; RUNNERS</span>
 </div>
 <div className="flex items-center justify-between pt-2 mt-1">
 <span className="font-label-technical text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">FROM ₹999</span>
 <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
 </div>
 </div>
</button>


</div></div></section><section id="selection"className="w-full px-margin-desktop relative bg-white py-8 md:py-10"><div className="flex flex-col gap-space-2xl relative z-10"><div className="flex flex-col gap-space-md pb-space-lg"><div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm"><div className="flex items-center gap-space-sm flex-wrap"><span className="font-label-technical text-label-technical tracking-widest uppercase bg-black text-white px-2.5 py-1 font-bold">CHAPTER // 02 — THE 26/27 ADVANCE CYCLE</span><span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-container text-on-primary-fixed font-label-mono-bold text-label-mono-bold tracking-wider uppercase"><span className="w-2 h-2 rounded-full bg-secondary inline-block "></span>PRE-ORDER OPEN</span><span className="font-label-technical text-label-technical uppercase text-on-surface-variant tracking-wider hidden sm:inline-block">[SYSTEM: MÜLLER-BROCKMANN 2×2 RASTER]</span></div><div className="flex items-center gap-2 font-label-technical text-label-technical uppercase text-on-surface"></div></div><div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pt-2"><div className="flex flex-col"><h2 data-home-reveal="" className="font-headline-lg text-4xl sm:text-5xl lg:text-6xl uppercase text-black font-extrabold tracking-tighter leading-none">26/27 SEASON KITS&nbsp;</h2><p data-home-reveal="" className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed mt-2 uppercase">A visual communication catalog for football culture collectors, typographers, and pitchside designers. 4 advance specimens mapped on a strict geometric grid.</p></div><div className="flex items-center gap-space-xs font-label-mono-bold text-label-mono-bold uppercase tracking-wider text-black px-3 py-2 bg-surface-container"><span className="material-symbols-outlined text-[18px] text-primary">grid_view</span><span className="">2×2 RASTER CATALOG</span></div></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 bg-[#0a0a0a] p-4 md:p-8">
  {/* Card 1: Barca - Top Left Style (Image left, text right) */}
  <div data-home-reveal="" className="flex flex-col sm:flex-row bg-white h-auto sm:h-[500px] overflow-hidden group relative">
    <div className="w-full sm:w-[70%] h-[300px] sm:h-full">
      <img src="https://luxornix.com/cdn/shop/files/FC_Barcelona_2026-27_away_new_kit.webp?v=1787226653" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="FC Barcelona" />
    </div>
    <div className="w-full sm:w-[30%] p-6 flex flex-col justify-between items-start border-l border-black/10">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between w-full">
          <span className="font-label-technical text-[9px] uppercase tracking-widest text-gray-500">Player Issue // 01</span>
        </div>
        <h3 data-home-reveal="" className="font-serif text-3xl uppercase leading-none tracking-tight">FC Barcelona</h3>
        <span className="font-price-currency text-sm font-bold">₹1,499</span>
      </div>
      <div className="flex flex-col gap-6 w-full mt-8 sm:mt-0">
        <p data-home-reveal="" className="text-[10px] uppercase text-gray-500 leading-relaxed font-label-technical tracking-wide">
          Aerodynamic Taper Fit<br/>Retro Blaugrana Trim<br/>Gold Emblem Spec
        </p>
        <button className="w-full py-3 bg-black text-white font-label-mono-bold text-[10px] uppercase hover:bg-gray-800 transition-colors">Bag +</button>
      </div>
    </div>
  </div>

  {/* Card 2: Real Madrid - Top Right Style (Beige Typography) */}
  <div data-home-reveal="" className="flex flex-col bg-[#EAE8E3] h-[500px] p-8 relative overflow-hidden group justify-between border border-black/5">
    <h3 data-home-reveal="" className="font-serif text-[70px] leading-[0.8] uppercase tracking-tighter text-[#1a1a1a] z-10 w-full text-left">REAL</h3>
    
    <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
       <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScImW5oUQMJmu5eLWKy6GPuUNpPPmVrq-Aw19WjaaN_fWFxU2ntaPxZi2w&s=10" className="h-[280px] w-auto object-cover grayscale mix-blend-multiply" alt="Real Madrid" />
    </div>

    <div className="flex justify-between items-end z-10 w-full">
       <div className="w-1/2 text-[10px] uppercase tracking-widest text-gray-600 font-label-technical leading-relaxed">
         Master Atelier // 02<br/>Bernabéu Nocturne<br/>₹1,249
       </div>
       <button className="py-2.5 px-6 bg-transparent border border-black text-black font-label-mono-bold text-[10px] uppercase hover:bg-black hover:text-white transition-colors">Bag +</button>
    </div>

    <h3 data-home-reveal="" className="font-serif text-[70px] leading-[0.8] uppercase tracking-tighter text-[#1a1a1a] z-10 w-full text-right mt-4">MADRID</h3>
  </div>

  {/* Card 3: Man Utd - Bottom Left Style (Collage / White Space) */}
  <div data-home-reveal="" className="bg-white h-[500px] p-6 relative group overflow-hidden flex flex-col justify-between">
    <div className="flex justify-between w-full h-[45%]">
      <div className="w-[55%] flex gap-2 h-full">
         <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTIj3lPR7KpO1Jdz8v0faQtoTqBQJ2iLzGc0OV8_g-EO1yql1OYf2In2c&s=10" className="w-1/2 h-full object-cover grayscale hover:grayscale-0 transition-colors" style={{objectPosition: 'top'}} alt="Man Utd 1" />
         <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTIj3lPR7KpO1Jdz8v0faQtoTqBQJ2iLzGc0OV8_g-EO1yql1OYf2In2c&s=10" className="w-1/2 h-full object-cover grayscale hover:grayscale-0 transition-colors" style={{objectPosition: 'center'}} alt="Man Utd 2" />
      </div>
      <div className="w-[40%] flex flex-col items-end text-right justify-start gap-2">
         <span className="font-label-technical text-[9px] uppercase tracking-widest text-gray-500">Match Suite // 03</span>
         <h3 data-home-reveal="" className="font-serif text-2xl uppercase leading-none tracking-tight">MANCHESTER<br/>UNITED</h3>
         <span className="font-price-currency text-sm font-bold mt-1">₹1,099</span>
         <button className="mt-4 border-b border-black pb-0.5 text-[10px] font-label-mono-bold uppercase hover:text-gray-500 transition-colors">Add to Bag</button>
      </div>
    </div>
    <div className="w-full h-[50%] flex justify-end">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTIj3lPR7KpO1Jdz8v0faQtoTqBQJ2iLzGc0OV8_g-EO1yql1OYf2In2c&s=10" className="w-[65%] h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" style={{objectPosition: 'bottom'}} alt="Man Utd 3" />
    </div>
  </div>

  {/* Card 4: Arsenal - Bottom Right Style (Vertical Strips) */}
  <div data-home-reveal="" className="h-[500px] relative group overflow-hidden bg-[#111] flex border border-white/10">
    <div className="w-1/4 h-full border-r border-black/40 overflow-hidden relative">
       <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcgIY_d5jPKDVvQA3ygreJG6n5vCghFhix_2PbOjHTeS_Mav1F3AEqHIDNXH33Jffdio80KTlzmRx99kHs6BNGF35WWHAcFmxyc3mmFXoPCgqmXQ0PS7D30QK8zIvP97ZnDFswcnxuZhzHC1ym-oURV9P_bzsmb_Xxxc7U-O7S4QDGn-tLnBL9KRhrgUndoz0UlAO71lwn35L4aNY_Gr0rvMmnxRxyLCLJFInso8SOBViI7x_zNf0BPg" className="absolute top-0 left-0 w-[400%] max-w-none h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100" />
    </div>
    <div className="w-1/4 h-full border-r border-black/40 overflow-hidden relative">
       <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcgIY_d5jPKDVvQA3ygreJG6n5vCghFhix_2PbOjHTeS_Mav1F3AEqHIDNXH33Jffdio80KTlzmRx99kHs6BNGF35WWHAcFmxyc3mmFXoPCgqmXQ0PS7D30QK8zIvP97ZnDFswcnxuZhzHC1ym-oURV9P_bzsmb_Xxxc7U-O7S4QDGn-tLnBL9KRhrgUndoz0UlAO71lwn35L4aNY_Gr0rvMmnxRxyLCLJFInso8SOBViI7x_zNf0BPg" className="absolute top-0 left-[-100%] w-[400%] max-w-none h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-90 group-hover:opacity-100" />
    </div>
    <div className="w-1/4 h-full border-r border-black/40 overflow-hidden relative">
       <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcgIY_d5jPKDVvQA3ygreJG6n5vCghFhix_2PbOjHTeS_Mav1F3AEqHIDNXH33Jffdio80KTlzmRx99kHs6BNGF35WWHAcFmxyc3mmFXoPCgqmXQ0PS7D30QK8zIvP97ZnDFswcnxuZhzHC1ym-oURV9P_bzsmb_Xxxc7U-O7S4QDGn-tLnBL9KRhrgUndoz0UlAO71lwn35L4aNY_Gr0rvMmnxRxyLCLJFInso8SOBViI7x_zNf0BPg" className="absolute top-0 left-[-200%] w-[400%] max-w-none h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-100" />
    </div>
    <div className="w-1/4 h-full overflow-hidden relative">
       <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcgIY_d5jPKDVvQA3ygreJG6n5vCghFhix_2PbOjHTeS_Mav1F3AEqHIDNXH33Jffdio80KTlzmRx99kHs6BNGF35WWHAcFmxyc3mmFXoPCgqmXQ0PS7D30QK8zIvP97ZnDFswcnxuZhzHC1ym-oURV9P_bzsmb_Xxxc7U-O7S4QDGn-tLnBL9KRhrgUndoz0UlAO71lwn35L4aNY_Gr0rvMmnxRxyLCLJFInso8SOBViI7x_zNf0BPg" className="absolute top-0 left-[-300%] w-[400%] max-w-none h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100" />
    </div>
    
    <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
       <div className="flex justify-between w-full">
          <span className="bg-white/90 backdrop-blur-sm text-black px-3 py-1.5 font-label-technical text-[9px] uppercase tracking-widest pointer-events-auto">Prototype // 04</span>
          <span className="bg-white/90 backdrop-blur-sm text-black px-3 py-1.5 font-price-currency text-[10px] font-bold pointer-events-auto">₹1,399</span>
       </div>
       <div className="flex justify-between items-end w-full">
          <h3 data-home-reveal="" className="font-serif text-3xl uppercase text-white drop-shadow-md leading-none tracking-tight">ARSENAL<br/>CANNON</h3>
          <button className="bg-white text-black px-6 py-2.5 font-label-mono-bold text-[10px] uppercase pointer-events-auto hover:bg-gray-200 transition-colors">Bag +</button>
       </div>
    </div>
  </div>
</div><div className="w-full pt-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-white"><div className="flex flex-col gap-1"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary inline-block"></span><span className="font-label-technical text-label-technical tracking-widest text-black uppercase font-bold">[ ADVANCE ARCHIVE // BATCH ALLOCATION VERIFIED ]</span></div><p data-home-reveal="" className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wide">Complete 26/27 European suite · Club &amp; National Prototype runs · Immediate dispatch</p></div><div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md w-full md:w-auto"><button className="font-label-mono-bold text-label-mono-bold text-black uppercase tracking-wider hover:text-tertiary flex items-center justify-center gap-1.5 transition-colors py-2 px-1 text-left"><span className="material-symbols-outlined text-[16px]">file_download</span><span className="">SPEC LOOKBOOK (PDF) ↗</span></button><button className="px-space-lg py-3 bg-black hover:bg-primary-container text-white hover:text-black font-label-mono-bold text-label-mono-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-200"><span className="">EXPLORE 26/27 SPECIMENS</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></button></div></div></div></section>




<Marquee label="From the stands" tone="dark" reverse items={["FROM THE STANDS", "TO THE STREETS", "ONE GAME. EVERY COLOUR."]} />
<section className="w-full px-margin-desktop bg-surface py-8 md:py-10"id="clubs-directory">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop">
<div className="lg:col-span-4 flex flex-col gap-space-md">
<span className="font-label-technical text-label-technical uppercase text-on-surface-variant tracking-widest">CHAPTER DIRECTORY</span>
<h2 data-home-reveal="" className="font-headline-lg text-4xl sm:text-5xl lg:text-6xl uppercase text-black font-extrabold tracking-tighter leading-none">SHOP BY CLUB &amp; COUNTRY</h2>
<p data-home-reveal="" className="font-body-md text-body-md text-on-surface-variant max-w-sm">
 Navigating terrace identities from North London to Milan. Each club roster is cataloged by seasonal milestone, tactical era, and fabric spec.
 </p>
<div className="pt-space-sm">
<div className="p-space-md bg-surface-container flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-mono-bold text-label-mono-bold uppercase text-on-surface">all india DISPATCH</span>
<span className="font-label-technical text-label-technical text-on-surface-variant mt-0.5">ESTIMATED TRANSIT: TWO WEEKS</span>
</div>
<span className="material-symbols-outlined text-on-surface text-[24px]">local_shipping</span>
</div>
</div>
</div>

<style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style><div className="lg:col-span-8 grid grid-rows-2 grid-flow-col auto-cols-[85vw] sm:auto-cols-[280px] md:auto-cols-[320px] lg:auto-cols-[340px] overflow-x-auto gap-space-md pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
<a data-home-reveal="" className="relative p-space-lg rounded-none transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-sm hover:scale-[1.01] w-full h-full snap-start"href="#"style={{"backgroundColor":"rgb(186, 12, 47)","color":"rgb(255, 255, 255)"}}>
<div className="absolute -right-6 -bottom-6 w-36 h-36 opacity-10 pointer-events-none text-white">
<svg fill="currentColor"viewBox="0 0 100 100"><path d="M88 48H60v-4c0-3.3-2.7-6-6-6H46c-3.3 0-6 2.7-6 6v4H12c-4.4 0-8 3.6-8 8s3.6 8 8 8h10c2.2 6.9 8.7 12 16.3 12h23.4c7.6 0 14.1-5.1 16.3-12H88c4.4 0 8-3.6 8-8s-3.6-8-8-8z"/></svg>
</div>
<div className="flex justify-between items-start gap-space-sm relative z-10">
<div className="flex items-center gap-space-md">
<div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 flex items-center justify-center"><img alt="Arsenal FC Official Crest"className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-md"src="https://assets.football-logos.cc/logos/england/700x700/arsenal.cfdaf053.png"/></div>
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm uppercase text-white tracking-wide group-hover:text-primary-container transition-colors">ARSENAL FC</span>
<span className="font-label-technical text-label-technical uppercase tracking-wider text-amber-300 font-bold mt-0.5">LONDON N5 // PREMIER LEAGUE</span>
</div>
</div>
<div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/25 backdrop-blur-sm rounded-full">
<span className="w-2.5 h-2.5 rounded-full inline-block bg-[#BA0C2F] border-white/60"></span>
<span className="w-2.5 h-2.5 rounded-full inline-block bg-white"></span>
<span className="w-2.5 h-2.5 rounded-full inline-block bg-[#063672]"></span>
</div>
</div>
<div className="flex justify-between items-end pt-space-md border-white/20 mt-4 relative z-10">
<div className="flex flex-col">
<span className="font-label-technical text-label-technical uppercase text-white/80">ARCHIVE GRADE // TERRACE</span>
<span className="font-label-mono-bold text-label-mono-bold text-white mt-0.5">14 STYLES CATALOGED</span>
</div>
<div className="w-8 h-8 rounded-full bg-white/15 group-hover:bg-primary-container group-hover:text-on-primary-fixed flex items-center justify-center transition-colors text-white">
<span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
</div>
</div>
</a>

<a data-home-reveal="" className="relative p-space-lg rounded-none transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-sm hover:scale-[1.01] w-full h-full snap-start"href="#"style={{"backgroundColor":"rgb(8, 28, 59)","color":"rgb(255, 255, 255)"}}>
<div className="absolute -right-6 -bottom-6 w-36 h-36 opacity-10 pointer-events-none text-amber-400">
<svg fill="currentColor"viewBox="0 0 100 100"><circle cx="50"cy="50"r="42"/></svg>
</div>
<div className="flex justify-between items-start gap-space-sm relative z-10">
<div className="flex items-center gap-space-md">
<div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 flex items-center justify-center"><img alt="Real Madrid CF Official Crest"className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-md"src="https://assets.football-logos.cc/logos/spain/700x700/real-madrid.81d3d699.png"/></div>
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm uppercase text-white tracking-wide group-hover:text-[#FEBE10] transition-colors">REAL MADRID</span>
<span className="font-label-technical text-label-technical uppercase tracking-wider text-[#FEBE10] font-bold mt-0.5">CHAMARTÍN // LA LIGA</span>
</div>
</div>
<div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-full">
<span className="w-2.5 h-2.5 rounded-full inline-block bg-white"></span>
<span className="w-2.5 h-2.5 rounded-full inline-block bg-[#FEBE10]"></span>
<span className="w-2.5 h-2.5 rounded-full inline-block bg-[#623091]"></span>
</div>
</div>
<div className="flex justify-between items-end pt-space-md border-white/20 mt-4 relative z-10">
<div className="flex flex-col">
<span className="font-label-technical text-label-technical uppercase text-white/80">ARCHIVE GRADE // ATELIER</span>
<span className="font-label-mono-bold text-label-mono-bold text-white mt-0.5">18 STYLES CATALOGED</span>
</div>
<div className="w-8 h-8 rounded-full bg-white/15 group-hover:bg-[#FEBE10] group-hover:text-black flex items-center justify-center transition-colors text-white">
<span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
</div>
</div>
</a>

<a data-home-reveal="" className="relative p-space-lg rounded-none transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-sm hover:scale-[1.01] w-full h-full snap-start"href="#"style={{"backgroundColor":"rgb(0, 51, 102)","color":"rgb(255, 255, 255)"}}>
<div className="absolute inset-0 opacity-20 pointer-events-none flex">
<div className="w-1/2 h-full bg-[#A50044]"></div>
<div className="w-1/2 h-full bg-[#003366]"></div>
</div>
<div className="flex justify-between items-start gap-space-sm relative z-10">
<div className="flex items-center gap-space-md">
<div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 flex items-center justify-center"><img alt="FC Barcelona Official Crest"className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-md"src="https://assets.football-logos.cc/logos/spain/700x700/barcelona.470254ee.png"/></div>
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm uppercase text-white tracking-wide group-hover:text-amber-300 transition-colors">FC BARCELONA</span>
<span className="font-label-technical text-label-technical uppercase tracking-wider text-amber-300 font-bold mt-0.5">LES CORTS // CATALUNYA</span>
</div>
</div>
<div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/25 backdrop-blur-sm rounded-full">
<span className="w-2.5 h-2.5 rounded-full inline-block bg-[#004D98]"></span>
<span className="w-2.5 h-2.5 rounded-full inline-block bg-[#A50044]"></span>
<span className="w-2.5 h-2.5 rounded-full inline-block bg-[#EDBB00]"></span>
</div>
</div>
<div className="flex justify-between items-end pt-space-md border-white/20 mt-4 relative z-10">
<div className="flex flex-col">
<span className="font-label-technical text-label-technical uppercase text-white/80">ARCHIVE GRADE // RETRO BLAUGRANA</span>
<span className="font-label-mono-bold text-label-mono-bold text-white mt-0.5">11 STYLES CATALOGED</span>
</div>
<div className="w-8 h-8 rounded-full bg-white/15 group-hover:bg-[#EDBB00] group-hover:text-black flex items-center justify-center transition-colors text-white">
<span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
</div>
</div>
</a>

<a data-home-reveal="" className="relative p-space-lg rounded-none transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-sm hover:scale-[1.01] w-full h-full snap-start"href="#"style={{"backgroundColor":"rgb(255, 220, 2)","color":"rgb(0, 76, 36)"}}>
<div className="absolute -right-6 -bottom-6 w-36 h-36 opacity-10 pointer-events-none text-[#004C24]">
<svg fill="currentColor"viewBox="0 0 100 100"><polygon points="50 5, 95 50, 50 95, 5 50"/></svg>
</div>
<div className="flex justify-between items-start gap-space-sm relative z-10">
<div className="flex items-center gap-space-md">
<div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 flex items-center justify-center"><img alt="CBF Brazil Official Crest"className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-md"src="https://assets.football-logos.cc/logos/brazil/700x700/brazil-national-team.caceec49.png"/></div>
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm uppercase text-[#003B1A] tracking-wide group-hover:text-[#002776] transition-colors font-extrabold">SELEÇÃO BRAZIL</span>
<span className="font-label-technical text-label-technical uppercase tracking-wider text-[#004C24] font-bold mt-0.5">CBF ARCHIVE // CANARINHO</span>
</div>
</div>
<div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/10 backdrop-blur-sm rounded-full">
<span className="w-2.5 h-2.5 rounded-full inline-block bg-[#009C3B]"></span>
<span className="w-2.5 h-2.5 rounded-full inline-block bg-[#002776]"></span>
<span className="w-2.5 h-2.5 rounded-full inline-block bg-white"></span>
</div>
</div>
<div className="flex justify-between items-end pt-space-md border-[#004C24]/20 mt-4 relative z-10">
<div className="flex flex-col">
<span className="font-label-technical text-label-technical uppercase text-[#004C24]/80 font-bold">ARCHIVE GRADE // 5★ VERIFIED</span>
<span className="font-label-mono-bold text-label-mono-bold text-[#003B1A] font-bold mt-0.5">09 STYLES CATALOGED</span>
</div>
<div className="w-8 h-8 rounded-full bg-[#004C24] group-hover:bg-[#002776] flex items-center justify-center transition-colors text-white">
<span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
</div>
</div>
</a>

<a data-home-reveal="" className="relative p-space-lg rounded-none transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-sm hover:scale-[1.01] w-full h-full snap-start"href="#"style={{"backgroundColor":"rgb(163, 8, 16)","color":"rgb(255, 255, 255)"}}>
<div className="absolute inset-0 opacity-20 pointer-events-none flex">
<div className="w-1/6 h-full bg-black"></div>
<div className="w-1/6 h-full bg-transparent"></div>
<div className="w-1/6 h-full bg-black"></div>
<div className="w-1/6 h-full bg-transparent"></div>
<div className="w-1/6 h-full bg-black"></div>
<div className="w-1/6 h-full bg-transparent"></div>
</div>
<div className="flex justify-between items-start gap-space-sm relative z-10">
<div className="flex items-center gap-space-md">
<div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 flex items-center justify-center"><img alt="AC Milan Official Crest"className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-md"src="https://assets.football-logos.cc/logos/italy/700x700/milan.23ad6174.png"/></div>
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm uppercase text-white tracking-wide group-hover:text-primary-container transition-colors">AC MILAN</span>
<span className="font-label-technical text-label-technical uppercase tracking-wider text-white/90 font-bold mt-0.5">SAN SIRO // SERIE A</span>
</div>
</div>
<div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/30 backdrop-blur-sm rounded-full">
<span className="w-2.5 h-2.5 rounded-full inline-block bg-[#DC052D]"></span>
<span className="w-2.5 h-2.5 rounded-full inline-block bg-black border-white/40"></span>
<span className="w-2.5 h-2.5 rounded-full inline-block bg-white"></span>
</div>
</div>
<div className="flex justify-between items-end pt-space-md border-white/20 mt-4 relative z-10">
<div className="flex flex-col">
<span className="font-label-technical text-label-technical uppercase text-white/80">ARCHIVE GRADE // IL DIAVOLO</span>
<span className="font-label-mono-bold text-label-mono-bold text-white mt-0.5">12 STYLES CATALOGED</span>
</div>
<div className="w-8 h-8 rounded-full bg-black/40 group-hover:bg-white group-hover:text-black flex items-center justify-center transition-colors text-white">
<span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
</div>
</div>
</a>

<a data-home-reveal="" className="relative p-space-lg rounded-none transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-sm hover:scale-[1.01] w-full h-full snap-start"href="#"style={{"backgroundColor":"rgb(197, 15, 31)","color":"rgb(255, 255, 255)"}}>
<div className="absolute -right-6 -bottom-6 w-36 h-36 opacity-10 pointer-events-none text-white">
<svg fill="currentColor"viewBox="0 0 100 100"><circle cx="50"cy="50"r="45"/></svg>
</div>
<div className="flex justify-between items-start gap-space-sm relative z-10">
<div className="flex items-center gap-space-md">
<div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 flex items-center justify-center"><img alt="FC Bayern München Official Crest"className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-md"src="https://assets.football-logos.cc/logos/germany/700x700/bayern-munchen.90b9d770.png"/></div>
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm uppercase text-white tracking-wide group-hover:text-primary-container transition-colors">BAYERN MÜNCHEN</span>
<span className="font-label-technical text-label-technical uppercase tracking-wider text-white/90 font-bold mt-0.5">BAVARIA // DIE ROTEN</span>
</div>
</div>
<div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/25 backdrop-blur-sm rounded-full">
<span className="w-2.5 h-2.5 rounded-full inline-block bg-[#DC052D] border-white/60"></span>
<span className="w-2.5 h-2.5 rounded-full inline-block bg-white"></span>
<span className="w-2.5 h-2.5 rounded-full inline-block bg-[#0066B2]"></span>
</div>
</div>
<div className="flex justify-between items-end pt-space-md border-white/20 mt-4 relative z-10">
<div className="flex flex-col">
<span className="font-label-technical text-label-technical uppercase text-white/80">ARCHIVE GRADE // MIA SAN MIA</span>
<span className="font-label-mono-bold text-label-mono-bold text-white mt-0.5">08 STYLES CATALOGED</span>
</div>
<div className="w-8 h-8 rounded-full bg-white/15 group-hover:bg-white group-hover:text-black flex items-center justify-center transition-colors text-white">
<span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
</div>
</div>
</a></div>
</div>
</section>

<section id="shorts"className="w-full px-margin-desktop relative bg-white py-8 md:py-10"><div className="flex flex-col gap-space-2xl relative z-10"><div className="flex flex-col gap-space-md pb-space-lg"><div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm"><div className="flex items-center gap-2 font-label-technical text-label-technical uppercase text-on-surface"><span className="px-2 py-0.5 hidden lg:inline-block">[SIZES: S · M · L · XL · XXL]</span><span className="px-2 py-0.5 bg-black text-white font-bold">[INR PRICING FROM ₹250]</span></div></div><div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pt-2"><div className="flex flex-col"><h2 data-home-reveal="" className="font-headline-lg text-4xl sm:text-5xl lg:text-6xl uppercase text-black font-extrabold tracking-tighter leading-none">SHORTS //&nbsp;</h2><p data-home-reveal="" className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed mt-2 uppercase">Engineered terrace shorts, authentic club crest embroidery, elasticated drawstrings, and quick-dry breathable jacquards for training and street wear.</p></div><div className="flex items-center gap-space-xs font-label-mono-bold text-label-mono-bold uppercase tracking-wider text-black px-3 py-2 bg-surface-container"><span className="material-symbols-outlined text-[18px] text-primary">straighten</span><span className="">ATHLETIC TAILORED FIT</span></div></div></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
<div data-home-reveal="" className="group relative flex flex-col bg-[#F2EFE9] transition-all duration-300 border-x border-b border-black">
 
 <div className="relative w-full h-[360px] bg-[#f2f0f0] overflow-hidden">
 <img alt="FC Barcelona Home Shorts"className="w-full h-full object-contain object-center p-space-sm grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWUe6Csp4VGmUW7XwrTjggch9VLIyOxDNWoNx1bXB5-Z_SDKDWncJwGYIl786kRZB2fJVWSRqUXFH7mLRYN-QGKxP9mERzCKAFydMo1gNprx7AiecZXyqj83sZfpfYaw5vEhRZZ4IRC4pRUz8mXsCfPeoXR9Yo4uOsPi2h4JOICAteQ5E4tJlsy654f7VKwlN61BtgIpVfHS4eBSZABYDJvU2St9pHE2QutJWXclltRE9JW4qVhegJeoXygpssrASwb2A"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 bg-black/80 backdrop-blur-md text-white font-label-technical uppercase tracking-widest text-[9px]">
 <span className="w-1.5 h-1.5 rounded-full bg-[#004D98] inline-block"></span>
 <span className="">SH-01 // MATCH</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-white/95 backdrop-blur-md font-price-currency text-on-surface text-[12px] font-bold">
 ₹250
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end text-white">
 <span className="font-label-technical tracking-wider text-white/80 text-[9px] uppercase">180GSM DIAMOND MESH</span>
 <span className="font-label-technical text-white/70 text-[9px] uppercase">NAVY</span>
 </div>
 </div>
 
 <div className="p-space-md flex flex-col gap-space-sm bg-white flex-1 justify-between">
 <div className="flex flex-col gap-0.5">
 <h4 className="font-label-mono-bold text-label-mono-bold uppercase text-black tracking-tight">BARCELONA 26/27 HOME</h4>
 <p data-home-reveal="" className="font-body-sm text-on-surface-variant uppercase text-[11px] leading-tight">Heavyweight poly-mesh · Dual zip pockets</p>
 </div>
 <div className="flex flex-col gap-2 pt-2">
 
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-1">
 <button className="w-7 h-7 font-label-technical text-[9px] text-black uppercase transition-colors">S</button>
 <button className="w-7 h-7 bg-black text-white font-label-technical text-[9px] uppercase font-bold">M</button>
 <button className="w-7 h-7 font-label-technical text-[9px] text-black uppercase transition-colors">L</button>
 <button className="w-7 h-7 font-label-technical text-[9px] text-black uppercase transition-colors">XL</button>
 </div>
 <button className="py-1.5 px-2.5 bg-black hover:bg-primary-container text-white hover:text-black font-label-technical text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 transition-colors duration-200">
 <span className="">BAG +</span>
 </button>
 </div>
 </div>
 </div>
</div>


<div data-home-reveal="" className="group relative flex flex-col bg-[#E9EDF2] transition-all duration-300 border-x border-b border-black">
 
 <div className="relative w-full h-[360px] bg-[#f2f0f0] overflow-hidden">
 <img alt="AC Milan Shorts"className="w-full h-full object-contain object-center p-space-sm grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJcF8NkgOP_zecpXsLx-WTozDG1IC1wH9xANMriLFole4sX-Qdd3BVJtTQeNvIZaCCDwLEPTApLOXWURfNN2MHmuhmQuxWQz6PHGG2oyIAYllDs4lfxdYnqSrCj-kyXidwOeGxjh2pCbye709npHZZ4ypBhIQHoV5tO5vr82FBMliyUJiT-X1ePmHLuLT8YiP2NeLEc_EobDpDE_4nsqoypTqZOlZJ6v-HBqliLhxtmEi0cEQ2_kAPrHK03dPbdNP1sxE"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 bg-black/80 backdrop-blur-md text-white font-label-technical uppercase tracking-widest text-[9px]">
 <span className="w-1.5 h-1.5 rounded-full bg-[#DC052D] inline-block"></span>
 <span className="">SH-02 // EMBROIDERY</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-white/95 backdrop-blur-md font-price-currency text-on-surface text-[12px] font-bold">
 ₹250
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end text-white">
 <span className="font-label-technical tracking-wider text-white/80 text-[9px] uppercase">TONAL DRAWCORD MESH</span>
 <span className="font-label-technical text-white/70 text-[9px] uppercase">BLACK / CRIMSON</span>
 </div>
 </div>
 
 <div className="p-space-md flex flex-col gap-space-sm bg-white flex-1 justify-between">
 <div className="flex flex-col gap-0.5">
 <h4 className="font-label-mono-bold text-label-mono-bold uppercase text-black tracking-tight">AC MILAN ROSSONERI</h4>
 <p data-home-reveal="" className="font-body-sm text-on-surface-variant uppercase text-[11px] leading-tight">Side ventilation panels · Milan insignia</p>
 </div>
 <div className="flex flex-col gap-2 pt-2">
 
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-1">
 <button className="w-7 h-7 font-label-technical text-[9px] text-black uppercase transition-colors">S</button>
 <button className="w-7 h-7 bg-black text-white font-label-technical text-[9px] uppercase font-bold">M</button>
 <button className="w-7 h-7 font-label-technical text-[9px] text-black uppercase transition-colors">L</button>
 <button className="w-7 h-7 font-label-technical text-[9px] text-black uppercase transition-colors">XL</button>
 </div>
 <button className="py-1.5 px-2.5 bg-black hover:bg-primary-container text-white hover:text-black font-label-technical text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 transition-colors duration-200">
 <span className="">BAG +</span>
 </button>
 </div>
 </div>
 </div>
</div>


<div data-home-reveal="" className="group relative flex flex-col bg-[#F2E9E9] transition-all duration-300 border-x border-b border-black">
 
 <div className="relative w-full h-[360px] bg-[#f2f0f0] overflow-hidden">
 <img alt="Real Madrid Kit Shorts"className="w-full h-full object-contain object-center p-space-sm grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfATCAn-U1jF8T4xQ6HZiAG4euhOqD2RGthfDO00uOLw9QxHu3PnxxRw25eOU5NcC7D2hwj9SFbo8XArTsXlXHCLDS59z-2lVw1c2hiJjhjvk_zsj2VGsncb2alf4mo11v8PUFiv2dJyblWCt20EcrCf-Vb1RB1d4WVJrWLxr0bz7U57o4EHNakjSdC3Fnt4QznkMvDp4mAEDGPS3N2CkeyfQOWgEnlX2RjJmP3eaX4bp5yCI4y9XeWlhW16VgfD6okZo"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 bg-black/80 backdrop-blur-md text-white font-label-technical uppercase tracking-widest text-[9px]">
 <span className="w-1.5 h-1.5 rounded-full bg-[#FEBE10] inline-block"></span>
 <span className="">SH-03 // ATELIER</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-white/95 backdrop-blur-md font-price-currency text-on-surface text-[12px] font-bold">
 ₹350
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end text-white">
 <span className="font-label-technical tracking-wider text-white/80 text-[9px] uppercase">MICRO-VENTED JACQUARD</span>
 <span className="font-label-technical text-white/70 text-[9px] uppercase">CHALK WHITE</span>
 </div>
 </div>
 
 <div className="p-space-md flex flex-col gap-space-sm bg-white flex-1 justify-between">
 <div className="flex flex-col gap-0.5">
 <h4 className="font-label-mono-bold text-label-mono-bold uppercase text-black tracking-tight">REAL MADRID 24/25</h4>
 <p data-home-reveal="" className="font-body-sm text-on-surface-variant uppercase text-[11px] leading-tight">Tailored athletic cut · Gold piping trim</p>
 </div>
 <div className="flex flex-col gap-2 pt-2">
 
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-1">
 <button className="w-7 h-7 font-label-technical text-[9px] text-black uppercase transition-colors">S</button>
 <button className="w-7 h-7 bg-black text-white font-label-technical text-[9px] uppercase font-bold">M</button>
 <button className="w-7 h-7 font-label-technical text-[9px] text-black uppercase transition-colors">L</button>
 <button className="w-7 h-7 font-label-technical text-[9px] text-black uppercase transition-colors">XL</button>
 </div>
 <button className="py-1.5 px-2.5 bg-black hover:bg-primary-container text-white hover:text-black font-label-technical text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 transition-colors duration-200">
 <span className="">BAG +</span>
 </button>
 </div>
 </div>
 </div>
</div>


<div data-home-reveal="" className="group relative flex flex-col bg-[#E9F2EC] transition-all duration-300 border-x border-b border-black">
 
 <div className="relative w-full h-[360px] bg-[#f2f0f0] overflow-hidden">
 <img alt="Arsenal Training Shorts"className="w-full h-full object-contain object-center p-space-sm grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"src="https://lh3.googleusercontent.com/aida-public/AB6AXuAA0rzA3I4XV4IxBm5yblGo70dr5UcpARxd9b5z5n_zsE7V90EgTY0RRVQt7sqCE13ntY_VM-mba6AgYrgJpSf6KUZIL-ttxzQhtjijUeqKcFDEyZLKmDbr6eRPR4QZH85Tinz_ZDi_uVlzVTICpD1UgWElQ6egU7leyLNMArb2INk2iwklQa94jpg2bEGsoD0MsDYy6mzI_MEnq7yYdmLt4Sr1GMxEpU0wg4ShIBXkBEZ3aAGsszOjC-8PDX6qkd0rzxk"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 bg-black/80 backdrop-blur-md text-white font-label-technical uppercase tracking-widest text-[9px]">
 <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block"></span>
 <span className="">SH-04 // LAB</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-white/95 backdrop-blur-md font-price-currency text-on-surface text-[12px] font-bold">
 ₹299
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end text-white">
 <span className="font-label-technical tracking-wider text-white/80 text-[9px] uppercase">HIGH-FLEX ELASTANE BLEND</span>
 <span className="font-label-technical text-white/70 text-[9px] uppercase">OBSIDIAN</span>
 </div>
 </div>
 
 <div className="p-space-md flex flex-col gap-space-sm bg-white flex-1 justify-between">
 <div className="flex flex-col gap-0.5">
 <h4 className="font-label-mono-bold text-label-mono-bold uppercase text-black tracking-tight">ARSENAL TRAINING SHORTS</h4>
 <p data-home-reveal="" className="font-body-sm text-on-surface-variant uppercase text-[11px] leading-tight">Acid cannon badge · Aerodynamic weave</p>
 </div>
 <div className="flex flex-col gap-2 pt-2">
 
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-1">
 <button className="w-7 h-7 font-label-technical text-[9px] text-black uppercase transition-colors">S</button>
 <button className="w-7 h-7 bg-black text-white font-label-technical text-[9px] uppercase font-bold">M</button>
 <button className="w-7 h-7 font-label-technical text-[9px] text-black uppercase transition-colors">L</button>
 <button className="w-7 h-7 font-label-technical text-[9px] text-black uppercase transition-colors">XL</button>
 </div>
 <button className="py-1.5 px-2.5 bg-black hover:bg-primary-container text-white hover:text-black font-label-technical text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 transition-colors duration-200">
 <span className="">BAG +</span>
 </button>
 </div>
 </div>
 </div>
</div></div><div className="w-full pt-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-white"><div className="flex flex-col gap-1"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary inline-block"></span><span className="font-label-technical text-label-technical tracking-widest text-black uppercase font-bold">[ 4 MATCHDAY SPECIMENS · IMMEDIATE DISPATCH ]</span></div><p data-home-reveal="" className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wide">Diamond mesh &amp; micro-vented jacquards · All India 24H shipping ready</p></div><div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md w-full md:w-auto"><button className="font-label-mono-bold text-label-mono-bold text-black uppercase tracking-wider hover:text-tertiary flex items-center justify-center gap-1.5 transition-colors py-2 px-1 text-left"><span className="material-symbols-outlined text-[16px]">straighten</span><span className="">SIZING GUIDE ↗</span></button><button className="px-space-lg py-3 bg-black hover:bg-primary-container text-white hover:text-black font-label-mono-bold text-label-mono-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-200"><span className="">EXPLORE COMPLETE SHORTS ARCHIVE</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></button></div></div></div></section><section id="track-pants"className="w-full px-margin-desktop relative bg-white py-8 md:py-10"><div className="flex flex-col gap-space-2xl relative z-10"><div className="flex flex-col gap-space-md pb-space-lg"><div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm"><div className="flex items-center gap-space-sm flex-wrap"><span className="font-label-technical text-label-technical tracking-widest uppercase bg-black text-white px-2.5 py-1 font-bold">CHAPTER // 05 — LOWER SILHOUETTES &amp; RUNNERS</span><span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-container text-on-primary-fixed font-label-mono-bold text-label-mono-bold tracking-wider uppercase"><span className="w-2 h-2 rounded-full bg-secondary inline-block "></span>NEW ARRIVALS</span><span className="font-label-technical text-label-technical uppercase text-on-surface-variant tracking-wider hidden sm:inline-block">[SYSTEM: HIGH-TENACITY NYLON &amp; TAILORED FLEECE]</span></div><div className="flex items-center gap-2 font-label-technical text-label-technical uppercase text-on-surface"><span className="px-2 py-0.5 hidden lg:inline-block">[SIZES: S · M · L · XL · XXL]</span><span className="px-2 py-0.5 bg-black text-white font-bold">[INR PRICING FROM ₹999]</span></div></div><div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pt-2"><div className="flex flex-col"><h2 data-home-reveal="" className="font-headline-lg text-4xl sm:text-5xl lg:text-6xl uppercase text-black font-extrabold tracking-tighter leading-none">TRACK PANTS //&nbsp;</h2><p data-home-reveal="" className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed mt-2 uppercase">Engineered terrace track trousers, relaxed tearaway tracksuits, and tapered aeroready training runners calibrated for pitchside movement and city wear.</p></div><div className="flex items-center gap-space-xs font-label-mono-bold text-label-mono-bold uppercase tracking-wider text-black px-3 py-2 bg-surface-container"><span className="material-symbols-outlined text-[18px] text-primary">straighten</span><span className="">ERGONOMIC // TAPER &amp; FLARE FIT</span></div></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 bg-[#0a0a0a] p-4 md:p-8">
  {/* Card 1: Top Left Style */}
  <div data-home-reveal="" className="flex flex-col sm:flex-row bg-white h-auto sm:h-[500px] overflow-hidden group relative">
    <div className="w-full sm:w-[70%] h-[300px] sm:h-full">
      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVj37i2iGMqimQ-2TzAseRMQX1DvwMKNNoYzI_-FOgJz-Bzuo4cwV0i4dzyXpkx1cpAlotsapSLchdKCze2QoIzRi_zUrRKG-qtvtJQU6VcJePydJHa5qgXIKytuvbU-XOZ4tpcg8tW8A09HteRn2paQqMufJysE21DdgYRk1SILjEQXX7XGx0DCmlLHgwzetj_xg83OVaN9_MVaCBQesTwxRJl6KFObBef8yyAwnq2hqdIRphje0yrkcYr7JKw6E_QAs" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Burgundy Track Trousers" />
    </div>
    <div className="w-full sm:w-[30%] p-6 flex flex-col justify-between items-start border-l border-black/10">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between w-full">
          <span className="font-label-technical text-[9px] uppercase tracking-widest text-gray-500">Runner // 01</span>
        </div>
        <h3 data-home-reveal="" className="font-serif text-3xl uppercase leading-none tracking-tight">Burgundy<br/>Pop-Stud</h3>
        <span className="font-price-currency text-sm font-bold">₹1,299</span>
      </div>
      <div className="flex flex-col gap-6 w-full mt-8 sm:mt-0">
        <p data-home-reveal="" className="text-[10px] uppercase text-gray-500 leading-relaxed font-label-technical tracking-wide">
          Chalk White Contrast<br/>Relaxed Loose Hem<br/>Heavyweight Shell
        </p>
        <button className="w-full py-3 bg-black text-white font-label-mono-bold text-[10px] uppercase hover:bg-gray-800 transition-colors">Bag +</button>
      </div>
    </div>
  </div>

  {/* Card 2: Collage Style (Bottom Left) */}
  <div data-home-reveal="" className="bg-white h-[500px] p-6 relative group overflow-hidden flex flex-col justify-between">
    <div className="flex justify-between w-full h-[45%]">
      <div className="w-[55%] flex gap-2 h-full">
         <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuWsZOv5lHiDErY97I-MbR2ZUf1NhP8uqi8vMUxr9nMCc7JiuGTKmICSiJRYsCFv9kkuXZObPzR1vPHYyyhfCkngl7aJGN7k9bkRTnjo5Me5vaXZO2l7HgV824ppP7uK517RObE930Mi4iy932xJRa94OTc3Z00V8d39B-eYRTm0iX-69KNiA3MA9sLKBOLbUZKbPaIZRDIqiypbLW3KfPN10y5toOhA55XUEN3Z7CJYEpzbnhbYVwTi4cdbCEJ5yihvE" className="w-1/2 h-full object-cover grayscale hover:grayscale-0 transition-colors" style={{objectPosition: 'top'}} alt="Slate Grey Track Pants 1" />
         <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuWsZOv5lHiDErY97I-MbR2ZUf1NhP8uqi8vMUxr9nMCc7JiuGTKmICSiJRYsCFv9kkuXZObPzR1vPHYyyhfCkngl7aJGN7k9bkRTnjo5Me5vaXZO2l7HgV824ppP7uK517RObE930Mi4iy932xJRa94OTc3Z00V8d39B-eYRTm0iX-69KNiA3MA9sLKBOLbUZKbPaIZRDIqiypbLW3KfPN10y5toOhA55XUEN3Z7CJYEpzbnhbYVwTi4cdbCEJ5yihvE" className="w-1/2 h-full object-cover grayscale hover:grayscale-0 transition-colors" style={{objectPosition: 'center'}} alt="Slate Grey Track Pants 2" />
      </div>
      <div className="w-[40%] flex flex-col items-end text-right justify-start gap-2">
         <span className="font-label-technical text-[9px] uppercase tracking-widest text-gray-500">Runner // 02</span>
         <h3 data-home-reveal="" className="font-serif text-2xl uppercase leading-none tracking-tight">Slate Grey<br/>Tapered</h3>
         <span className="font-price-currency text-sm font-bold mt-1">₹999</span>
         <button className="mt-4 border-b border-black pb-0.5 text-[10px] font-label-mono-bold uppercase hover:text-gray-500 transition-colors">Add to Bag</button>
      </div>
    </div>
    <div className="w-full h-[50%] flex justify-end">
      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuWsZOv5lHiDErY97I-MbR2ZUf1NhP8uqi8vMUxr9nMCc7JiuGTKmICSiJRYsCFv9kkuXZObPzR1vPHYyyhfCkngl7aJGN7k9bkRTnjo5Me5vaXZO2l7HgV824ppP7uK517RObE930Mi4iy932xJRa94OTc3Z00V8d39B-eYRTm0iX-69KNiA3MA9sLKBOLbUZKbPaIZRDIqiypbLW3KfPN10y5toOhA55XUEN3Z7CJYEpzbnhbYVwTi4cdbCEJ5yihvE" className="w-[65%] h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" style={{objectPosition: 'bottom'}} alt="Slate Grey Track Pants 3" />
    </div>
  </div>
</div><div className="w-full pt-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-white"><div className="flex flex-col gap-1"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary inline-block"></span><span className="font-label-technical text-label-technical tracking-widest text-black uppercase font-bold">[ ARCHIVE RUN: 330 UNITS AVAILABLE ]</span></div><p data-home-reveal="" className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wide">Dispatch within 24h · All-India Express · Engineered pitchside silhouettes</p></div><div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md w-full md:w-auto"><button className="font-label-mono-bold text-label-mono-bold text-black uppercase tracking-wider hover:text-tertiary flex items-center justify-center gap-1.5 transition-colors py-2 px-1 text-left"><span className="material-symbols-outlined text-[16px]">straighten</span><span className="">INSEAM &amp; SIZING ARCHIVE ↗</span></button><button className="px-space-lg py-3 bg-black hover:bg-primary-container text-white hover:text-black font-label-mono-bold text-label-mono-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-200"><span className="">EXPLORE ALL TRACK PANTS</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></button></div></div></div></section><section className="w-full px-margin-desktop py-space-3xl bg-surface-container">
<div className="flex flex-col gap-space-xl">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
<div>
<span className="font-label-technical text-label-technical uppercase text-on-surface-variant tracking-widest block mb-1">TECHNICAL SPECIFICATIONS</span>
<h3 data-home-reveal="" className="font-headline-md text-headline-md uppercase text-on-surface">KNOW YOUR KIT</h3>
</div>
<p data-home-reveal="" className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
 A definitive 4-tier structural guide to yarn counts, badge appliqués, and matchday durability profiles.
 </p>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">

<div data-home-reveal="" className="bg-surface p-space-lg flex flex-col justify-between h-full gap-space-lg">
<div className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<span className="font-label-technical text-label-technical text-on-surface-variant uppercase">SPEC // 01</span>
<span className="font-price-currency text-price-currency text-on-surface">FROM ₹799</span>
</div>
<h4 className="font-title-editorial text-title-editorial uppercase text-on-surface">EMBROIDERY EDITION</h4>
<p data-home-reveal="" className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
 Standard heavyweight 160gsm interlock knit featuring high-tensile thread machine embroidery on crests and manufacturer badges. Engineered for casual daily wear and machine washes.
 </p>
</div>
<div className="flex flex-col gap-1 font-label-technical text-label-technical text-on-surface-variant border-surface-container-high pt-space-sm">
<span className="">FIT: REGULAR TERRACE CUT</span>
<span className="">CREST: REINFORCED SEWN THREAD</span>
<span className="">DURABILITY: OPTIMUM STREETWEAR</span>
</div>
</div>

<div data-home-reveal="" className="bg-surface p-space-lg flex flex-col justify-between h-full gap-space-lg">
<div className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<span className="font-label-technical text-label-technical text-on-surface-variant uppercase">SPEC // 02</span>
<span className="font-price-currency text-price-currency text-on-surface">FROM ₹1,099</span>
</div>
<h4 className="font-title-editorial text-title-editorial uppercase text-on-surface">1ST COPY + SHORTS</h4>
<p data-home-reveal="" className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
 Full matchday uniform package matching tonal club shorts with inner mesh brief and drawstrings. Accurate pattern scales, badge placement, and breathable moisture-wicking jacquard.
 </p>
</div>
<div className="flex flex-col gap-1 font-label-technical text-label-technical text-on-surface-variant border-surface-container-high pt-space-sm">
<span className="">FIT: ATHLETIC STANDARD</span>
<span className="">INCLUDED: SHIRT + SHORTS SET</span>
<span className="">BREATHABILITY: DUAL-KNIT HYDROPHOBIC</span>
</div>
</div>

<div data-home-reveal="" className="bg-surface p-space-lg flex flex-col justify-between h-full gap-space-lg">
<div className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<span className="font-label-technical text-label-technical text-on-surface-variant uppercase">SPEC // 03</span>
<span className="font-price-currency text-price-currency text-on-surface">FROM ₹1,249</span>
</div>
<h4 className="font-title-editorial text-title-editorial uppercase text-on-surface">MASTER COPY ATELIER</h4>
<p data-home-reveal="" className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
 1:1 retail equivalent reproduction featuring silicone heat-bonded sponsor logos, authentic hem authenticators, internal wash ribbons, and calibrated optical color matching.
 </p>
</div>
<div className="flex flex-col gap-1 font-label-technical text-label-technical text-on-surface-variant border-surface-container-high pt-space-sm">
<span className="">FIT: PRE-MATCH REGULAR</span>
<span className="">DETAILS: THERMO-TRANSFER LOGOS</span>
<span className="">ACCURACY: 99.4% ATELIER CALIBRATED</span>
</div>
</div>

<div data-home-reveal="" className="bg-surface p-space-lg flex flex-col justify-between h-full gap-space-lg">
<div className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<span className="font-label-technical text-label-technical text-tertiary uppercase">SPEC // 04 · ELITE</span>
<span className="font-price-currency text-price-currency text-on-surface">FROM ₹1,499</span>
</div>
<h4 className="font-title-editorial text-title-editorial uppercase text-on-surface">PLAYER VERSION</h4>
<p data-home-reveal="" className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
 True athlete on-pitch specification. Ultra-light micro-perforated yarn matrix, heat-pressed laser-cut crests, bonded ergonomic seams, and body-sculpted aerodynamic taper.
 </p>
</div>
<div className="flex flex-col gap-1 font-label-technical text-label-technical text-on-surface-variant border-surface-container-high pt-space-sm">
<span className="">FIT: TAPERED COMPRESSION SLIM</span>
<span className="">CREST: ULTRA-LIGHT HEAT BONDED</span>
<span className="">WEIGHT: 110G TOTAL CHASSIS</span>
</div>
</div>
</div>
</div>
</section><Marquee label="The terrace community" tone="paper" items={["WORN WITH PRIDE", "MADE FOR MATCHDAY", "THE TERRACE BELONGS TO YOU"]} />
<section id="community-reviews"className="w-full px-margin-desktop py-space-3xl relative bg-white"><div className="flex flex-col gap-space-2xl relative z-10"><div className="flex flex-col gap-space-md pb-space-lg"><div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm"><div className="flex items-center gap-space-sm flex-wrap"><span className="font-label-technical text-label-technical tracking-widest uppercase bg-black text-white px-2.5 py-1 font-bold">CHAPTER // 07 — TERRACE VOICE &amp; COMMUNITY</span><span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-container text-on-primary-fixed font-label-mono-bold text-label-mono-bold tracking-wider uppercase"><span className="w-2 h-2 rounded-full bg-secondary inline-block "></span>AUTHENTICATED DISPATCHES</span><span className="font-label-technical text-label-technical uppercase text-on-surface-variant tracking-wider hidden sm:inline-block">[ADMIN MANAGED FEED: REAL MATCHDAY PROOFS &amp; CHATS]</span></div><div className="flex items-center gap-2 font-label-technical text-label-technical uppercase text-on-surface"><button className="flex items-center gap-1.5 px-2.5 py-1 bg-black text-white hover:bg-primary-container hover:text-black font-label-mono-bold text-[10px] tracking-wider transition-colors uppercase"><span className="material-symbols-outlined text-[14px]">add_photo_alternate</span><span className="">[+] ADMIN: POST NEW CHAT SCREENSHOT &amp; REVIEW</span></button></div></div><div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pt-2"><div className="flex flex-col"><h2 data-home-reveal="" className="font-headline-lg text-headline-lg uppercase text-on-surface tracking-tight leading-none">user reviews</h2><p data-home-reveal="" className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed mt-2 uppercase">Direct feedback, unedited customer chats, unboxings, and terrace community dispatches from kit collectors across India. Curated and published live by the KITVERSE dispatch atelier.</p></div><div className="flex items-center gap-space-xs font-label-mono-bold text-label-mono-bold uppercase tracking-wider text-black px-3 py-2 bg-surface-container"><span className="material-symbols-outlined text-[18px] text-primary">verified</span><span className="">VERIFIED PURCHASERS ARCHIVE</span></div></div></div><div className="flex flex-wrap items-center gap-2 pb-space-md"><span className="font-label-technical text-label-technical uppercase text-on-surface-variant mr-1">FILTER FEED:</span><button className="px-2.5 py-1 bg-black text-white font-label-technical text-[10px] uppercase font-bold tracking-wider">ALL DISPATCHES (142)</button><button className="px-2.5 py-1 font-label-technical text-[10px] text-black uppercase transition-colors">WHATSAPP &amp; DM CHATS (86)</button><button className="px-2.5 py-1 font-label-technical text-[10px] text-black uppercase transition-colors">UNBOXING PHOTOS (44)</button><button className="px-2.5 py-1 font-label-technical text-[10px] text-black uppercase transition-colors">PLAYER SPEC REVIEWS (28)</button><button className="px-2.5 py-1 font-label-technical text-[10px] text-black uppercase transition-colors">BOTTOMS &amp; SHORTS (18)</button></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-desktop"><div data-home-reveal="" className="group relative flex flex-col bg-white transition-all duration-300 justify-between"><div className="p-space-md flex flex-col gap-space-sm"><div className="flex items-center justify-between pb-2"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#004D98]"></span><span className="font-label-mono-bold text-[11px] uppercase text-black">@arjun_k // MUMBAI</span></div><span className="px-2 py-0.5 bg-[#f0edee] font-label-technical text-[9px] uppercase tracking-wider text-on-surface-variant">VERIFIED BUYER</span></div><div className="bg-surface-container-low p-3 flex flex-col gap-2 font-body-sm text-[12px]"><div className="flex items-center justify-between text-[10px] text-on-surface-variant border-black/5 pb-1 font-label-technical"><span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-primary">chat</span>WHATSAPP DISPATCH PROOF</span><span className="">YESTERDAY 18:42</span></div><div className="bg-white p-2 rounded border-black/5 flex flex-col gap-1"><p data-home-reveal="" className="text-black font-body-sm leading-snug">"Bro received the Barcelona 26/27 away kit! Quality is actually insane, stitching is 10/10."</p><div className="flex items-center justify-between text-[10px] text-on-surface-variant"><span className="font-label-technical uppercase">REF: KV-2025-04</span><span className="text-[#5d6300] font-bold">✓✓ DELIVERED</span></div></div></div><p data-home-reveal="" className="font-body-sm text-body-sm text-black leading-relaxed mt-1 uppercase">"The fabric weight is unmatched. Master Copy feels identical to retail player chassis."</p></div><div className="p-space-md bg-surface-container-low flex flex-col gap-1"><div className="flex items-center justify-between font-label-technical text-[10px]"><span className="text-primary font-bold tracking-wider">SPECIMEN: FC BARCELONA 26/27 AWAY</span><span className="text-black font-price-currency font-bold">★ 5.0 / 5.0</span></div><span className="font-label-technical text-[9px] text-on-surface-variant uppercase">MASTER ATELIER EDITION · 110GSM CHASSIS</span></div></div><div data-home-reveal="" className="group relative flex flex-col bg-white transition-all duration-300 justify-between"><div className="p-space-md flex flex-col gap-space-sm"><div className="flex items-center justify-between pb-2"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#BA0C2F]"></span><span className="font-label-mono-bold text-[11px] uppercase text-black">@tanmay.terrace // DELHI</span></div><span className="px-2 py-0.5 bg-primary-container text-on-primary-fixed font-label-technical text-[9px] uppercase tracking-wider font-bold">PHOTO ATTACHED</span></div><div className="relative w-full h-44 bg-surface-container overflow-hidden"><img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"alt="User wearing Liverpool kit"src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHM2ycEQFJKMsH-ejKJVEGrUjkrvMjO6WTHS_frV69yFOUUPb6oIAu0BFvGTETkrm_k9YdtMIwIt7EDlnHcW-BQabWy6pHG6HCn-N2wfDk3wjZZEmCobbGF7rG8xsrIPE6IuZTp_hdg67de2mqmaUYTeOFtE6JFjVmUlRVYmsq-qtgdVmgaRQFPLaTKmGGb0Vo-vW79EtERMqE2-9aAX1AcRKAQrMNJ71F1nSpJfrgR2fbZ2ZgB8gw0g"/><div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-white font-label-technical text-[9px] uppercase tracking-widest">UNBOXING LOG // TERRACE DELHI</div></div><p data-home-reveal="" className="font-body-sm text-body-sm text-black leading-relaxed mt-1 uppercase">"Delivered in 48 hours to Delhi. Embroidery crest is direct needle precision, no loose threads. Already ordered the Real Madrid shorts."</p></div><div className="p-space-md bg-surface-container-low flex flex-col gap-1"><div className="flex items-center justify-between font-label-technical text-[10px]"><span className="text-primary font-bold tracking-wider">SPECIMEN: LIVERPOOL FC 23/24 EMBROIDERY</span><span className="text-black font-price-currency font-bold">★ 5.0 / 5.0</span></div><span className="font-label-technical text-[9px] text-on-surface-variant uppercase">HEAVYWEIGHT 160GSM · 48H EXPRESS TRANSIT</span></div></div><div data-home-reveal="" className="group relative flex flex-col bg-white transition-all duration-300 justify-between"><div className="p-space-md flex flex-col gap-space-sm"><div className="flex items-center justify-between pb-2"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#FEBE10]"></span><span className="font-label-mono-bold text-[11px] uppercase text-black">@vikram_r9 // BENGALURU</span></div><span className="px-2 py-0.5 bg-[#f0edee] font-label-technical text-[9px] uppercase tracking-wider text-on-surface-variant">VERIFIED BUYER</span></div><div className="bg-surface-container-low p-3 flex flex-col gap-2 font-body-sm text-[12px]"><div className="flex items-center justify-between text-[10px] text-on-surface-variant border-black/5 pb-1 font-label-technical"><span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-primary">alternate_email</span>INSTAGRAM DM SCREENSHOT</span><span className="">OCT 22</span></div><div className="bg-white p-2 rounded border-black/5 flex flex-col gap-1"><p data-home-reveal="" className="text-black font-body-sm leading-snug">"Yo check this out, fit is crisp! Sizing guide was spot on. Shorts have proper inner lining too."</p><div className="flex items-center justify-between text-[10px] text-on-surface-variant"><span className="font-label-technical uppercase">REF: KV-RM24-709</span><span className="text-[#5d6300] font-bold">REPLIED BY ATELIER</span></div></div></div><p data-home-reveal="" className="font-body-sm text-body-sm text-black leading-relaxed mt-1 uppercase">"First copy + shorts combo is the best deal on the site. True to size, elastic waistband is heavy duty."</p></div><div className="p-space-md bg-surface-container-low flex flex-col gap-1"><div className="flex items-center justify-between font-label-technical text-[10px]"><span className="text-primary font-bold tracking-wider">SPECIMEN: REAL MADRID 24/25 COMBO</span><span className="text-black font-price-currency font-bold">★ 5.0 / 5.0</span></div><span className="font-label-technical text-[9px] text-on-surface-variant uppercase">1ST COPY + SHORTS SUITE · SIZE L</span></div></div><div data-home-reveal="" className="group relative flex flex-col bg-white transition-all duration-300 justify-between"><div className="p-space-md flex flex-col gap-space-sm"><div className="flex items-center justify-between pb-2"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#002776]"></span><span className="font-label-mono-bold text-[11px] uppercase text-black">@dev_footballer // KOLKATA</span></div><span className="px-2 py-0.5 bg-primary-container text-on-primary-fixed font-label-technical text-[9px] uppercase tracking-wider font-bold">ELITE TIER REVIEW</span></div><div className="bg-surface-container-low p-3 flex flex-col gap-2 font-body-sm text-[12px]"><div className="flex items-center justify-between text-[10px] text-on-surface-variant border-black/5 pb-1 font-label-technical"><span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-primary">verified</span>KIT UNWRAP LOG</span><span className="">OCT 19</span></div><div className="bg-white p-2 rounded border-black/5 flex flex-col gap-1"><p data-home-reveal="" className="text-black font-body-sm leading-snug">"The heat-seal rubber transfer on the player version is legit. Breathable side mesh is 1:1 match spec."</p><div className="flex items-center justify-between text-[10px] text-on-surface-variant"><span className="font-label-technical uppercase">REF: KV-ARG-ELITE</span><span className="text-[#5d6300] font-bold">✓ VERIFIED PITCH TEST</span></div></div></div><p data-home-reveal="" className="font-body-sm text-body-sm text-black leading-relaxed mt-1 uppercase">"Player version chassis is featherlight. Wore it for 90 minutes Sunday league, zero chafing. 100% authentic feel."</p></div><div className="p-space-md bg-surface-container-low flex flex-col gap-1"><div className="flex items-center justify-between font-label-technical text-[10px]"><span className="text-primary font-bold tracking-wider">SPECIMEN: ARGENTINA 2024 PLAYER ISSUE</span><span className="text-black font-price-currency font-bold">★ 5.0 / 5.0</span></div><span className="font-label-technical text-[9px] text-on-surface-variant uppercase">110G TOTAL CHASSIS · BONDED SEAMS</span></div></div><div data-home-reveal="" className="group relative flex flex-col bg-white transition-all duration-300 justify-between"><div className="p-space-md flex flex-col gap-space-sm"><div className="flex items-center justify-between pb-2"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-secondary"></span><span className="font-label-mono-bold text-[11px] uppercase text-black">@pranav_fc // PUNE</span></div><span className="px-2 py-0.5 bg-[#f0edee] font-label-technical text-[9px] uppercase tracking-wider text-on-surface-variant">VERIFIED BUYER</span></div><div className="bg-surface-container-low p-3 flex flex-col gap-2 font-body-sm text-[12px]"><div className="flex items-center justify-between text-[10px] text-on-surface-variant border-black/5 pb-1 font-label-technical"><span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-primary">lock</span>ORDER VERIFICATION</span><span className="">OCT 14</span></div><div className="bg-white p-2 rounded border-black/5 flex flex-col gap-1"><p data-home-reveal="" className="text-black font-body-sm leading-snug">"Payment went smooth on Razorpay, order ref KV-8821 arrived today. Will definitely buy next season kits here."</p><div className="flex items-center justify-between text-[10px] text-on-surface-variant"><span className="font-label-technical uppercase">STATUS: SETTLED</span><span className="text-[#5d6300] font-bold">DISPATCH SECURE</span></div></div></div><p data-home-reveal="" className="font-body-sm text-body-sm text-black leading-relaxed mt-1 uppercase">"Customer support answered sizing questions in 5 mins on WhatsApp. Top tier service and packaging."</p></div><div className="p-space-md bg-surface-container-low flex flex-col gap-1"><div className="flex items-center justify-between font-label-technical text-[10px]"><span className="text-primary font-bold tracking-wider">SPECIMEN: ARSENAL 26/27 CANNON</span><span className="text-black font-price-currency font-bold">★ 5.0 / 5.0</span></div><span className="font-label-technical text-[9px] text-on-surface-variant uppercase">LAB PROTOTYPE RUN // DISPATCH ARCHIVE</span></div></div><div data-home-reveal="" className="group relative flex flex-col bg-white transition-all duration-300 justify-between"><div className="p-space-md flex flex-col gap-space-sm"><div className="flex items-center justify-between pb-2"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#DC052D]"></span><span className="font-label-mono-bold text-[11px] uppercase text-black">@kabir_milanista // GOA</span></div><span className="px-2 py-0.5 bg-primary-container text-on-primary-fixed font-label-technical text-[9px] uppercase tracking-wider font-bold">CHASSIS SPEC</span></div><div className="relative w-full h-44 bg-surface-container overflow-hidden"><img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"alt="Track pants specimen unboxed"src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVj37i2iGMqimQ-2TzAseRMQX1DvwMKNNoYzI_-FOgJz-Bzuo4cwV0i4dzyXpkx1cpAlotsapSLchdKCze2QoIzRi_zUrRKG-qtvtJQU6VcJePydJHa5qgXIKytuvbU-XOZ4tpcg8tW8A09HteRn2paQqMufJysE21DdgYRk1SILjEQXX7XGx0DCmlLHgwzetj_xg83OVaN9_MVaCBQesTwxRJl6KFObBef8yyAwnq2hqdIRphje0yrkcYr7JKw6E_QAs"/><div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-white font-label-technical text-[9px] uppercase tracking-widest">RUNNER 01 // CRINKLE NYLON</div></div><p data-home-reveal="" className="font-body-sm text-body-sm text-black leading-relaxed mt-1 uppercase">"AC Milan shorts + tracksuit combo arrived together. Heavyweight 240gsm crinkle nylon is so fire in person."</p></div><div className="p-space-md bg-surface-container-low flex flex-col gap-1"><div className="flex items-center justify-between font-label-technical text-[10px]"><span className="text-primary font-bold tracking-wider">SPECIMEN: BURGUNDY POP-STUD TROUSERS</span><span className="text-black font-price-currency font-bold">★ 5.0 / 5.0</span></div><span className="font-label-technical text-[9px] text-on-surface-variant uppercase">240GSM CRINKLE NYLON · TEARAWAY HEM</span></div></div></div><div className="w-full pt-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-white"><div className="flex flex-col gap-1"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary inline-block"></span><span className="font-label-technical text-label-technical tracking-widest text-black uppercase font-bold">[ SUBMIT YOUR MATCHDAY DISPATCH &amp; GET ₹150 VOUCHER ]</span></div><p data-home-reveal="" className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wide">Share your unboxing via WhatsApp [@KITVERSE.DISPATCH] to get featured in the archive &amp; receive ₹150 off your next specimen.</p></div><div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md w-full md:w-auto"><button className="font-label-mono-bold text-label-mono-bold text-black uppercase tracking-wider hover:text-tertiary flex items-center justify-center gap-1.5 transition-colors py-2 px-1 text-left"><span className="material-symbols-outlined text-[16px]">lock</span><span className="">ADMIN PORTAL: MANAGE REVIEWS [LOCKED]</span></button><button className="px-space-lg py-3 bg-black hover:bg-primary-container text-white hover:text-black font-label-mono-bold text-label-mono-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-200"><span className="">SUBMIT YOUR CHAT PROOF</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></button></div></div></div></section>

<section className="w-full bg-primary-container text-on-primary-fixed relative overflow-hidden px-margin-desktop py-space-3xl"><div className="max-w-6xl mx-auto flex flex-col gap-space-2xl relative z-10 py-space-lg"><div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-sm"><div className="flex items-center gap-space-xs font-label-technical uppercase tracking-widest text-[10px] text-black"><span className="w-2 h-2 rounded-full bg-secondary inline-block "></span><span className="font-bold">ATELIER ORIGIN // MALABAR TERRACE SPEC</span><span className="text-black/60">[10.7867° N, 76.6548° E]</span></div><div className="flex items-center gap-2 font-label-technical uppercase text-[10px] tracking-wider text-black bg-black/10 px-2.5 py-1"><span className="w-2 h-2 rounded-full bg-black inline-block"></span><span className="font-bold">BRED IN KERALA // SERVING FOOTBALL CULTURE NATIONWIDE</span></div></div><div className="flex flex-col items-center text-center gap-space-md my-space-md"><span className="font-label-technical uppercase tracking-widest text-black text-[12px] font-bold px-3 py-1 bg-black/5">PALAKKAD ATELIER // MATCHDAY STATEMENT</span><h2 data-home-reveal="" className="font-headline-lg text-headline-lg uppercase text-black tracking-tight leading-none max-w-5xl font-extrabold">SEE YOU ON MATCHDAY.</h2><p data-home-reveal="" className="font-title-editorial text-title-editorial uppercase tracking-wider text-black font-bold max-w-2xl">DIFFERENT COLOURS. ONE LIFELONG OBSESSION.</p><p data-home-reveal="" className="font-body-md text-body-md text-black/80 max-w-2xl leading-relaxed uppercase">Born in the heart of Palakkad, Kerala — crafted for terraces, pitches, and street corners across the nation. From midnight Sevens floodlights to continental finals, we celebrate the raw pulse of football culture.</p></div><div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-md text-center sm:text-left text-black font-label-technical text-label-technical uppercase tracking-widest text-[10px]"><div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-black inline-block"></span><span className="font-bold">EST. 2024 · PALAKKAD, KERALA</span><span className="">// 100% INDEPENDENT ATELIER</span></div><div className="font-bold">ALL INDIA DISPATCH · AUTHENTIC WEAVE SPECIFICATION</div></div></div></section>
</div></main><footer className="w-full bg-white text-on-surface"><div className="w-full bg-black text-white px-margin-desktop py-2.5 overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-space-sm font-label-technical text-label-technical uppercase tracking-widest text-[9px]"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary inline-block "></span><span className="font-bold text-white">DELHI CENTRAL ATELIER DISPATCH ACTIVE</span></div><div className="flex items-center gap-1.5 text-white/80"><span className="material-symbols-outlined text-[13px] text-primary">lock</span><span className="">SECURE 256-BIT ENCRYPTION</span></div><div className="flex items-center gap-1.5 text-white/80"><span className="material-symbols-outlined text-[13px] text-primary">verified</span><span className="">RAZORPAY VERIFIED GATEWAY</span></div><div className="flex items-center gap-1.5 text-white/80"><span className="material-symbols-outlined text-[13px] text-primary">local_shipping</span><span className="">ALL INDIA EXPRESS TRANSIT: 48-72 HOURS</span></div></div></div><div className="w-full px-margin-desktop py-space-3xl flex flex-col gap-space-2xl"><div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-space-md pb-space-lg"><div className="flex flex-col"><span className="font-display-xl text-display-xl-mobile md:text-display-xl tracking-tight uppercase text-black leading-none select-none">KITVERSE</span><span className="font-label-mono-bold text-label-mono-bold text-black uppercase tracking-wider mt-1">ATELIER RUN: ISSUE 04 // 2026-2027 ARCHIVE</span></div><div className="flex flex-col items-start lg:items-end gap-1.5 max-w-md"><span className="font-label-technical text-label-technical text-on-surface-variant uppercase tracking-widest">EDITORIAL MASTHEAD &amp; PRODUCTION MANIFESTO</span><p data-home-reveal="" className="font-body-sm text-body-sm text-on-surface-variant uppercase text-left lg:text-right leading-relaxed">A high-tension football culture publication, garment registry, and pitchside artifact atelier. Fusing terrace tribalism with European high-fashion publishing standards.</p></div></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl"><div className="flex flex-col gap-space-sm"><div className="pb-1.5"><span className="font-label-mono-bold text-label-mono-bold uppercase text-black tracking-wider">01 // ARCHIVE &amp; SHOP</span></div><ul className="flex flex-col gap-2 font-body-sm text-[12px] text-on-surface-variant uppercase pt-1"><li className="hover:text-black transition-colors"><a href="#selection"className="">All Matchday Jerseys</a></li><li className="hover:text-black transition-colors"><a href="#selection"className="">26/27 Advance Prototypes</a></li><li className="hover:text-black transition-colors"><a href="#shorts"className="">Shorts Repertoire</a></li><li className="hover:text-black transition-colors"><a href="#track-pants"className="">Technical Track Pants</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Collar T-Shirts &amp; Polos</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Vintage &amp; Retro Classics</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Complete Match Boxsets</a></li></ul></div><div className="flex flex-col gap-space-sm"><div className="pb-1.5"><span className="font-label-mono-bold text-label-mono-bold uppercase text-black tracking-wider">02 // CLUB &amp; NATIONAL</span></div><ul className="flex flex-col gap-2 font-body-sm text-[12px] text-on-surface-variant uppercase pt-1"><li className="hover:text-black transition-colors"><a href="#"className="">Premier League Roster</a></li><li className="hover:text-black transition-colors"><a href="#"className="">La Liga Heritage</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Serie A Atelier Runs</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Bundesliga Selections</a></li><li className="hover:text-black transition-colors"><a href="#"className="">International Federations</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Canarinho Brazil Suite</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Pitchside Lookbook 24/25</a></li></ul></div><div className="flex flex-col gap-space-sm"><div className="pb-1.5"><span className="font-label-mono-bold text-label-mono-bold uppercase text-black tracking-wider">03 // SPECIFICATIONS</span></div><ul className="flex flex-col gap-2 font-body-sm text-[12px] text-on-surface-variant uppercase pt-1"><li className="hover:text-black transition-colors"><a href="#"className="">Tier 01: Embroidery 180GSM</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Tier 02: 1st Copy + Shorts</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Tier 03: Master Copy Atelier</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Tier 04: Player Issue 110GSM</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Sizing Matrix &amp; Inseam</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Wash &amp; Heat-Seal Care</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Optical Calibration Notes</a></li></ul></div><div className="flex flex-col gap-space-sm"><div className="pb-1.5"><span className="font-label-mono-bold text-label-mono-bold uppercase text-black tracking-wider">04 // DISPATCH &amp; CARE</span></div><ul className="flex flex-col gap-2 font-body-sm text-[12px] text-on-surface-variant uppercase pt-1"><li className="hover:text-black transition-colors"><a href="#"className="">Order Tracking by KV-Ref</a></li><li className="hover:text-black transition-colors"><a href="#"className="">All-India Delivery Timelines</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Size Exchange Protocol</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Authenticated Stitch Guarantee</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Razorpay Secure Gateway</a></li><li className="hover:text-black transition-colors"><a href="#"className="">WhatsApp Concierge: +91 KV</a></li><li className="hover:text-black transition-colors"><a href="#community-reviews"className="">Community Review Archive</a></li></ul></div><div className="flex flex-col gap-space-sm"><div className="pb-1.5"><span className="font-label-mono-bold text-label-mono-bold uppercase text-black tracking-wider">05 // ATELIER &amp; LEGAL</span></div><ul className="flex flex-col gap-2 font-body-sm text-[12px] text-on-surface-variant uppercase pt-1"><li className="hover:text-black transition-colors"><a href="#"className="">Manifesto Edition 04/500</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Swiss Raster Grid System</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Editorial Masthead</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Terms of Garment Supply</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Authenticity Protocol</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Privacy &amp; Data Dispatch</a></li><li className="hover:text-black transition-colors"><a href="#"className="">Admin Access Portal [Locked]</a></li></ul></div></div><div className="bg-surface p-space-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-space-md"><div className="flex flex-col gap-1"><span className="font-label-mono-bold text-label-mono-bold uppercase text-secondary tracking-wider">MANIFESTO ENTRY #04 // CITRON PITCH SPECIFICATION</span><p data-home-reveal="" className="font-title-editorial text-title-editorial text-on-surface">"The terrace is an open-air runway. Fabric carries heritage, nylon carries glory."</p></div><div className="flex items-center gap-space-md flex-shrink-0"><div className="flex flex-col items-start md:items-end"><span className="font-label-technical text-label-technical uppercase text-on-surface-variant">AUTHENTICATED TERRACE APPAREL</span><span className="font-label-mono-bold text-label-mono-bold text-black">EDITION 04/500 // VERIFIED</span></div><div className="px-3 py-1.5 bg-primary-container text-on-primary-fixed font-label-mono-bold text-label-mono-bold">ISO 9001 SPEC</div></div></div><div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-space-md pt-space-sm"><div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md"><div className="flex flex-col"><svg className="w-36 h-7 text-black fill-current"viewBox="0 0 160 30"><rect height="30"width="3"x="0"y="0"/><rect height="30"width="2"x="6"y="0"/><rect height="30"width="6"x="11"y="0"/><rect height="30"width="2"x="20"y="0"/><rect height="30"width="4"x="25"y="0"/><rect height="30"width="2"x="32"y="0"/><rect height="30"width="5"x="37"y="0"/><rect height="30"width="2"x="45"y="0"/><rect height="30"width="7"x="50"y="0"/><rect height="30"width="3"x="60"y="0"/><rect height="30"width="1"x="66"y="0"/><rect height="30"width="4"x="70"y="0"/><rect height="30"width="6"x="77"y="0"/><rect height="30"width="2"x="86"y="0"/><rect height="30"width="4"x="91"y="0"/><rect height="30"width="6"x="98"y="0"/><rect height="30"width="2"x="107"y="0"/><rect height="30"width="7"x="112"y="0"/><rect height="30"width="2"x="122"y="0"/><rect height="30"width="4"x="127"y="0"/><rect height="30"width="3"x="134"y="0"/><rect height="30"width="6"x="140"y="0"/><rect height="30"width="2"x="149"y="0"/><rect height="30"width="5"x="154"y="0"/></svg><span className="font-label-technical text-label-technical tracking-widest text-black mt-0.5">KV-2026-IND-04 // ATELIER VERIFIED</span></div><div className="font-label-technical text-label-technical uppercase text-on-surface-variant">© 2025-2026 KITVERSE MAGAZINE ARCHIVE. ALL FOOTBALL CULTURE &amp; DESIGN RIGHTS RESERVED.</div></div><div className="flex items-center gap-space-md"><div className="flex items-center gap-space-md font-label-mono-bold text-label-mono-bold uppercase text-on-surface-variant"><a href="#"className="hover:text-black transition-colors">TERMS OF SUPPLY</a><a href="#"className="hover:text-black transition-colors">AUTHENTICITY</a><a href="#"className="hover:text-black transition-colors">SUBSCRIBE</a></div><a href="#"className="w-9 h-9 flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-200 text-black"title="Return to Top"><span className="material-symbols-outlined text-[18px]">arrow_upward</span></a></div></div></div></footer>



















 </div>
 );
}
