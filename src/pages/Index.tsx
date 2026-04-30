import React from 'react';
import Header from '../components/layout/Header';
import HeroSection from '../components/sections/HeroSection';
import Test from './TestBackend';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ftech-dark via-ftech-medium to-ftech-medium/80 font-sans">
      <Header />
      <main>
        <HeroSection />
        
      </main>
      <Test />
    </div>
  );
};

export default App;