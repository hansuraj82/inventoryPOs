// import React, { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { useAuthStore } from '../store/store';
// import Layout from '../components/Layout';

// export default function Settings() {
//   const { user, updateProfile, changePassword, isLoading } = useAuthStore();
  
//   const [activeTab, setActiveTab] = useState('profile');
//   const [dataLoading, setDataLoading] = useState(true);

//   useEffect(() => {
//     document.title = 'Settings - Dukanbill';
//   }, []);
  
//   const [profileFormData, setProfileFormData] = useState({
//     name: '',
//     phone: '',
//     shopName: ''
//   });

//   const [businessDetailsFormData, setBusinessDetailsFormData] = useState({
//     gstin: '',
//     pan: '',
//     businessAddress: '',
//     businessEmail: '',
//     businessPhone: '',
//     bankName: '',
//     accountNumber: '',
//     ifscCode: '',
//     upiId: ''
//   });

//   const [passwordFormData, setPasswordFormData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });

//   const [passwordErrors, setPasswordErrors] = useState({});
//   const [showPasswords, setShowPasswords] = useState({
//     current: false,
//     new: false,
//     confirm: false
//   });

//   // Initialize profile form data
//   useEffect(() => {
//     if (user) {
//       setProfileFormData({
//         name: user.name || '',
//         phone: user.phone || '',
//         shopName: user.shopName || ''
//       });

//       setBusinessDetailsFormData({
//         gstin: user.businessDetails?.gstin || '',
//         pan: user.businessDetails?.pan || '',
//         businessAddress: user.businessDetails?.businessAddress || '',
//         businessEmail: user.businessDetails?.businessEmail || '',
//         businessPhone: user.businessDetails?.businessPhone || '',
//         bankName: user.businessDetails?.bankName || '',
//         accountNumber: user.businessDetails?.accountNumber || '',
//         ifscCode: user.businessDetails?.ifscCode || '',
//         upiId: user.businessDetails?.upiId || ''
//       });
      
//       setDataLoading(false);
//     }
//   }, [user]);

//   const handleProfileChange = (e) => {
//     const { name, value } = e.target;
//     setProfileFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleBusinessDetailsChange = (e) => {
//     const { name, value } = e.target;
//     setBusinessDetailsFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear error for this field when user starts typing
//     if (passwordErrors[name]) {
//       setPasswordErrors((prev) => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validatePassword = (password) => {
//     const errors = {};
    
//     // Length check
//     if (password.length < 8) {
//       errors.length = 'Password must be at least 8 characters';
//     }
    
//     // Uppercase check
//     if (!/[A-Z]/.test(password)) {
//       errors.uppercase = 'Password must contain at least one uppercase letter';
//     }
    
//     // Lowercase check
//     if (!/[a-z]/.test(password)) {
//       errors.lowercase = 'Password must contain at least one lowercase letter';
//     }
    
//     // Number check
//     if (!/\d/.test(password)) {
//       errors.number = 'Password must contain at least one number';
//     }
    
//     // Special character check
//     if (!/[@$!%*?&]/.test(password)) {
//       errors.special = 'Password must contain at least one special character (@$!%*?&)';
//     }
    
//     return errors;
//   };

//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate at least one field is filled
//     if (!profileFormData.name && !profileFormData.phone && !profileFormData.shopName) {
//       toast.error('Please update at least one field');
//       return;
//     }

//     // Prepare data with only non-empty fields
//     const updateData = {};
//     if (profileFormData.name) updateData.name = profileFormData.name;
//     if (profileFormData.phone) updateData.phone = profileFormData.phone;
//     if (profileFormData.shopName) updateData.shopName = profileFormData.shopName;

//     const result = await updateProfile(updateData);
//     if (result.success) {
//       toast.success('Profile updated successfully!');
//     } else {
//       toast.error(result.message);
//     }
//   };

//   const handleBusinessDetailsSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate at least one field is filled
//     if (!Object.values(businessDetailsFormData).some(val => val)) {
//       toast.error('Please fill in at least one business detail');
//       return;
//     }

//     const result = await updateProfile({
//       businessDetails: businessDetailsFormData
//     });
//     if (result.success) {
//       toast.success('Business details updated successfully!');
//     } else {
//       toast.error(result.message);
//     }
//   };

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();
//     const errors = {};

//     // Validate current password
//     if (!passwordFormData.currentPassword) {
//       errors.currentPassword = 'Current password is required';
//     }

//     // Validate new password
//     if (!passwordFormData.newPassword) {
//       errors.newPassword = 'New password is required';
//     } else {
//       const validationErrors = validatePassword(passwordFormData.newPassword);
//       if (Object.keys(validationErrors).length > 0) {
//         setPasswordErrors(validationErrors);
//         return;
//       }
//     }

//     // Validate confirm password
//     if (!passwordFormData.confirmPassword) {
//       errors.confirmPassword = 'Please confirm your password';
//     } else if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
//       errors.confirmPassword = 'Passwords do not match';
//     }

//     if (Object.keys(errors).length > 0) {
//       setPasswordErrors(errors);
//       return;
//     }

//     const result = await changePassword({
//       currentPassword: passwordFormData.currentPassword,
//       newPassword: passwordFormData.newPassword,
//       confirmPassword: passwordFormData.confirmPassword
//     });

//     if (result.success) {
//       toast.success('Password changed successfully!');
//       setPasswordFormData({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       });
//       setPasswordErrors({});
//     } else {
//       toast.error(result.message);
//     }
//   };

//   const togglePasswordVisibility = (field) => {
//     setShowPasswords((prev) => ({
//       ...prev,
//       [field]: !prev[field]
//     }));
//   };

//   return (
//     <Layout>
//       <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-2xl mx-auto">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
//             <p className="text-gray-600 mt-2">Manage your account settings and security</p>
//           </div>

//           {dataLoading ? (
//             // Loading Skeleton
//             <div className="space-y-6">
//               {/* Tab Skeleton */}
//               <div className="flex gap-4 mb-8 border-b border-gray-200">
//                 {[1, 2, 3].map((i) => (
//                   <div
//                     key={i}
//                     className="pb-4 px-4 w-24 h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse"
//                   />
//                 ))}
//               </div>

//               {/* Content Skeleton */}
//               <div className="bg-white rounded-lg shadow p-6 md:p-8">
//                 {/* Title Skeleton */}
//                 <div className="mb-8">
//                   <div className="h-6 w-48 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse mb-6" />
                  
//                   {/* Form Fields Skeleton */}
//                   <div className="space-y-6">
//                     {[1, 2, 3, 4].map((i) => (
//                       <div key={i}>
//                         {/* Label Skeleton */}
//                         <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse mb-3" />
//                         {/* Input Skeleton */}
//                         <div className="h-10 w-full bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse" />
//                       </div>
//                     ))}
//                   </div>

//                   {/* Button Skeleton */}
//                   <div className="mt-8 h-10 w-full bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse" />
//                 </div>
//               </div>
//             </div>
//           ) : (
//             // Actual Content
//             <>
//               {/* Tab Navigation */}
//               <div className="flex gap-4 mb-8 border-b border-gray-200">
//                 <button
//                   onClick={() => setActiveTab('profile')}
//                   className={`pb-4 px-4 font-medium transition-colors ${
//                     activeTab === 'profile'
//                       ? 'text-blue-600 border-b-2 border-blue-600'
//                       : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   Edit Profile
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('password')}
//                   className={`pb-4 px-4 font-medium transition-colors ${
//                     activeTab === 'password'
//                       ? 'text-blue-600 border-b-2 border-blue-600'
//                       : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   Change Password
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('business')}
//                   className={`pb-4 px-4 font-medium transition-colors ${
//                     activeTab === 'business'
//                       ? 'text-blue-600 border-b-2 border-blue-600'
//                       : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   Business Details
//                 </button>
//               </div>
//             </>
//           )}

//           {!dataLoading && (
//             <>
//               {/* Edit Profile Tab */}
//               {activeTab === 'profile' && (
//                 <div className="bg-white rounded-lg shadow p-6 md:p-8">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Profile</h2>
              
//               <form onSubmit={handleProfileSubmit} className="space-y-6">
//                 {/* Name Field */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={profileFormData.name}
//                     onChange={handleProfileChange}
//                     placeholder="Enter your full name"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">Between 2 and 50 characters</p>
//                 </div>

//                 {/* Phone Field */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={profileFormData.phone}
//                     onChange={handleProfileChange}
//                     placeholder="Enter your phone number"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">Between 10 and 20 characters</p>
//                 </div>

//                 {/* Shop Name Field */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Shop Name
//                   </label>
//                   <input
//                     type="text"
//                     name="shopName"
//                     value={profileFormData.shopName}
//                     onChange={handleProfileChange}
//                     placeholder="Enter your shop name"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">Between 2 and 100 characters</p>
//                 </div>

//                 {/* Email Display (Read-only) */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address
//                   </label>
//                   <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
//                     {user?.email}
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? 'Updating...' : 'Update Profile'}
//                 </button>
//               </form>
//             </div>
//           )}

//           {/* Change Password Tab */}
//           {activeTab === 'password' && (
//             <div className="bg-white rounded-lg shadow p-6 md:p-8">
//               <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>

//               {/* Password Requirements */}
//               <div className="mb-8 p-4 border border-blue-200 rounded-lg bg-blue-50">
//                 <p className="text-sm font-semibold text-blue-900 mb-3">Password Requirements:</p>
//                 <ul className="text-sm text-blue-800 space-y-1">
//                   <li>✓ At least 8 characters long</li>
//                   <li>✓ Contains uppercase letter (A-Z)</li>
//                   <li>✓ Contains lowercase letter (a-z)</li>
//                   <li>✓ Contains a number (0-9)</li>
//                   <li>✓ Contains a special character (@$!%*?&)</li>
//                 </ul>
//               </div>

//               <form onSubmit={handlePasswordSubmit} className="space-y-6">
//                 {/* Current Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Current Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPasswords.current ? 'text' : 'password'}
//                       name="currentPassword"
//                       value={passwordFormData.currentPassword}
//                       onChange={handlePasswordChange}
//                       placeholder="Enter your current password"
//                       className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
//                         passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => togglePasswordVisibility('current')}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
//                     >
//                       {showPasswords.current ? '👁️' : '👁️‍🗨️'}
//                     </button>
//                   </div>
//                   {passwordErrors.currentPassword && (
//                     <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
//                   )}
//                 </div>

//                 {/* New Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     New Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPasswords.new ? 'text' : 'password'}
//                       name="newPassword"
//                       value={passwordFormData.newPassword}
//                       onChange={handlePasswordChange}
//                       placeholder="Enter your new password"
//                       className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
//                         Object.keys(passwordErrors).some(
//                           (key) => key !== 'currentPassword' && key !== 'confirmPassword'
//                         )
//                           ? 'border-red-500'
//                           : 'border-gray-300'
//                       }`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => togglePasswordVisibility('new')}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
//                     >
//                       {showPasswords.new ? '👁️' : '👁️‍🗨️'}
//                     </button>
//                   </div>
//                   {Object.keys(passwordErrors).some(
//                     (key) => key !== 'currentPassword' && key !== 'confirmPassword'
//                   ) && (
//                     <div className="mt-2 space-y-1">
//                       {Object.entries(passwordErrors).map(
//                         ([key, error]) =>
//                           key !== 'currentPassword' &&
//                           key !== 'confirmPassword' && (
//                             <p key={key} className="text-red-500 text-sm">
//                               • {error}
//                             </p>
//                           )
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Confirm Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Confirm New Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPasswords.confirm ? 'text' : 'password'}
//                       name="confirmPassword"
//                       value={passwordFormData.confirmPassword}
//                       onChange={handlePasswordChange}
//                       placeholder="Confirm your new password"
//                       className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
//                         passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => togglePasswordVisibility('confirm')}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
//                     >
//                       {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
//                     </button>
//                   </div>
//                   {passwordErrors.confirmPassword && (
//                     <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
//                   )}
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? 'Changing Password...' : 'Change Password'}
//                 </button>
//               </form>
//             </div>
//           )}

//           {/* Business Details Tab */}
//           {activeTab === 'business' && (
//             <div className="bg-white rounded-lg shadow p-6 md:p-8">
//               <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Details for GST Invoice</h2>
//               <p className="text-sm text-gray-600 mb-6">Add your business information to appear on GST-compliant invoices</p>
              
//               <form onSubmit={handleBusinessDetailsSubmit} className="space-y-6">
//                 {/* GST & TAX Details */}
//                 <div className="border-b pb-6">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">GST & Tax Details</h3>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         GSTIN (Goods & Service Tax ID Number)
//                       </label>
//                       <input
//                         type="text"
//                         name="gstin"
//                         value={businessDetailsFormData.gstin}
//                         onChange={handleBusinessDetailsChange}
//                         placeholder="e.g., 18AABCU0001R1Z0"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                       />
//                       <p className="text-xs text-gray-500 mt-1">15-digit GST number</p>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         PAN (Permanent Account Number)
//                       </label>
//                       <input
//                         type="text"
//                         name="pan"
//                         value={businessDetailsFormData.pan}
//                         onChange={handleBusinessDetailsChange}
//                         placeholder="e.g., AAAPN1234R"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                       />
//                       <p className="text-xs text-gray-500 mt-1">10-digit PAN number</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Business Address & Contact */}
//                 <div className="border-b pb-6">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Business Address & Contact</h3>
                  
//                   <div className="space-y-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Business Address
//                       </label>
//                       <textarea
//                         name="businessAddress"
//                         value={businessDetailsFormData.businessAddress}
//                         onChange={handleBusinessDetailsChange}
//                         placeholder="Enter complete business address"
//                         rows="3"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Business Phone
//                         </label>
//                         <input
//                           type="tel"
//                           name="businessPhone"
//                           value={businessDetailsFormData.businessPhone}
//                           onChange={handleBusinessDetailsChange}
//                           placeholder="e.g., +91-9876543210"
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Business Email
//                         </label>
//                         <input
//                           type="email"
//                           name="businessEmail"
//                           value={businessDetailsFormData.businessEmail}
//                           onChange={handleBusinessDetailsChange}
//                           placeholder="e.g., shop@example.com"
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Bank Details */}
//                 <div className="border-b pb-6">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Details</h3>
                  
//                   <div className="space-y-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Bank Name
//                       </label>
//                       <input
//                         type="text"
//                         name="bankName"
//                         value={businessDetailsFormData.bankName}
//                         onChange={handleBusinessDetailsChange}
//                         placeholder="e.g., State Bank of India"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Account Number
//                         </label>
//                         <input
//                           type="text"
//                           name="accountNumber"
//                           value={businessDetailsFormData.accountNumber}
//                           onChange={handleBusinessDetailsChange}
//                           placeholder="e.g., 1234567890"
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           IFSC Code
//                         </label>
//                         <input
//                           type="text"
//                           name="ifscCode"
//                           value={businessDetailsFormData.ifscCode}
//                           onChange={handleBusinessDetailsChange}
//                           placeholder="e.g., SBIN0001234"
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         UPI ID (Optional)
//                       </label>
//                       <input
//                         type="text"
//                         name="upiId"
//                         value={businessDetailsFormData.upiId}
//                         onChange={handleBusinessDetailsChange}
//                         placeholder="e.g., shop@upi"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? 'Saving...' : 'Save Business Details'}
//                 </button>
//               </form>
//             </div>
//           )}
//             </>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// }











import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FaUserCircle,
  FaStore,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaCheckCircle,
  FaBuilding,
  FaCreditCard,
  FaLock,
  FaRedoAlt,
  FaInfoCircle,
  FaSpinner,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaIdCard,
  FaUniversity,
  FaKey,
  FaCheck,
  FaTimes,
  FaArrowRight,
} from 'react-icons/fa';
import { useAuthStore } from '../store/store';
import Layout from '../components/Layout';

const EMPTY_PROFILE = { name: '', phone: '', shopName: '' };
const EMPTY_BUSINESS = {
  gstin: '',
  pan: '',
  businessAddress: '',
  businessEmail: '',
  businessPhone: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  upiId: '',
};
const EMPTY_PASSWORD = { currentPassword: '', newPassword: '', confirmPassword: '' };

const getProfile = (user) => ({
  name: user?.name || '',
  phone: user?.phone || '',
  shopName: user?.shopName || '',
});

const getBusiness = (user) => ({
  gstin: user?.businessDetails?.gstin || '',
  pan: user?.businessDetails?.pan || '',
  businessAddress: user?.businessDetails?.businessAddress || '',
  businessEmail: user?.businessDetails?.businessEmail || '',
  businessPhone: user?.businessDetails?.businessPhone || '',
  bankName: user?.businessDetails?.bankName || '',
  accountNumber: user?.businessDetails?.accountNumber || '',
  ifscCode: user?.businessDetails?.ifscCode || '',
  upiId: user?.businessDetails?.upiId || '',
});

function Field({ label, name, value, onChange, placeholder, icon: Icon, hint, type = 'text', autoComplete, maxLength, inputMode, className = '', required = false, readOnly = false, onBlur, ...props }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
        {label}{required && <span className="text-rose-500">*</span>}
      </label>
      <div className={`group flex min-w-0 items-center rounded-xl border bg-white transition-all duration-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 ${readOnly ? 'border-slate-200 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
        {Icon && <Icon className="ml-3.5 shrink-0 text-slate-400 transition-colors group-focus-within:text-indigo-500" aria-hidden="true" />}
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          inputMode={inputMode}
          readOnly={readOnly}
          required={required}
          className={`min-w-0 w-full rounded-xl bg-transparent px-2.5 py-3 text-sm min-[360px]:px-3.5 text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed ${Icon ? 'pl-1' : ''} ${readOnly ? 'text-slate-500' : ''}`}
          {...props}
        />
      </div>
      {hint && <p className="mt-1.5 text-xs leading-5 text-slate-500">{hint}</p>}
    </div>
  );
}

function SectionHeading({ icon: Icon, eyebrow, title, description }) {
  return (
    <div className="mb-6 flex items-start gap-3.5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">{eyebrow}</p>}
        <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{title}</h2>
        {description && <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>}
      </div>
    </div>
  );
}

function ActionButton({ children, loading, icon: Icon = FaSave, variant = 'primary', ...props }) {
  const styles = variant === 'secondary'
    ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200'
    : 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 focus:ring-indigo-200';
  return (
    <button
      {...props}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-55 ${styles} w-full sm:w-auto ${props.className || ''}`}
    >
      {loading ? <FaSpinner className="animate-spin" /> : <Icon />}
      {children}
    </button>
  );
}

function PasswordField({ label, name, placeholder, autoComplete, passwordFormData, passwordErrors, showPasswords, onChange, onToggle }) {
  const fieldKey = name === 'currentPassword' ? 'current' : name === 'newPassword' ? 'new' : 'confirm';
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>
      <div className={`group flex items-center rounded-xl border bg-white transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 ${passwordErrors[name] ? 'border-rose-400' : 'border-slate-200 hover:border-slate-300'}`}>
        <FaLock className="ml-3.5 shrink-0 text-slate-400 group-focus-within:text-indigo-500" />
        <input
          id={name}
          name={name}
          type={showPasswords[fieldKey] ? 'text' : 'password'}
          value={passwordFormData[name]}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm min-[360px]:px-3 text-slate-800 outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={() => onToggle(fieldKey)}
          className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          aria-label={showPasswords[fieldKey] ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {showPasswords[fieldKey] ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {passwordErrors[name] && <p className="mt-1.5 text-xs font-medium text-rose-600">{passwordErrors[name]}</p>}
    </div>
  );
}

export default function Settings() {
  const { user, updateProfile, changePassword, isLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [dataLoading, setDataLoading] = useState(true);
  const [profileFormData, setProfileFormData] = useState(EMPTY_PROFILE);
  const [businessDetailsFormData, setBusinessDetailsFormData] = useState(EMPTY_BUSINESS);
  const [passwordFormData, setPasswordFormData] = useState(EMPTY_PASSWORD);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [savedProfile, setSavedProfile] = useState(EMPTY_PROFILE);
  const [savedBusiness, setSavedBusiness] = useState(EMPTY_BUSINESS);

  useEffect(() => {
    document.title = 'Settings - Dukanbill';
  }, []);

  useEffect(() => {
    if (user) {
      const profile = getProfile(user);
      const business = getBusiness(user);
      setProfileFormData(profile);
      setBusinessDetailsFormData(business);
      setSavedProfile(profile);
      setSavedBusiness(business);
      setDataLoading(false);
    }
  }, [user]);

  const profileDirty = useMemo(() => JSON.stringify(profileFormData) !== JSON.stringify(savedProfile), [profileFormData, savedProfile]);
  const businessDirty = useMemo(() => JSON.stringify(businessDetailsFormData) !== JSON.stringify(savedBusiness), [businessDetailsFormData, savedBusiness]);
  const passwordChecks = useMemo(() => {
    const password = passwordFormData.newPassword;
    return [
      { label: 'At least 8 characters', passed: password.length >= 8 },
      { label: 'One uppercase letter', passed: /[A-Z]/.test(password) },
      { label: 'One lowercase letter', passed: /[a-z]/.test(password) },
      { label: 'One number', passed: /\d/.test(password) },
      { label: 'One special character (@$!%*?&)', passed: /[@$!%*?&]/.test(password) },
    ];
  }, [passwordFormData.newPassword]);
  const passwordStrength = passwordChecks.filter((rule) => rule.passed).length;
  const passwordStrengthLabel = passwordStrength <= 2 ? 'Needs work' : passwordStrength <= 4 ? 'Almost there' : 'Strong password';

  const tabs = [
    { id: 'profile', label: 'Profile', mobileLabel: 'Profile', icon: FaUserCircle, description: 'Your account and shop name' },
    { id: 'business', label: 'Business details', mobileLabel: 'Business', icon: FaStore, description: 'GST, contact and bank details' },
    { id: 'password', label: 'Security', mobileLabel: 'Security', icon: FaShieldAlt, description: 'Password and account security' },
  ];

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBusinessDetailsChange = (e) => {
    const { name, value } = e.target;
    const normalizedValue = ['gstin', 'pan', 'ifscCode'].includes(name) ? value.toUpperCase() : value;
    setBusinessDetailsFormData((prev) => ({ ...prev, [name]: normalizedValue }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({ ...prev, [name]: '', ...(name === 'newPassword' ? { rules: '' } : {}) }));
  };

  const validatePassword = (password) => {
    const errors = {};
    if (password.length < 8) errors.length = 'Use at least 8 characters.';
    if (!/[A-Z]/.test(password)) errors.uppercase = 'Add an uppercase letter.';
    if (!/[a-z]/.test(password)) errors.lowercase = 'Add a lowercase letter.';
    if (!/\d/.test(password)) errors.number = 'Add a number.';
    if (!/[@$!%*?&]/.test(password)) errors.special = 'Add a special character (@$!%*?&).';
    return errors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileDirty) {
      toast('Your profile is already up to date.');
      return;
    }
    if (profileFormData.name.trim().length < 2 || profileFormData.name.trim().length > 50) {
      toast.error('Name must be between 2 and 50 characters.');
      return;
    }
    if (profileFormData.phone && (profileFormData.phone.trim().length < 10 || profileFormData.phone.trim().length > 20)) {
      toast.error('Phone number must be between 10 and 20 characters.');
      return;
    }
    if (profileFormData.shopName.trim().length < 2 || profileFormData.shopName.trim().length > 100) {
      toast.error('Shop name must be between 2 and 100 characters.');
      return;
    }

    const result = await updateProfile({
      name: profileFormData.name.trim(),
      phone: profileFormData.phone.trim(),
      shopName: profileFormData.shopName.trim(),
    });
    if (result?.success) {
      setSavedProfile({ ...profileFormData, name: profileFormData.name.trim(), phone: profileFormData.phone.trim(), shopName: profileFormData.shopName.trim() });
      toast.success('Profile updated successfully.');
    } else {
      toast.error(result?.message || 'Could not update profile.');
    }
  };

  const handleBusinessDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!businessDirty) {
      toast('Business details are already up to date.');
      return;
    }
    if (businessDetailsFormData.gstin && !/^[0-9A-Z]{15}$/.test(businessDetailsFormData.gstin)) {
      toast.error('GSTIN should contain 15 letters/numbers.');
      return;
    }
    if (businessDetailsFormData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(businessDetailsFormData.pan)) {
      toast.error('Please check the PAN format.');
      return;
    }
    if (businessDetailsFormData.businessEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessDetailsFormData.businessEmail)) {
      toast.error('Please enter a valid business email.');
      return;
    }

    const result = await updateProfile({ businessDetails: businessDetailsFormData });
    if (result?.success) {
      setSavedBusiness({ ...businessDetailsFormData });
      toast.success('Business details saved successfully.');
    } else {
      toast.error(result?.message || 'Could not save business details.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!passwordFormData.currentPassword) errors.currentPassword = 'Enter your current password.';
    if (!passwordFormData.newPassword) errors.newPassword = 'Enter a new password.';
    else Object.assign(errors, validatePassword(passwordFormData.newPassword));
    if (!passwordFormData.confirmPassword) errors.confirmPassword = 'Confirm your new password.';
    else if (passwordFormData.newPassword !== passwordFormData.confirmPassword) errors.confirmPassword = 'Passwords do not match.';

    setPasswordErrors(errors);
    if (Object.keys(errors).length) return;

    const result = await changePassword({
      currentPassword: passwordFormData.currentPassword,
      newPassword: passwordFormData.newPassword,
      confirmPassword: passwordFormData.confirmPassword,
    });
    if (result?.success) {
      toast.success('Password changed successfully.');
      setPasswordFormData(EMPTY_PASSWORD);
      setPasswordErrors({});
      setShowPasswords({ current: false, new: false, confirm: false });
    } else {
      toast.error(result?.message || 'Could not change password.');
    }
  };

  const resetProfile = () => setProfileFormData({ ...savedProfile });
  const resetBusiness = () => setBusinessDetailsFormData({ ...savedBusiness });
  const togglePasswordVisibility = (field) => setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));



  return (
    <Layout>
      <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-slate-50/80 px-2 py-3 min-[360px]:px-3 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
        <div className="mx-auto w-full min-w-0 max-w-6xl">
          <header className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 px-3 py-4 text-white shadow-lg shadow-indigo-950/10 sm:mb-6 sm:rounded-3xl sm:px-6 sm:py-7 lg:px-8 lg:py-8">
            <div className="flex min-w-0 flex-col gap-4 sm:gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-start gap-2.5 min-[360px]:gap-3 sm:gap-4">
                <div className="flex h-10 w-10 min-[360px]:h-12 min-[360px]:w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-xl backdrop-blur"><FaShieldAlt /></div>
                <div>
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.1em] text-indigo-200 min-[360px]:text-[10px] min-[360px]:tracking-[0.12em] sm:text-xs sm:tracking-[0.18em]">DUKANBILL · ACCOUNT CENTER</p>
                  <h1 className="text-xl font-extrabold tracking-tight min-[360px]:text-2xl sm:text-3xl">Settings</h1>
                  <p className="mt-1 max-w-xl break-words text-sm leading-5 text-indigo-100/80 sm:leading-6">Manage your profile, business information and account security in one place.</p>
                </div>
              </div>
              <div className="flex min-w-0 w-full items-center gap-2 rounded-xl border border-white/15 bg-white/10 p-2.5 backdrop-blur min-[360px]:p-3 sm:rounded-2xl sm:p-3.5 md:w-auto md:max-w-[320px]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full min-[360px]:h-10 min-[360px]:w-10 bg-white/15 text-lg"><FaUser /></div>
                <div className="min-w-0">
                  <p className="max-w-full truncate text-sm font-bold">{user?.name || 'Your account'}</p>
                  <p className="max-w-full truncate text-xs text-indigo-100/80">{user?.email || 'Account settings'}</p>
                </div>
                <FaCheckCircle className="ml-1 shrink-0 text-emerald-300" title="Account loaded" />
              </div>
            </div>
          </header>

          {dataLoading ? (
            <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
              <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-[520px] animate-pulse rounded-2xl bg-white shadow-sm" />
            </div>
          ) : (
            <div className="grid min-w-0 grid-cols-1 items-start gap-4 sm:gap-5 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
<aside className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm min-[360px]:p-2 sm:p-2.5 lg:sticky lg:top-5">
  <p className="hidden px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:block">
    Account preferences
  </p>

  <nav 
    className="flex items-center justify-around gap-1 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:justify-start lg:flex-col lg:overflow-visible" 
    aria-label="Settings sections"
  >
    {tabs.map((tab) => {
      const Icon = tab.icon;
      const active = activeTab === tab.id;
      const dirty = (tab.id === 'profile' && profileDirty) || (tab.id === 'business' && businessDirty);
      
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id)}
          aria-current={active ? 'page' : undefined}
          title={tab.label}
          className={`group relative flex items-center justify-center gap-1.5 rounded-xl p-2 text-left transition-all duration-200 sm:min-w-[118px] sm:flex-1 sm:justify-start sm:gap-3 sm:px-3 sm:py-3 lg:min-w-0 lg:flex-none ${
            active 
              ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          {/* Icon Wrapper (Centered on Mobile) */}
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition sm:h-9 sm:w-9 ${
            active 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
              : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
          }`}>
            <Icon size={18} />
          </span>

          {/* Label & Description (Hidden on Mobile, Visible from sm: up) */}
          <span className="hidden min-w-0 flex-1 sm:block">
            <span className="block whitespace-nowrap text-sm font-bold text-slate-800">
              {tab.label}
            </span>
            <span className="hidden truncate text-[11px] text-slate-400 lg:block">
              {tab.description}
            </span>
          </span>

          {/* Unsaved Changes Indicator Dot */}
          {dirty && (
            <span 
              className="absolute top-1 right-1 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400 ring-2 ring-white sm:relative sm:top-0 sm:right-0 sm:h-2 sm:w-2 sm:ring-0" 
              title="Unsaved changes" 
            />
          )}

          {/* Active Arrow for Desktop */}
          {active && <FaArrowRight className="hidden text-xs lg:block" />}
        </button>
      );
    })}
  </nav>

  {/* Quick Tip Box */}
  <div className="mx-2 mt-3 hidden rounded-xl bg-slate-50 p-3 lg:block">
    <div className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700">
      <FaInfoCircle className="text-indigo-500" /> Quick tip
    </div>
    <p className="text-xs leading-5 text-slate-500">
      Business details appear on your invoices. Double-check GSTIN, PAN and payment details before saving.
    </p>
  </div>
</aside>

              <main className="min-w-0">
                {activeTab === 'profile' && (
                  <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm sm:rounded-2xl" key="profile-panel">
                    <div className="border-b border-slate-100 px-3 py-3.5 min-[360px]:px-3.5 min-[360px]:py-4 sm:px-6 sm:py-5 lg:px-7 lg:py-6">
                      <SectionHeading icon={FaUserCircle} eyebrow="Personal workspace" title="Profile information" description="Keep your account details and shop identity up to date." />
                      {profileDirty && <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800"><span className="h-2 w-2 rounded-full bg-amber-500" /> You have unsaved profile changes.</div>}
                    </div>
                    <form onSubmit={handleProfileSubmit} className="min-w-0 space-y-5 px-3 py-4 min-[360px]:px-3.5 sm:px-6 sm:py-6 lg:px-7 lg:py-7">
                      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 sm:gap-5">
                        <Field label="Full name" name="name" value={profileFormData.name} onChange={handleProfileChange} placeholder="Enter your full name" icon={FaUser} autoComplete="name" hint="Use 2–50 characters." required />
                        <Field label="Phone number" name="phone" value={profileFormData.phone} onChange={handleProfileChange} placeholder="Enter phone number" icon={FaPhone} autoComplete="tel" inputMode="tel" hint="Use 10–20 characters." />
                        <Field label="Shop name" name="shopName" value={profileFormData.shopName} onChange={handleProfileChange} placeholder="Your shop or business name" icon={FaStore} autoComplete="organization" hint="Use 2–100 characters." required className="lg:col-span-2" />
                        <Field label="Email address" name="accountEmail" value={user?.email || ''} onChange={() => {}} placeholder="Email address" icon={FaEnvelope} hint="Email address cannot be changed here." readOnly className="lg:col-span-2" />
                      </div>
                      <div className="flex flex-col-reverse gap-2.5 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-5">
                        <ActionButton type="button" variant="secondary" icon={FaRedoAlt} onClick={resetProfile} disabled={!profileDirty || isLoading}>Discard changes</ActionButton>
                        <ActionButton type="submit" loading={isLoading} disabled={!profileDirty || isLoading}>Save profile</ActionButton>
                      </div>
                    </form>
                  </section>
                )}

                {activeTab === 'business' && (
                  <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm sm:rounded-2xl" key="business-panel">
                    <div className="border-b border-slate-100 px-3 py-3.5 min-[360px]:px-3.5 min-[360px]:py-4 sm:px-6 sm:py-5 lg:px-7 lg:py-6">
                      <SectionHeading icon={FaBuilding} eyebrow="Invoice identity" title="Business details" description="These details may be displayed on your business invoices and receipts." />
                      {businessDirty && <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800"><span className="h-2 w-2 rounded-full bg-amber-500" /> You have unsaved business changes.</div>}
                    </div>
                    <form onSubmit={handleBusinessDetailsSubmit} className="min-w-0 space-y-6 px-3 py-4 min-[360px]:px-3.5 sm:space-y-7 sm:px-6 sm:py-6 lg:px-7 lg:py-7">
                      <section>
                        <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3"><FaIdCard className="text-indigo-500" /><h3 className="text-sm font-bold text-slate-800">Tax registration</h3></div>
                        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 sm:gap-5">
                          <Field label="GSTIN" name="gstin" value={businessDetailsFormData.gstin} onChange={handleBusinessDetailsChange} placeholder="15-character GSTIN" icon={FaIdCard} maxLength={15} hint="Letters and numbers; automatically capitalized." />
                          <Field label="PAN" name="pan" value={businessDetailsFormData.pan} onChange={handleBusinessDetailsChange} placeholder="ABCDE1234F" icon={FaIdCard} maxLength={10} hint="10-character PAN format." />
                        </div>
                      </section>
                      <section>
                        <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3"><FaMapMarkerAlt className="text-indigo-500" /><h3 className="text-sm font-bold text-slate-800">Business contact</h3></div>
                        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 sm:gap-5">
                          <div className="lg:col-span-2"><label htmlFor="businessAddress" className="mb-1.5 block text-sm font-semibold text-slate-700">Business address</label><textarea id="businessAddress" name="businessAddress" value={businessDetailsFormData.businessAddress} onChange={handleBusinessDetailsChange} placeholder="Enter the complete address to show on invoices" rows={3} className="w-full min-w-0 resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 min-[360px]:px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" /></div>
                          <Field label="Business phone" name="businessPhone" value={businessDetailsFormData.businessPhone} onChange={handleBusinessDetailsChange} placeholder="Business contact number" icon={FaPhone} inputMode="tel" />
                          <Field label="Business email" name="businessEmail" value={businessDetailsFormData.businessEmail} onChange={handleBusinessDetailsChange} placeholder="shop@example.com" icon={FaEnvelope} type="email" />
                        </div>
                      </section>
                      <section>
                        <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3"><FaUniversity className="text-indigo-500" /><h3 className="text-sm font-bold text-slate-800">Bank and digital payments</h3></div>
                        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 sm:gap-5">
                          <Field label="Bank name" name="bankName" value={businessDetailsFormData.bankName} onChange={handleBusinessDetailsChange} placeholder="e.g. State Bank of India" icon={FaUniversity} className="lg:col-span-2" />
                          <Field label="Account number" name="accountNumber" value={businessDetailsFormData.accountNumber} onChange={handleBusinessDetailsChange} placeholder="Enter account number" icon={FaCreditCard} inputMode="numeric" autoComplete="off" />
                          <Field label="IFSC code" name="ifscCode" value={businessDetailsFormData.ifscCode} onChange={handleBusinessDetailsChange} placeholder="e.g. SBIN0001234" icon={FaUniversity} maxLength={11} />
                          <Field label="UPI ID (optional)" name="upiId" value={businessDetailsFormData.upiId} onChange={handleBusinessDetailsChange} placeholder="shop@upi" icon={FaCreditCard} className="lg:col-span-2" />
                        </div>
                      </section>
                      <div className="flex flex-col-reverse gap-2.5 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-5">
                        <ActionButton type="button" variant="secondary" icon={FaRedoAlt} onClick={resetBusiness} disabled={!businessDirty || isLoading}>Discard changes</ActionButton>
                        <ActionButton type="submit" loading={isLoading} disabled={!businessDirty || isLoading}>Save business details</ActionButton>
                      </div>
                    </form>
                  </section>
                )}

                {activeTab === 'password' && (
                  <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm sm:rounded-2xl" key="security-panel">
                    <div className="border-b border-slate-100 px-3 py-3.5 min-[360px]:px-3.5 min-[360px]:py-4 sm:px-6 sm:py-5 lg:px-7 lg:py-6">
                      <SectionHeading icon={FaShieldAlt} eyebrow="Account protection" title="Change password" description="Choose a unique password that is difficult to guess." />
                    </div>
                    <form onSubmit={handlePasswordSubmit} className="min-w-0 space-y-5 px-3 py-4 min-[360px]:px-3.5 sm:px-6 sm:py-6 lg:px-7 lg:py-7">
                      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 sm:gap-5">
                        <PasswordField label="Current password" name="currentPassword" placeholder="Enter current password" autoComplete="current-password" passwordFormData={passwordFormData} passwordErrors={passwordErrors} showPasswords={showPasswords} onChange={handlePasswordChange} onToggle={togglePasswordVisibility} />
                        <div className="hidden md:block" />
                        <PasswordField label="New password" name="newPassword" placeholder="Create a strong password" autoComplete="new-password" passwordFormData={passwordFormData} passwordErrors={passwordErrors} showPasswords={showPasswords} onChange={handlePasswordChange} onToggle={togglePasswordVisibility} />
                        <PasswordField label="Confirm new password" name="confirmPassword" placeholder="Re-enter new password" autoComplete="new-password" passwordFormData={passwordFormData} passwordErrors={passwordErrors} showPasswords={showPasswords} onChange={handlePasswordChange} onToggle={togglePasswordVisibility} />
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <div><h3 className="text-sm font-bold text-slate-800">Password strength</h3><p className="mt-0.5 text-xs text-slate-500">Meet all five requirements to continue.</p></div>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${passwordStrength === 5 ? 'bg-emerald-100 text-emerald-700' : passwordStrength >= 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>{passwordFormData.newPassword ? passwordStrengthLabel : 'Not entered'}</span>
                        </div>
                        <div className="mb-4 grid grid-cols-5 gap-1.5" aria-label={`Password strength ${passwordStrength} out of 5`}>
                          {[1, 2, 3, 4, 5].map((level) => <div key={level} className={`h-1.5 rounded-full transition-colors ${passwordStrength >= level ? (passwordStrength === 5 ? 'bg-emerald-500' : passwordStrength >= 3 ? 'bg-amber-400' : 'bg-rose-400') : 'bg-slate-200'}`} />)}
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {passwordChecks.map((rule) => <div key={rule.label} className={`flex items-center gap-2 text-xs transition-colors ${rule.passed ? 'text-emerald-700' : 'text-slate-500'}`}><span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${rule.passed ? 'bg-emerald-100' : 'bg-slate-200'}`}>{rule.passed ? <FaCheck size={9} /> : <FaTimes size={9} />}</span>{rule.label}</div>)}
                        </div>
                        {passwordFormData.confirmPassword && <p className={`mt-3 text-xs font-semibold ${passwordFormData.newPassword === passwordFormData.confirmPassword ? 'text-emerald-700' : 'text-rose-600'}`}>{passwordFormData.newPassword === passwordFormData.confirmPassword ? 'Passwords match.' : 'Passwords do not match yet.'}</p>}
                      </div>
                      <div className="flex flex-col-reverse gap-2.5 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-5">
                        <ActionButton type="button" variant="secondary" icon={FaRedoAlt} onClick={() => { setPasswordFormData(EMPTY_PASSWORD); setPasswordErrors({}); setShowPasswords({ current: false, new: false, confirm: false }); }} disabled={isLoading || (!passwordFormData.currentPassword && !passwordFormData.newPassword && !passwordFormData.confirmPassword)}>Clear fields</ActionButton>
                        <ActionButton type="submit" loading={isLoading} disabled={isLoading || !passwordFormData.currentPassword || !passwordFormData.newPassword || !passwordFormData.confirmPassword || passwordStrength !== 5 || passwordFormData.newPassword !== passwordFormData.confirmPassword} icon={FaKey}>Update password</ActionButton>
                      </div>
                    </form>
                  </section>
                )}

                <div className="mt-3 flex min-w-0 items-start gap-2 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-3 text-xs leading-5 text-slate-500 sm:mt-4 sm:px-4">
                  <FaInfoCircle className="mt-0.5 shrink-0 text-indigo-500" />
                  <p>Changes are sent to your existing Dukanbill account service. Keep your bank details and password private, and verify invoice details before sharing them with customers.</p>
                </div>
              </main>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
