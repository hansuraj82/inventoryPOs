// import React, { Suspense, useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { useAuthStore } from './store/store';
// import PrivateRoute from './components/PrivateRoute';
// import FullPageLoader from './components/FullPageLoader';
// import PWAInstallBanner from './components/PWAInstallBanner';

// // Lazy load all pages
// const Login = React.lazy(() => import('./pages/Login'));
// const Register = React.lazy(() => import('./pages/Register'));
// const Dashboard = React.lazy(() => import('./pages/Dashboard'));
// const Products = React.lazy(() => import('./pages/Products'));
// const POS = React.lazy(() => import('./pages/POS'));
// const Sales = React.lazy(() => import('./pages/Sales'));
// const Settings = React.lazy(() => import('./pages/Settings'));
// // const StaffManagement = React.lazy(() => import('./pages/StaffManagement'));
// // const StaffAllocation = React.lazy(() => import('./pages/StaffAllocation'));
// // const StaffPerformance = React.lazy(() => import('./pages/StaffPerformance'));
// const BarcodePrintSheet = React.lazy(() => import('./pages/BarcodePrintSheet'))
// const UpiQuickPay = React.lazy(() => import('./pages/UpiQuickPay'));
// const Home = React.lazy(() => import('./pages/HomePage'));

// function App() {
//   const { token } = useAuthStore();

//   return (
//     <BrowserRouter>
//       <Toaster
//         position="top-right"
//         reverseOrder={false}
//         gutter={8}
//         toastOptions={{
//           duration: 4000,
//           style: {
//             background: '#fff',
//             color: '#000',
//           }
//         }}
//       />

//       {/* PWA Install Banner */}
//       <PWAInstallBanner />

//       <Routes>
//         <Route
//           path="/login"
//           element={
//             <Suspense fallback={<FullPageLoader />}>
//               <Login />
//             </Suspense>
//           }
//         />


//                 <Route
//           path="/home"
//           element={
//             <Suspense fallback={<FullPageLoader />}>
//               <Home />
//             </Suspense>
//           }
//         />


//         <Route
//           path="/upi"
//           element={
//             <Suspense fallback={<FullPageLoader />}>
//               <UpiQuickPay />
//             </Suspense>
//           }
//         />


//         <Route
//           path="/register"
//           element={
//             <Suspense fallback={<FullPageLoader />}>
//               <Register />
//             </Suspense>
//           }
//         />

//         <Route
//           path="/dashboard"
//           element={
//             <PrivateRoute>
//               <Suspense fallback={<FullPageLoader />}>
//                 <Dashboard />
//               </Suspense>
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/products"
//           element={
//             <PrivateRoute>
//               <Suspense fallback={<FullPageLoader />}>
//                 <Products />
//               </Suspense>
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/pos"
//           element={
//             <PrivateRoute>
//               <Suspense fallback={<FullPageLoader />}>
//                 <POS />
//               </Suspense>
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/sales"
//           element={
//             <PrivateRoute>
//               <Suspense fallback={<FullPageLoader />}>
//                 <Sales />
//               </Suspense>
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/settings"
//           element={
//             <PrivateRoute>
//               <Suspense fallback={<FullPageLoader />}>
//                 <Settings />
//               </Suspense>
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/Barcode"
//           element={
//             <PrivateRoute>
//               <Suspense fallback={<FullPageLoader />}>
//                 <BarcodePrintSheet />
//               </Suspense>
//             </PrivateRoute>
//           }
//         />


//         {/* <Route
//           path="/staff-management"
//           element={
//             <PrivateRoute>
//               <Suspense fallback={<FullPageLoader />}>
//                 <StaffManagement />
//               </Suspense>
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/staff-allocation"
//           element={
//             <PrivateRoute>
//               <Suspense fallback={<FullPageLoader />}>
//                 <StaffAllocation />
//               </Suspense>
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/staff-performance"
//           element={
//             <PrivateRoute>
//               <Suspense fallback={<FullPageLoader />}>
//                 <StaffPerformance />
//               </Suspense>
//             </PrivateRoute>
//           }
//         /> */}

//         <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;








// import React, { Suspense, Component } from 'react';
// import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { useAuthStore } from './store/store';
// import PrivateRoute from './components/PrivateRoute';
// import FullPageLoader from './components/FullPageLoader';
// import PWAInstallBanner from './components/PWAInstallBanner';

// // --- PRODUCTION ERROR BOUNDARY ---
// class ErrorBoundary extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error('Dukanbill UI Error Caught:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
//           <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-4">
//             <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center text-3xl mx-auto border border-red-500/30">
//               ⚠️
//             </div>
//             <h2 className="text-xl font-bold">Something went wrong</h2>
//             <p className="text-xs text-slate-400">
//               An unexpected error occurred in this view. Please reload the application.
//             </p>
//             <button
//               onClick={() => window.location.reload()}
//               className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-lg shadow-indigo-600/30"
//             >
//               Reload Application
//             </button>
//             {/* <Link to='/' className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-lg shadow-indigo-600/30"
//             >Go To Home</Link> */}
//           </div>
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// // --- LAZY LOADED PAGES ---
// const Login = React.lazy(() => import('./pages/Login'));
// const Register = React.lazy(() => import('./pages/Register'));
// const Dashboard = React.lazy(() => import('./pages/Dashboard'));
// const Products = React.lazy(() => import('./pages/Products'));
// const POS = React.lazy(() => import('./pages/POS'));
// const Sales = React.lazy(() => import('./pages/Sales'));
// const Settings = React.lazy(() => import('./pages/Settings'));
// const BarcodePrintSheet = React.lazy(() => import('./pages/BarcodePrintSheet'));
// const UpiQuickPay = React.lazy(() => import('./pages/UpiQuickPay'));
// const Home = React.lazy(() => import('./pages/HomePage'));

// function App() {
//   const { token } = useAuthStore();

//   return (
//     <ErrorBoundary>
//       <BrowserRouter>
//         <Toaster
//           position="top-right"
//           reverseOrder={false}
//           gutter={8}
//           toastOptions={{
//             duration: 4000,
//             style: {
//               background: '#0f172a',
//               color: '#fff',
//               borderRadius: '12px',
//               fontSize: '13px'
//             }
//           }}
//         />

//         {/* PWA Install Banner */}
//         <PWAInstallBanner />

//         <Suspense fallback={<FullPageLoader />}>
//           <Routes>
//             {/* PUBLIC / LANDING ROUTES */}
//             <Route path="/" element={<Home />} />
//             <Route path="/home" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/upi" element={<UpiQuickPay />} />

//             {/* PROTECTED DASHBOARD & POS ROUTES */}
//             <Route
//               path="/dashboard"
//               element={
//                 <PrivateRoute>
//                   <Dashboard />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/products"
//               element={
//                 <PrivateRoute>
//                   <Products />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/pos"
//               element={
//                 <PrivateRoute>
//                   <POS />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/sales"
//               element={
//                 <PrivateRoute>
//                   <Sales />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/settings"
//               element={
//                 <PrivateRoute>
//                   <Settings />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/barcode"
//               element={
//                 <PrivateRoute>
//                   <BarcodePrintSheet />
//                 </PrivateRoute>
//               }
//             />

//             {/* FALLBACK REDIRECT */}
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </Suspense>
//       </BrowserRouter>
//     </ErrorBoundary>
//   );
// }

// export default App;




import React, { Suspense, Component } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/store';
import PrivateRoute from './components/PrivateRoute';
import FullPageLoader from './components/FullPageLoader';
import PWAInstallBanner from './components/PWAInstallBanner';

// --- PRODUCTION ERROR BOUNDARY ---
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dukanbill UI Error Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-4">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center text-3xl mx-auto border border-red-500/30">
              ⚠️
            </div>

            <h2 className="text-xl font-bold">
              Something went wrong
            </h2>

            <p className="text-xs text-slate-400">
              An unexpected error occurred in this view.
              Please reload the application.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-lg shadow-indigo-600/30"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- LAZY-LOADED PAGES ---
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Products = React.lazy(() => import('./pages/Products'));
const POS = React.lazy(() => import('./pages/POS'));
const Sales = React.lazy(() => import('./pages/Sales'));
const Settings = React.lazy(() => import('./pages/Settings'));
const BarcodePrintSheet = React.lazy(() => import('./pages/BarcodePrintSheet'));
const UpiQuickPay = React.lazy(() => import('./pages/UpiQuickPay'));
const Home = React.lazy(() => import('./pages/HomePage'));
const Quotation = React.lazy(() => import('./pages/Quotations'))

// --- AUTHENTICATED USERS CANNOT ACCESS LOGIN / REGISTER ---
function PublicOnlyRoute({ children }) {
  const { token } = useAuthStore();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// --- HOME ROUTE: REDIRECT LOGGED-IN USERS TO DASHBOARD ---
function HomeRoute() {
  return <Home />;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f172a',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '13px',
            },
          }}
        />

        <PWAInstallBanner />

        <Suspense fallback={<FullPageLoader />}>
          <Routes>
            {/* HOME */}
            <Route path="/" element={<HomeRoute />} />
            <Route path="/home" element={<HomeRoute />} />

            {/* AUTH: REDIRECT LOGGED-IN USERS */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <Register />
                </PublicOnlyRoute>
              }
            />

            {/* PUBLIC ROUTE */}
            <Route path="/upi" element={<UpiQuickPay />} />

            {/* PROTECTED ROUTES */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/products"
              element={
                <PrivateRoute>
                  <Products />
                </PrivateRoute>
              }
            />

            <Route
              path="/pos"
              element={
                <PrivateRoute>
                  <POS />
                </PrivateRoute>
              }
            />

            <Route
              path="/sales"
              element={
                <PrivateRoute>
                  <Sales />
                </PrivateRoute>
              }
            />

            <Route
              path="/quotation"
              element={
                <PrivateRoute>
                  <Quotation />
                </PrivateRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />

            <Route
              path="/barcode"
              element={
                <PrivateRoute>
                  <BarcodePrintSheet />
                </PrivateRoute>
              }
            />

            {/* UNKNOWN ROUTES */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;