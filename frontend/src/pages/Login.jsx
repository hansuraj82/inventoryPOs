// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useAuthStore } from '../store/store';

// export default function Login() {
//   const navigate = useNavigate();
//   const { login, isLoading, error } = useAuthStore();
//   const [credentials, setCredentials] = useState({
//     email: '',
//     password: ''
//   });

//   React.useEffect(() => {
//     document.title = 'Login - Dukanbill';
//   }, []);
//   const [showErrorModal, setShowErrorModal] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!credentials.email || !credentials.password) {
//       setErrorMessage('Please fill in all fields');
//       setShowErrorModal(true);
//       return;
//     }

//     const success = await login(credentials.email, credentials.password);
//     if (success) {
//       toast.success('Login successful!');
//       navigate('/dashboard');
//     } else {
//       setErrorMessage(error || 'Login failed. Please check your credentials.');
//       setShowErrorModal(true);
//     }
//   };

//   const closeErrorModal = () => {
//     setShowErrorModal(false);
//     setErrorMessage('');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-3 md:px-4 py-8">
//       <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 max-w-md w-full">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2 text-center"> <span className="text-indigo-500">Dukanbill</span>
//               </h1>
//         <p className="text-gray-600 text-sm md:text-base text-center mb-6 md:mb-8">Login to your account</p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={credentials.email}
//               onChange={handleChange}
//               className="input-field text-xs md:text-sm"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               value={credentials.password}
//               onChange={handleChange}
//               className="input-field text-xs md:text-sm"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full btn-primary disabled:opacity-50 text-sm md:text-base py-2 md:py-3"
//           >
//             {isLoading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <p className="text-center text-gray-600 text-xs md:text-sm mt-6">
//           Don't have an account?{' '}
//           <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">
//             Register
//           </Link>
//         </p>
//       </div>

//       {/* Error Modal */}
//       {showErrorModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
//           <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full animate-in">
//             {/* Error Header */}
//             <div className="flex items-center justify-center mb-4">
//               <div className="bg-red-100 rounded-full p-3">
//                 <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//             </div>

//             {/* Error Title */}
//             <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
//               Login Failed
//             </h2>

//             {/* Error Message */}
//             <p className="text-gray-600 text-center mb-6 text-sm md:text-base">
//               {errorMessage}
//             </p>

//             {/* Action Buttons */}
//             <div className="flex gap-3">
//               <button
//                 onClick={closeErrorModal}
//                 className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
//               >
//                 Try Again
//               </button>
//             </div>

//             {/* Help Text */}
//             <p className="text-center text-gray-500 text-xs mt-4">
//               Need help?{' '}
//               <a href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold">
//                 Contact support
//               </a>
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }













import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/store';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    document.title = 'Login - Dukanbill';
  }, []);

  useEffect(() => {
    if (!showErrorModal) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeErrorModal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showErrorModal]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = credentials.email.trim();

    if (!email || !credentials.password) {
      setErrorMessage('Please enter both your email address and password.');
      setShowErrorModal(true);
      return;
    }

    try {
      const success = await login(email, credentials.password);

      if (success) {
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        setErrorMessage(error || 'Login failed. Please check your email and password, then try again.');
        setShowErrorModal(true);
      }
    } catch {
      setErrorMessage('We could not sign you in right now. Please check your connection and try again.');
      setShowErrorModal(true);
    }
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-slate-950 px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
      {/* Soft background accents */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/70 via-slate-950 to-slate-950" />
      </div>

      <section className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/30 sm:rounded-3xl lg:grid-cols-[0.95fr_1.05fr]">
        {/* Desktop brand panel */}
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-9 text-white lg:flex xl:p-12">
          <div aria-hidden="true" className="absolute -right-16 top-24 h-56 w-56 rounded-full border-[36px] border-white/10" />
          <div aria-hidden="true" className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full border-[42px] border-white/10" />

          <div className="relative">
            <div className="mb-12 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-black text-indigo-700 shadow-lg">
                D
              </div>
              <span className="text-xl font-bold tracking-tight">Dukanbill</span>
            </div>

            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-indigo-100">
              Simple. Smart. Reliable.
            </p>
            <h2 className="max-w-sm text-3xl font-bold leading-tight xl:text-4xl">
              Your business, ready for the next sale.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-indigo-100 xl:text-base">
              Sign in to manage your shop and continue where you left off.
            </p>
          </div>

          <div className="relative mt-12 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-100">
                ✓
              </span>
              Built for your everyday business
            </div>
            <p className="pl-9 text-sm leading-6 text-indigo-100">
              A clear, focused workspace to help you get back to work quickly.
            </p>
          </div>
        </aside>

        {/* Login form */}
        <div className="flex min-w-0 items-center justify-center px-5 py-7 sm:px-9 sm:py-10 lg:px-10 xl:px-14 xl:py-12">
          <div className="w-full max-w-md">
            <div className="mb-7 text-center lg:mb-8 lg:text-left">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl font-black text-indigo-600 ring-1 ring-indigo-100 sm:h-14 sm:w-14 lg:hidden">
                D
              </div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Welcome back
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Sign in to Dukanbill
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                Enter your account details to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>
                <div className="relative">
                  <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.7" />
                      <path d="m4 7 8 6 8-6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    autoCapitalize="none"
                    spellCheck="false"
                    placeholder="you@example.com"
                    value={credentials.email}
                    onChange={handleChange}
                    className="block min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    required
                    aria-describedby="email-hint"
                  />
                </div>
                <p id="email-hint" className="mt-1.5 text-xs text-slate-500">
                  Use the email address linked to your account.
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="4" y="10" width="16" height="11" rx="2" strokeWidth="1.7" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={handleChange}
                    onKeyUp={(event) => setCapsLockOn(event.getModifierState('CapsLock'))}
                    onKeyDown={(event) => setCapsLockOn(event.getModifierState('CapsLock'))}
                    onBlur={() => setCapsLockOn(false)}
                    className="block min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-14 text-base text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute inset-y-0 right-0 flex min-w-12 items-center justify-center rounded-r-xl text-sm font-semibold text-slate-500 transition hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c5.2 0 8.6 5.1 9.5 7-.3.7-1.1 2-2.5 3.3M6.2 6.2C3.9 7.7 2.8 10 2.5 12c.5 1 1.8 3.3 4.6 5.1A10.4 10.4 0 0 0 12 19c1 0 2-.2 2.9-.5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" strokeWidth="1.8" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="2.5" strokeWidth="1.8" />
                      </svg>
                    )}
                  </button>
                </div>
                {capsLockOn && (
                  <p role="status" className="mt-2 flex items-center gap-2 text-xs font-medium text-amber-700">
                    <span aria-hidden="true">⚠</span> Caps Lock is on.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition duration-200 hover:bg-indigo-700 hover:shadow-indigo-600/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-65 disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 1 5.4 1 12h3z" />
                    </svg>
                    Signing you in…
                  </>
                ) : (
                  <>
                    Sign in
                    <svg className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12h14m-6-6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 sm:my-7">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium text-slate-400">DUKANBILL ACCOUNT</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <p className="text-center text-sm leading-6 text-slate-600">
              New to Dukanbill?{' '}
              <Link
                to="/register"
                className="whitespace-nowrap font-bold text-indigo-600 underline-offset-4 transition hover:text-indigo-700 hover:underline focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Create an account
              </Link>
            </p>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              By continuing, you agree to keep your account credentials secure.
            </p>
          </div>
        </div>
      </section>

      {/* Accessible, responsive error dialog */}
      {showErrorModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/65 px-3 py-5 backdrop-blur-sm sm:px-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeErrorModal();
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="login-error-title"
            aria-describedby="login-error-description"
            className="my-auto w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 ring-8 ring-rose-50/60">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                <path d="M12 8v5m0 3h.01" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h2 id="login-error-title" className="text-center text-xl font-bold text-slate-900">
              Unable to sign in
            </h2>
            <p id="login-error-description" className="mt-2 break-words text-center text-sm leading-6 text-slate-600">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={closeErrorModal}
              autoFocus
              className="mt-6 min-h-11 w-full rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
            >
              Try again
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
