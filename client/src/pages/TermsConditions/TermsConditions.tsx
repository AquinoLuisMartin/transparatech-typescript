import React, { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './TermsConditions.module.css';
import '../Landing/Home.css';

// Navigation and footer assets
import navLogo from '../../images/navlogo.png';
import HexadevsLogo from '../../images/HevadevsFooter.png';

const TermsConditions: FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavigationHeader: FC = () => (
    <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${
      scrollY > 50 ? 'bg-blue-900/95 backdrop-blur-md shadow-lg' : 'bg-blue-900'
    } text-white`}>
      <div className="header-container">
        <div className="header-content">
          <div className="logo-container">
            <div className="flex items-center mr-3">
              <img src={navLogo} alt="PUPSMB Logo" className="w-14 h-14 object-contain drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">PUPSMB TransparaTech</h1>
              <p className="text-white text-sm">Official Management System of PUPSMB</p>
            </div>
          </div>
          
          <nav className="nav-menu flex items-center">
            <Link to="/" className="nav-link !text-white">Home</Link>
            <Link to="/about" className="nav-link !text-white">About</Link>
            <Link to="/#features" className="nav-link !text-white">Features</Link>
            <Link to="/auth/signup" className="nav-link !text-white mr-4">Get Started</Link>

            {/* Header-aligned Log In / Sign Up buttons */}
            <div className="ml-6 flex items-center gap-3">
              <Link
                to="/auth/signin"
                className="px-3 py-1 rounded-md text-sm font-extrabold text-white border border-white/20 transition-colors duration-150 hover:bg-white/20 hover:shadow-md"
                style={{ background: 'transparent' }}
              >
                Log In
              </Link>

              <Link
                to="/auth/signup"
                className="px-3 py-1 rounded-md text-sm font-extrabold bg-white text-[#365487] transition-colors duration-150 hover:bg-blue-100 hover:text-blue-900 hover:shadow-md border border-white/30"
              >
                Sign Up
              </Link>
            </div>
          </nav>
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