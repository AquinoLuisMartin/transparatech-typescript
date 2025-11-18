import React, { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './PrivacyPolicy.module.css';
import '../Landing/Home.css';

// Navigation and footer assets
import navLogo from '../../images/navlogo.png';
import HexadevsLogo from '../../images/HevadevsFooter.png';

const PrivacyPolicy: FC = () => {
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
    <div className={`${styles.privacyPage} min-h-screen bg-gray-50`}>
      <NavigationHeader />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Privacy Policy</h1>
          <p className={styles.heroSubtitle}>
            Learn how we protect your privacy and handle your personal information
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.contentCard}>
            
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Introduction</h2>
              <p className={styles.sectionText}>
                At TransparaTech, we value your privacy and strive to protect your personal data. This Privacy Policy explains what information we collect and how we use it within the PUP Sta. Maria Campus Transparency Portal.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Data We Collect</h2>
              <p className={styles.sectionText}>We may collect the following:</p>
              <ul className={styles.list}>
                <li><strong>Personal Information:</strong> name, email, organization, role (student/officer/admin)</li>
                <li><strong>Report Data:</strong> uploaded documents, financial statements, organizational records</li>
                <li><strong>Usage Data:</strong> login logs, device/IP info, activity logs</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>3. How Your Data Is Used</h2>
              <p className={styles.sectionText}>Your data is used for:</p>
              <ul className={styles.list}>
                <li>Account authentication and access</li>
                <li>Document submission, tracking, and verification</li>
                <li>Administrative review and transparency processes</li>
                <li>System improvements and security monitoring</li>
                <li>Official university compliance processes</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Data Sharing</h2>
              <p className={styles.sectionText}>We do not sell or rent your data.</p>
              <p className={styles.sectionText}>Data may be shared only with:</p>
              <ul className={styles.list}>
                <li>Authorized university administrators</li>
                <li>Auditors or compliance officers as required</li>
                <li>Legal authorities if required by law</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Data Retention</h2>
              <p className={styles.sectionText}>
                We retain documents and personal information as needed to support governance, record-keeping, and auditing requirements. Unnecessary or outdated data may be archived or securely deleted.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>6. Data Security</h2>
              <p className={styles.sectionText}>
                We use encryption (HTTPS), access restrictions, audit logs, and other safeguards to protect your data from unauthorized access.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>7. Your Rights</h2>
              <p className={styles.sectionText}>You may request:</p>
              <ul className={styles.list}>
                <li>Access to your personal information</li>
                <li>Correction of inaccurate data</li>
                <li>Account or data deletion (subject to retention policies)</li>
              </ul>
              <p className={styles.sectionText}>
                Contact: <a href="mailto:privacy@transparatech.edu.ph" className={styles.emailLink}>privacy@transparatech.edu.ph</a>
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>8. Changes to the Policy</h2>
              <p className={styles.sectionText}>
                Updates to this Privacy Policy may be made from time to time. All revisions will be posted on this page with an updated date.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>9. Contact Information</h2>
              <p className={styles.sectionText}>
                For privacy concerns: <a href="mailto:privacy@transparatech.edu.ph" className={styles.emailLink}>privacy@transparatech.edu.ph</a>
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

export default PrivacyPolicy;