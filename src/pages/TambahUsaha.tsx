import { useState } from "react";
import type { FormEvent } from "react";
import { isAxiosError } from "axios";
import api from "../lib/api";

type CreateUsahaResponse = {
  message?: string;
  data?: {
    usaha?: {
      id_usaha: number;
    };
  };
};

function TambahUsaha() {
  const [namaUsaha, setNamaUsaha] = useState("");
  const [bidangUsaha, setBidangUsaha] = useState("");
  const [alamat, setAlamat] = useState("");
  const [ktp, setKtp] = useState("");
  const [npwp, setNpwp] = useState("");
  const [suratIzinUsaha, setSuratIzinUsaha] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [createdUsahaId, setCreatedUsahaId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");
      setCreatedUsahaId(null);
      setIsSubmitting(true);

      const response = await api.post<CreateUsahaResponse>("/usaha", {
        nama_usaha: namaUsaha,
        bidang_usaha: bidangUsaha,
        alamat,
        ktp,
        npwp,
        surat_izin_usaha: suratIzinUsaha,
      });

      const usahaId = response.data.data?.usaha?.id_usaha ?? null;

      if (usahaId) {
        localStorage.setItem("active_usaha_id", String(usahaId));
      }

      setCreatedUsahaId(usahaId);
      setSuccess(response.data.message ?? "Usaha berhasil ditambahkan.");
    } catch (err) {
      if (
        isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(
          err
        )
      ) {
        const errors = err.response?.data?.errors;
        setError(
          errors
            ? Object.values(errors).flat().join(" ")
            : err.response?.data?.message ?? "Gagal menambah usaha."
        );
        return;
      }

      setError("Gagal menambah usaha.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function continueToForm() {
    if (createdUsahaId) {
      localStorage.setItem("active_usaha_id", String(createdUsahaId));
    }

    window.location.assign("/form-pertanyaan");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-8 text-ftech-dark">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        {/* Header Card */}
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-ftech-dark via-ftech-medium to-ftech-dark p-6 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-ftech-orange/10 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-wider text-ftech-orange">
              Registrasi Usaha
            </p>
            <h1 className="mt-1 text-3xl font-bold">Tambah Usaha Baru</h1>
            <p className="mt-2 text-sm text-white/70">
              Isi data usaha Anda untuk memulai evaluasi ESG
            </p>
          </div>
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

        {!createdUsahaId ? (
          <form
            onSubmit={handleSubmit}
            className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg"
          >
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-ftech-orange/10 flex items-center justify-center">
                  <span className="text-ftech-orange font-bold">1</span>
                </div>
                <h2 className="text-xl font-bold">Data Usaha</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  <span className="text-slate-600">Nama usaha</span>
                  <input
                    className="rounded-lg border border-slate-200 px-4 py-3 outline-none transition-all focus:border-ftech-orange focus:ring-2 focus:ring-ftech-orange/20"
                    placeholder="Contoh: Warung Sejahtera"
                    value={namaUsaha}
                    onChange={(e) => setNamaUsaha(e.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  <span className="text-slate-600">Bidang usaha</span>
                  <input
                    className="rounded-lg border border-slate-200 px-4 py-3 outline-none transition-all focus:border-ftech-orange focus:ring-2 focus:ring-ftech-orange/20"
                    placeholder="Contoh: Kuliner"
                    value={bidangUsaha}
                    onChange={(e) => setBidangUsaha(e.target.value)}
                  />
                </label>
              </div>

              <label className="mt-4 flex flex-col gap-2 text-sm font-medium text-slate-700">
                <span className="text-slate-600">Alamat usaha</span>
                <textarea
                  className="min-h-24 rounded-lg border border-slate-200 px-4 py-3 outline-none transition-all focus:border-ftech-orange focus:ring-2 focus:ring-ftech-orange/20"
                  placeholder="Alamat lengkap usaha"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                />
              </label>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-ftech-orange/10 flex items-center justify-center">
                  <span className="text-ftech-orange font-bold">2</span>
                </div>
                <h2 className="text-xl font-bold">Dokumen (Dummy)</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  <span className="text-slate-600">KTP</span>
                  <input
                    className="rounded-lg border border-slate-200 px-4 py-3 outline-none transition-all focus:border-ftech-orange focus:ring-2 focus:ring-ftech-orange/20"
                    placeholder="ktp-dummy.pdf"
                    value={ktp}
                    onChange={(e) => setKtp(e.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  <span className="text-slate-600">NPWP</span>
                  <input
                    className="rounded-lg border border-slate-200 px-4 py-3 outline-none transition-all focus:border-ftech-orange focus:ring-2 focus:ring-ftech-orange/20"
                    placeholder="npwp-dummy.pdf"
                    value={npwp}
                    onChange={(e) => setNpwp(e.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  <span className="text-slate-600">Surat izin usaha</span>
                  <input
                    className="rounded-lg border border-slate-200 px-4 py-3 outline-none transition-all focus:border-ftech-orange focus:ring-2 focus:ring-ftech-orange/20"
                    placeholder="siu-dummy.pdf"
                    value={suratIzinUsaha}
                    onChange={(e) => setSuratIzinUsaha(e.target.value)}
                  />
                </label>
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 md:flex-row">
              <button
                className="group rounded-xl bg-gradient-to-r from-ftech-orange to-orange-400 px-6 py-3.5 font-semibold text-white transition-all hover:shadow-lg hover:shadow-ftech-orange/30 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Menyimpan...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Simpan Usaha
                  </span>
                )}
              </button>
              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300"
                onClick={() => window.location.assign("/dashboard")}
              >
                Kembali
              </button>
            </div>
          </form>
        ) : (
          <section className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-lg">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-emerald-700">
                Usaha berhasil ditambahkan!
              </h2>
              <p className="mt-2 text-slate-600">
                Dokumen masuk status menunggu verifikasi admin.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 md:flex-row justify-center">
              <button
                className="group rounded-xl bg-gradient-to-r from-ftech-orange to-orange-400 px-6 py-3.5 font-semibold text-white transition-all hover:shadow-lg hover:shadow-ftech-orange/30 hover:scale-[1.02]"
                onClick={continueToForm}
              >
                <span className="flex items-center justify-center gap-2">
                  Lanjut ke Form ESG
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              <button
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition-all hover:bg-slate-50"
                onClick={() => window.location.assign("/dashboard")}
              >
                Kembali ke Dashboard
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default TambahUsaha;
