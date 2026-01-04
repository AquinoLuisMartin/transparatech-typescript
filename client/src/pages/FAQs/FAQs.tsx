import React, { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './FAQs.module.css';
import '../Landing/Home.css';

// Navigation and footer assets
import navLogo from '../../images/navlogo.png';
import HexadevsLogo from '../../images/HevadevsFooter.png';

const FAQs: FC = () => {
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
    <div className={`${styles.faqsPage} min-h-screen bg-gray-50`}>
      <NavigationHeader />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Frequently Asked Questions</h1>
          <p className={styles.heroSubtitle}>
            Find answers to common questions about the TransparaTech Portal
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.contentCard}>
            
            <div className={styles.faqItem}>
              <h3 className={styles.question}>Q: What is the Transparency Portal?</h3>
              <p className={styles.answer}>
                A: It is a digital system created to promote transparency, ethical reporting, and open governance at PUP Sta. Maria Campus. It centralizes organizational and financial documents for easy access and verification.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.question}>Q: Who can use the Portal?</h3>
              <p className={styles.answer}>
                A: Students, organization officers, and authorized administrators with valid accounts.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.question}>Q: How do I sign up?</h3>
              <p className={styles.answer}>
                A: Register using your university email. Once verified, you will gain role-based access to the system.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.question}>Q: Is my data secure?</h3>
              <p className={styles.answer}>
                A: Yes. We use encrypted connections, restricted access, and strict data-handling procedures to keep your information safe.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.question}>Q: Can I delete my account or data?</h3>
              <p className={styles.answer}>
                A: You may request deletion, but some records may be retained for official compliance and auditing requirements.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.question}>Q: How often is the Portal updated?</h3>
              <p className={styles.answer}>
                A: The system is continuously maintained. Updates may include new features, bug fixes, or improvements to transparency workflows.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.question}>Q: Who do I contact for help?</h3>
              <p className={styles.answer}>
                A: For support, email us at <a href="mailto:support@transparatech.edu.ph" className={styles.emailLink}>support@transparatech.edu.ph</a>.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-blue-950 text-white py-16">
        <div className="w-full px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start justify-between">
            
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

export default FAQs;