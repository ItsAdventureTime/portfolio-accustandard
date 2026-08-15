import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

export type AttentionBoxTone = 'info' | 'success' | 'warning' | 'error';

interface AttentionBoxProps extends HTMLAttributes<HTMLDivElement> {
  tone?: AttentionBoxTone;
}

/**
 * Calm emphasis surface for information that needs a visual cue without
 * turning the copy into a heavy-weight headline.
 */
export function AttentionBox({
  tone = 'info',
  className,
  ...props
}: AttentionBoxProps) {
  return (
    <div
      {...props}
      className={clsx('attention-box', className)}
      data-tone={tone}
      data-ui-pattern="smoothui-attention-box"
    />
  );
}
