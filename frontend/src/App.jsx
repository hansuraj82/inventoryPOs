import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/store';
import PrivateRoute from './components/PrivateRoute';
import FullPageLoader from './components/FullPageLoader';
import PWAInstallBanner from './components/PWAInstallBanner';

// Lazy load all pages
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Products = React.lazy(() => import('./pages/Products'));
const POS = React.lazy(() => import('./pages/POS'));
const Sales = React.lazy(() => import('./pages/Sales'));
const Settings = React.lazy(() => import('./pages/Settings'));
// const StaffManagement = React.lazy(() => import('./pages/StaffManagement'));
// const StaffAllocation = React.lazy(() => import('./pages/StaffAllocation'));
// const StaffPerformance = React.lazy(() => import('./pages/StaffPerformance'));
const BarcodePrintSheet = React.lazy(() =>import('./pages/BarcodePrintSheet'))

function App() {
  const { token } = useAuthStore();

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#000',
          }
        }}
      />

      {/* PWA Install Banner */}
      <PWAInstallBanner />

      <Routes>
        <Route
          path="/login"
          element={
            <Suspense fallback={<FullPageLoader />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<FullPageLoader />}>
              <Register />
            </Suspense>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Suspense fallback={<FullPageLoader />}>
                <Dashboard />
              </Suspense>
            </PrivateRoute>
          }
        />

        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Suspense fallback={<FullPageLoader />}>
                <Products />
              </Suspense>
            </PrivateRoute>
          }
        />

        <Route
          path="/pos"
          element={
            <PrivateRoute>
              <Suspense fallback={<FullPageLoader />}>
                <POS />
              </Suspense>
            </PrivateRoute>
          }
        />

        <Route
          path="/sales"
          element={
            <PrivateRoute>
              <Suspense fallback={<FullPageLoader />}>
                <Sales />
              </Suspense>
            </PrivateRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Suspense fallback={<FullPageLoader />}>
                <Settings />
              </Suspense>
            </PrivateRoute>
          }
        />

        <Route
          path="/Barcode"
          element={
            <PrivateRoute>
              <Suspense fallback={<FullPageLoader />}>
                <BarcodePrintSheet />
              </Suspense>
            </PrivateRoute>
          }
        />


        {/* <Route
          path="/staff-management"
          element={
            <PrivateRoute>
              <Suspense fallback={<FullPageLoader />}>
                <StaffManagement />
              </Suspense>
            </PrivateRoute>
          }
        />

        <Route
          path="/staff-allocation"
          element={
            <PrivateRoute>
              <Suspense fallback={<FullPageLoader />}>
                <StaffAllocation />
              </Suspense>
            </PrivateRoute>
          }
        />

        <Route
          path="/staff-performance"
          element={
            <PrivateRoute>
              <Suspense fallback={<FullPageLoader />}>
                <StaffPerformance />
              </Suspense>
            </PrivateRoute>
          }
        /> */}

        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
