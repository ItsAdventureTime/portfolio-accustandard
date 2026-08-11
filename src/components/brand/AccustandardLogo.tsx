'use client';

import React from 'react';
import logoImg from '../../../public/photo_2026-08-01_23-55-07.jpg';

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

  const logoSrc = typeof logoImg === 'string' ? logoImg : logoImg.src || '/photo_2026-08-01_23-55-07.jpg';

  return (
    <div className={`flex items-center select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc}
        alt="AccuStandard Medical and Diagnostic Supplies Corporation"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className={`${heightClasses} w-auto object-contain block`}
      />
    </div>
  );
};
