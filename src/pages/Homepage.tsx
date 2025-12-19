// src/pages/Homepage.tsx
import React from 'react';
import { Hero } from '../components/Hero';
import Calendar from '../components/Calendar';
import NavigationBar from '../components/Navbar';
import Footer from '../components/Footer'
interface HomepageProps {
  onLogout?: () => void;
}

const Homepage: React.FC<HomepageProps> = ({ onLogout }) => {
  return (
    <div>
      <NavigationBar onLogout={onLogout} />
      <Hero />
      <Calendar />
      <Footer />
    </div>
  );
};

export default Homepage;