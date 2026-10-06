import React from 'react';
import { Link } from 'react-router-dom';
import { teamData } from '../../teamData.js';

export default function ClubsDirectory({ 
  allTeams, 
  clubsCarouselRef, 
  handleMouseDown, 
  handleMouseLeave, 
  handleMouseUp, 
  handleMouseMove, 
  handleClickCapture, 
  scrollClubs 
}) {
  return (
    <section className="w-full px-margin-desktop bg-surface py-8 md:py-10"id="clubs-directory">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop">
<div className="lg:col-span-5 flex flex-col gap-space-md">
<span className="font-label-technical text-label-technical uppercase text-on-surface-variant tracking-widest">CHAPTER DIRECTORY</span>
<h2 data-home-reveal="" className="font-headline-lg text-4xl sm:text-5xl lg:text-6xl uppercase text-black font-extrabold tracking-tighter leading-none">SHOP BY CLUB &amp; COUNTRY</h2>
<p data-home-reveal="" className="font-body-md text-body-md text-on-surface-variant max-w-sm">
 Navigating kitverse identities from North London to Milan. Each club roster is cataloged by seasonal milestone, tactical era, and fabric spec.
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
<div className="hidden lg:flex items-center gap-2 pt-4">
  <button onClick={() => scrollClubs('left')} aria-label="Scroll left" className="w-12 h-12 bg-surface-container border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-colors group">
    <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
  </button>
  <button onClick={() => scrollClubs('right')} aria-label="Scroll right" className="w-12 h-12 bg-surface-container border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-colors group">
    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
  </button>
</div>
</div>

<style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
<div ref={clubsCarouselRef} onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} onClickCapture={handleClickCapture} className="lg:col-span-7 min-w-0 grid grid-rows-2 grid-flow-col auto-cols-[85vw] sm:auto-cols-[280px] md:auto-cols-[320px] lg:auto-cols-[340px] overflow-x-auto gap-space-md pb-4 snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
{allTeams.map((team, i) => {
  const data = teamData[team] || { bg: '#333', color: '#FFF', logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(team)}&background=random`, archive: 'ARCHIVE' };
  return (
    <Link key={i} data-home-reveal="" className="relative p-space-lg rounded-none transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-sm hover:scale-[1.01] w-full h-full snap-start" to={`/shop?team=${encodeURIComponent(team)}`} style={{ backgroundColor: data.bg, color: data.color }}>
      <div className="absolute inset-0 opacity-20 pointer-events-none flex">
        <div className="w-1/2 h-full bg-white/10"></div>
        <div className="w-1/2 h-full bg-transparent"></div>
      </div>
      <div className="flex justify-between items-start gap-space-sm relative z-10">
        <div className="flex items-center gap-space-md">
          <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 flex items-center justify-center">
            <img alt={`${team} Official Crest`} className={`w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-md ${data.whiteLogo ? 'brightness-0 invert' : ''}`} src={data.logo}/>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm uppercase tracking-wide group-hover:opacity-100 transition-colors" style={{ opacity: 0.9 }}>{team}</span>
            <span className="font-label-technical text-label-technical uppercase tracking-wider font-bold mt-0.5" style={{ opacity: 0.7 }}>OFFICIAL MATCHWEAR</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-end pt-space-md border-white/20 mt-4 relative z-10">
        <div className="flex flex-col">
          <span className="font-label-technical text-label-technical uppercase" style={{ opacity: 0.7 }}>ARCHIVE GRADE // {data.archive}</span>
          <span className="font-label-mono-bold text-label-mono-bold mt-0.5" style={{ opacity: 0.9 }}>SHOP COLLECTION</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-black/20 group-hover:bg-white flex items-center justify-center transition-colors">
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform" style={{ color: '#000' }}>arrow_forward</span>
        </div>
      </div>
    </Link>
  );
})}
</div>
</div>
</section>
  );
}