import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.jsx';
import './index.css';

// Register Service Worker
const updateSW = registerSW({
  immediate: true,
  onRegistered(r) {
    console.log('✅ PWA Service Worker registered');
    if (r) {
      setInterval(() => {
        r.update();
      }, 60000); // Check for updates every minute
    }
  },
  onRegisterError(error) {
    console.error('❌ PWA Service Worker registration failed:', error);
  },
  onNeedRefresh() {
    console.log('🔄 New PWA content available');
    // Optionally show update prompt to user
    if (confirm('New version available! Reload to update?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('📵 PWA is ready to work offline');
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
