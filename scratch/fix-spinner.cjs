const fs = require('fs');

let code = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');

const oldReturn = `   if (!cmsLoaded) {
     return (
       <>
         <Navbar />
         <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="animate-pulse w-8 h-8 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
         </div>
       </>
     );
   }

   return (
   <>
     <Navbar />
     <div className="home-page" ref={homeRef}>`;

const newReturn = `   return (
   <>
     <Navbar />
     <div className="home-page" ref={homeRef} style={{ opacity: cmsLoaded ? 1 : 0 }}>`;

code = code.replace(oldReturn, newReturn);

fs.writeFileSync('client/src/pages/Storefront.jsx', code);
