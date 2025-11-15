import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

// Type definitions
interface FormData {
  firstName: string;
  lastName: string;
  middleInitial: string;
  email: string;
  studentNumber: string;
  schoolNumber: string;
  accountType: 'member' | 'officer' | 'administrator';
  organization: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

interface FormTouched {
  [key: string]: boolean;
}

interface OrganizationOption {
  value: string;
  label: string;
}

interface PasswordStrength {
  level: 'empty' | 'weak' | 'medium' | 'strong';
  score: number;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    middleInitial: '',
    email: '',
    studentNumber: '',
    schoolNumber: '', 
    accountType: 'member',
    organization: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [closeHover, setCloseHover] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [agreed, setAgreed] = useState<boolean>(false);
  const [checkboxError, setCheckboxError] = useState<string>('');
  // New inline modal state and active tab
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  // Toast notification for success
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>('');
  const toastTimer = useRef<number | null>(null);

  const studentOrgs: OrganizationOption[] = [
    { value: 'isite', label: 'ISITE' },
    { value: 'aces', label: 'ACES' },
    { value: 'jpia', label: 'JPIA' },
    { value: 'aft', label: 'AFT' },
    { value: 'hmsoc', label: 'HMSOC' },
    { value: 'cem', label: 'CEM' },
    { value: 'domt', label: 'DOMT' }
  ];

  const adminTypes: OrganizationOption[] = [
    { value: 'coa', label: 'Commission on Audit (COA)' },
    { value: 'oss', label: 'Office of Student Services (OSS)' },
    { value: 'cosoa', label: 'Commission on Student Organizations and Accreditation (COSOA)' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;

    // Filter out non-letter characters for name fields
    let filteredValue = value;
    if (name === 'firstName' || name === 'lastName') {
      // Only allow letters (A-Z, a-z)
      filteredValue = value.replace(/[^A-Za-z]/g, '');
    } else if (name === 'middleInitial') {
      // Only allow letters and limit to 2 characters
      filteredValue = value.replace(/[^A-Za-z]/g, '').slice(0, 2);
    }

    // Reset organization when account type changes
    if (name === 'accountType') {
      setFormData({
        ...formData,
        [name]: filteredValue as FormData['accountType'],
        organization: '' // Reset organization selection
      });
    } else {
      setFormData({
        ...formData,
        [name]: filteredValue
      });
    }

    // Special-case: studentNumber gets real-time validation while typing (only for member/officer)
    if (name === 'studentNumber') {
      // mark as interacted
      setTouched(prev => ({ ...prev, studentNumber: true }));
      validateField('studentNumber', filteredValue);
      return;
    }

    // Real-time validation only if the user already touched the field
    if (touched[name]) validateField(name, filteredValue);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name } = e.target;
    setFocusedField(name);
    // mark touched when user focuses (they interacted)
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFocusedField(null);
    // validate on blur and mark touched
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  // Open modal and set active tab (terms | privacy)
  const openModal = (tab: 'terms' | 'privacy') => {
    setActiveTab(tab);
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    setIsModalOpen(true);
    // prevent background scroll
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // restore focus
    if (previouslyFocused.current) previouslyFocused.current.focus();
    document.body.style.overflow = '';
  };

  // Handle ESC to close and trap focus while modal is open
  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        // Focus trap
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    // focus the modal container's first focusable element
    requestAnimationFrame(() => {
      if (!modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable && focusable.length) focusable[0].focus();
    });

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isModalOpen]);

  // cleanup toast timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  // Validation helpers
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // strict student number format for members/officers: 20XX-XXXXX-SM-0
  const studentNumberPattern = /^20\d{2}-\d{5}-SM-0$/;
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  // name validation patterns - letters only (A-Z, a-z)
  const namePattern = /^[A-Za-z]+$/;

  const validateField = (name: string, value: string): boolean => {
    let message = '';

    if (['lastName', 'firstName', 'studentNumber', 'schoolNumber', 'email', 'organization', 'password', 'confirmPassword', 'accountType'].includes(name)) {
      if (!value || value.toString().trim() === '') {
        message = 'This field is required.';
      }
    }

    // Name validation for firstName, lastName
    if (!message && (name === 'firstName' || name === 'lastName')) {
      if (value && !namePattern.test(value)) {
        message = 'Only letters (A–Z) are allowed.';
      }
    }

    if (!message && name === 'email') {
      if (value && !emailPattern.test(value)) {
        message = 'Please enter a valid email address.';
      }
    }

    if (!message && name === 'middleInitial') {
      // optional field, but if provided must be 1-2 alphabetic characters
      if (value) {
        const miPattern = /^[A-Za-z]{1,2}$/;
        if (!miPattern.test(value)) {
          message = 'Middle initial must be 1–2 letters (A–Z).';
        }
      }
    }

    if (!message && name === 'studentNumber') {
      // Enforce strict pattern for Member, Officer, and certain Administrator types (COA, COSOA)
      const adminRequiresStudentNumber = formData.accountType === 'administrator' && (formData.organization === 'coa' || formData.organization === 'cosoa');
      if (formData.accountType === 'member' || formData.accountType === 'officer' || adminRequiresStudentNumber) {
        if (value && !studentNumberPattern.test(value)) {
          message = 'Please enter a valid student number (20XX-XXXXX-SM-0).';
        }
      }
    }

    // schoolNumber currently only required for administrators; no specific format enforced yet
    if (!message && name === 'schoolNumber') {
      // required handled above; no extra format rule for now
    }

    if (!message && name === 'password') {
      if (value && !passwordPattern.test(value)) {
        message = 'Password must be at least 8 characters, include an uppercase letter, a number, and a special character.';
      }
    }

    if (!message && name === 'confirmPassword') {
      if (value && value !== formData.password) {
        message = 'Passwords do not match.';
      }
    }

    // If password changed, re-validate confirmPassword
    if (name === 'password' && formData.confirmPassword) {
      validateField('confirmPassword', formData.confirmPassword);
    }

    setErrors(prev => ({ ...prev, [name]: message }));
    return message === '';
  };

  const validateAll = (): boolean => {
    // Determine which identifier field to validate for administrators
    const adminUsesStudentNumber = formData.accountType === 'administrator' && (formData.organization === 'coa' || formData.organization === 'cosoa');
    const idField = formData.accountType === 'administrator' ? (adminUsesStudentNumber ? 'studentNumber' : 'schoolNumber') : 'studentNumber';
    const toValidate = ['accountType','lastName','firstName', idField,'email','organization','password','confirmPassword'];
    let ok = true;
    toValidate.forEach(field => {
      const value = formData[field as keyof FormData] || '';
      const valid = validateField(field, value.toString());
      if (!valid) ok = false;
    });
    return ok;
  };

  const getPasswordStrength = (pwd: string): PasswordStrength => {
    if (!pwd) return { level: 'empty', score: 0 };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { level: 'weak', score: 1 };
    if (score === 2 || score === 3) return { level: 'medium', score: 2 };
    return { level: 'strong', score: 3 };
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = (): void => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // Real-time validation before submit
    const ok = validateAll();
    if (!ok) {
      // focus first error field optionally
      alert('Please fix the errors in the form before submitting.');
      return;
    }
    // Ensure Terms checkbox is checked
    if (!agreed) {
      setCheckboxError('Please agree to the Terms of Use and Privacy Policy before continuing.');
      return;
    }

    try {
      const response = await axios.post('/api/v1/auth/register', formData);

      if (response.data.success) {
        // show toast notification
        setToastText('You have successfully created an account.');
        setToastVisible(true);
        // reset form state
        setFormData({
          firstName: '',
          lastName: '',
          middleInitial: '',
          email: '',
          studentNumber: '',
          schoolNumber: '',
          accountType: 'member',
          organization: '',
          password: '',
          confirmPassword: ''
        });
        setTouched({});
        setErrors({});
        setAgreed(false);
        setCheckboxError('');

        // auto-dismiss toast after 4s and then navigate to sign-in
        if (toastTimer.current) window.clearTimeout(toastTimer.current);
        toastTimer.current = window.setTimeout(() => {
          setToastVisible(false);
          setToastText('');
          navigate('/auth/signin');
        }, 4000);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message || 'An error occurred during registration.');
      } else {
        alert('An unexpected error occurred.');
      }
    }
  };

  // Pure client-side quick validity check (doesn't mutate errors state)
  const isFormValid = (): boolean => {
    // required fields (use schoolNumber for admin, studentNumber for others)
  const adminUsesStudentNumber = formData.accountType === 'administrator' && (formData.organization === 'coa' || formData.organization === 'cosoa');
  const required = ['accountType','lastName','firstName', (formData.accountType === 'administrator' ? (adminUsesStudentNumber ? 'studentNumber' : 'schoolNumber') : 'studentNumber'),'email','organization','password','confirmPassword'];
    for (const f of required) {
      const v = formData[f as keyof FormData] || '';
      if (v.toString().trim() === '') return false;
    }
    if (!emailPattern.test(formData.email)) return false;
    // enforce strict student number format only for member/officer
    // enforce strict student number format for members/officers and for admins of COA/COSOA
    if (formData.accountType === 'member' || formData.accountType === 'officer' || (formData.accountType === 'administrator' && (formData.organization === 'coa' || formData.organization === 'cosoa'))) {
      if (!studentNumberPattern.test(formData.studentNumber)) return false;
    }
    if (!passwordPattern.test(formData.password)) return false;
    if (formData.password !== formData.confirmPassword) return false;
    return true;
  };

  const getRoleTitle = (): string => {
    return 'Create Your Account';
  };

  const getLoginLink = (): string => {
    return '/auth/signin';
  };

  // UI helpers: when admin is selected but no admin 'organization' chosen, lock other fields
  const isAdmin = formData.accountType === 'administrator';
  const adminOrgNotSelected = isAdmin && !formData.organization;
  // Dynamic labels for administrator sub-types
  const schoolNumberLabel = (() => {
    if (!isAdmin) return 'Student Number';
    if (formData.organization === 'oss') return 'Faculty Number';
    if (formData.organization === 'coa' || formData.organization === 'cosoa') return 'Student Number';
    return 'School Number';
  })();
  const emailLabel = (() => {
    if (isAdmin && formData.organization === 'oss') return 'Faculty Email';
    return 'Email';
  })();

  return (
    <div className="signup">
      <div className="signup__container">
        <form className="signup__form" onSubmit={handleSubmit} style={{ position: 'relative' }}>
          {/* Close (X) button - absolute positioned in the top-right of the signup card */}
          <button
            type="button"
            aria-label="Close signup"
            onClick={() => navigate('/')}
            onMouseEnter={() => setCloseHover(true)}
            onMouseLeave={() => setCloseHover(false)}
            className="signup__close-btn"
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
          <header className="signup__header">
            <div className="signup__logo">
              <div className="logo-circle">PUP</div>
            </div>
            <h2 className="signup__title" style={{ color: '#1565c0' }}>{getRoleTitle()}</h2>
            <p className="signup__subtitle">Fill in the details below to get started.</p>
          </header>
          {/* Account Type first */}
          <div className="form-field" style={{ marginBottom: 12 }}>
            <label htmlFor="accountType" className="form-field__label">
              Account Type<span className="required-asterisk"> *</span>
            </label>
            <select
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              className={`form-field__select ${(errors.accountType && touched.accountType) ? 'input-error' : ''}`}
            >
              <option value="member">Organization Member (Viewer)</option>
              <option value="officer">Officer</option>
              <option value="administrator">Administrator</option>
            </select>
            <div className="error-row">
              <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.accountType && errors.accountType) ? 1 : 0 }}>
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="error-text" aria-live="polite">{touched.accountType && errors.accountType ? errors.accountType : '\u00A0'}</p>
            </div>
          </div>

          {/* Grid layout: two columns with specified rows */}
          <div className="signup__grid">
            {/* Row: Organization/Administration Type | Last Name */}
            <div className="form-field">
              <label htmlFor="organization" className="form-field__label">
                {formData.accountType === 'administrator' ? 'Administration Type' : 'Organization'}
                <span className="required-asterisk"> *</span>
              </label>
              <select
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                  required
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className={`form-field__select ${(errors.organization && touched.organization) ? 'input-error' : ''}`}
                  disabled={!formData.accountType}
              >
                <option value="">{formData.accountType === 'administrator' ? 'Select One' : 'Select your organization'}</option>
                {formData.accountType === 'administrator'
                  ? adminTypes.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))
                  : studentOrgs.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
              </select>
              <div className="error-row">
                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.organization && errors.organization) ? 1 : 0 }}>
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="error-text" aria-live="polite">{touched.organization && errors.organization ? errors.organization : '\u00A0'}</p>
              </div>

              {/* Info message for administrators when admin type not selected */}
              {isAdmin && !formData.organization && (
                <div className="info-row" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, color: '#1976d2' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M12 9v2m0 4h.01" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div>
                    Please select your Administration Type to proceed.
                  </div>
                </div>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="lastName" className="form-field__label">
                Last Name<span className="required-asterisk"> *</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  disabled={adminOrgNotSelected}
                  required
                  placeholder="Letters only (e.g., Dela Cruz)"
                  className={`form-field__input ${(errors.lastName && touched.lastName) ? 'input-error' : ''}`}
              />
              <div className="error-row">
                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.lastName && errors.lastName) ? 1 : 0 }}>
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="error-text" aria-live="polite">{touched.lastName && errors.lastName ? errors.lastName : '\u00A0'}</p>
              </div>
            </div>

            {/* Row: First Name | Middle Initial */}
            <div className="form-field">
              <label htmlFor="firstName" className="form-field__label">
                First Name<span className="required-asterisk"> *</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  disabled={adminOrgNotSelected}
                  required
                  placeholder="Letters only (e.g., Juan)"
                  className={`form-field__input ${(errors.firstName && touched.firstName) ? 'input-error' : ''}`}
              />
              <div className="error-row">
                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.firstName && errors.firstName) ? 1 : 0 }}>
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="error-text" aria-live="polite">{touched.firstName && errors.firstName ? errors.firstName : '\u00A0'}</p>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="middleInitial" className="form-field__label">
                Middle Initial
              </label>
              <input
                type="text"
                id="middleInitial"
                name="middleInitial"
                value={formData.middleInitial}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  disabled={adminOrgNotSelected}
                  placeholder="Letters only (e.g., M)"
                  maxLength={2}
                  className={`form-field__input ${(errors.middleInitial && touched.middleInitial) ? 'input-error' : ''}`}
              />
              <div className="error-row">
                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.middleInitial && errors.middleInitial) ? 1 : 0 }}>
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="error-text" aria-live="polite">{touched.middleInitial && errors.middleInitial ? errors.middleInitial : '\u00A0'}</p>
              </div>
            </div>

            {/* Row: Student Number | Email */}
            <div className="form-field">
              {formData.accountType === 'administrator' ? (
                (formData.organization === 'coa' || formData.organization === 'cosoa') ? (
                  <>
                    <label htmlFor="studentNumber" className="form-field__label">
                      Student Number<span className="required-asterisk"> *</span>
                    </label>
                    <input
                      type="text"
                      id="studentNumber"
                      name="studentNumber"
                      value={formData.studentNumber}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      disabled={adminOrgNotSelected}
                      required
                      placeholder="2022-00098-SM-0"
                      className={`form-field__input ${(errors.studentNumber && touched.studentNumber) ? 'input-error' : ''}`}
                    />
                    <div className="error-row">
                      <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.studentNumber && errors.studentNumber) ? 1 : 0 }}>
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="error-text" aria-live="polite">{touched.studentNumber && errors.studentNumber ? errors.studentNumber : '\u00A0'}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <label htmlFor="schoolNumber" className="form-field__label">
                      {schoolNumberLabel}<span className="required-asterisk"> *</span>
                    </label>
                    <input
                      type="text"
                      id="schoolNumber"
                      name="schoolNumber"
                      value={formData.schoolNumber}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      disabled={adminOrgNotSelected}
                      required
                      placeholder="Faculty Number"
                      className={`form-field__input ${(errors.schoolNumber && touched.schoolNumber) ? 'input-error' : ''}`}
                    />
                    <div className="error-row">
                      <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.schoolNumber && errors.schoolNumber) ? 1 : 0 }}>
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="error-text" aria-live="polite">{touched.schoolNumber && errors.schoolNumber ? errors.schoolNumber : '\u00A0'}</p>
                    </div>
                  </>
                )
              ) : (
                <>
                  <label htmlFor="studentNumber" className="form-field__label">
                    Student Number<span className="required-asterisk"> *</span>
                  </label>
                  <input
                    type="text"
                    id="studentNumber"
                    name="studentNumber"
                    value={formData.studentNumber}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={adminOrgNotSelected}
                    required
                    placeholder="2022-00098-SM-0"
                    className={`form-field__input ${(errors.studentNumber && touched.studentNumber) ? 'input-error' : ''}`}
                  />
                  <div className="error-row">
                    <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.studentNumber && errors.studentNumber) ? 1 : 0 }}>
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="error-text" aria-live="polite">{touched.studentNumber && errors.studentNumber ? errors.studentNumber : '\u00A0'}</p>
                  </div>
                </>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="email" className="form-field__label">
                {emailLabel}<span className="required-asterisk"> *</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  disabled={adminOrgNotSelected}
                  required
                  placeholder="your.email@pupsmb.edu.ph"
                  className={`form-field__input ${(errors.email && touched.email) ? 'input-error' : ''}`}
              />
              <div className="error-row">
                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.email && errors.email) ? 1 : 0 }}>
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="error-text" aria-live="polite">{touched.email && errors.email ? errors.email : '\u00A0'}</p>
              </div>
            </div>

            {/* Row: Password | Confirm Password */}
            <div className="form-field">
              <label htmlFor="password" className="form-field__label">
                Password<span className="required-asterisk"> *</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  disabled={adminOrgNotSelected}
                  required
                  placeholder="••••••••"
                  className={`form-field__input password-input ${(errors.password && touched.password) ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={togglePasswordVisibility}
                  disabled={adminOrgNotSelected}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg 
                    className="password-toggle-icon" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    {showPassword ? (
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    ) : (
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    )}
                  </svg>
                </button>
              </div>
              {/* Password rules list shown only when password field is focused (fade-in) */}
              <ul className={`password-rules ${focusedField === 'password' ? 'show' : ''}`}>
                <li>At least 8 characters</li>
                <li>Include uppercase letters</li>
                <li>Include numbers</li>
                <li>Include special characters</li>
              </ul>
              {/* Password strength bar */}
              <div className="password-strength" aria-live="polite">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: formData.password ? `${(getPasswordStrength(formData.password).score / 3) * 100}%` : '0%',
                      background: getPasswordStrength(formData.password).level === 'weak' ? '#d32f2f' : getPasswordStrength(formData.password).level === 'medium' ? '#f9a825' : '#43a047'
                    }}
                  />
                </div>
                <div className="strength-label">{formData.password ? (getPasswordStrength(formData.password).level === 'weak' ? 'Weak' : getPasswordStrength(formData.password).level === 'medium' ? 'Medium' : 'Strong') : '\u00A0'}</div>
              </div>
              <div className="error-row">
                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.password && errors.password) ? 1 : 0 }}>
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="error-text" aria-live="polite">{touched.password && errors.password ? errors.password : '\u00A0'}</p>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword" className="form-field__label">
                Confirm Password<span className="required-asterisk"> *</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  disabled={adminOrgNotSelected}
                  required
                  placeholder="••••••••"
                  className={`form-field__input password-input ${(errors.confirmPassword && touched.confirmPassword) ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={toggleConfirmPasswordVisibility}
                  disabled={adminOrgNotSelected}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <svg 
                    className="password-toggle-icon" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    {showConfirmPassword ? (
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    ) : (
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    )}
                  </svg>
                </button>
              </div>
              {/* Removed duplicate real-time match indicator to keep a single, consistent error/info message below */}

              <div className="error-row">
                {touched.confirmPassword && errors.confirmPassword ? (
                  <>
                    <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="error-text" aria-live="polite">{errors.confirmPassword}</p>
                  </>
                ) : formData.confirmPassword && formData.password === formData.confirmPassword ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M20 6L9 17l-5-5" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p className="error-text" aria-live="polite" style={{ color: '#2e7d32' }}>Password matches</p>
                  </>
                ) : (
                  <p className="error-text" aria-live="polite">{'\u00A0'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Terms checkbox - left aligned just above submit */}
          <div style={{ marginTop: 12 }}>
            <label className="checkbox-field">
              <input
                type="checkbox"
                className="checkbox-field__input"
                checked={agreed}
                onChange={(e) => { setAgreed(e.target.checked); if (e.target.checked) setCheckboxError(''); }}
                aria-required
              />
              <span className="checkbox-field__label">
                I agree to the{' '}
                <button type="button" onClick={() => openModal('terms')} className="signup__link-btn" style={{ cursor: 'pointer', textDecoration: 'underline' }}><strong>Terms of Use</strong></button>
                {' '}and{' '}
                <button type="button" onClick={() => openModal('privacy')} className="signup__link-btn" style={{ cursor: 'pointer', textDecoration: 'underline' }}><strong>Privacy Policy</strong></button>
                {' '}*
              </span>
            </label>
            {checkboxError && (
              <div className="error-text" style={{ marginTop: 6 }}>{checkboxError}</div>
            )}
          </div>

          <button
            type="submit"
            className="signup__submit-btn"
            disabled={!isFormValid() || adminOrgNotSelected || !agreed}
          >
            Create Account
          </button>


          <div className="signup__footer">
            <p className="signup__footer-text">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate(getLoginLink())}
                className="signup__link-btn"
                style={{ color: '#1565c0', background: 'transparent', border: 'none', padding: 0 }}
              >
                <strong>Log in</strong>
              </button>
            </p>
          </div>
        </form>
        {/* Inline Terms / Privacy modal (controlled by isModalOpen & activeTab) */}
        {isModalOpen && (
          <div className="modal-backdrop" onClick={() => closeModal()} aria-hidden>
            <div
              className="modal-container"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              aria-describedby="modal-desc"
              onClick={(e) => e.stopPropagation()}
              ref={modalRef}
            >
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M12 2l6 3v6c0 5-3.58 9.74-6 11-2.42-1.26-6-6-6-11V5l6-3z" fill="#1565c0" />
                    <path d="M9 11l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h3 id="modal-title" className="modal-title">{activeTab === 'terms' ? 'Terms of Use' : 'Privacy Policy'}</h3>
                </div>
                <button className="modal-close" onClick={() => closeModal()} aria-label="Close modal">✕</button>
              </div>

              <div className="modal-tabs" role="tablist" aria-label="Policy Tabs">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'terms'}
                  className={`modal-tab ${activeTab === 'terms' ? 'active' : ''}`}
                  onClick={() => setActiveTab('terms')}
                >
                  Terms of Use
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'privacy'}
                  className={`modal-tab ${activeTab === 'privacy' ? 'active' : ''}`}
                  onClick={() => setActiveTab('privacy')}
                >
                  Privacy Policy
                </button>
              </div>

              <div id="modal-desc" className="modal-body">
                {activeTab === 'terms' ? (
                  <div className="policy-content">
                    <div className="section-title">
                      <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="false" role="img" aria-label="Introduction icon">
                        <title>File Text</title>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#1565c0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2v6h6" stroke="#1565c0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 13h8M8 17h8M8 9h3" stroke="#1565c0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <strong>Introduction</strong>
                    </div>
                    <p>Welcome to [Institution Name]!</p>
                    <p>By creating an account and using this system, you agree to the following:</p>

                    <div className="section-title">
                      <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" role="img" aria-label="Account Registration icon">
                        <title>User</title>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <strong>Account Registration</strong>
                    </div>
                    <p>You are responsible for keeping your login credentials secure and for all activities under your account.</p>

                    <div className="section-title">
                      <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" role="img" aria-label="Acceptable Use icon">
                        <title>Scale</title>
                        <path d="M21 10h-6" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 10H3" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 3v7" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 21h16" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <strong>Acceptable Use Policy</strong>
                    </div>
                    <p>This portal is intended for academic and administrative purposes only. Unauthorized access or misuse is prohibited.</p>

                    <div className="section-title">
                      <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" role="img" aria-label="User Content icon">
                        <title>Folder</title>
                        <path d="M3 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <strong>User Content</strong>
                    </div>
                    <p>Users are responsible for the content they upload. Respect copyright and institutional policies.</p>

                    <div className="section-title">
                      <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" role="img" aria-label="Service Availability icon">
                        <title>Refresh</title>
                        <path d="M21 12a9 9 0 1 0-3.16 6.36" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 3v6h-6" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <strong>Service Availability</strong>
                    </div>
                    <p>The system may be temporarily unavailable due to maintenance or technical issues.</p>

                    <div className="section-title">
                      <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" role="img" aria-label="Account Termination icon">
                        <title>User X</title>
                        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18 8l-4 4M18 12l-4-4" stroke="#d32f2f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <strong>Account Termination</strong>
                    </div>
                    <p>Accounts that violate policies may be suspended or terminated.</p>

                    <div className="section-title">
                      <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" role="img" aria-label="Limitation of Liability icon">
                        <title>Alert Triangle</title>
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 9v4M12 17h.01" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <strong>Limitation of Liability</strong>
                    </div>
                    <p>The institution is not liable for indirect or consequential damages arising from use of the service.</p>

                    <div className="section-title">
                      <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" role="img" aria-label="Changes to Terms icon">
                        <title>Settings</title>
                        <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06c.52-.52.73-1.28.33-1.82A1.65 1.65 0 0 0 4 12.6H3a2 2 0 1 1 0-4h.09c.53 0 1.04-.21 1.41-.59.37-.37.59-.88.59-1.41V4a2 2 0 1 1 4 0v.09c0 .53.21 1.04.59 1.41.37.37.88.59 1.41.59H12a1.65 1.65 0 0 0 1.51 1c.53 0 1.04.21 1.41.59.37.37.59.88.59 1.41V12c0 .53.21 1.04.59 1.41.37.37.88.59 1.41.59H20a2 2 0 1 1 0 4h-.6c-.64 0-1.25.25-1.71.71z" stroke="#6b7280" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <strong>Changes to Terms</strong>
                    </div>
                    <p>Terms may change over time. Continued use signifies your acceptance of any updates.</p>
                  </div>
                ) : (
                  <div className="policy-content">
                    <div className="section-title">
                      <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" role="img" aria-label="Data Collection icon">
                        <title>Database</title>
                        <rect x="3" y="3" width="18" height="4" rx="2" stroke="#6b7280" strokeWidth="1.5"/>
                        <path d="M21 7v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <strong>Data Collection</strong>
                    </div>
                    <p>We collect information necessary to provide the service and improve your experience.</p>

                    <div className="section-title">
                      <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" role="img" aria-label="Usage icon">
                        <title>Usage</title>
                        <path d="M3 12h3l3 8 4-16 3 10h4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <strong>Usage</strong>
                    </div>
                    <p>Data helps us analyze usage patterns and improve functionality.</p>

                    <div className="section-title">
                      <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" role="img" aria-label="Sharing icon">
                        <title>Share</title>
                        <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 3v12" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 7l4-4 4 4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <strong>Sharing</strong>
                    </div>
                    <p>We only share data with trusted third-parties where necessary and per legal obligations.</p>

                    <div className="section-title">
                      <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" role="img" aria-label="Security icon">
                        <title>Lock</title>
                        <rect x="3" y="11" width="18" height="10" rx="2" stroke="#6b7280" strokeWidth="1.5"/>
                        <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <strong>Security</strong>
                    </div>
                    <p>We use reasonable safeguards to protect your data, but no system is completely secure.</p>

                    <div className="section-title">
                      <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" role="img" aria-label="Retention icon">
                        <title>Clock</title>
                        <circle cx="12" cy="12" r="9" stroke="#6b7280" strokeWidth="1.5"/>
                        <path d="M12 7v6l4 2" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <strong>Retention</strong>
                    </div>
                    <p>Data is retained according to institutional retention policies.</p>

                    <div className="section-title">
                      <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" role="img" aria-label="User Rights icon">
                        <title>User Rights</title>
                        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke="#6b7280" strokeWidth="1.5"/>
                        <path d="M3 21a9 9 0 0 1 18 0" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <strong>User Rights</strong>
                    </div>
                    <p>You may request access, correction, or deletion of your personal data as allowed by law.</p>

                    <div className="section-title">
                      <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" role="img" aria-label="Cookies icon">
                        <title>Cookie</title>
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12.5" cy="11.5" r="0.5" fill="#6b7280" />
                        <circle cx="9.5" cy="13.5" r="0.5" fill="#6b7280" />
                      </svg>
                      <strong>Cookies</strong>
                    </div>
                    <p>We use cookies to improve the site experience; you can manage cookie settings in your browser.</p>

                    <div className="section-title">
                      <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" role="img" aria-label="Children Privacy icon">
                        <title>Children</title>
                        <path d="M12 2a4 4 0 0 0-4 4v3h8V6a4 4 0 0 0-4-4z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <strong>Children’s Privacy</strong>
                    </div>
                    <p>The service is not directed to children under 13 and we do not knowingly collect their data.</p>

                    <div className="section-title">
                      <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" role="img" aria-label="Policy Changes icon">
                        <title>Policy Changes</title>
                        <path d="M3 5h18M3 12h18M3 19h18" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <strong>Policy Changes</strong>
                    </div>
                    <p>Privacy policies may be updated and continued use indicates acceptance.</p>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <div style={{ flex: 1, color: '#475569', fontSize: '0.9rem' }}>
                  For questions, contact us at <a href="mailto:support@example.com" style={{ color: '#1565c0' }}>support@example.com</a>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="modal-btn secondary" onClick={() => closeModal()}>Close</button>
                  <button className="modal-btn primary" onClick={() => { setAgreed(true); setCheckboxError(''); closeModal(); }}>I Understand</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Success toast (top-centered, non-modal) */}
        {toastVisible && (
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            style={{
              position: 'fixed',
              top: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#eaf3ff',
              color: '#0b57a6',
              border: '1px solid #cfe3ff',
              padding: '10px 14px',
              borderRadius: 8,
              boxShadow: '0 8px 24px rgba(2,6,23,0.2)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M20 6L9 17l-5-5" stroke="#1565c0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div style={{ fontSize: '0.95rem' }}>{toastText}</div>
            <button
              aria-label="Dismiss notification"
              onClick={() => {
                setToastVisible(false);
                setToastText('');
                if (toastTimer.current) window.clearTimeout(toastTimer.current);
              }}
              style={{
                marginLeft: 8,
                background: 'transparent',
                border: 'none',
                color: '#0b57a6',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
