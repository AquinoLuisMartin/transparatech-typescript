import React, { useEffect, useRef } from 'react';

interface ReCaptchaV2Props {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpired?: () => void;
  onError?: () => void;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact';
}

// Global grecaptcha type
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      render: (container: string | HTMLElement, parameters: {
        sitekey: string;
        callback?: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
        theme?: 'light' | 'dark';
        size?: 'normal' | 'compact';
      }) => number;
      getResponse: (widgetId?: number) => string;
      reset: (widgetId?: number) => void;
      execute: (widgetId?: number) => void;
    };
    onRecaptchaLoad?: () => void;
  }
}

const ReCaptchaV2: React.FC<ReCaptchaV2Props> = ({
  siteKey,
  onVerify,
  onExpired,
  onError,
  theme = 'light',
  size = 'normal'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    const loadRecaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.render && containerRef.current) {
        // Clear any existing widget
        if (widgetIdRef.current !== null) {
          try {
            window.grecaptcha.reset(widgetIdRef.current);
          } catch (e) {
            console.warn('Error resetting reCAPTCHA:', e);
          }
        }

        // Render new widget
        try {
          widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
            sitekey: siteKey,
            callback: onVerify,
            'expired-callback': onExpired,
            'error-callback': onError,
            theme: theme,
            size: size
          });
        } catch (error) {
          console.error('Error rendering reCAPTCHA:', error);
          if (onError) onError();
        }
      }
    };

    // Check if script is already loaded
    if (window.grecaptcha && window.grecaptcha.render) {
      window.grecaptcha.ready(loadRecaptcha);
    } else {
      // Wait for script to load
      const checkForGrecaptcha = setInterval(() => {
        if (window.grecaptcha && window.grecaptcha.render) {
          clearInterval(checkForGrecaptcha);
          window.grecaptcha.ready(loadRecaptcha);
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => {
        clearInterval(checkForGrecaptcha);
        console.error('reCAPTCHA script failed to load within 10 seconds');
        if (onError) onError();
      }, 10000);
    }

    // Cleanup function
    return () => {
      if (widgetIdRef.current !== null && window.grecaptcha && window.grecaptcha.reset) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch (e) {
          console.warn('Error cleaning up reCAPTCHA:', e);
        }
      }
    };
  }, [siteKey, onVerify, onExpired, onError, theme, size]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '78px'
      }}
    />
  );
};

export default ReCaptchaV2;