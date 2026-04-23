import React from 'react';
import DashboardVisual from './DashboardVisual';

const HeroSection: React.FC = () => {
  return (
    <section className="min-h-screen pt-24 pb-12 px-6 grid md:grid-cols-2 gap-12 items-center">
      {/* Kolom Kiri - Teks & Tombol */}
      <div className="space-y-6 flex flex-col items-start justify-center md:pl-10">
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
          Platform Terpadu Evaluasi & Manajemen Dampak ESG
        </h1>
        <p className="text-lg text-white/90 max-w-xl">
          Optimalkan Kredit Hijau dan Dampak Bisnis anda.
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          <button className="px-8 py-3 rounded-xl text-lg font-semibold text-white border-2 border-white hover:bg-white/10 transition-all shadow-md">
            Login
          </button>
          <button className="px-8 py-3 rounded-xl text-lg font-semibold text-white bg-ftech-orange hover:bg-ftech-orange/90 transition-all shadow-xl">
            Daftar
          </button>
        </div>
      </div>

      {/* Kolom Kanan - Visual Dasbor di Monitor */}
      <div className="flex items-center justify-center h-full">
         <DashboardVisual />
      </div>
    </section>
  );
};

export default HeroSection;