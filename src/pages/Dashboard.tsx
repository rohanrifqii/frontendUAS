import { useEffect, useState } from "react";
import api from "../lib/api";

type User = {
  user_id: number;
  nama: string;
  username: string;
  email: string;
  id_role: number;
};

type Usaha = {
  id_usaha: number;
  nama_usaha: string;
  bidang_usaha: string;
  alamat: string;
  status_verifikasi?: string | null;
  tanggal_registrasi?: string | null;
};

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [usaha, setUsaha] = useState<Usaha[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [meResponse, usahaResponse] = await Promise.all([
          api.get("/me"),
          api.get<{ data: Usaha[] }>("/usaha"),
        ]);

        const loggedInUser = meResponse.data.user as User;

        if (loggedInUser.id_role === 2) {
          window.location.assign("/admin/dashboard");
          return;
        }

        setUser(loggedInUser);
        setUsaha(usahaResponse.data.data);
      } catch {
        localStorage.removeItem("token");
        window.location.assign("/login");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function logout() {
    try {
      setError("");
      await api.post("/logout");
    } catch {
      setError("Logout gagal di server, token lokal tetap dihapus.");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("active_usaha_id");
      window.location.assign("/login");
    }
  }

  function continueToForm(usahaId: number) {
    localStorage.setItem("active_usaha_id", String(usahaId));
    window.location.assign("/form-pertanyaan");
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-ftech-dark">
        <p>Loading...</p>
      </main>
    );
  }
  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-8 text-ftech-dark">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        {/* Header Card */}
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-ftech-dark via-ftech-medium to-ftech-dark p-6 text-white shadow-xl md:flex-row md:items-center md:justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-ftech-orange/10 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-wider text-ftech-orange">
              Dashboard
            </p>
            <h1 className="mt-1 text-3xl font-bold">Halo, {user.nama} 👋</h1>
            <p className="mt-2 text-white/70 text-sm">Kelola usaha dan evaluasi ESG Anda</p>
          </div>
          <button
            className="mt-4 w-full rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20 md:mt-0 md:w-auto backdrop-blur-sm"
            onClick={logout}
          >
            <span className="flex items-center justify-center gap-2">
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

        {/* Profil User Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ftech-orange to-orange-400 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Profil User</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="group rounded-xl bg-slate-50 p-4 transition hover:bg-slate-100">
              <span className="block text-xs font-semibold uppercase text-slate-400">
                Nama
              </span>
              <p className="mt-1 font-semibold text-slate-700">{user.nama}</p>
            </div>
            <div className="group rounded-xl bg-slate-50 p-4 transition hover:bg-slate-100">
              <span className="block text-xs font-semibold uppercase text-slate-400">
                Username
              </span>
              <p className="mt-1 font-semibold text-slate-700">{user.username}</p>
            </div>
            <div className="group rounded-xl bg-slate-50 p-4 transition hover:bg-slate-100">
              <span className="block text-xs font-semibold uppercase text-slate-400">
                Email
              </span>
              <p className="mt-1 font-semibold text-slate-700">{user.email}</p>
            </div>
          </div>
        </section>

        {/* Usaha Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">Usaha Saya</h2>
              <p className="mt-1 text-sm text-slate-500">
                Total: {usaha.length} usaha terdaftar
              </p>
            </div>

            <button
              className="group rounded-xl bg-gradient-to-r from-ftech-orange to-orange-400 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-ftech-orange/30 hover:scale-[1.02]"
              onClick={() => window.location.assign("/usaha/tambah")}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Usaha
              </span>
            </button>
          </div>

          {usaha.length === 0 ? (
            <div className="mt-6 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-slate-600 font-medium">Belum ada usaha</p>
              <p className="text-sm text-slate-500 mt-1">Tambahkan usaha dulu untuk lanjut ke form evaluasi</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {usaha.map((item) => (
                <article
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-ftech-orange/50 hover:shadow-lg"
                  key={item.id_usaha}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-ftech-orange/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{item.nama_usaha}</h3>
                      <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                        item.status_verifikasi === 'terverifikasi' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status_verifikasi ?? "menunggu"}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Bidang:</span> {item.bidang_usaha}
                    </p>
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Alamat:</span> {item.alamat}
                    </p>
                  </div>
                  <button
                    className="mt-4 w-full rounded-lg bg-ftech-dark px-4 py-2.5 font-semibold text-white transition-all hover:bg-ftech-orange hover:shadow-lg hover:shadow-ftech-orange/30"
                    onClick={() => continueToForm(item.id_usaha)}
                  >
                    Lanjut ke Form ESG
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
