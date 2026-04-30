import React from "react";
import Button from "../ui/Button";

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
          <Button variant="outline" onClick={() => window.location.assign("/login")}>
            Login
          </Button>
          <Button variant="solid" onClick={() => window.location.assign("/register")}>
            Daftar
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
