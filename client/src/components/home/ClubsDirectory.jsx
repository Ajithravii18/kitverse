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
    <section className="w-full px-6 md:px-12 bg-background py-24 border-b border-border" id="clubs-directory">
      <div className="flex flex-col gap-12 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col max-w-2xl">
            <span className="font-sans text-xs uppercase tracking-widest text-secondary mb-4 block">Chapter Directory // Global Roster</span>
            <h2 data-home-reveal className="font-display text-display-md uppercase text-foreground m-0 leading-none">
              Shop by Club
            </h2>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => scrollClubs('left')} className="w-10 h-10 flex items-center justify-center border border-border bg-card text-foreground hover:bg-foreground hover:text-background transition-colors" aria-label="Scroll left">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button type="button" onClick={() => scrollClubs('right')} className="w-10 h-10 flex items-center justify-center border border-border bg-card text-foreground hover:bg-foreground hover:text-background transition-colors" aria-label="Scroll right">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="relative w-full overflow-hidden mt-4">
          <div 
            className="flex gap-4 overflow-x-auto scroll-smooth custom-scrollbar pb-8 cursor-grab active:cursor-grabbing snap-x snap-mandatory"
            ref={clubsCarouselRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onClickCapture={handleClickCapture}
          >
            {allTeams.map(team => {
              const data = teamData[team];
              if (!data) return null;
              
              return (
                <Link 
                  key={team} 
                  to={`/shop?team=${encodeURIComponent(team)}`} 
                  className="group min-w-[160px] md:min-w-[180px] flex flex-col items-center justify-center gap-4 bg-card border border-border p-6 snap-start hover:border-foreground transition-all duration-300"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img 
                      src={data.logo} 
                      alt={`${team} crest`} 
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <h3 className="font-display text-base md:text-lg uppercase m-0 text-foreground">{team}</h3>
                    <span className="font-sans text-[9px] uppercase tracking-widest text-secondary mt-1">{data.archive}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}