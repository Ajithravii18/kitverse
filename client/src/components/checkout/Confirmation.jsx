import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar.jsx';
import { money } from '../../format.js';

export default function Confirmation({
  confirmation,
  submitting,
  retryPaymentVerification
}) {
  const paymentVerified = ['paid', 'partially_refunded', 'refunded'].includes(confirmation.paymentStatus);
  const paymentReview = confirmation.paymentStatus === 'review_required';
  const verificationPending = confirmation.status === 'verification_pending';
  
  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full px-margin md:px-margin-desktop py-space-xl grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
        <section className="lg:col-span-7 flex flex-col pt-space-lg">
          <div className="flex flex-col gap-2 mb-space-lg">
            <span className={`font-label-technical text-[10px] tracking-widest uppercase inline-block px-2 py-1 self-start ${paymentVerified ? 'bg-primary-container text-on-primary-fixed' : verificationPending ? 'bg-surface-container text-on-surface' : 'bg-surface-container text-on-surface'}`}>
              {paymentReview ? 'PAYMENT RECEIVED / REVIEW REQUIRED' : paymentVerified ? 'PAYMENT VERIFIED' : verificationPending ? 'PAYMENT RECEIVED / VERIFYING' : 'SECURE PAYMENT / CHECKING'}
            </span>
            <div className="w-16 h-16 mt-space-md mb-space-sm rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: paymentVerified ? '#000' : '#888' }}>
              <span className="material-symbols-outlined text-[32px]" style={{ color: paymentVerified ? '#000' : '#888' }}>
                {paymentVerified ? 'check' : 'pending'}
              </span>
            </div>
            <h1 className="font-display-md text-display-md uppercase text-on-surface mt-2 leading-none">
              {paymentReview ? <>PAYMENT<br/>UNDER REVIEW.</> : paymentVerified ? <>PAYMENT VERIFIED</> : verificationPending ? <>PAYMENT<br/>RECEIVED.</> : <>VERIFYING<br/>PAYMENT.</>}
            </h1>
          </div>
          
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md uppercase leading-relaxed mb-space-lg">
            {paymentReview ? 'PAYMENT WAS RECEIVED AFTER YOUR RESERVATION ENDED. DO NOT PAY AGAIN. CONTACT THE STORE WITH YOUR ORDER REFERENCE FOR FULFILLMENT OR REFUND REVIEW.' : paymentVerified
              ? 'YOUR PAYMENT IS CONFIRMED. YOUR ORDER IS NOW IN THE KITVERSE ARCHIVE PROCESSING QUEUE.'
              : verificationPending
                ? 'YOUR PAYMENT PROVIDER RETURNED A SUCCESS RESPONSE, BUT CONFIRMATION IS TAKING LONGER THAN EXPECTED. DO NOT PAY AGAIN; CHECK THE STATUS BELOW.'
                : 'WE ARE SECURELY CONFIRMING YOUR PAYMENT WITH THE GATEWAY. KEEP THIS PAGE OPEN FOR YOUR ORDER RECEIPT.'}
          </p>
          
          {verificationPending && (
            <button type="button" disabled={submitting} onClick={retryPaymentVerification} className="self-start bg-black text-white px-space-lg py-3 font-label-mono-bold text-[12px] tracking-widest uppercase hover:bg-black/80 transition-colors">
              {submitting ? 'CHECKING PAYMENT...' : 'RETRY PAYMENT CHECK'}
            </button>
          )}
          
          {confirmation.error && (
            <p className="mt-space-md font-label-mono-bold text-[12px] text-error bg-error-container p-3 border border-error uppercase">
              {confirmation.error}
            </p>
          )}
        </section>
        
        <aside className="lg:col-span-5 bg-surface-container-low border border-black/10 p-space-xl flex flex-col gap-space-lg">
          <div className="flex justify-between items-end border-b border-black/10 pb-space-sm">
            <span className="font-headline-sm text-[16px] uppercase text-on-surface">YOUR RECEIPT</span>
            <span className="font-label-technical text-label-technical tracking-widest uppercase text-on-surface-variant">KV / 01</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="font-label-technical text-[9px] tracking-widest uppercase text-on-surface-variant">ORDER REFERENCE</span>
            <strong className="font-label-mono-bold text-[16px] uppercase text-on-surface">{confirmation.orderRef}</strong>
          </div>
          
          <dl className="flex flex-col gap-space-sm border-t border-black/5 pt-space-sm">
            <div className="flex justify-between py-2 border-b border-black/5">
              <dt className="font-label-technical text-[10px] tracking-widest uppercase text-on-surface-variant">PAYMENT STATUS</dt>
              <dd className="font-label-mono-bold text-[12px] uppercase text-on-surface">{paymentReview ? 'REVIEW REQUIRED' : paymentVerified ? 'VERIFIED' : verificationPending ? 'CONFIRMATION PENDING' : 'VERIFYING'}</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-black/5">
              <dt className="font-label-technical text-[10px] tracking-widest uppercase text-on-surface-variant">TRANSACTION</dt>
              <dd className="font-label-mono-bold text-[12px] uppercase text-on-surface">{confirmation.paymentId || 'AWAITING GATEWAY RECEIPT'}</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-black/5">
              <dt className="font-label-technical text-[10px] tracking-widest uppercase text-on-surface-variant">ORDER TOTAL</dt>
              <dd className="font-price-currency text-[14px] text-on-surface font-bold">{money(confirmation.total)}</dd>
            </div>
            {paymentVerified && (
              <div className="flex justify-between py-2 border-b border-black/5">
                <dt className="font-label-technical text-[10px] tracking-widest uppercase text-on-surface-variant">CONFIRMED</dt>
                <dd className="font-label-mono-bold text-[12px] uppercase text-on-surface">
                  {new Date(confirmation.confirmedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </dd>
              </div>
            )}
          </dl>
          
          <p className="font-label-technical text-[9px] tracking-widest uppercase text-on-surface-variant leading-relaxed">
            KEEP YOUR ORDER REFERENCE FOR SUPPORT AND ORDER UPDATES.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-space-sm mt-space-sm">
            {paymentVerified && (
              <Link to="/profile" className="flex-1 bg-black text-white py-3 text-center font-label-mono-bold text-[12px] tracking-widest uppercase hover:bg-black/80 transition-colors flex justify-center items-center gap-1">
                VIEW ORDERS <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
              </Link>
            )}
            <Link to="/shop" className="flex-1 bg-surface border border-black py-3 text-center font-label-mono-bold text-[12px] tracking-widest uppercase hover:bg-surface-container transition-colors flex justify-center items-center gap-1 text-on-surface">
              CONTINUE SHOPPING <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
        </aside>
      </main>
      <footer className="w-full px-margin md:px-margin-desktop h-16 border-t border-black/10 flex items-center justify-between bg-surface font-label-technical text-[9px] tracking-widest uppercase text-on-surface-variant mt-auto">
        <span>+ KITVERSE / EST. 2024</span>
        <span>MADE FOR THE LOVE OF THE GAME</span>
      </footer>
    </div>
  );
}
