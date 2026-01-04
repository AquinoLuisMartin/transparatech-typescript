import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import NotificationPopup from '../components/common/NotificationPopup';
import useNotificationsPoll from '../hooks/useNotificationsPoll';

type NotificationType = 'info' | 'success' | 'error' | 'warning';

interface Notification {
  id: number;
  message: string;
  type?: NotificationType;
  duration?: number; // ms
}

interface NotificationContextValue {
  showNotification: (message: string, type?: NotificationType, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const useNotification = (): NotificationContextValue => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [current, setCurrent] = useState<Notification | null>(null);
  const timerRef = useRef<number | null>(null);
  const idRef = useRef(1);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const dismiss = useCallback(() => {
    clearTimer();
    setCurrent(null);
  }, []);

  const showNotification = useCallback((message: string, type: NotificationType = 'info', duration = 4000) => {
    clearTimer();
    const id = idRef.current++;
    setCurrent({ id, message, type, duration });
    if (duration > 0) {
      timerRef.current = window.setTimeout(() => {
        setCurrent(null);
        timerRef.current = null;
      }, duration);
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  // Expose a small initializer component through the provider so app root can render it.
  const NotificationInitializer: React.FC<{ enabled?: boolean; endpoint?: string; intervalMs?: number }> = ({ enabled = false, endpoint, intervalMs }) => {
    // Only attach polling when explicitly enabled to avoid unnecessary requests in non-dashboard pages.
    useNotificationsPoll({ endpoint: endpoint || '/api/v1/notifications/latest', intervalMs: intervalMs || 15000, enabled });
    return null;
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {current && (
        <NotificationPopup
          key={current.id}
          message={current.message}
          type={current.type}
          onDismiss={dismiss}
        />
      )}
    </NotificationContext.Provider>
  );
};

export const NotificationInitializer: React.FC<{ enabled?: boolean; endpoint?: string; intervalMs?: number }> = ({ enabled = true, endpoint, intervalMs }) => {
  // This component must be rendered as a child of NotificationProvider to work.
  useNotificationsPoll({ endpoint: endpoint || '/api/v1/notifications/latest', intervalMs: intervalMs || 15000, enabled });
  return null;
};
