import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/store';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/dashboard" className="text-xl md:text-2xl font-bold text-indigo-400 flex-shrink-0">
            InventoryPOS
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="hover:text-indigo-400 transition text-sm lg:text-base">
                Dashboard
              </Link>
              <Link to="/products" className="hover:text-indigo-400 transition text-sm lg:text-base">
                Products
              </Link>
              <Link to="/pos" className="hover:text-indigo-400 transition text-sm lg:text-base">
                POS
              </Link>
              <Link to="/sales" className="hover:text-indigo-400 transition text-sm lg:text-base">
                Sales
              </Link>
            </div>
          )}

          {/* Desktop User Menu */}
          {user && (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-xs lg:text-sm text-gray-300 truncate">{user.shopName}</span>
              <button
                onClick={handleLogout}
                className="px-3 lg:px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition text-xs lg:text-sm font-medium"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {user && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white focus:outline-none text-2xl"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        {user && isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-700">
            <Link
              to="/dashboard"
              className="block py-2 px-0 hover:text-indigo-400 transition text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/products"
              className="block py-2 px-0 hover:text-indigo-400 transition text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/pos"
              className="block py-2 px-0 hover:text-indigo-400 transition text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              POS
            </Link>
            <Link
              to="/sales"
              className="block py-2 px-0 hover:text-indigo-400 transition text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Sales
            </Link>
            <div className="border-t border-gray-700 mt-4 pt-4">
              <p className="text-xs text-gray-400 mb-2">Shop: {user.shopName}</p>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full px-3 py-2 bg-red-600 rounded hover:bg-red-700 transition text-xs font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
