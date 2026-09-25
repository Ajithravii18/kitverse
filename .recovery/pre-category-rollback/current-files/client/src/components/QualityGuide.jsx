import React from 'react';

export default function QualityGuide() {
  return (
    <section id="qualities" className="quality">
      <div className="quality-intro">
        <div className="eyebrow">KNOW YOUR KIT</div>
        <h2>The details<br/>make the difference.</h2>
        <p>Each jersey is listed in the quality we have in stock. Check its available sizes before adding it to your bag.</p>
      </div>
      <div className="quality-grid">
        {['Stitched details.', 'A coordinated jersey-and-shorts set.', 'Check each listing for fabric.', 'A closer-fitting style.'].map((text, i) => (
          <article key={i} className="reveal" style={{ '--i': i }}>
            <span>0{i + 1} / {['THE DETAIL','THE FULL KIT','THE FINISH','THE FIT'][i]}</span>
            <h3>{['Embroidery', 'First copy + shorts', 'Master copy', 'Player version'][i]}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
