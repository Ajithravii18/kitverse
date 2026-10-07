import React from 'react';
import { Link } from 'react-router-dom';

export default function Shorts() {
  return (
    <section className="w-full px-6 md:px-12 bg-background py-24 md:py-32 border-b border-border">
      <div className="flex flex-col gap-16 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col max-w-2xl">
            <span className="font-sans text-xs uppercase tracking-widest text-secondary mb-4 block">Apparel // Matchday Spec</span>
            <h2 data-home-reveal className="font-display text-display-md uppercase text-foreground m-0 leading-none">
              Performance Shorts
            </h2>
            <p data-home-reveal className="font-sans text-base text-secondary mt-6">
              Engineered with micro-vented jacquard and diamond mesh for peak breathability and unrestricted movement. Available for complete kit assemblies.
            </p>
          </div>
          <Link to="/shop?type=shorts" className="font-sans text-sm uppercase tracking-widest text-foreground hover:text-accent transition-colors border-b border-foreground pb-1 w-fit">
            Explore Shorts Archive
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
          <Link to="/shop?type=shorts" data-home-reveal className="md:col-span-4 group relative bg-card aspect-square md:aspect-[3/4] overflow-hidden flex flex-col justify-end p-8 border border-border">
            <img src="/images/categories/shorts.jpg" alt="Club Shorts" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col gap-2">
              <span className="font-sans text-[10px] uppercase bg-foreground text-background px-2 py-1 w-fit tracking-widest">Edition 01</span>
              <h3 className="font-display text-3xl uppercase text-foreground m-0">Club Edition</h3>
            </div>
          </Link>

          <div className="md:col-span-8 grid grid-rows-2 gap-6">
            <Link to="/shop?type=shorts" data-home-reveal className="group relative bg-bg-dark-2 w-full h-full min-h-[250px] overflow-hidden flex flex-col justify-end p-8">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfATCAn-U1jF8T4xQ6HZiAG4euhOqD2RGthfDO00uOLw9QxHu3PnxxRw25eOU5NcC7D2hwj9SFbo8XArTsXlXHCLDS59z-2lVw1c2hiJjhjvk_zsj2VGsncb2alf4mo11v8PUFiv2dJyblWCt20EcrCf-Vb1RB1d4WVJrWLxr0bz7U57o4EHNakjSdC3Fnt4QznkMvDp4mAEDGPS3N2CkeyfQOWgEnlX2RjJmP3eaX4bp5yCI4y9XeWlhW16VgfD6okZo" alt="Premium Shorts" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent pointer-events-none"></div>
              
              <div className="relative z-10 flex justify-between items-end">
                <div className="flex flex-col gap-2">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-background bg-foreground px-2 py-1 w-fit">Spec</span>
                  <h3 className="font-display text-4xl uppercase text-foreground m-0">Premium Mesh</h3>
                </div>
                <span className="font-sans text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">View →</span>
              </div>
            </Link>

            <Link to="/shop?type=shorts" data-home-reveal className="group relative bg-card border border-border w-full h-full min-h-[250px] overflow-hidden flex flex-col justify-end p-8">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAA0rzA3I4XV4IxBm5yblGo70dr5UcpARxd9b5z5n_zsE7V90EgTY0RRVQt7sqCE13ntY_VM-mba6AgYrgJpSf6KUZIL-ttxzQhtjijUeqKcFDEyZLKmDbr6eRPR4QZH85Tinz_ZDi_uVlzVTICpD1UgWElQ6egU7leyLNMArb2INk2iwklQa94jpg2bEGsoD0MsDYy6mzI_MEnq7yYdmLt4Sr1GMxEpU0wg4ShIBXkBEZ3aAGsszOjC-8PDX6qkd0rzxk" alt="Training Shorts" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none"></div>
              
              <div className="relative z-10 flex justify-between items-end">
                <div className="flex flex-col gap-2">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-background bg-foreground px-2 py-1 w-fit">Training</span>
                  <h3 className="font-display text-4xl uppercase text-foreground m-0">Drill Gear</h3>
                </div>
                <span className="font-sans text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">View →</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
