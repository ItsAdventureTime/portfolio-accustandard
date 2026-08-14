'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

export type AccessibleModalVariant = 'center' | 'sheet' | 'fullscreen';
export type AccessibleModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  contentClassName?: string;
  variant?: AccessibleModalVariant;
  size?: AccessibleModalSize;
  dialogRole?: 'dialog' | 'alertdialog';
  showCloseButton?: boolean;
  closeLabel?: string;
}

/**
 * Shared shell for legacy module dialogs. Radix supplies focus entry/trap,
 * Escape handling, focus restoration, and background inertness while each
 * module keeps ownership of its existing panel content.
 */
export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  contentClassName = '',
  variant = 'center',
  size = 'lg',
  dialogRole = 'dialog',
  showCloseButton = false,
  closeLabel = 'Close dialog',
}) => {
  const viewportClassName = [
    'modal-viewport',
    `modal-viewport--${variant}`,
    `modal-viewport--${size}`,
    contentClassName,
  ].filter(Boolean).join(' ');

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content role={dialogRole} className={viewportClassName}>
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          {description && <Dialog.Description className="sr-only">{description}</Dialog.Description>}
          {showCloseButton && (
            <Dialog.Close asChild>
              <button type="button" className="modal-close modal-close--viewport" aria-label={closeLabel} title={closeLabel}>
                <span aria-hidden="true">×</span>
              </button>
            </Dialog.Close>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
