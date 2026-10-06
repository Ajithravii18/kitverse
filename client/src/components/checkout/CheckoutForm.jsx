import React from 'react';
import { useNavigate } from 'react-router-dom';

const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function CheckoutForm({
  authenticated,
  requireLogin,
  error,
  savedAddresses,
  formData,
  setFormData,
  handleUpdate,
  submit
}) {
  const navigate = useNavigate();

  if (!authenticated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-space-xl bg-surface-container-low border border-black/10 text-center">
        <span className="material-symbols-outlined text-display-md mb-space-md text-on-surface-variant">lock</span>
        <h2 className="font-headline-md text-headline-md uppercase text-on-surface mb-space-sm">LOGIN REQUIRED</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-space-lg uppercase">
          SECURE CHECKOUT IS RESTRICTED TO REGISTERED ARCHIVE MEMBERS. PLEASE AUTHENTICATE TO CONTINUE WITH YOUR TRANSACTION.
        </p>
        <div className="flex flex-col sm:flex-row gap-space-sm w-full max-w-sm">
          <button type="submit" form="checkout-form" onClick={requireLogin} className="flex-1 bg-black text-white font-label-mono-bold text-label-mono-bold py-3 uppercase hover:bg-black/80 transition-colors">LOG IN</button>
          <button type="submit" form="checkout-form" onClick={() => navigate('/signup?redirect=/checkout')} className="flex-1 bg-surface border border-black text-black font-label-mono-bold text-label-mono-bold py-3 uppercase hover:bg-surface-container transition-colors">SIGN UP</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-space-lg">
      <div className="flex flex-col gap-1 border-b border-black/10 pb-space-sm">
         <h1 className="font-headline-lg text-headline-lg uppercase text-on-surface mb-2">BILLING DETAILS</h1>
      </div>
      
      {error && (
        <div className="bg-error-container text-on-error-container p-space-md border border-error font-label-mono-bold text-label-mono-bold uppercase">
          ERROR: {error}
        </div>
      )}

      {savedAddresses && savedAddresses.length > 0 && (
        <div className="bg-surface-container-low border border-black/10 p-space-md flex flex-col gap-space-sm">
          <span className="font-label-technical text-label-technical tracking-widest text-on-surface-variant uppercase">USE A SAVED ADDRESS</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            {savedAddresses.map((addr, i) => (
              <button key={i} type="button" onClick={() => setFormData(prev => ({ ...prev, ...addr }))} className="text-left p-space-sm border border-black/10 hover:border-black hover:bg-surface transition-colors bg-surface-container flex flex-col gap-1">
                <strong className="font-label-mono-bold text-label-mono-bold uppercase text-on-surface">{addr.firstName} {addr.lastName}</strong>
                <span className="font-body-sm text-body-sm text-on-surface-variant uppercase">{addr.streetAddress}{addr.apartment ? `, ${addr.apartment}` : ''}, {addr.city}, {addr.state} {addr.postcode}</span>
              </button>
            ))}
            <button type="submit" form="checkout-form" onClick={() => setFormData(prev => ({ ...prev, firstName: '', lastName: '', streetAddress: '', apartment: '', city: '', state: '', postcode: '', phone: '', altPhone: '' }))} className="text-left p-space-sm border border-dashed border-black/20 hover:border-black transition-colors bg-transparent flex items-center justify-center font-label-mono-bold text-label-mono-bold uppercase text-on-surface-variant hover:text-on-surface">
              + ENTER A NEW ADDRESS
            </button>
          </div>
        </div>
      )}

      <form id="checkout-form" onSubmit={submit} className="flex flex-col gap-space-md">
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
           <div className="flex flex-col gap-1">
             <label className="font-label-technical text-label-technical tracking-widest uppercase text-on-surface-variant" htmlFor="checkout-firstName">FIRST NAME *</label>
             <input required type="text" className="w-full bg-surface-container p-3 font-body-md border border-black/10 focus:border-black focus:outline-none transition-colors" id="checkout-firstName" value={formData.firstName} onChange={e => handleUpdate('firstName', e.target.value)} />
           </div>
           <div className="flex flex-col gap-1">
             <label className="font-label-technical text-label-technical tracking-widest uppercase text-on-surface-variant" htmlFor="checkout-lastName">LAST NAME *</label>
             <input required type="text" className="w-full bg-surface-container p-3 font-body-md border border-black/10 focus:border-black focus:outline-none transition-colors" id="checkout-lastName" value={formData.lastName} onChange={e => handleUpdate('lastName', e.target.value)} />
           </div>
         </div>
         
         <div className="flex flex-col gap-1">
           <label className="font-label-technical text-label-technical tracking-widest uppercase text-on-surface-variant" htmlFor="checkout-country">COUNTRY / REGION *</label>
           <input readOnly type="text" className="w-full bg-surface-container-high text-on-surface-variant p-3 font-body-md border border-black/10 cursor-not-allowed uppercase" id="checkout-country" value={formData.country} />
         </div>

         <div className="flex flex-col gap-space-sm">
           <div className="flex flex-col gap-1">
             <label className="font-label-technical text-label-technical tracking-widest uppercase text-on-surface-variant" htmlFor="checkout-streetAddress">STREET ADDRESS *</label>
             <input required type="text" placeholder="HOUSE NUMBER AND STREET NAME" className="w-full bg-surface-container p-3 font-body-md border border-black/10 focus:border-black focus:outline-none transition-colors placeholder:text-on-surface-variant/50 uppercase" id="checkout-streetAddress" value={formData.streetAddress} onChange={e => handleUpdate('streetAddress', e.target.value)} />
           </div>
           <input type="text" placeholder="APARTMENT, SUITE, UNIT, ETC. (OPTIONAL)" className="w-full bg-surface-container p-3 font-body-md border border-black/10 focus:border-black focus:outline-none transition-colors placeholder:text-on-surface-variant/50 uppercase" value={formData.apartment} onChange={e => handleUpdate('apartment', e.target.value)} />
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
           <div className="flex flex-col gap-1">
             <label className="font-label-technical text-label-technical tracking-widest uppercase text-on-surface-variant" htmlFor="checkout-city">TOWN / CITY *</label>
             <input required type="text" className="w-full bg-surface-container p-3 font-body-md border border-black/10 focus:border-black focus:outline-none transition-colors uppercase" id="checkout-city" value={formData.city} onChange={e => handleUpdate('city', e.target.value)} />
           </div>
           <div className="flex flex-col gap-1">
             <label className="font-label-technical text-label-technical tracking-widest uppercase text-on-surface-variant" htmlFor="checkout-state">STATE *</label>
             <select required className="w-full bg-surface-container p-3 font-body-md border border-black/10 focus:border-black focus:outline-none transition-colors uppercase cursor-pointer" id="checkout-state" value={formData.state} onChange={e => handleUpdate('state', e.target.value)}>
               <option value="" disabled>SELECT A STATE</option>
               {indianStates.map(state => <option key={state} value={state}>{state.toUpperCase()}</option>)}
             </select>
           </div>
         </div>

         <div className="flex flex-col gap-1">
           <label className="font-label-technical text-label-technical tracking-widest uppercase text-on-surface-variant" htmlFor="checkout-postcode">POSTCODE / ZIP *</label>
           <input required type="text" className="w-full bg-surface-container p-3 font-body-md border border-black/10 focus:border-black focus:outline-none transition-colors uppercase" id="checkout-postcode" value={formData.postcode} onChange={e => handleUpdate('postcode', e.target.value)} />
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
           <div className="flex flex-col gap-1">
             <label className="font-label-technical text-label-technical tracking-widest uppercase text-on-surface-variant" htmlFor="checkout-phone">PHONE *</label>
             <input required type="tel" className="w-full bg-surface-container p-3 font-body-md border border-black/10 focus:border-black focus:outline-none transition-colors uppercase" id="checkout-phone" value={formData.phone} onChange={e => handleUpdate('phone', e.target.value)} />
           </div>
           <div className="flex flex-col gap-1">
             <label className="font-label-technical text-label-technical tracking-widest uppercase text-on-surface-variant" htmlFor="checkout-altPhone">ALT PHONE (OPTIONAL)</label>
             <input type="tel" className="w-full bg-surface-container p-3 font-body-md border border-black/10 focus:border-black focus:outline-none transition-colors uppercase" id="checkout-altPhone" value={formData.altPhone} onChange={e => handleUpdate('altPhone', e.target.value)} />
           </div>
         </div>

         <div className="flex flex-col gap-1">
           <label className="font-label-technical text-label-technical tracking-widest uppercase text-on-surface-variant" htmlFor="checkout-email">EMAIL ADDRESS *</label>
           <input required type="email" className="w-full bg-surface-container p-3 font-body-md border border-black/10 focus:border-black focus:outline-none transition-colors uppercase" id="checkout-email" value={formData.email} onChange={e => handleUpdate('email', e.target.value)} />
         </div>

         <div className="flex flex-col gap-1">
           <label className="font-label-technical text-label-technical tracking-widest uppercase text-on-surface-variant">ORDER NOTES (OPTIONAL)</label>
           <textarea placeholder="DELIVERY INSTRUCTIONS" rows="4" className="w-full bg-surface-container p-3 font-body-md border border-black/10 focus:border-black focus:outline-none transition-colors placeholder:text-on-surface-variant/50 uppercase resize-y" value={formData.notes} onChange={e => handleUpdate('notes', e.target.value)} />
         </div>
      </form>
    </div>
  );
}
