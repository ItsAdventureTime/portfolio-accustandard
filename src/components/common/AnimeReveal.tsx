'use client';

import { animate } from 'animejs';
import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';
import { useEffect, useRef } from 'react';

interface AnimeRevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Small, non-essential entrance cue. Content remains fully visible when the
 * user prefers reduced motion or when JavaScript is unavailable.
 */
export function AnimeReveal({ children, className, ...props }: AnimeRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const animation = animate(node, {
      opacity: [0, 1],
      y: [8, 0],
      duration: 280,
      ease: 'out(4)',
    });

    return () => {
      animation.pause();
    };
  }, []);

  return (
    <div
      {...props}
      ref={ref}
      className={clsx('anime-reveal', className)}
      data-motion="animejs"
    >
      {children}
    </div>
  );
}
