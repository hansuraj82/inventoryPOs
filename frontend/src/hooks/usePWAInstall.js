import { useEffect, useRef, useState, useCallback } from 'react';

export function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installationPrompt, setInstallationPrompt] = useState(null);
  const deferredPromptRef = useRef(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      deferredPromptRef.current = event;
      setInstallationPrompt(event);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setInstallationPrompt(null);
      deferredPromptRef.current = null;
      localStorage.setItem('pwa_installed', 'true');
    };

    const handleWindowBeforeUnload = () => {
      deferredPromptRef.current = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('beforeunload', handleWindowBeforeUnload);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('beforeunload', handleWindowBeforeUnload);
    };
  }, []);

  const triggerInstall = useCallback(async () => {
    if (!deferredPromptRef.current) {
      console.warn('Install prompt not available');
      return false;
    }

    try {
      setIsInstalling(true);
      deferredPromptRef.current.prompt();
      const { outcome } = await deferredPromptRef.current.userChoice;

      if (outcome === 'accepted') {
        setIsInstallable(false);
        setInstallationPrompt(null);
        deferredPromptRef.current = null;
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('PWA install error:', error);
      return false;
    } finally {
      setIsInstalling(false);
    }
  }, []);

  const dismissInstallPrompt = useCallback(() => {
    setIsInstallable(false);
    setInstallationPrompt(null);
    deferredPromptRef.current = null;
    localStorage.setItem('pwa_install_dismissed', 'true');
  }, []);

  const isStandalone = () => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    );
  };

  return {
    isInstallable,
    isInstalling,
    installationPrompt,
    triggerInstall,
    dismissInstallPrompt,
    isStandalone: isStandalone(),
    isPWASupported: 'serviceWorker' in navigator
  };
}
