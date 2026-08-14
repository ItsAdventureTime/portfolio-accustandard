'use client';

import React, { useCallback, useRef, useState } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error';

export interface NotificationAction {
  label: string;
  onSelect: () => void;
}

export interface NotificationInput {
  id?: string;
  severity: NotificationSeverity;
  title?: string;
  message: string;
  action?: NotificationAction;
  duration?: number;
  mode?: 'foreground' | 'background';
}

export interface NotificationItem extends NotificationInput {
  id: string;
  dedupeKey: string;
}

const MAX_QUEUED_NOTIFICATIONS = 20;
const MAX_VISIBLE_NOTIFICATIONS = 4;
const DEFAULT_DURATION = 5000;
const SEVERITY_DURATION: Record<NotificationSeverity, number> = {
  info: 5000,
  success: 4500,
  warning: 6500,
  error: 8000,
};

const getDedupeKey = ({ id, severity, title, message }: NotificationInput) => (
  id || [severity, title || '', message].join(':')
);

export const useNotificationQueue = () => {
  const sequence = useRef(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const notify = useCallback((input: NotificationInput) => {
    setNotifications((current) => {
      const dedupeKey = getDedupeKey(input);
      if (current.some((notification) => notification.dedupeKey === dedupeKey)) return current;

      sequence.current += 1;
      const notification: NotificationItem = {
        ...input,
        id: input.id || `notification-${Date.now()}-${sequence.current}`,
        dedupeKey,
      };

      return [...current, notification].slice(-MAX_QUEUED_NOTIFICATIONS);
    });
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((current) => current.filter((notification) => notification.id !== id));
  }, []);

  return { notifications, notify, dismiss };
};

const severityMeta: Record<NotificationSeverity, {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  info: { label: 'Information', icon: Info },
  success: { label: 'Success', icon: CheckCircle2 },
  warning: { label: 'Warning', icon: TriangleAlert },
  error: { label: 'Error', icon: TriangleAlert },
};

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onDismiss }) => {
  const visibleNotifications = notifications.slice(0, MAX_VISIBLE_NOTIFICATIONS);

  return (
    <Toast.Provider duration={DEFAULT_DURATION} label="Notifications" swipeDirection="right">
      {visibleNotifications.map((notification) => {
        const meta = severityMeta[notification.severity];
        const Icon = meta.icon;
        const toastType = notification.mode ?? (
          notification.severity === 'info' ? 'background' : 'foreground'
        );

        return (
          <Toast.Root
            key={notification.id}
            open
            type={toastType}
            duration={notification.duration ?? SEVERITY_DURATION[notification.severity]}
            onOpenChange={(open) => {
              if (!open) onDismiss(notification.id);
            }}
            className="notification-toast"
            data-severity={notification.severity}
          >
            <span className="notification-toast-icon" aria-hidden="true">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="sr-only">{meta.label}: </span>
              {notification.title && <Toast.Title className="notification-toast-title">{notification.title}</Toast.Title>}
              <Toast.Description className="notification-toast-message">
                {notification.message}
              </Toast.Description>
              {notification.action && (
                <Toast.Action
                  altText={notification.action.label}
                  asChild
                  onSelect={() => {
                    notification.action?.onSelect();
                    onDismiss(notification.id);
                  }}
                >
                  <button type="button" className="notification-toast-action">
                    {notification.action.label}
                  </button>
                </Toast.Action>
              )}
            </div>
            <Toast.Close asChild>
              <button type="button" className="notification-toast-close" aria-label="Dismiss notification">
                <X className="h-4 w-4" />
              </button>
            </Toast.Close>
          </Toast.Root>
        );
      })}
      <Toast.Viewport className="notification-viewport" aria-label="Notifications" />
    </Toast.Provider>
  );
};
