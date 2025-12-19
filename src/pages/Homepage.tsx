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
  // 👇 Auto-scroll to #calendar on load or hash change
  useEffect(() => {
    const scrollToHash = () => {
      if (window.location.hash === '#calendar') {
        const calendarElement = document.getElementById('calendar');
        if (calendarElement) {
          // Small delay ensures the DOM is fully rendered
          setTimeout(() => {
            calendarElement.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    // Scroll on initial load
    scrollToHash();

    // Optional: handle future hash changes (e.g., if user bookmarks #calendar)
    window.addEventListener('hashchange', scrollToHash);

    // Cleanup listener
    return () => {
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);

  return (
    <div>
      <NavigationBar onLogout={onLogout} />
      <Hero />
      
      {/* 🔑 This ID is essential for scrolling */}
      <div id="calendar">
        <Calendar />
      </div>
      
      <Footer />
    </div>
  );
};

export default Homepage;