import React from 'react';

type NotificationType = 'info' | 'success' | 'error' | 'warning';

interface Props {
  message: string;
  type?: NotificationType;
  onDismiss: () => void;
}

const colors: Record<NotificationType, { bg: string; border: string; text: string }> = {
  info: { bg: '#eaf3ff', border: '#cfe3ff', text: '#0b57a6' },
  success: { bg: '#e6ffed', border: '#c7f0d6', text: '#1b7f3a' },
  error: { bg: '#fff1f0', border: '#ffd6d6', text: '#a12a2a' },
  warning: { bg: '#fff8e6', border: '#ffecb8', text: '#8a5f00' }
};

const NotificationPopup: React.FC<Props> = ({ message, type = 'info', onDismiss }) => {
  const style = {
    position: 'fixed' as const,
    top: 20,
    right: 20,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: colors[type].bg,
    color: colors[type].text,
    border: `1px solid ${colors[type].border}`,
    padding: '10px 14px',
    borderRadius: 8,
    boxShadow: '0 8px 24px rgba(2,6,23,0.12)',
    minWidth: 260,
    maxWidth: 420
  };

  return (
    <div role="status" aria-live="polite" aria-atomic="true" style={style}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {type === 'success' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M20 6L9 17l-5-5" stroke={colors[type].text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {type === 'error' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 9v4" stroke={colors[type].text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16h.01" stroke={colors[type].text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {type === 'info' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <circle cx="12" cy="12" r="10" stroke={colors[type].text} strokeWidth="2" />
            <path d="M12 8v4" stroke={colors[type].text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 16h.01" stroke={colors[type].text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {type === 'warning' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={colors[type].text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      <div style={{ flex: 1, fontSize: '0.95rem' }}>{message}</div>

      <button
        aria-label="Dismiss notification"
        onClick={onDismiss}
        style={{
          background: 'transparent',
          border: 'none',
          color: colors[type].text,
          cursor: 'pointer',
          fontSize: 16,
          lineHeight: 1
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default NotificationPopup;
