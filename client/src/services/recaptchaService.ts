import ReCAPTCHA from 'react-google-recaptcha';
import { RECAPTCHA_ACTIONS, isRecaptchaEnabled, isDevelopmentMode } from '../config/recaptcha';

/**
 * reCAPTCHA v3 Service for handling Google reCAPTCHA integration
 */
export class RecaptchaService {
  private static instance: RecaptchaService;
  private recaptchaRef: ReCAPTCHA | null = null;

  private constructor() {}

  public static getInstance(): RecaptchaService {
    if (!RecaptchaService.instance) {
      RecaptchaService.instance = new RecaptchaService();
    }
    return RecaptchaService.instance;
  }

  /**
   * Set the reCAPTCHA reference
   */
  setRecaptchaRef(ref: ReCAPTCHA | null): void {
    this.recaptchaRef = ref;
  }

  /**
   * Execute reCAPTCHA v3 and get token
   */
  async executeRecaptcha(action: string): Promise<string | null> {
    try {
      // Skip reCAPTCHA in development mode if not configured
      if (isDevelopmentMode() && !isRecaptchaEnabled()) {
        console.warn('reCAPTCHA skipped in development mode - configure VITE_RECAPTCHA_SITE_KEY for production');
        return 'dev_bypass_token';
      }

      if (!this.recaptchaRef) {
        throw new Error('reCAPTCHA not initialized');
      }

      if (!isRecaptchaEnabled()) {
        throw new Error('reCAPTCHA not configured - missing site key');
      }

      // Execute reCAPTCHA v3
      const token = await this.recaptchaRef.executeAsync();
      
      if (!token) {
        throw new Error('Failed to get reCAPTCHA token');
      }

      console.log(`reCAPTCHA executed successfully for action: ${action}`);
      return token;

    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      
      // In development mode, return a bypass token
      if (isDevelopmentMode()) {
        console.warn('Falling back to development bypass token');
        return 'dev_bypass_token';
      }
      
      throw error;
    }
  }

  /**
   * Reset reCAPTCHA
   */
  resetRecaptcha(): void {
    if (this.recaptchaRef) {
      this.recaptchaRef.reset();
    }
  }

  /**
   * Get reCAPTCHA token for login action
   */
  async getLoginToken(): Promise<string | null> {
    return this.executeRecaptcha(RECAPTCHA_ACTIONS.LOGIN);
  }

  /**
   * Get reCAPTCHA token for registration action
   */
  async getRegisterToken(): Promise<string | null> {
    return this.executeRecaptcha(RECAPTCHA_ACTIONS.REGISTER);
  }

  /**
   * Get reCAPTCHA token for forgot password action
   */
  async getForgotPasswordToken(): Promise<string | null> {
    return this.executeRecaptcha(RECAPTCHA_ACTIONS.FORGOT_PASSWORD);
  }

  /**
   * Check if reCAPTCHA is properly configured
   */
  isConfigured(): boolean {
    return isRecaptchaEnabled();
  }
}

/**
 * reCAPTCHA v3 Hook for React components
 */
export const useRecaptcha = () => {
  const service = RecaptchaService.getInstance();

  return {
    executeRecaptcha: service.executeRecaptcha.bind(service),
    resetRecaptcha: service.resetRecaptcha.bind(service),
    getLoginToken: service.getLoginToken.bind(service),
    getRegisterToken: service.getRegisterToken.bind(service),
    getForgotPasswordToken: service.getForgotPasswordToken.bind(service),
    setRecaptchaRef: service.setRecaptchaRef.bind(service),
    isConfigured: service.isConfigured.bind(service)
  };
};