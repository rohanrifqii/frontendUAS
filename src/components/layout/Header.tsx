import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-ftech-dark/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Nama Perusahaan */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ftech-orange to-orange-400 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-ftech-orange/30">
              F
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              <span className="text-ftech-orange">F-Tech</span> Solution
            </span>
          </div>

          {/* Menu Navigasi - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-white/80 hover:text-ftech-orange transition-all duration-300 text-sm font-medium relative group">
              Solusi
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ftech-orange transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#" className="text-white/80 hover:text-ftech-orange transition-all duration-300 text-sm font-medium relative group">
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ftech-orange transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#" className="text-white/80 hover:text-ftech-orange transition-all duration-300 text-sm font-medium relative group">
              Laporan
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ftech-orange transition-all duration-300 group-hover:w-full" />
            </a>
            <button 
              onClick={() => window.location.assign('/login')}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-ftech-orange text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-ftech-orange/30"
            >
              Masuk
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-white/80 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col gap-4">
              <a href="#" className="text-white/80 hover:text-ftech-orange transition-colors text-sm font-medium">
                Solusi
              </a>
              <a href="#" className="text-white/80 hover:text-ftech-orange transition-colors text-sm font-medium">
                FAQ
              </a>
              <a href="#" className="text-white/80 hover:text-ftech-orange transition-colors text-sm font-medium">
                Laporan
              </a>
              <button 
                onClick={() => window.location.assign('/login')}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-ftech-orange text-white text-sm font-medium transition-colors text-left"
              >
                Masuk
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;