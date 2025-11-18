import React, { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './FAQs.module.css';
import '../Landing/Home.css';

// Navigation and footer assets
import navLogo from '../../images/navlogo.png';
import HexadevsLogo from '../../images/HevadevsFooter.png';

const FAQs: FC = () => {
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