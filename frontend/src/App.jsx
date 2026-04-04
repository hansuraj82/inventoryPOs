import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/store';
import PrivateRoute from './components/PrivateRoute';
import FullPageLoader from './components/FullPageLoader';

// Lazy load all pages
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Products = React.lazy(() => import('./pages/Products'));
const POS = React.lazy(() => import('./pages/POS'));
const Sales = React.lazy(() => import('./pages/Sales'));

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

        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
