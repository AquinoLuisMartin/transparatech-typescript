import React, { useRef, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { RECAPTCHA_SITE_KEY, RECAPTCHA_CONFIG, isRecaptchaEnabled, isDevelopmentMode } from '../../config/recaptcha';
import { useRecaptcha } from '../../services/recaptchaService';

interface RecaptchaWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * reCAPTCHA v3 Wrapper Component
 * Provides invisible reCAPTCHA v3 protection for forms
 */
const RecaptchaWrapper: React.FC<RecaptchaWrapperProps> = ({ 
  children, 
  className = '' 
}) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { setRecaptchaRef } = useRecaptcha();

  useEffect(() => {
    // Set the recaptcha reference in the service
    if (recaptchaRef.current) {
      setRecaptchaRef(recaptchaRef.current);
    }

    return () => {
      setRecaptchaRef(null);
    };
  }, [setRecaptchaRef]);

  // Don't render reCAPTCHA in development if not configured
  if (isDevelopmentMode() && !isRecaptchaEnabled()) {
    return (
      <div className={className}>
        {children}
        {/* Development mode indicator */}
        <div 
          className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded-lg text-sm z-50"
          style={{ fontSize: '12px', maxWidth: '300px' }}
        >
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Dev Mode: reCAPTCHA disabled</span>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if reCAPTCHA is not configured in production
  if (!isRecaptchaEnabled()) {
    console.error('reCAPTCHA site key not configured');
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      {children}
      {/* Invisible reCAPTCHA v3 */}
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={RECAPTCHA_SITE_KEY}
        size={RECAPTCHA_CONFIG.size}
        theme={RECAPTCHA_CONFIG.theme}
        badge={RECAPTCHA_CONFIG.badge}
        isolated={RECAPTCHA_CONFIG.isolated}
        hl={RECAPTCHA_CONFIG.hl}
        style={{ display: 'none' }} // Make it invisible
      />
    </div>
  );
};

export default RecaptchaWrapper;