const fs = require('fs');
let code = fs.readFileSync('client/src/components/ProductDetailModal.jsx', 'utf8');

// Replace the top structure
const oldStart = `<div className="w-full max-w-[1200px] bg-background text-foreground flex flex-col md:flex-row overflow-hidden relative">
      <div className="detail-modal-utility"><span>KITVERSE / PRODUCT DOSSIER</span><span>{demo ? 'PREVIEW EDITION' : 'LIVE ARCHIVE'}</span></div>
      <div className="detail-layout">
        <div className="w-full md:w-1/2 relative bg-card flex flex-col border-r border-border min-h-[400px]">`;

const newStart = `<div className="w-full max-w-[1200px] bg-background text-foreground flex flex-col overflow-hidden relative">
      <div className="w-full flex justify-between items-center py-4 px-6 border-b border-border text-xs font-bold uppercase tracking-widest sticky top-0 bg-background z-10 text-foreground"><span>KITVERSE / PRODUCT DOSSIER</span><span className="text-accent">{demo ? 'PREVIEW EDITION' : 'LIVE ARCHIVE'}</span></div>
      <div className="flex flex-col md:flex-row w-full h-full max-h-[85vh] overflow-y-auto">
        <div className="w-full md:w-1/2 relative bg-card flex flex-col border-b md:border-b-0 md:border-r border-border min-h-[400px]">`;

code = code.replace(oldStart, newStart);

const oldRightCol = `<div className="flex-1 flex flex-col p-6 md:p-12 overflow-y-auto">`;
const newRightCol = `<div className="w-full md:w-1/2 flex flex-col p-6 md:p-12">`;
code = code.replace(oldRightCol, newRightCol);

fs.writeFileSync('client/src/components/ProductDetailModal.jsx', code);
console.log('Fixed ProductDetailModal layout');
