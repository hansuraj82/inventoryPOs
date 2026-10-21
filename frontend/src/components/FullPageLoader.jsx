// import React from 'react';

// export default function FullPageLoader() {
//   return (
//     <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center z-50">
//       <div className="flex flex-col items-center gap-6">
//         {/* Animated loader spinner */}
//         <div className="relative w-20 h-20">
//           <div className="absolute inset-0 rounded-full border-4 border-white border-opacity-30"></div>
//           <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-white animate-spin"></div>
//         </div>

//         {/* Loading text with animation */}
//         <div className="text-center">
//           <h2 className="text-white text-2xl font-bold mb-2">Loading</h2>
//           <div className="flex gap-1 justify-center">
//             <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
//             <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
//             <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
//           </div>
//         </div>

//         {/* Loading progress bar */}
//         <div className="w-64 h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
//           <div className="h-full bg-white rounded-full animate-pulse" style={{
//             width: '70%',
//             animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
//           }}></div>
//         </div>
//       </div>
//     </div>
//   );
// }






import React, { useEffect, useState } from 'react';

export default function FullPageLoader() {
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    'Getting your workspace ready',
    'Preparing your business dashboard',
    'Almost there — just a moment',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((current) => (current + 1) % tips.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <main
      className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-8 text-white"
      role="status"
      aria-live="polite"
      aria-label="Loading Dukanbill"
    >
      {/* Animated ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 animate-pulse rounded-full bg-indigo-600/30 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute -bottom-28 -right-20 h-80 w-80 animate-pulse rounded-full bg-fuchsia-600/20 blur-3xl [animation-delay:900ms] sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl sm:h-[30rem] sm:w-[30rem]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.55)_100%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:42px_42px]" />
      </div>

      {/* Main loader card */}
      <section className="relative w-full max-w-md animate-[fadeInUp_600ms_ease-out_both]">
        <div className="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-br from-indigo-400/60 via-fuchsia-400/20 to-cyan-300/40 opacity-80 blur-[1px]" />

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/75 px-6 py-9 text-center shadow-2xl shadow-indigo-950/50 backdrop-blur-2xl sm:px-10 sm:py-11">
          {/* Brand */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
                <path
                  d="m8 10 4 2.3 4-2.3M12 12.3V17"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-lg font-extrabold tracking-tight">
                Dukan<span className="text-indigo-300">bill</span>
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Smart business tools
              </p>
            </div>
          </div>

          {/* Animated orbital loader */}
          <div className="relative mx-auto mb-7 flex h-32 w-32 items-center justify-center sm:h-36 sm:w-36">
            <div className="absolute inset-0 rounded-full border border-indigo-300/20" />
            <div className="absolute inset-2 rounded-full border border-dashed border-white/15 animate-[spin_18s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-indigo-300 border-r-fuchsia-300 animate-spin" />
            <div className="absolute inset-7 rounded-full border border-white/10 animate-[spin_3s_linear_infinite_reverse]" />

            {/* Orbiting dot */}
            <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
              <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
            </div>

            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/20 shadow-[0_0_35px_rgba(99,102,241,0.22)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-8 w-8 text-white"
                aria-hidden="true"
              >
                <path
                  d="M5 5h14v14H5z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 9h8M8 12h5M8 15h8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Loading message */}
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-indigo-300">
            Please wait
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Setting things up<span className="animate-pulse text-indigo-300">...</span>
          </h1>

          <div className="mt-4 flex min-h-6 items-center justify-center gap-2 text-sm text-slate-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
            <p key={tipIndex} className="animate-[fadeIn_350ms_ease-out_both]">
              {tips[tipIndex]}
            </p>
          </div>

          {/* Indeterminate shimmer bar: intentionally not a fake percentage */}
          <div
            className="mt-8 h-1.5 overflow-hidden rounded-full bg-white/10"
            aria-label="Loading in progress"
          >
            <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-indigo-400 via-fuchsia-300 to-cyan-300 shadow-[0_0_16px_rgba(129,140,248,0.55)] animate-[loaderSweep_1.7s_ease-in-out_infinite]" />
          </div>

          <div className="mt-5 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              Initializing
            </span>
            <span>Secure workspace</span>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          Your business, one step closer to simpler.
        </p>
      </section>

      {/* Local keyframes; no external CSS file required */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes loaderSweep {
          0% { transform: translateX(-130%); }
          100% { transform: translateX(280%); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}
