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
        {/* SVG Vector Replica of photo_2026-08-01_23-55-07.jpg */}
        <svg
          viewBox="0 0 520 110"
          className="h-full w-auto object-contain"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main ACCUSTANDARD text in Deep Royal Blue */}
          <text
            x="5"
            y="65"
            fill="#1E3A8A"
            fontSize="62"
            fontWeight="900"
            fontFamily="Arial Black, Impact, sans-serif"
            letterSpacing="-1"
          >
            ACCUSTANDARD
          </text>

          {/* Rx Graphic & D in Red & Navy */}
          <text
            x="410"
            y="65"
            fill="#DC2626"
            fontSize="68"
            fontWeight="900"
            fontFamily="Georgia, serif"
            fontStyle="italic"
          >
            Rx
          </text>

          <text
            x="475"
            y="65"
            fill="#1E3A8A"
            fontSize="62"
            fontWeight="900"
            fontFamily="Arial Black, Impact, sans-serif"
          >
            D
          </text>

          {/* Red Underline Bar */}
          <path d="M 5 76 L 405 76 L 415 76 L 415 82 L 5 82 Z" fill="#DC2626" />

          {/* Subtitle text */}
          <text
            x="8"
            y="98"
            fill="#0F172A"
            fontSize="18"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
            letterSpacing="0.5"
          >
            MEDICAL AND DIAGNOSTIC SUPPLIES CORPORATION
          </text>
        </svg>
      </div>
    </div>
  );
};
