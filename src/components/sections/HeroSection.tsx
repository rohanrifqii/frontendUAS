  import React from "react";
  import Button from "../ui/Button";

  const HeroSection: React.FC = () => {
    return (
      <section className="relative min-h-screen pt-24 pb-12 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-ftech-dark via-ftech-medium to-ftech-dark/90" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-ftech-orange/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptLTItNHYyaC0ydi0yaDJ6bTAtNHYyaC0ydi0yaDJ6bTQtNHYyaC0ydi0yaDJ6bTQtNHYyaC0ydi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

        <div className="relative grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Kolom Kiri - Teks & Tombol */}
          <div className="space-y-8 flex flex-col items-start justify-center md:pl-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ftech-orange/20 border border-ftech-orange/30 text-ftech-orange text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-ftech-orange animate-pulse" />
              Platform ESG Terdepan
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Evaluasi & Manajemen
              <span className="block text-ftech-orange mt-2">Dampak ESG</span>
            </h1>
            <p className="text-lg text-white/80 max-w-xl leading-relaxed">
              Optimalkan kredit hijau dan dampak bisnis Anda dengan teknologi AI yang cerdas. 
              Solusi komprehensif untuk masa depan berkelanjutan.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="solid" onClick={() => window.location.assign("/register")} className="px-8 py-3 text-lg">
                Mulai Sekarang
              </Button>
              <Button variant="outline" onClick={() => window.location.assign("/login")} className="px-8 py-3 text-lg">
                Masuk
              </Button>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-white/10">
              <div>
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-sm text-white/60">Usaha Terdaftar</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">98%</p>
                <p className="text-sm text-white/60">Akurasi AI</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">24/7</p>
                <p className="text-sm text-white/60">Dukungan</p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan - Visual */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square">
              {/* Card Utama */}
              <div className="absolute inset-0 bg-gradient-to-br from-ftech-orange/30 to-transparent rounded-3xl border border-white/10 backdrop-blur-sm p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-ftech-orange/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-ftech-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold">ESG Score</p>
                      <p className="text-2xl font-bold text-ftech-orange">A+</p>
                    </div>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-ftech-orange to-orange-400 rounded-full" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">92</p>
                      <p className="text-xs text-white/60">Lingkungan</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">88</p>
                      <p className="text-xs text-white/60">Sosial</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">90</p>
                      <p className="text-xs text-white/60">Governance</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-ftech-orange/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>
    );
  };

  export default HeroSection;
