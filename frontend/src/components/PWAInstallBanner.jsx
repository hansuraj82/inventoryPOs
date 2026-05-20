import React, { useState, useEffect } from 'react';
import { MdDownload, MdClose, MdPhone, MdDesktopMac } from 'react-icons/md';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function PWAInstallBanner() {
  const {
    isInstallable,
    isInstalling,
    triggerInstall,
    dismissInstallPrompt,
    isStandalone,
    isPWASupported
  } = usePWAInstall();

  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Determine if mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isInstallable && !isStandalone && isPWASupported) {
      // Small delay before showing banner for smoother animation
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isStandalone, isPWASupported]);

  const handleInstall = async () => {
    const success = await triggerInstall();
    if (success) {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  };

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      dismissInstallPrompt();
    }, 300);
  };

  if (!isVisible || isStandalone) {
    return null;
  }

  // Mobile: Bottom Slide-Up Banner
  if (isMobile) {
    return (
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        {/* Backdrop Blur */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"
          onClick={handleDismiss}
        />

        {/* Banner Content */}
        <div className="relative bg-slate-900 border-t-2 border-blue-500 shadow-2xl">
          <div className="px-4 py-5 sm:px-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <MdPhone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-base sm:text-lg">
                    Install Dukanbill
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1">
                    Get the app experience on your device
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="ml-3 flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Dismiss"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-4 px-0 py-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <span>Fast & Offline</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <span>No App Store</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <span>Home Screen</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <span>Always Updated</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                disabled={isInstalling}
                className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50 text-sm"
              >
                Not Now
              </button>
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                <MdDownload className="w-4 h-4" />
                {isInstalling ? 'Installing...' : 'Install'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop: Card Component in Top-Right Corner
  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-300 ease-out transform ${
        isAnimating
          ? 'translate-x-0 translate-y-0 opacity-100 scale-100'
          : 'translate-x-96 translate-y-0 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden w-80 hover:border-blue-500/50 transition-colors">
        {/* Gradient Header */}
        <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500" />

        <div className="p-6">
          {/* Icon & Title */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
                <MdDesktopMac className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Install Dukanbill</h3>
                <p className="text-slate-400 text-xs mt-0.5">App Mode</p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Dismiss"
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-slate-300 text-sm mb-5 leading-relaxed">
            Install Dukanbill as a standalone app on your desktop for a native application experience.
          </p>

          {/* Feature List */}
          <div className="space-y-2.5 mb-6 pb-6 border-b border-slate-700">
            {[
              { icon: '⚡', text: 'Lightning Fast' },
              { icon: '📱', text: 'App-like Experience' },
              { icon: '🔄', text: 'Auto Updates' },
              { icon: '💾', text: 'Works Offline' }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <span className="text-lg">{feature.icon}</span>
                <span className="text-slate-300">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              disabled={isInstalling}
              className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 transition-colors disabled:opacity-50 text-sm"
            >
              Maybe Later
            </button>
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-blue-500/50 hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              <MdDownload className="w-4 h-4" />
              {isInstalling ? 'Installing...' : 'Get App'}
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-slate-500 text-center mt-4">
            Installs without app store • Uninstall anytime
          </p>
        </div>
      </div>
    </div>
  );
}
