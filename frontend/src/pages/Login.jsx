import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/store';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  React.useEffect(() => {
    document.title = 'Login - Dukanbill';
  }, []);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      setErrorMessage('Please fill in all fields');
      setShowErrorModal(true);
      return;
    }

    const success = await login(credentials.email, credentials.password);
    if (success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      setErrorMessage(error || 'Login failed. Please check your credentials.');
      setShowErrorModal(true);
    }
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-3 md:px-4 py-8">
      <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 max-w-md w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2 text-center"> <span className="text-indigo-500">Dukanbill</span>
              </h1>
        <p className="text-gray-600 text-sm md:text-base text-center mb-6 md:mb-8">Login to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="input-field text-xs md:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="input-field text-xs md:text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 text-sm md:text-base py-2 md:py-3"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs md:text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">
            Register
          </Link>
        </p>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full animate-in">
            {/* Error Header */}
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Error Title */}
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
              Login Failed
            </h2>

            {/* Error Message */}
            <p className="text-gray-600 text-center mb-6 text-sm md:text-base">
              {errorMessage}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeErrorModal}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>

            {/* Help Text */}
            <p className="text-center text-gray-500 text-xs mt-4">
              Need help?{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Contact support
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
