import React from 'react';

export default function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        {/* Animated loader spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-white border-opacity-30"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-white animate-spin"></div>
        </div>

        {/* Loading text with animation */}
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-2">Loading</h2>
          <div className="flex gap-1 justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
            <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          </div>
        </div>

        {/* Loading progress bar */}
        <div className="w-64 h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-pulse" style={{
            width: '70%',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}></div>
        </div>
      </div>
    </div>
  );
}
