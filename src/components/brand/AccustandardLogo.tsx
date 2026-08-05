'use client';

import React from 'react';

interface AccustandardLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AccustandardLogo: React.FC<AccustandardLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const heightClasses = {
    sm: 'h-7',
    md: 'h-9 sm:h-10',
    lg: 'h-12 sm:h-14',
  }[size];

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div className={`flex flex-col justify-center ${heightClasses}`}>
        {/* SVG Vector Logo matching official Accustandard logo specification */}
        <svg
          viewBox="0 0 580 95"
          className="h-full w-auto object-contain"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main ACCUSTANDARD title in Deep Royal Blue */}
          <text
            x="0"
            y="52"
            fill="#1E3A8A"
            fontSize="54"
            fontWeight="900"
            fontFamily="Impact, 'Arial Black', sans-serif"
            letterSpacing="1"
          >
            ACCUSTANDARD
          </text>

          {/* Solid Red Divider Bar */}
          <rect x="0" y="60" width="580" height="5" fill="#DC2626" rx="1.5" />

          {/* Subtitle: MEDICAL AND DIAGNOSTIC SUPPLIES CORPORATION */}
          <text
            x="0"
            y="85"
            fill="#0F172A"
            fontSize="18"
            fontWeight="800"
            fontFamily="'Helvetica Neue', Arial, sans-serif"
            letterSpacing="0.4"
          >
            MEDICAL AND DIAGNOSTIC SUPPLIES CORPORATION
          </text>
        </svg>
      </div>
    </div>
  );
};
