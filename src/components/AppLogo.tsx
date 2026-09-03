import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 rounded-lg text-xs',
    md: 'w-9 h-9 rounded-xl text-sm',
    lg: 'w-12 h-12 rounded-2xl text-base',
    xl: 'w-16 h-16 rounded-3xl text-xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  return (
    <div
      className={`relative select-none overflow-hidden shrink-0 flex items-center justify-center font-bold text-white shadow-md bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 border border-emerald-300/30 ${sizeClasses[size]} ${className}`}
      style={{
        boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.35)',
      }}
    >
      {/* Glossy top-light reflection */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
      
      {/* SVG Emblem */}
      <svg
        className={`${iconSizes[size]} relative z-10 text-white drop-shadow-sm`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    </div>
  );
};
