import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-ftech-dark/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
      {/* Logo & Nama Perusahaan */}
      <div className="flex items-center gap-3">
        {/* Visual kotak oranye logo */}
        <div className="w-8 h-8 rounded-md bg-ftech-orange flex items-center justify-center font-bold text-lg text-white">
          F
        </div>
        <span className="text-2xl font-semibold text-white">F-Tech Solution</span>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex items-center gap-8">
        <a href="#" className="text-white hover:text-ftech-orange transition-colors">Solusi</a>
        <a href="#" className="text-white hover:text-ftech-orange transition-colors">FAQ</a>
        <a href="#" className="text-white hover:text-ftech-orange transition-colors">Laporan</a>
      </nav>
    </header>
  );
};

export default Header;