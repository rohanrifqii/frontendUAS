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
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-ftech-dark">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-lg bg-ftech-dark p-6 text-white shadow md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-ftech-orange">
              Dashboard User
            </p>
            <h1 className="mt-1 text-3xl font-bold">Halo, {user.nama}</h1>
          </div>
          <button
            className="w-full rounded-md border border-white/25 px-4 py-2 font-semibold text-white transition hover:bg-white/10 md:w-auto"
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

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Profil User</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <p className="rounded-md bg-slate-50 p-4">
              <span className="block text-sm font-semibold text-slate-500">
                Nama
              </span>
              {user.nama}
            </p>
            <p className="rounded-md bg-slate-50 p-4">
              <span className="block text-sm font-semibold text-slate-500">
                Username
              </span>
              {user.username}
            </p>
            <p className="rounded-md bg-slate-50 p-4">
              <span className="block text-sm font-semibold text-slate-500">
                Email
              </span>
              {user.email}
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">Usaha</h2>
              <p className="mt-1 text-sm text-slate-500">
                Total usaha: {usaha.length}
              </p>
            </div>

            <button
              className="rounded-md bg-ftech-orange px-5 py-3 font-semibold text-white transition hover:bg-ftech-orange/90"
              onClick={() => window.location.assign("/usaha/tambah")}
            >
              Tambah Usaha
            </button>
          </div>

          {usaha.length === 0 ? (
            <div className="mt-6 rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
              <p>Belum ada usaha. Tambahkan usaha dulu untuk lanjut ke form.</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {usaha.map((item) => (
                <article
                  className="rounded-lg border border-slate-200 bg-slate-50 p-5"
                  key={item.id_usaha}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold">{item.nama_usaha}</h3>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-700">
                      {item.status_verifikasi ?? "menunggu"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    Bidang: {item.bidang_usaha}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Alamat: {item.alamat}
                  </p>
                  <button
                    className="mt-4 rounded-md bg-ftech-dark px-4 py-2 font-semibold text-white transition hover:bg-ftech-medium"
                    onClick={() => continueToForm(item.id_usaha)}
                  >
                    Lanjut ke Form Pertanyaan
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
