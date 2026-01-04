import React, { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './TermsConditions.module.css';
import '../Landing/Home.css';

// Navigation and footer assets
import navLogo from '../../images/navlogo.png';
import HexadevsLogo from '../../images/HevadevsFooter.png';

const TermsConditions: FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavigationHeader: FC = () => (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrollY > 50 || isMobileMenuOpen ? 'bg-blue-900 shadow-lg' : 'bg-blue-900'
    } text-white`}>
      <div className="header-container relative">
        <div className="header-content flex justify-between items-center py-4">
          <div className="logo-container flex items-center gap-3">
            <div className="flex items-center">
              <img src={navLogo} alt="PUPSMB Logo" className="w-10 h-10 sm:w-14 sm:h-14 object-contain drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white leading-tight">PUPSMB TransparaTech</h1>
              <p className="text-white text-xs sm:text-sm opacity-90">Official Management System of PUPSMB</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="nav-link !text-white hover:text-blue-200 transition-colors">Home</Link>
            <Link to="/about" className="nav-link !text-white hover:text-blue-200 transition-colors">About</Link>
            <Link to="/#features" className="nav-link !text-white hover:text-blue-200 transition-colors">Features</Link>
            <Link to="/auth/signup" className="nav-link !text-white hover:text-blue-200 transition-colors">Get Started</Link>

            <div className="flex items-center gap-3 ml-4">
              <Link
                to="/auth/signin"
                className="px-4 py-2 rounded-md text-sm font-bold text-white border border-white/30 transition-all duration-200 hover:bg-white/10 hover:border-white/50"
              >
                Log In
              </Link>

              <Link
                to="/auth/signup"
                className="px-4 py-2 rounded-md text-sm font-bold bg-white text-blue-900 transition-all duration-200 hover:bg-blue-50 shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`lg:hidden absolute top-full left-0 w-full bg-blue-900 border-t border-white/10 shadow-xl transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col p-6 space-y-4">
            <Link to="/" className="text-left text-white text-lg font-medium py-2 border-b border-white/10 hover:text-blue-200 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" className="text-left text-white text-lg font-medium py-2 border-b border-white/10 hover:text-blue-200 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/#features" className="text-left text-white text-lg font-medium py-2 border-b border-white/10 hover:text-blue-200 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
            
            <div className="flex flex-col gap-3 mt-4 pt-2">
              <Link
                to="/auth/signin"
                className="w-full text-center px-4 py-3 rounded-lg text-base font-bold text-white border border-white/30 hover:bg-white/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/auth/signup"
                className="w-full text-center px-4 py-3 rounded-lg text-base font-bold bg-white text-blue-900 hover:bg-blue-50 transition-colors shadow-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <div className={`${styles.termsPage} min-h-screen bg-gray-50`}>
      <NavigationHeader />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Terms & Conditions</h1>
          <p className={styles.heroSubtitle}>
            Please read these terms and conditions carefully before using the TransparaTech Portal
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.contentCard}>
            
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
              <p className={styles.sectionText}>
                By using the TransparaTech / PUP Sta. Maria Campus Transparency Portal ("the Portal"), you agree to these Terms & Conditions. If you do not agree, please discontinue use of the Portal.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Purpose of the Portal</h2>
              <p className={styles.sectionText}>
                The Portal is a digital platform designed to promote transparency, accountability, and good governance within the Polytechnic University of the Philippines—Sta. Maria Campus. It centralizes the submission, review, and management of organizational and financial reports.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>3. User Accounts</h2>
              <ul className={styles.list}>
                <li>Users must register using valid credentials.</li>
                <li>You are responsible for maintaining the confidentiality of your login details.</li>
                <li>Any unauthorized use of your account should be reported immediately.</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Acceptable Use</h2>
              <p className={styles.sectionText}>You agree to:</p>
              <ul className={styles.list}>
                <li>Use the Portal solely for transparency, governance, and reporting purposes.</li>
                <li>Submit truthful, accurate, and complete information.</li>
                <li>Avoid tampering, hacking, or interfering with Portal operations.</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Intellectual Property</h2>
              <p className={styles.sectionText}>
                All text, graphics, layout, and system design within the Portal are owned by TransparaTech / PUP Sta. Maria Campus. You may not copy, reproduce, or redistribute materials without permission.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>6. No Warranty</h2>
              <ul className={styles.list}>
                <li>The Portal is provided "as is."</li>
                <li>We do not guarantee uninterrupted operation, error-free performance, or absolute security.</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>7. Limitation of Liability</h2>
              <ul className={styles.list}>
                <li>TransparaTech / PUP Sta. Maria Campus is not liable for indirect or consequential damages.</li>
                <li>Direct liability is limited to the maximum extent permitted by Philippine law.</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>8. Changes to Terms</h2>
              <p className={styles.sectionText}>
                We may update these Terms periodically. The updated version will be posted with a new effective date.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>9. Governing Law</h2>
              <p className={styles.sectionText}>
                These Terms follow applicable laws of the Philippines.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>10. Contact Information</h2>
              <p className={styles.sectionText}>
                For inquiries regarding these Terms, contact: <a href="mailto:support@transparatech.edu.ph" className={styles.emailLink}>support@transparatech.edu.ph</a>
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-blue-950 text-white py-16">
        <div className="w-full px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start justify-between">
            
            {/* Left Section: PUPSMB Logo and Copyright */}
            <div className="flex flex-col items-center lg:items-start gap-6">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
                <img 
                  src={navLogo} 
                  alt="PUPSMB Logo" 
                  className="w-16 h-16 object-contain"
                />
                <div className="text-center lg:text-left">
                  <p className="text-white font-medium">© Hexadevs 2025</p>
                  <p className="text-white/80 text-sm mt-1">All Rights Reserved</p>
                </div>
              </div>
            </div>

            {/* Center Section: Links */}
            <div className="text-center">
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-white hover:text-blue-200 transition-colors duration-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-white hover:text-blue-200 transition-colors duration-200">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-white hover:text-blue-200 transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/faqs" className="text-white hover:text-blue-200 transition-colors duration-200">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right Section: HEXADEVS Logo and Text */}
            <div className="flex flex-col items-center lg:items-end gap-6 lg:pr-8">
              <div className="flex flex-col items-center lg:items-end gap-2">
                <p className="text-white font-medium lg:text-right">Developed By</p>
                <img 
                  src={HexadevsLogo} 
                  alt="Hexadevs Logo" 
                  width="134"
                  height="67"
                  className="object-contain"
                />
              </div>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsConditions;