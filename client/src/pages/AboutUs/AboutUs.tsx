import React, { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TeamCard from './components/TeamCard';
import styles from './AboutUs.module.css';
import '../Landing/Home.css';

// Navigation and footer assets
import navLogo from '../../images/navlogo.png';
import HexadevsLogo from '../../images/HevadevsFooter.png';
import AquinoImage from '../../images/Aquino.jpg';
import AguilarImage from '../../images/Aguilar.jpg';
import CapaImage from '../../images/Capa.jpg';
import CatalanImage from '../../images/Catalan.jpg';
import PastranaImage from '../../images/Pastrana.jpg';
import DelacruzImage from '../../images/Dela Cruz.jpg';


// Team member data
interface TeamMember {
  id: number;
  image: string;
  name: string;
  title: string;
  role: string;
  description: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    image: AquinoImage,
    name: 'Luis Martin S. Aquino',
    title: 'Project Manager/Full Stack Developer',
    role: 'Leadership & Development',
    description: 'Leading the project vision and development of TransparaTech while architecting robust full-stack solutions that ensure transparency and efficiency in university management systems.'
  },
  {
    id: 2,
    image: CapaImage,
    name: 'Kyla Marie G. Capa',
    title: 'Front-end Developer & UI/UX',
    role: 'Design & User Experience',
    description: 'Creating intuitive and visually appealing user interfaces that make complex university processes simple and accessible for all users.'
  },
  {
    id: 3,
    image: AguilarImage,
    name: 'Ellayssa Mae D. Aguilar',
    title: 'Front-end Developer & UI/UX',
    role: 'Design & User Experience',
    description: 'Developing responsive front-end components and crafting user experiences that enhance transparency and usability in educational technology.'
  },
  {
    id: 4,
    image: DelacruzImage,
    name: 'Aira Joy L. Dela Cruz',
    title: 'Back-end Developer',
    role: 'Server & Database Development',
    description: 'Building secure and scalable server-side applications that handle data management and ensure reliable system performance for the transparency portal.'
  },
  {
    id: 5,
    image: CatalanImage,
    name: 'Pauline P. Catalan',
    title: 'Back-end Developer',
    role: 'Server & Database Development',
    description: 'Developing robust backend systems and database architectures that support transparent data handling and secure information management.'
  },
  {
    id: 6,
    image: PastranaImage,
    name: 'Princess Dianne V. Pastrana',
    title: 'Quality Assurance/Tester',
    role: 'Testing & Quality Control',
    description: 'Ensuring the highest quality standards through comprehensive testing processes and quality assurance to deliver a reliable transparency platform.'
  }
];

const AboutUs: FC = () => {
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
    <div className={`${styles.aboutUs} min-h-screen bg-gray-50`}>
      <NavigationHeader />
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Meet Our Team</h1>
          <p className={styles.heroSubtitle}>
            Dedicated professionals committed to making technology transparent and accessible
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.teamGrid}>
            {TEAM_MEMBERS.map((member) => (
              <TeamCard
                key={member.id}
                image={member.image}
                name={member.name}
                title={member.title}
                role={member.role}
                description={member.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.missionContent}>
            <h2 className={styles.missionTitle}>Our Mission</h2>
            <p className={styles.missionText}>
              At TransparaTech, we believe that technology should be transparent, accessible, and empowering. 
              Our team is dedicated to building solutions that foster trust, accountability, and good governance 
              within educational institutions and organizations. We strive to create a future where transparency 
              is not just a goal, but a fundamental principle embedded in every system we develop.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-blue-950 text-white py-16">
        <div className="w-full px-6">
          {/* 3-Section Horizontal Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start justify-between">
            
            {/* Left Section: PUPSMB Logo and Copyright */}
            <div className="flex flex-col items-center lg:items-start gap-6">
              {/* PUPSMB Logo and Copyright */}
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
              {/* HEXADEVS Logo and Text */}
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

export default AboutUs;