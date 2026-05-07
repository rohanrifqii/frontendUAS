import { useState } from 'react';
import type { FormEvent } from 'react';
import { isAxiosError } from 'axios';
import api from '../lib/api';

function Register() {
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setError('');
      setIsSubmitting(true);

      const response = await api.post('/register', {
        nama,
        username,
        email,
        password,
        password_confirmation: password,
      });

      localStorage.setItem('token', response.data.token);
      window.location.assign('/dashboard');
    } catch (err) {
      if (isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(err)) {
        const errors = err.response?.data?.errors;
        setError(errors ? Object.values(errors).flat().join(' ') : err.response?.data?.message ?? 'Register gagal');
        return;
      }

      setError('Register gagal');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-ftech-dark via-ftech-medium to-ftech-dark px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 text-white overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute top-0 right-1/4 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-ftech-orange/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex flex-col gap-3 sm:gap-4 lg:gap-5 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 md:p-7 lg:p-8 shadow-2xl backdrop-blur-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
          <div className="w-10 sm:w-12 md:w-14 h-10 sm:h-12 md:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-ftech-orange to-orange-400 flex items-center justify-center font-bold text-xl sm:text-2xl md:text-3xl text-white shadow-lg shadow-ftech-orange/30">
            F
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wider text-ftech-orange">
            F-Tech Solution
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold">Buat Akun</h1>
          <p className="mt-2 text-white/60 text-xs sm:text-sm md:text-base">Daftar untuk memulai evaluasi ESG</p>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-red-200">
            {error}
          </p>
        )}

        <label className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
          <span className="text-white/80">Nama Lengkap</span>
          <div className="relative">
            <svg className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <input
              className="w-full rounded-lg border border-white/10 bg-white/5 px-8 sm:px-10 py-2 sm:py-3 text-white text-xs sm:text-sm placeholder-white/40 outline-none transition-all focus:border-ftech-orange focus:bg-white/10"
              placeholder="Nama lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
          <span className="text-white/80">Username</span>
          <div className="relative">
            <svg className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <input
              className="w-full rounded-lg border border-white/10 bg-white/5 px-8 sm:px-10 py-2 sm:py-3 text-white text-xs sm:text-sm placeholder-white/40 outline-none transition-all focus:border-ftech-orange focus:bg-white/10"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
          <span className="text-white/80">Email</span>
          <div className="relative">
            <svg className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <input
              className="w-full rounded-lg border border-white/10 bg-white/5 px-8 sm:px-10 py-2 sm:py-3 text-white text-xs sm:text-sm placeholder-white/40 outline-none transition-all focus:border-ftech-orange focus:bg-white/10"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
          <span className="text-white/80">Password</span>
          <div className="relative">
            <svg className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input
              className="w-full rounded-lg border border-white/10 bg-white/5 px-8 sm:px-10 py-2 sm:py-3 text-white text-xs sm:text-sm placeholder-white/40 outline-none transition-all focus:border-ftech-orange focus:bg-white/10"
              type="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </label>

        <button
          className="mt-1 sm:mt-2 rounded-lg bg-gradient-to-r from-ftech-orange to-orange-400 px-4 sm:px-5 py-2.5 sm:py-3.5 font-semibold text-xs sm:text-sm md:text-base text-white transition-all hover:shadow-lg hover:shadow-ftech-orange/30 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 sm:h-5 w-4 sm:w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Memproses...
            </span>
          ) : "Buat Akun"}
        </button>

        <div className="relative my-1.5 sm:my-2 lg:my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs sm:text-sm">
            <span className="bg-ftech-dark px-3 sm:px-4 text-white/40">atau</span>
          </div>
        </div>

        <button
          type="button"
          className="rounded-lg border border-white/10 bg-white/5 px-4 sm:px-5 py-2.5 sm:py-3 font-medium text-xs sm:text-sm md:text-base text-white transition-all hover:bg-white/10 hover:border-white/20"
          onClick={() => window.location.assign('/login')}
        >
          Sudah punya akun? Masuk
        </button>
      </form>
    </main>
  );
}

export default Register;
