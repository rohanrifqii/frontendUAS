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
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-ftech-dark">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="rounded-lg bg-ftech-dark p-6 text-white shadow">
          <p className="text-sm font-semibold uppercase tracking-wider text-ftech-orange">
            Registrasi Usaha
          </p>
          <h1 className="mt-1 text-3xl font-bold">Tambah Usaha</h1>
          <p className="mt-2 text-sm text-white/75">
            Data dokumen ini masih dummy untuk simulasi verifikasi admin.
          </p>
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

        {!createdUsahaId ? (
          <form
            onSubmit={handleSubmit}
            className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            <section>
              <h2 className="text-xl font-bold">Data Usaha</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Nama usaha
                  <input
                    className="rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-ftech-orange"
                    placeholder="Contoh: Warung Sejahtera"
                    value={namaUsaha}
                    onChange={(e) => setNamaUsaha(e.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Bidang usaha
                  <input
                    className="rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-ftech-orange"
                    placeholder="Contoh: Kuliner"
                    value={bidangUsaha}
                    onChange={(e) => setBidangUsaha(e.target.value)}
                  />
                </label>
              </div>

              <label className="mt-4 flex flex-col gap-2 text-sm font-medium text-slate-700">
                Alamat usaha
                <textarea
                  className="min-h-24 rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-ftech-orange"
                  placeholder="Alamat lengkap usaha"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                />
              </label>
            </section>

            <section>
              <h2 className="text-xl font-bold">Dokumen Dummy</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  KTP
                  <input
                    className="rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-ftech-orange"
                    placeholder="ktp-dummy.pdf"
                    value={ktp}
                    onChange={(e) => setKtp(e.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  NPWP
                  <input
                    className="rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-ftech-orange"
                    placeholder="npwp-dummy.pdf"
                    value={npwp}
                    onChange={(e) => setNpwp(e.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Surat izin usaha
                  <input
                    className="rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-ftech-orange"
                    placeholder="siu-dummy.pdf"
                    value={suratIzinUsaha}
                    onChange={(e) => setSuratIzinUsaha(e.target.value)}
                  />
                </label>
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 md:flex-row">
              <button
                className="rounded-md bg-ftech-orange px-5 py-3 font-semibold text-white transition hover:bg-ftech-orange/90 disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Usaha"}
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                onClick={() => window.location.assign("/dashboard")}
              >
                Kembali ke Dashboard
              </button>
            </div>
          </form>
        ) : (
          <section className="rounded-lg border border-emerald-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-emerald-700">
              Usaha berhasil ditambahkan
            </h2>
            <p className="mt-2 text-slate-600">
              Dokumen masuk status menunggu verifikasi admin.
            </p>
            <div className="mt-6 flex flex-col gap-3 md:flex-row">
              <button
                className="rounded-md bg-ftech-orange px-5 py-3 font-semibold text-white transition hover:bg-ftech-orange/90"
                onClick={continueToForm}
              >
                Lanjut ke Form Pertanyaan
              </button>
              <button
                className="rounded-md border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
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
