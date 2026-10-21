// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useAuthStore } from '../store/store';
// import { validateEmail, validatePhone } from '../utils/helpers';

// export default function Register() {
//   const navigate = useNavigate();
//   const { register, isLoading, error } = useAuthStore();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     shopName: '',
//     password: '',
//     passwordConfirm: ''
//   });

//   React.useEffect(() => {
//     document.title = 'Register - Dukanbill';
//   }, []);
//   const [showErrorModal, setShowErrorModal] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation
//     if (!validateEmail(formData.email)) {
//       setErrorMessage('Invalid email address');
//       setShowErrorModal(true);
//       return;
//     }

//     if (!validatePhone(formData.phone)) {
//       setErrorMessage('Phone must be 10 digits');
//       setShowErrorModal(true);
//       return;
//     }

//     if (formData.password.length < 6) {
//       setErrorMessage('Password must be at least 6 characters');
//       setShowErrorModal(true);
//       return;
//     }

//     if (formData.password !== formData.passwordConfirm) {
//       setErrorMessage('Passwords do not match');
//       setShowErrorModal(true);
//       return;
//     }

//     const success = await register(formData);
//     if (success) {
//       toast.success('Registration successful!');
//       navigate('/dashboard');
//     } else {
//       setErrorMessage(error || 'Registration failed. Please try again.');
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
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2 text-center"><span className="text-indigo-500">Dukanbill</span></h1>
//         <p className="text-gray-600 text-sm md:text-base text-center mb-6 md:mb-8">Create your account</p>

//         <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
//           <div>
//             <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
//               Full Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="input-field text-xs md:text-sm"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="input-field text-xs md:text-sm"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
//               Phone Number
//             </label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder="10 digit number"
//               className="input-field text-xs md:text-sm"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
//               Shop Name
//             </label>
//             <input
//               type="text"
//               name="shopName"
//               value={formData.shopName}
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
//               value={formData.password}
//               onChange={handleChange}
//               className="input-field text-xs md:text-sm"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               name="passwordConfirm"
//               value={formData.passwordConfirm}
//               onChange={handleChange}
//               className="input-field text-xs md:text-sm"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full btn-primary disabled:opacity-50 text-sm md:text-base py-2 md:py-3 mt-2"
//           >
//             {isLoading ? 'Creating Account...' : 'Register'}
//           </button>
//         </form>

//         <p className="text-center text-gray-600 text-xs md:text-sm mt-6">
//           Already have an account?{' '}
//           <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
//             Login
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
//               Registration Failed
//             </h2>

//             {/* Error Message */}
//             <p className="text-gray-600 text-center mb-6 text-sm md:text-base">
//               {errorMessage}
//             </p>

//             {/* Action Button */}
//             <button
//               onClick={closeErrorModal}
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
//             >
//               Got it
//             </button>
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
import { validateEmail, validatePhone } from '../utils/helpers';

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  shopName: '',
  password: '',
  passwordConfirm: '',
};

function FieldIcon({ type }) {
  const common = {
    className: 'h-5 w-5',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  switch (type) {
    case 'user':
      return <svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
    case 'email':
      return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
    case 'phone':
      return <svg {...common}><path d="M5 3h4l2 5-2.5 1.5a14 14 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" /></svg>;
    case 'shop':
      return <svg {...common}><path d="M3 10h18l-2-6H5l-2 6Z" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></svg>;
    default:
      return <svg {...common}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>;
  }
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
  onKeyUp,
  onKeyDown,
  onBlur,
  hint,
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
          <FieldIcon type="password" />
        </span>
        <input
          id={id}
          name={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          onKeyUp={onKeyUp}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          placeholder={label === 'Password' ? 'Create a password' : 'Re-enter your password'}
          className="block min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-14 text-base text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          required
          aria-describedby={hint ? `${id}-hint` : undefined}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={show}
          className="absolute inset-y-0 right-0 flex min-w-12 items-center justify-center rounded-r-xl text-slate-500 transition hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
        >
          {show ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" strokeLinecap="round" />
              <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c5.2 0 8.6 5.1 9.5 7-.3.7-1.1 2-2.5 3.3M6.2 6.2C3.9 7.7 2.8 10 2.5 12c.5 1 1.8 3.3 4.6 5.1A10.4 10.4 0 0 0 12 19c1 0 2-.2 2.9-.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          )}
        </button>
      </div>
      {hint && <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();

  const [formData, setFormData] = useState(initialFormData);
  const [showPasswords, setShowPasswords] = useState({ password: false, passwordConfirm: false });
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    document.title = 'Register - Dukanbill';
  }, []);

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

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
    setFormData((current) => ({
      ...current,
      [name]: name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value,
    }));
  };

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanedData = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      shopName: formData.shopName.trim(),
    };

    if (!cleanedData.name || !cleanedData.shopName || !cleanedData.email || !cleanedData.phone || !cleanedData.password || !cleanedData.passwordConfirm) {
      showError('Please fill in all fields before creating your account.');
      return;
    }

    if (!validateEmail(cleanedData.email)) {
      showError('Please enter a valid email address.');
      return;
    }

    if (!validatePhone(cleanedData.phone)) {
      showError('Please enter a valid 10-digit phone number.');
      return;
    }

    if (cleanedData.password.length < 6) {
      showError('Your password must contain at least 6 characters.');
      return;
    }

    if (cleanedData.password !== cleanedData.passwordConfirm) {
      showError('The passwords do not match. Please check both fields.');
      return;
    }

    try {
      const success = await register(cleanedData);
      if (success) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } else {
        showError(error || 'Registration failed. Please check your details and try again.');
      }
    } catch {
      showError('We could not create your account right now. Please check your connection and try again.');
    }
  };

  const password = formData.password;
  const passwordChecks = [
    { label: 'At least 6 characters', passed: password.length >= 6 },
    { label: 'Contains a number', passed: /\d/.test(password) },
  ];
  const passwordStrength = !password
    ? 0
    : password.length < 6
      ? 1
      : password.length < 9
        ? 2
        : 3;
  const strengthLabel = ['', 'Needs work', 'Good', 'Strong'][passwordStrength];

  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-slate-950 px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/70 via-slate-950 to-slate-950" />
      </div>

      <section className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/30 sm:rounded-3xl lg:grid-cols-[0.85fr_1.15fr]">
        {/* Brand panel is intentionally hidden on smaller screens to give the form more room. */}
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-9 text-white lg:flex xl:p-12">
          <div aria-hidden="true" className="absolute -right-16 top-24 h-56 w-56 rounded-full border-[36px] border-white/10" />
          <div aria-hidden="true" className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full border-[42px] border-white/10" />
          <div className="relative">
            <div className="mb-12 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-black text-indigo-700 shadow-lg">D</div>
              <span className="text-xl font-bold tracking-tight">Dukanbill</span>
            </div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-indigo-100">Start with a smarter setup</p>
            <h2 className="max-w-sm text-3xl font-bold leading-tight xl:text-4xl">Bring your shop and your workflow together.</h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-indigo-100 xl:text-base">
              Create your account to get started with your Dukanbill workspace.
            </p>
          </div>
          <div className="relative mt-12 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-100">✓</span>
              Quick account setup
            </p>
            <p className="pl-9 text-sm leading-6 text-indigo-100">Add your details once and continue to your dashboard.</p>
          </div>
        </aside>

        <div className="flex min-w-0 items-center justify-center px-5 py-6 sm:px-9 sm:py-9 lg:px-10 xl:px-14 xl:py-10">
          <div className="w-full max-w-xl">
            <header className="mb-6 text-center lg:mb-7 lg:text-left">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-lg font-black text-indigo-600 ring-1 ring-indigo-100 sm:h-12 sm:w-12 lg:hidden">D</div>
              <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Create your account</p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Join Dukanbill</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">Set up your account and shop details below.</p>
            </header>

            <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <div className="min-w-0">
                  <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400"><FieldIcon type="user" /></span>
                    <input id="name" name="name" type="text" autoComplete="name" value={formData.name} onChange={handleChange} placeholder="Your full name" className="block min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10" required />
                  </div>
                </div>

                <div className="min-w-0">
                  <label htmlFor="shopName" className="mb-2 block text-sm font-semibold text-slate-700">Shop name</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400"><FieldIcon type="shop" /></span>
                    <input id="shopName" name="shopName" type="text" autoComplete="organization" value={formData.shopName} onChange={handleChange} placeholder="Your business name" className="block min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10" required />
                  </div>
                </div>

                <div className="min-w-0">
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400"><FieldIcon type="email" /></span>
                    <input id="email" name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck="false" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="block min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10" required />
                  </div>
                </div>

                <div className="min-w-0">
                  <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">Phone number</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400"><FieldIcon type="phone" /></span>
                    <input id="phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" value={formData.phone} onChange={handleChange} placeholder="10-digit number" maxLength={10} className="block min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10" required aria-describedby="phone-hint" />
                  </div>
                  <p id="phone-hint" className="mt-1.5 text-xs text-slate-500">{formData.phone.length}/10 digits</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <div>
                  <PasswordField
                    id="password"
                    label="Password"
                    value={formData.password}
                    onChange={handleChange}
                    show={showPasswords.password}
                    onToggle={() => setShowPasswords((current) => ({ ...current, password: !current.password }))}
                    autoComplete="new-password"
                    onKeyDown={(event) => setCapsLockOn(event.getModifierState('CapsLock'))}
                    onKeyUp={(event) => setCapsLockOn(event.getModifierState('CapsLock'))}
                    onBlur={() => setCapsLockOn(false)}
                  />
                  {formData.password && (
                    <div className="mt-3" aria-live="polite">
                      <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                        <span className="text-slate-500">Password strength</span>
                        <span className={`font-semibold ${passwordStrength === 3 ? 'text-emerald-600' : passwordStrength === 2 ? 'text-indigo-600' : 'text-amber-600'}`}>{strengthLabel}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[1, 2, 3].map((level) => (
                          <div key={level} className={`h-1.5 rounded-full ${passwordStrength >= level ? (passwordStrength === 3 ? 'bg-emerald-500' : passwordStrength === 2 ? 'bg-indigo-500' : 'bg-amber-500') : 'bg-slate-200'}`} />
                        ))}
                      </div>
                      <div className="mt-2 space-y-1 text-xs">
                        {passwordChecks.map((check) => (
                          <p key={check.label} className={check.passed ? 'text-emerald-700' : 'text-slate-500'}>
                            <span className="mr-1.5" aria-hidden="true">{check.passed ? '✓' : '○'}</span>{check.label}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <PasswordField
                    id="passwordConfirm"
                    label="Confirm password"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    show={showPasswords.passwordConfirm}
                    onToggle={() => setShowPasswords((current) => ({ ...current, passwordConfirm: !current.passwordConfirm }))}
                    autoComplete="new-password"
                  />
                  {formData.passwordConfirm && (
                    <p className={`mt-2 text-xs font-medium ${formData.password === formData.passwordConfirm ? 'text-emerald-700' : 'text-rose-600'}`} aria-live="polite">
                      {formData.password === formData.passwordConfirm ? '✓ Passwords match' : 'Passwords do not match yet'}
                    </p>
                  )}
                </div>
              </div>

              {capsLockOn && (
                <p role="status" className="flex items-center gap-2 text-xs font-medium text-amber-700">
                  <span aria-hidden="true">⚠</span> Caps Lock is on.
                </p>
              )}

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
                    Creating your account…
                  </>
                ) : (
                  <>
                    Create account
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12h14m-6-6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm leading-6 text-slate-600 sm:mt-7">
              Already have an account?{' '}
              <Link to="/login" className="whitespace-nowrap font-bold text-indigo-600 underline-offset-4 transition hover:text-indigo-700 hover:underline focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-indigo-500">
                Sign in
              </Link>
            </p>
            <p className="mt-4 text-center text-xs leading-5 text-slate-400">Your details are used to set up your Dukanbill account.</p>
          </div>
        </div>
      </section>

      {showErrorModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/65 px-3 py-5 backdrop-blur-sm sm:px-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeErrorModal();
          }}
        >
          <section role="alertdialog" aria-modal="true" aria-labelledby="register-error-title" aria-describedby="register-error-description" className="my-auto w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 ring-8 ring-rose-50/60">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                <path d="M12 8v5m0 3h.01" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h2 id="register-error-title" className="text-center text-xl font-bold text-slate-900">Could not create account</h2>
            <p id="register-error-description" className="mt-2 break-words text-center text-sm leading-6 text-slate-600">{errorMessage}</p>
            <button type="button" onClick={closeErrorModal} autoFocus className="mt-6 min-h-11 w-full rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30">
              Try again
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
