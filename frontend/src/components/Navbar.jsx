// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../store/store';

// export default function Navbar() {
//   const navigate = useNavigate();
//   const { user, logout } = useAuthStore();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-40">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-between items-center py-4">
//           {/* Logo */}
//           <Link to="/dashboard" className="text-xl md:text-2xl font-bold text-indigo-400 flex-shrink-0">
//             Dukanbill
//           </Link>

//           {/* Desktop Navigation */}
//           {user && (
//             <div className="hidden md:flex items-center gap-6">
//               <Link to="/dashboard" className="hover:text-indigo-400 transition text-sm lg:text-base">
//                 Dashboard
//               </Link>
//               <Link to="/products" className="hover:text-indigo-400 transition text-sm lg:text-base">
//                 Products
//               </Link>
//               <Link to="/pos" className="hover:text-indigo-400 transition text-sm lg:text-base">
//                 POS
//               </Link>
//               <Link to="/sales" className="hover:text-indigo-400 transition text-sm lg:text-base">
//                 Sales
//               </Link>
//             </div>
//           )}

//           {/* Desktop User Menu */}
//           {user && (
//             <div className="hidden md:flex items-center gap-4">
//               <span className="text-xs lg:text-sm text-gray-300 truncate">{user.shopName}</span>
//               <button
//                 onClick={handleLogout}
//                 className="px-3 lg:px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition text-xs lg:text-sm font-medium"
//               >
//                 Logout
//               </button>
//             </div>
//           )}

//           {/* Mobile Menu Button */}
//           {user && (
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="md:hidden text-white focus:outline-none text-2xl"
//             >
//               {isMenuOpen ? '✕' : '☰'}
//             </button>
//           )}
//         </div>

//         {/* Mobile Navigation */}
//         {user && isMenuOpen && (
//           <div className="md:hidden pb-4 border-t border-gray-700">
//             <Link
//               to="/dashboard"
//               className="block py-2 px-0 hover:text-indigo-400 transition text-sm"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Dashboard
//             </Link>
//             <Link
//               to="/products"
//               className="block py-2 px-0 hover:text-indigo-400 transition text-sm"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Products
//             </Link>
//             <Link
//               to="/pos"
//               className="block py-2 px-0 hover:text-indigo-400 transition text-sm"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               POS
//             </Link>
//             <Link
//               to="/sales"
//               className="block py-2 px-0 hover:text-indigo-400 transition text-sm"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Sales
//             </Link>
//             <div className="border-t border-gray-700 mt-4 pt-4">
//               <p className="text-xs text-gray-400 mb-2">Shop: {user.shopName}</p>
//               <button
//                 onClick={() => {
//                   handleLogout();
//                   setIsMenuOpen(false);
//                 }}
//                 className="w-full px-3 py-2 bg-red-600 rounded hover:bg-red-700 transition text-xs font-medium"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/store';
// Icons make the UI feel more professional and aid scannability
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  ReceiptIndianRupee, 
  LogOut, 
  Menu, 
  X,
  Store,
  Settings as SettingsIcon
} from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to highlight the current page
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Products', path: '/products', icon: <Package size={18} /> },
    { name: 'POS', path: '/pos', icon: <ShoppingCart size={18} /> },
    { name: 'Sales', path: '/sales', icon: <ReceiptIndianRupee size={18} /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon size={18} /> },
  ];

  return (
    <nav className="bg-slate-950 text-slate-200 shadow-xl border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:rotate-3 transition-transform shadow-lg shadow-indigo-500/20">
                <Store className="text-white" size={20} />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Dukan<span className="text-indigo-500">bill</span>
              </span>
            </Link>
          </div>

          {/* Desktop Central Navigation */}
          {user && (
            <div className="hidden md:flex items-center bg-slate-900/50 rounded-full px-1.5 py-1 border border-slate-800">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/40'
                      : 'hover:text-white hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          )}

          {/* User Profile & Logout */}
          {user && (
            <div className="hidden md:flex items-center gap-5">
              <div className="flex flex-col items-end border-r border-slate-800 pr-5">
                <span className="text-xs font-bold text-white uppercase tracking-wider leading-none">
                  {user.shopName}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 font-medium">Merchant Account</span>
              </div>
              
              <Link
                to="/settings"
                className="group flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all"
                title="Settings"
              >
                <SettingsIcon size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </Link>
              
              <button
                onClick={handleLogout}
                className="group flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:bg-red-500/10 transition-all"
                title="Logout"
              >
                <LogOut size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          )}

          {/* Mobile Toggle */}
          {user && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sidebar/Menu */}
      {user && isMenuOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-800 animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <div className="p-3 mb-4 bg-slate-900/50 rounded-2xl border border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Logged in as</p>
              <p className="text-white font-semibold">{user.shopName}</p>
            </div>
            
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3 text-red-400 bg-red-400/5 hover:bg-red-400/10 rounded-xl font-bold transition-all"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}