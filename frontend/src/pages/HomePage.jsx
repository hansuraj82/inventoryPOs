// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import UpiQuickPay from './UpiQuickPay';
// import { useAuthStore } from '../store/store';

// export const HomePage = () => {
//   const navigate = useNavigate();

//   const { user } = useAuthStore();
//   const [showUpiModal, setShowUpiModal] = useState(false);


//   return (
//     <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden font-sans">
      
//       {/* BACKGROUND GLOW ACCENTS */}
//       <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
//       <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

//       {/* TOP NAVBAR BRANDING */}
//       <header className="flex justify-between items-center z-10 w-full max-w-7xl mx-auto">
//         <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
//           <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-600/40">
//             D
//           </div>
//           <span className="text-2xl font-black tracking-tight text-white">
//             Dukan<span className="text-indigo-400">bill</span>
//           </span>
//         </div>

//         {user && (
//           <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-full text-xs sm:text-sm">
//             <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
//             <span className="text-slate-300">Welcome, <strong className="text-white">{user?.name.toUpperCase() || 'Partner'}</strong></span>
//           </div>
//         )}
//       </header>

//       {/* HERO & MAIN ACTION CARDS */}
//       <main className="z-10 my-auto py-8 max-w-7xl mx-auto w-full">
//         <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
//           <span className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
//             Retail POS & Billing Suite
//           </span>
//           <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
//             Manage your store with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">speed and precision.</span>
//           </h1>
//           <p className="text-slate-400 text-sm sm:text-base mt-4">
//             Instant GST invoicing, fast barcode billing, inventory tracking, and dynamic UPI QR collections in one place.
//           </p>
//         </div>

//         {/* DYNAMIC GRID - GUEST vs LOGGED IN */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
//           {user ? (
//             /* --- LOGGED IN STATE: DASHBOARD CARD --- */
//             <div
//               onClick={() => navigate('/dashboard')}
//               className="group relative bg-gradient-to-br from-indigo-900/40 to-slate-900/80 border border-indigo-500/30 hover:border-indigo-500 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-600/20 hover:-translate-y-1 flex flex-col justify-between md:col-span-2 lg:col-span-2 min-h-[260px]"
//             >
//               <div>
//                 <div className="w-14 h-14 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition duration-300">
//                   📊
//                 </div>
//                 <h2 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition">Go to Dashboard</h2>
//                 <p className="text-slate-400 text-sm mt-2">
//                   Access live sales metrics, record new bills, check stock alerts, and generate reports.
//                 </p>
//               </div>

//               <div className="flex items-center text-indigo-400 text-sm font-bold mt-6 group-hover:translate-x-2 transition">
//                 Open Workspace &rarr;
//               </div>
//             </div>
//           ) : (
//             /* --- GUEST STATE: LOGIN & REGISTER CARDS --- */
//             <>
//               {/* LOGIN CARD */}
//               <div
//                 onClick={() => navigate('/login')}
//                 className="group bg-slate-900/80 border border-slate-800 hover:border-indigo-500 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between min-h-[260px]"
//               >
//                 <div>
//                   <div className="w-14 h-14 bg-slate-800 text-indigo-400 border border-slate-700 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition duration-300">
//                     🔐
//                   </div>
//                   <h2 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition">Store Login</h2>
//                   <p className="text-slate-400 text-sm mt-2">
//                     Already have an account? Sign in to manage your inventory and generate customer invoices.
//                   </p>
//                 </div>
//                 <div className="flex items-center text-indigo-400 text-sm font-bold mt-6 group-hover:translate-x-2 transition">
//                   Login to Account &rarr;
//                 </div>
//               </div>

//               {/* REGISTER CARD */}
//               <div
//                 onClick={() => navigate('/register')}
//                 className="group bg-slate-900/80 border border-slate-800 hover:border-emerald-500 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between min-h-[260px]"
//               >
//                 <div>
//                   <div className="w-14 h-14 bg-slate-800 text-emerald-400 border border-slate-700 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition duration-300">
//                     ✨
//                   </div>
//                   <h2 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition">Register Shop</h2>
//                   <p className="text-slate-400 text-sm mt-2">
//                     New store owner? Set up your business profile, add products, and start billing in minutes.
//                   </p>
//                 </div>
//                 <div className="flex items-center text-emerald-400 text-sm font-bold mt-6 group-hover:translate-x-2 transition">
//                   Create Free Account &rarr;
//                 </div>
//               </div>
//             </>
//           )}

//           {/* --- ALWAYS VISIBLE: QUICK UPI TERMINAL CARD --- */}
//           <div
//             onClick={() => setShowUpiModal(true)}
//             className="group bg-gradient-to-br from-slate-900/90 to-emerald-950/30 border border-emerald-500/20 hover:border-emerald-500 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between min-h-[260px]"
//           >
//             <div>
//               <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition duration-300">
//                 ⚡
//               </div>
//               <h2 className="text-2xl font-bold text-white group-hover:text-emerald-300 transition">Quick UPI Collect</h2>
//               <p className="text-slate-400 text-sm mt-2">
//                 Generate live, instant UPI payment QR codes without logging in. Saved directly in your browser.
//               </p>
//             </div>
//             <div className="flex items-center text-emerald-400 text-sm font-bold mt-6 group-hover:translate-x-2 transition">
//               Open UPI Terminal &rarr;
//             </div>
//           </div>

//         </div>
//       </main>

//       {/* FOOTER */}
//       <footer className="z-10 text-center text-xs text-slate-500 pt-6 border-t border-slate-900 max-w-7xl mx-auto w-full">
//         &copy; {new Date().getFullYear()} Dukanbill POS Engine. Fast, Reliable & Secure Retail Management.
//       </footer>

//       {/* --- QUICK UPI MODAL POPUP --- */}
//       {showUpiModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
//           <div className="relative w-full max-w-md">
//             <button
//               onClick={() => setShowUpiModal(false)}
//               className="absolute -top-4 -right-4 w-10 h-10 bg-slate-800 text-slate-300 hover:text-white rounded-full flex items-center justify-center text-lg font-bold border border-slate-700 shadow-xl z-20"
//             >
//               ✕
//             </button>
//             <UpiQuickPay />
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };


// export default HomePage;













import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UpiQuickPay from './UpiQuickPay';
import { useAuthStore } from '../store/store';

const ArrowIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="M5 12h14m-6-6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FeatureIcon = ({ type, className = 'h-6 w-6' }) => {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  if (type === 'dashboard') {
    return <svg {...common}><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="5" rx="2" /><rect x="13" y="10" width="8" height="11" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /></svg>;
  }
  if (type === 'login') {
    return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M10 12h8m-3-3 3 3-3 3M6 8v8" /></svg>;
  }
  if (type === 'register') {
    return <svg {...common}><circle cx="9" cy="8" r="4" /><path d="M2.5 21a6.5 6.5 0 0 1 13 0M19 8v6m-3-3h6" /></svg>;
  }
  return <svg {...common}><path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" /></svg>;
};

function ActionCard({ icon, title, description, action, accent = 'indigo', onClick, wide = false }) {
  const accents = {
    indigo: {
      border: 'hover:border-indigo-400/70 focus-visible:ring-indigo-400/60',
      icon: 'bg-indigo-500/10 text-indigo-300 ring-indigo-400/20 group-hover:bg-indigo-500/20',
      title: 'group-hover:text-indigo-200',
      action: 'text-indigo-300',
      glow: 'hover:shadow-indigo-950/50',
    },
    emerald: {
      border: 'hover:border-emerald-400/70 focus-visible:ring-emerald-400/60',
      icon: 'bg-emerald-500/10 text-emerald-300 ring-emerald-400/20 group-hover:bg-emerald-500/20',
      title: 'group-hover:text-emerald-200',
      action: 'text-emerald-300',
      glow: 'hover:shadow-emerald-950/40',
    },
    violet: {
      border: 'hover:border-violet-400/70 focus-visible:ring-violet-400/60',
      icon: 'bg-violet-500/10 text-violet-300 ring-violet-400/20 group-hover:bg-violet-500/20',
      title: 'group-hover:text-violet-200',
      action: 'text-violet-300',
      glow: 'hover:shadow-violet-950/40',
    },
  };

  const color = accents[accent] || accents.indigo;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-[220px] w-full min-w-0 flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/75 p-5 text-left shadow-lg shadow-black/10 outline-none transition duration-200 hover:-translate-y-1 hover:bg-slate-900 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.99] sm:min-h-[240px] sm:rounded-3xl sm:p-7 ${color.border} ${color.glow} ${wide ? 'md:col-span-2 lg:col-span-2' : ''}`}
    >
      <div>
        <span className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ring-1 transition duration-200 group-hover:scale-105 sm:mb-6 sm:h-14 sm:w-14 ${color.icon}`}>
          <FeatureIcon type={icon} className="h-6 w-6 sm:h-7 sm:w-7" />
        </span>
        <h2 className={`text-xl font-bold tracking-tight text-white transition sm:text-2xl ${color.title}`}>{title}</h2>
        <p className="mt-2 max-w-prose break-words text-sm leading-6 text-slate-400 sm:text-[15px]">{description}</p>
      </div>
      <span className={`mt-6 inline-flex items-center gap-2 text-sm font-bold transition group-hover:gap-3 ${color.action}`}>
        {action}
        <ArrowIcon className="h-4 w-4" />
      </span>
    </button>
  );
}

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showUpiModal, setShowUpiModal] = useState(false);

  useEffect(() => {
    document.title = 'Dukanbill | Retail POS & Billing';
  }, []);

  useEffect(() => {
    if (!showUpiModal) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setShowUpiModal(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [showUpiModal]);

  const displayName = user?.name?.trim() || 'Partner';

  return (
    <main className="relative flex min-h-[100svh] w-full flex-col overflow-x-hidden bg-slate-950 px-3 py-4 font-sans text-slate-100 sm:px-6 sm:py-7 lg:px-8">
      {/* Ambient background accents */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 -top-28 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-emerald-600/15 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => navigate('/')} className="group inline-flex min-w-0 items-center gap-2.5 rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950 sm:gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-black text-white shadow-lg shadow-indigo-600/30 transition group-hover:rotate-3 group-hover:scale-105 sm:h-11 sm:w-11">D</span>
          <span className="truncate text-xl font-black tracking-tight text-white sm:text-2xl">
            Dukan<span className="text-indigo-400">bill</span>
          </span>
        </button>

        {user && (
          <div className="flex max-w-full min-w-0 items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs sm:gap-3 sm:px-4 sm:text-sm">
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" />
            <span className="min-w-0 truncate text-slate-300">
              Welcome, <strong className="text-white">{displayName.toUpperCase()}</strong>
            </span>
          </div>
        )}
      </header>

      <section className="relative z-10 mx-auto my-auto w-full max-w-7xl py-10 sm:py-14 lg:py-16">
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-12 lg:mb-14">
          <span className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-300 sm:px-4 sm:text-xs sm:tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Retail POS &amp; Billing Suite
          </span>
          <h1 className="text-balance text-3xl font-black leading-[1.12] tracking-tight text-white min-[390px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Manage your store with{' '}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
              speed and precision.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:mt-5 sm:text-base sm:leading-7 md:text-lg">
            Instant GST invoicing, fast barcode billing, inventory tracking, and dynamic UPI QR collections in one place.
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {user ? (
            <ActionCard
              icon="dashboard"
              title="Go to Dashboard"
              description="Access sales metrics, record new bills, check stock alerts, and generate reports."
              action="Open workspace"
              accent="indigo"
              onClick={() => navigate('/dashboard')}
              wide
            />
          ) : (
            <>
              <ActionCard
                icon="login"
                title="Store Login"
                description="Already have an account? Sign in to manage your inventory and generate customer invoices."
                action="Login to account"
                accent="indigo"
                onClick={() => navigate('/login')}
              />
              <ActionCard
                icon="register"
                title="Register Shop"
                description="Set up your business profile, add products, and start billing in minutes."
                action="Create an account"
                accent="emerald"
                onClick={() => navigate('/register')}
              />
            </>
          )}

          <ActionCard
            icon="upi"
            title="Quick UPI Collect"
            description="Generate UPI payment QR codes without logging in. Your saved details stay in this browser."
            action="Open UPI terminal"
            accent="emerald"
            onClick={() => setShowUpiModal(true)}
          />
        </div>

        <div className="mx-auto mt-7 flex max-w-3xl flex-col items-center justify-center gap-2 text-center sm:mt-9 sm:flex-row sm:gap-3">
          <span className="inline-flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
            <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path d="m5 12 4 4L19 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Designed for everyday retail
          </span>
          <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />
          <span className="text-xs text-slate-500 sm:text-sm">Simple billing. Clear workflows.</span>
        </div>
      </section>

      <footer className="relative z-10 mx-auto w-full max-w-7xl border-t border-slate-900 pt-5 text-center text-[11px] leading-5 text-slate-500 sm:pt-6 sm:text-xs">
        &copy; {new Date().getFullYear()} Dukanbill POS Engine. Fast, reliable &amp; secure retail management.
      </footer>

      {showUpiModal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-black/80 px-2 py-2 backdrop-blur-sm sm:items-center sm:px-4 sm:py-4 lg:px-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowUpiModal(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Quick UPI Collect"
            className="relative my-auto w-full min-w-0 max-w-6xl rounded-2xl outline-none sm:rounded-3xl"
          >
            <button
              type="button"
              onClick={() => setShowUpiModal(false)}
              aria-label="Close UPI payment window"
              className="absolute -right-1 -top-1 z-20 flex h-10 w-10 translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-lg font-bold text-slate-300 shadow-xl transition hover:bg-slate-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 sm:-right-3 sm:-top-3"
            >
              ×
            </button>
            <div className="max-h-[calc(100svh-1rem)] overflow-x-hidden overflow-y-auto rounded-2xl shadow-2xl shadow-black/40 sm:max-h-[calc(100svh-2rem)] sm:rounded-3xl">
              <UpiQuickPay />
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default HomePage;
