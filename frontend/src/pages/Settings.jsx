import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/store';
import Layout from '../components/Layout';

export default function Settings() {
  const { user, updateProfile, changePassword, isLoading } = useAuthStore();
  console.log('user is',user);
  
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    phone: '',
    shopName: ''
  });

  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Initialize profile form data
  useEffect(() => {
    if (user) {
      setProfileFormData({
        name: user.name || '',
        phone: user.phone || '',
        shopName: user.shopName || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePassword = (password) => {
    const errors = {};
    
    // Length check
    if (password.length < 8) {
      errors.length = 'Password must be at least 8 characters';
    }
    
    // Uppercase check
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = 'Password must contain at least one uppercase letter';
    }
    
    // Lowercase check
    if (!/[a-z]/.test(password)) {
      errors.lowercase = 'Password must contain at least one lowercase letter';
    }
    
    // Number check
    if (!/\d/.test(password)) {
      errors.number = 'Password must contain at least one number';
    }
    
    // Special character check
    if (!/[@$!%*?&]/.test(password)) {
      errors.special = 'Password must contain at least one special character (@$!%*?&)';
    }
    
    return errors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // Validate at least one field is filled
    if (!profileFormData.name && !profileFormData.phone && !profileFormData.shopName) {
      toast.error('Please update at least one field');
      return;
    }

    // Prepare data with only non-empty fields
    const updateData = {};
    if (profileFormData.name) updateData.name = profileFormData.name;
    if (profileFormData.phone) updateData.phone = profileFormData.phone;
    if (profileFormData.shopName) updateData.shopName = profileFormData.shopName;

    const result = await updateProfile(updateData);
    if (result.success) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error(result.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    // Validate current password
    if (!passwordFormData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    // Validate new password
    if (!passwordFormData.newPassword) {
      errors.newPassword = 'New password is required';
    } else {
      const validationErrors = validatePassword(passwordFormData.newPassword);
      if (Object.keys(validationErrors).length > 0) {
        setPasswordErrors(validationErrors);
        return;
      }
    }

    // Validate confirm password
    if (!passwordFormData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    const result = await changePassword({
      currentPassword: passwordFormData.currentPassword,
      newPassword: passwordFormData.newPassword,
      confirmPassword: passwordFormData.confirmPassword
    });

    if (result.success) {
      toast.success('Password changed successfully!');
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors({});
    } else {
      toast.error(result.message);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and security</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-4 px-4 font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`pb-4 px-4 font-medium transition-colors ${
                activeTab === 'password'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Change Password
            </button>
          </div>

          {/* Edit Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Profile</h2>
              
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileFormData.name}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">Between 2 and 50 characters</p>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileFormData.phone}
                    onChange={handleProfileChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">Between 10 and 20 characters</p>
                </div>

                {/* Shop Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    name="shopName"
                    value={profileFormData.shopName}
                    onChange={handleProfileChange}
                    placeholder="Enter your shop name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">Between 2 and 100 characters</p>
                </div>

                {/* Email Display (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
                    {user?.email}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          )}

          {/* Change Password Tab */}
          {activeTab === 'password' && (
            <div className="bg-white rounded-lg shadow p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>

              {/* Password Requirements */}
              <div className="mb-8 p-4 border border-blue-200 rounded-lg bg-blue-50">
                <p className="text-sm font-semibold text-blue-900 mb-3">Password Requirements:</p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ At least 8 characters long</li>
                  <li>✓ Contains uppercase letter (A-Z)</li>
                  <li>✓ Contains lowercase letter (a-z)</li>
                  <li>✓ Contains a number (0-9)</li>
                  <li>✓ Contains a special character (@$!%*?&)</li>
                </ul>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordFormData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your current password"
                      className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                        passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                    >
                      {showPasswords.current ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordFormData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your new password"
                      className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                        Object.keys(passwordErrors).some(
                          (key) => key !== 'currentPassword' && key !== 'confirmPassword'
                        )
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                    >
                      {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {Object.keys(passwordErrors).some(
                    (key) => key !== 'currentPassword' && key !== 'confirmPassword'
                  ) && (
                    <div className="mt-2 space-y-1">
                      {Object.entries(passwordErrors).map(
                        ([key, error]) =>
                          key !== 'currentPassword' &&
                          key !== 'confirmPassword' && (
                            <p key={key} className="text-red-500 text-sm">
                              • {error}
                            </p>
                          )
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordFormData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm your new password"
                      className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                        passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                    >
                      {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Changing Password...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
