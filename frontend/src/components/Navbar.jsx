import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/store';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="text-2xl font-bold text-indigo-400">
            InventoryPOS
          </Link>
          {user && (
            <div className="flex gap-6">
              <Link to="/dashboard" className="hover:text-indigo-400">
                Dashboard
              </Link>
              <Link to="/products" className="hover:text-indigo-400">
                Products
              </Link>
              <Link to="/pos" className="hover:text-indigo-400">
                POS
              </Link>
              <Link to="/sales" className="hover:text-indigo-400">
                Sales
              </Link>
            </div>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm">{user.shopName}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
