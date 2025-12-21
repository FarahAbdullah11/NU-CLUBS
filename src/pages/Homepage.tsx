// src/pages/Homepage.tsx
import React, { useEffect } from 'react';
import { Hero } from '../components/Hero';
import Calendar from '../components/Calendar';
import NavigationBar from '../components/Navbar';
import Footer from '../components/Footer';

interface HomepageProps {
  onLogout?: () => void;
}

const Homepage: React.FC<HomepageProps> = ({ onLogout }) => {
  useEffect(() => {
    const scrollToCalendar = () => {
      if (window.location.hash === '#calendar') {
        const calendarElement = document.getElementById('calendar');
        if (calendarElement) {
          // Use requestAnimationFrame for better timing
          requestAnimationFrame(() => {
            calendarElement.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          });
        }
      }
    };

    // Scroll on initial load
    scrollToCalendar();

    // Handle hash changes (e.g., user clicks a #calendar link)
    window.addEventListener('hashchange', scrollToCalendar);

    return () => {
      window.removeEventListener('hashchange', scrollToCalendar);
    };
  }, []);

  return (
    <div className="homepage">
      <NavigationBar onLogout={onLogout} />
      <Hero />
      
      {/* Essential ID for scroll targeting */}
      <div id="calendar" className="calendar-section">
        <Calendar />
      </div>
      
      <Footer />
    </div>
  );
};

export default Homepage;