import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import api from '../lib/api';

type Pertanyaan = {
  pertanyaan_id: number;
  pertanyaan: string;
};

function AdminDashboard() {
  const [pertanyaan, setPertanyaan] = useState<Pertanyaan[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadPertanyaan() {
    const response = await api.get<{ data: Pertanyaan[] }>('/pertanyaan');
    setPertanyaan(response.data.data);
  }

  useEffect(() => {
    async function loadAdminData() {
      try {
        await loadPertanyaan();
      } catch {
        window.location.assign('/login');
      } finally {
        setIsLoading(false);
      }
    }

    loadAdminData();
  }, []);

  async function tambahPertanyaan(e: FormEvent) {
    e.preventDefault();

    try {
      setError('');
      setSuccess('');
      setIsSubmitting(true);

      await api.post('/admin/pertanyaan', {
        pertanyaan: input,
      });

      setInput('');
      setSuccess('Pertanyaan berhasil ditambahkan.');
      await loadPertanyaan();
    } catch {
      setError('Gagal menambah pertanyaan');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function logout() {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('token');
      window.location.assign('/login');
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-10 text-ftech-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ftech-orange border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-600">Memuat data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-8 text-ftech-dark">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {/* Header Card */}
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-ftech-dark via-ftech-medium to-ftech-dark p-6 text-white shadow-xl md:flex-row md:items-center md:justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-ftech-orange/10 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-wider text-ftech-orange">
              Admin Panel
            </p>
            <h1 className="mt-1 text-3xl font-bold">Dashboard Admin</h1>
          </div>
          <button
            className="mt-4 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20 md:mt-0 backdrop-blur-sm"
            onClick={logout}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Keluar
            </span>
          </button>
        </header>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </p>
        )}

        {/* Tambah Pertanyaan */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-ftech-orange/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-ftech-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Tambah Pertanyaan ESG</h2>
          </div>
          <form className="mt-4 flex flex-col gap-3 md:flex-row" onSubmit={tambahPertanyaan}>
            <input
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:border-ftech-orange focus:ring-2 focus:ring-ftech-orange/20"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pertanyaan baru untuk evaluasi ESG..."
            />

            <button
              className="group rounded-xl bg-gradient-to-r from-ftech-orange to-orange-400 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-ftech-orange/30 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Menyimpan...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Tambah
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              )}
            </button>
          </form>
        </section>

        {/* Daftar Pertanyaan */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Daftar Pertanyaan</h2>
            </div>
            <span className="rounded-full bg-ftech-orange/10 px-4 py-1.5 text-sm font-semibold text-ftech-orange">
              {pertanyaan.length} pertanyaan
            </span>
          </div>

          {pertanyaan.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <svg className="w-12 h-12 text-slate-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-3 text-slate-600">Belum ada pertanyaan</p>
              <p className="text-sm text-slate-500">Tambahkan pertanyaan pertama Anda</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {pertanyaan.map((item, index) => (
                <div
                  className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-ftech-orange/30 hover:shadow-md"
                  key={item.pertanyaan_id}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-ftech-orange text-white font-semibold text-sm">
                      {index + 1}
                    </span>
                    <p className="text-slate-700 font-medium">{item.pertanyaan}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;
