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
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
  }[size];

  return (
    <div className={`flex items-center select-none ${className}`}>
      <div className={`flex flex-col justify-center ${heightClasses}`}>
        {/* Pixel-Perfect High-Definition SVG Vector Replica of photo_2026-08-01_23-55-07.jpg */}
        <svg
          viewBox="0 0 540 100"
          className="h-full w-auto object-contain"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ACCUSTANDA Main Typography */}
          <text
            x="0"
            y="54"
            fill="#1E3A8A"
            fontSize="58"
            fontWeight="900"
            fontFamily="'Impact', 'Arial Black', sans-serif"
            letterSpacing="-0.5"
          >
            ACCUSTANDA
          </text>

          {/* Rx Medical Symbol (Large Red Rx) */}
          <text
            x="395"
            y="54"
            fill="#DC2626"
            fontSize="64"
            fontWeight="900"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
          >
            R
          </text>
          <text
            x="430"
            y="70"
            fill="#DC2626"
            fontSize="46"
            fontWeight="900"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
          >
            x
          </text>

          {/* D Letter in Deep Royal Blue */}
          <text
            x="485"
            y="54"
            fill="#1E3A8A"
            fontSize="58"
            fontWeight="900"
            fontFamily="'Impact', 'Arial Black', sans-serif"
          >
            D
          </text>

          {/* Connected Red Underline Bar */}
          <rect x="0" y="62" width="410" height="5" fill="#DC2626" />
          <rect x="445" y="44" width="85" height="4" fill="#DC2626" />

          {/* Subtitle: MEDICAL AND DIAGNOSTIC SUPPLIES CORPORATION */}
          <text
            x="2"
            y="88"
            fill="#0F172A"
            fontSize="18"
            fontWeight="800"
            fontFamily="'Helvetica Neue', Arial, sans-serif"
            letterSpacing="0.2"
          >
            MEDICAL AND DIAGNOSTIC SUPPLIES CORPORATION
          </text>
        </svg>
      </div>
    </div>
  );
};
