import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/store';

export default function PrivateRoute({ children }) {
  const { token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}
