'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  contentClassName?: string;
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
}) => (
  <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md" />
      <Dialog.Content
        className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 focus:outline-none ${contentClassName}`}
      >
        <Dialog.Title className="sr-only">{title}</Dialog.Title>
        {description && <Dialog.Description className="sr-only">{description}</Dialog.Description>}
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
