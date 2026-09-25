import React, { useState, useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import SiteHeader from './SiteHeader.jsx';
import SiteFooter from './SiteFooter.jsx';
import Modal from '../Modal.jsx';
import { BagContext } from '../../main.jsx';

export default function CustomerLayout() {
  const { setBagOpen, authCustomer, cartCount } = useContext(BagContext);
  const [menu, setMenu] = useState(false);
  const [info, setInfo] = useState(null);

  return (
    <>
      <div className="announcement">CLUB OR COUNTRY. WEAR YOUR COLOURS.</div>
      <SiteHeader menu={menu} setMenu={setMenu} setBag={setBagOpen} authCustomer={authCustomer} cartCount={cartCount} />
      
      <Outlet />
      
      <SiteFooter setInfo={setInfo} />

      {menu && (
        <Modal label="Main navigation" className="menu-dialog" onClose={() => setMenu(false)}>
          <Link to="/" className="logo" onClick={() => setMenu(false)}>KITVERSE</Link>
          <p className="eyebrow">FIND YOUR COLOURS</p>
          <nav className="menu-links" aria-label="Mobile navigation">
            <Link to="/shop" onClick={() => setMenu(false)}>All Jerseys<span>↗</span></Link>
            <Link to="/collections/club-teams" onClick={() => setMenu(false)}>Club Teams<span>↗</span></Link>
            <Link to="/collections/national-teams" onClick={() => setMenu(false)}>National Teams<span>↗</span></Link>
            <Link to="/#qualities" onClick={() => setMenu(false)}>Quality guide<span>↗</span></Link>
          </nav>
        </Modal>
      )}

      {info && (
        <Modal label={info} onClose={() => setInfo(null)}>
          <h2>{info}</h2>
          <p>{info === 'Sizing Guide' ? 'Measure a well-fitting shirt across the chest and from shoulder to hem.' : 'KITVERSE is a football jersey storefront in development.'}</p>
        </Modal>
      )}
    </>
  );
}
