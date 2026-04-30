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
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-ftech-dark">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-ftech-dark">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-lg bg-ftech-dark p-6 text-white shadow md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-ftech-orange">
              Admin
            </p>
            <h1 className="mt-1 text-3xl font-bold">Dashboard Admin</h1>
          </div>
          <button
            className="rounded-md border border-white/25 px-4 py-2 font-semibold text-white transition hover:bg-white/10"
            onClick={logout}
          >
            Logout
          </button>
        </header>

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </p>
        )}

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Tambah Pertanyaan</h2>
          <form className="mt-4 flex flex-col gap-3 md:flex-row" onSubmit={tambahPertanyaan}>
            <input
              className="flex-1 rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-ftech-orange"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pertanyaan"
            />

            <button
              className="rounded-md bg-ftech-orange px-5 py-3 font-semibold text-white transition hover:bg-ftech-orange/90 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Tambah'}
            </button>
          </form>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Daftar Pertanyaan</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
              {pertanyaan.length} item
            </span>
          </div>

          {pertanyaan.length === 0 ? (
            <p className="mt-4 text-slate-600">Belum ada pertanyaan.</p>
          ) : (
            <div className="mt-4 grid gap-3">
              {pertanyaan.map((item, index) => (
                <p
                  className="rounded-md border border-slate-200 bg-slate-50 p-4"
                  key={item.pertanyaan_id}
                >
                  <span className="font-semibold">{index + 1}.</span>{' '}
                  {item.pertanyaan}
                </p>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;
