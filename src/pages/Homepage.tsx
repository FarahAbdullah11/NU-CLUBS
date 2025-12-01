// src/pages/Homepage.tsx
import React from 'react';
import { Hero } from '../components/Hero';
import Calendar from '../components/Calendar';
import NavigationBar from '../components/Navbar';

interface HomepageProps {
  onLogout?: () => void;
}

const Homepage: React.FC<HomepageProps> = ({ onLogout }) => {
  return (
    <div>
      <NavigationBar onLogout={onLogout} />
      <Hero />
      <Calendar />
    </div>
  );
};

export default Homepage;