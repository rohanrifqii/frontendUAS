import React from 'react';
import Header from '../components/layout/Header';
import HeroSection from '../components/sections/HeroSection';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ftech-dark via-ftech-medium to-ftech-medium/80 font-sans">
      <Header />
      <main>
        <HeroSection />
      </main>
    </div>
  );
};

export default App;
