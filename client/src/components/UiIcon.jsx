import React from 'react';
const paths={
  person:'M20 21v-2a7 7 0 0 0-14 0v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
  shopping_bag:'M5 7h14l1 14H4L5 7 M8 8V6a4 4 0 0 1 8 0v2',
  arrow_forward:'M4 12h16 M14 6l6 6-6 6',
  search:'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14 M15 15l6 6',
  tune:'M4 6h16 M4 12h16 M4 18h16 M8 3v6 M16 9v6 M8 15v6',
  swap_vert:'M8 3v18 M4 7l4-4 4 4 M16 3v18 M12 17l4 4 4-4',
  close:'M6 6l12 12 M18 6 6 18'
};
export default function UiIcon({name,className=''}){return <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={{width:'1em',height:'1em',flexShrink:0,display:'inline-block',verticalAlign:'middle'}} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]}/></svg>;}
