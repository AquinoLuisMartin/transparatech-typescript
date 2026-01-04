/**
 * Google reCAPTCHA v3 Configuration
 */

// reCAPTCHA v3 Site Key (Public Key)
// Replace with your actual site key from Google reCAPTCHA Admin Console
export const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Test key

// reCAPTCHA v3 Actions
export const RECAPTCHA_ACTIONS = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgot_password'
} as const;

// reCAPTCHA v3 Score Thresholds
export const RECAPTCHA_THRESHOLDS = {
  HIGH: 0.9,    // Very likely human
  MEDIUM: 0.5,  // Likely human
  LOW: 0.3      // Possible bot
} as const;

// reCAPTCHA v3 Configuration Options
export const RECAPTCHA_CONFIG = {
  size: 'invisible' as const,
  theme: 'light' as const,
  badge: 'bottomright' as const,
  isolated: false,
  hl: 'en'
} as const;

// Environment check
export const isRecaptchaEnabled = (): boolean => {
  return Boolean(RECAPTCHA_SITE_KEY && RECAPTCHA_SITE_KEY !== '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI');
};

// Development mode check
export const isDevelopmentMode = (): boolean => {
  return import.meta.env.MODE === 'development' || import.meta.env.DEV;
};