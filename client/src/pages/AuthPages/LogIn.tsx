import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import './Login.css';

interface FormData {
  email: string;
  studentNumber: string;
  password: string;
}



const LogIn: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<FormData>({ email: '', studentNumber: '', password: '' });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [closeHover, setCloseHover] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);

  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotTouched, setForgotTouched] = useState<boolean>(false);
  const [forgotError, setForgotError] = useState<string>('');
  const [forgotSuccess, setForgotSuccess] = useState<string>('');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => 
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const togglePasswordVisibility = (): void => setShowPassword(v => !v);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Prepare login data - only send filled fields
    const loginData: { password: string; email?: string; studentNumber?: string } = {
      password: formData.password
    };
    
    if (formData.email.trim()) {
      loginData.email = formData.email;
    }
    
    if (formData.studentNumber.trim()) {
      loginData.studentNumber = formData.studentNumber;
    }
    
    try {
      const response = await axios.post('/api/v1/auth/login', loginData);

      if (response.data.success) {
        const { user, accessToken } = response.data.data;
        
        console.log('Login successful! Full response:', response.data);
        console.log('User data:', user);
        console.log('Account Type:', user.accountType);
        console.log('Role ID:', user.roleId);
        
        // Map account type to role for the auth system
        let authRole = 'viewer'; // default
        const accountType = user.accountType || response.data.data.user.accountType;
        
        if (accountType === 'Administrator') {
          authRole = 'admin_full';
        } else if (accountType === 'Officer') {
          authRole = 'officer';
        } else if (accountType === 'Organization Member (Viewer)') {
          authRole = 'viewer';
        }

        const userSession = {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          studentNumber: user.studentNumber,
          accountType: user.accountType,
          role: authRole, // Use the string role, not numeric roleId
          organization: user.organization,
        };

        localStorage.setItem('userSession', JSON.stringify(userSession));
        localStorage.setItem('accessToken', accessToken);
        
        console.log('Setting auth role:', authRole);
        login(authRole);

        // Navigate based on account type from database
        
        console.log('Determining navigation for account type:', accountType);
        
        if (accountType === 'Administrator') {
          console.log('Redirecting to: /dashboard/admin');
          navigate('/dashboard/admin');
        } else if (accountType === 'Officer') {
          console.log('Redirecting to: /dashboard/officer');
          navigate('/dashboard/officer');
        } else if (accountType === 'Organization Member (Viewer)') {
          console.log('Redirecting to: /dashboard/viewer');
          navigate('/dashboard/viewer');
        } else {
          console.log('Using fallback navigation based on roleId:', user.roleId);
          // Fallback based on roleId
          switch (user.roleId) {
            case 1:
              console.log('Redirecting to: /dashboard/admin');
              navigate('/dashboard/admin');
              break;
            case 2:
              console.log('Redirecting to: /dashboard/officer');
              navigate('/dashboard/officer');
              break;
            case 3:
              console.log('Redirecting to: /dashboard/viewer');
              navigate('/dashboard/viewer');
              break;
            default:
              console.log('Redirecting to: /dashboard (default)');
              navigate('/dashboard');
          }
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Login error:', error.response.data);
        alert(error.response.data.message || 'An error occurred during login.');
      } else if (axios.isAxiosError(error) && error.request) {
        console.error('No response received:', error.request);
        alert('No response from server. Please check if the server is running.');
      } else {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };

  const handleForgotChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setForgotEmail(e.target.value);
    if (forgotTouched) {
      setForgotError(emailPattern.test(e.target.value) ? '' : 'Please enter a valid email address.');
    }
  };

  const handleForgotSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setForgotTouched(true);
    if (!forgotEmail || !emailPattern.test(forgotEmail)) {
      setForgotError('Please enter a valid email address.');
      return;
    }
    setForgotError('');
    setForgotSuccess(`Password reset link sent to ${forgotEmail}.`);
  };

  const getRoleTitle = (): string => 'User Login';
  

  return (
    <div className="login">
      <div className="login__container">
        {showForgotPassword ? (
          <form className="login__form" onSubmit={handleForgotSubmit} style={{ position: 'relative' }}>
            <header className="login__header">
              <h2 className="login__title">Forgot Password?</h2>
              <p className="login__subtitle">Enter your email address and we'll send you a link to reset your password.</p>
            </header>

            <div className="form-field">
              <label htmlFor="forgotEmail" className="form-field__label">Email Address <span style={{ color: '#d32f2f' }}>*</span></label>
              <input
                type="email"
                id="forgotEmail"
                name="forgotEmail"
                value={forgotEmail}
                onChange={handleForgotChange}
                onBlur={() => { 
                  setForgotTouched(true); 
                  if (!emailPattern.test(forgotEmail)) setForgotError('Please enter a valid email address.'); 
                }}
                required
                placeholder="your.email@pupsmb.edu.ph"
                className={`form-field__input ${forgotError ? 'input-error' : ''}`}
              />
              <div className="error-row">
                <p className="error-text" aria-live="polite">{forgotTouched && forgotError ? forgotError : '\u00A0'}</p>
              </div>
            </div>

            {!forgotSuccess ? (
              <>
                <button 
                  type="submit" 
                  className="login__submit-btn" 
                  disabled={!forgotEmail || !!forgotError || !emailPattern.test(forgotEmail)}
                >
                  Send Reset Link
                </button>
                <div style={{ textAlign: 'center' }}>
                  <button 
                    type="button" 
                    onClick={() => { setShowForgotPassword(false); setForgotSuccess(''); }} 
                    className="login__link-btn" 
                    style={{ marginTop: 8 }}
                  >
                    ← Back to Login
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <p style={{ color: '#155724', background: '#d4edda', display: 'inline-block', padding: '8px 12px', borderRadius: 6 }}>
                  {forgotSuccess}
                </p>
                <div style={{ marginTop: 12 }}>
                  <button 
                    type="button" 
                    onClick={() => setShowForgotPassword(false)} 
                    className="login__link-btn"
                  >
                    ← Back to Login
                  </button>
                </div>
              </div>
            )}
          </form>
        ) : (
          <form className="login__form" onSubmit={handleSubmit} style={{ position: 'relative' }}>
            <button
              type="button"
              aria-label="Close login"
              onClick={() => navigate('/')}
              onMouseEnter={() => setCloseHover(true)}
              onMouseLeave={() => setCloseHover(false)}
              className="login__close-btn"
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'transparent',
                border: 'none',
                padding: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke={closeHover ? '#d1d5db' : '#6b7280'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <header className="login__header">
              <h2 className="login__title">{getRoleTitle()}</h2>
            </header>

            <div className="form-field">
              <label htmlFor="email" className="form-field__label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="your.email@pupsmb.edu.ph"
                className="form-field__input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="studentNumber" className="form-field__label">Student Number</label>
              <input
                type="text"
                id="studentNumber"
                name="studentNumber"
                value={formData.studentNumber}
                onChange={handleInputChange}
                required
                placeholder="2022-00098-SM-0"
                className="form-field__input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="password" className="form-field__label">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                  className="form-field__input password-input"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <svg className="password-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" className="login__submit-btn">Log In</button>

            <div className="login__footer">
              <p className="login__footer-text">Don't have an account?{' '}
                <span
                  onClick={() => navigate('/auth/signup')}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  Sign up here
                </span>
              </p>

              <p className="login__forgot">
                <button 
                  type="button" 
                  onClick={() => { 
                    setShowForgotPassword(true); 
                    setForgotSuccess(''); 
                    setForgotEmail(''); 
                    setForgotError(''); 
                    setForgotTouched(false); 
                  }} 
                  className="login__link-btn"
                >
                  Forgot password?
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LogIn;
