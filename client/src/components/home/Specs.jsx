import React from 'react';

export default function Specs() {
  const tiers = [
    {
      id: "01",
      name: "Embroidery Edition",
      price: "From ₹1799",
      desc: "Standard heavyweight 160gsm interlock knit featuring high-tensile thread machine embroidery on crests and badges. Engineered for casual daily wear and machine washes.",
      features: ["Heavyweight 160gsm", "Stitched Crests", "Relaxed Fit"]
    },
    {
      id: "02",
      name: "Player Issue",
      price: "From ₹2199",
      desc: "Authentic matchday specification. 130gsm micro-vented poly blend with heat-transferred vinyl crests and sponsors to eliminate skin friction during peak athletic performance.",
      features: ["Ultra-light 130gsm", "Heat-Transfer Crests", "Athletic Tapered Fit"]
    },
    {
      id: "03",
      name: "Retro Heritage",
      price: "From ₹1599",
      desc: "Period-accurate cotton-poly blends recreating the drape and weight of 90s football apparel. Features vintage collar structures and thick embroidered logos.",
      features: ["Period-Accurate Weight", "Vintage Collars", "Classic Boxy Fit"]
    },
    {
      id: "04",
      name: "Training Series",
      price: "From ₹1199",
      desc: "High-flex technical fabrics designed for training drills. Maximum breathability with durable sublimated logos that withstand daily friction and sweat.",
      features: ["High-Flex Fabric", "Sublimated Logos", "Movement Cut"]
    }
  ];

  return (
    <section className="w-full px-6 md:px-12 bg-background py-24 border-b border-border">
      <div className="flex flex-col gap-12 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col max-w-2xl">
            <span className="font-sans text-xs uppercase tracking-widest text-secondary mb-4 block">Technical Specifications</span>
            <h2 data-home-reveal className="font-display text-display-md uppercase text-foreground m-0 leading-none">
              Know Your Kit
            </h2>
          </div>
          <p data-home-reveal className="font-sans text-base text-secondary max-w-md">
            A definitive structural guide to yarn counts, badge appliqués, and matchday durability profiles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {tiers.map(tier => (
            <div data-home-reveal key={tier.id} className="bg-card border border-border p-8 flex flex-col justify-between h-full gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[10px] text-secondary uppercase tracking-widest">Spec // {tier.id}</span>
                  <span className="font-sans text-xs font-bold text-foreground">{tier.price}</span>
                </div>
                <h4 className="font-display text-2xl uppercase text-foreground m-0">{tier.name}</h4>
                <p className="font-sans text-sm text-secondary leading-relaxed">
                  {tier.desc}
                </p>
              </div>
              <ul className="flex flex-col gap-2 pt-6 border-t border-border/50 list-none p-0 m-0">
                {tier.features.map(f => (
                  <li key={f} className="font-sans text-xs uppercase tracking-widest text-secondary flex items-center gap-2">
                    <span className="w-1 h-1 bg-accent rounded-full inline-block"></span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}