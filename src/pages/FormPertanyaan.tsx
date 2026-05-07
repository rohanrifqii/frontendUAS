import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { isAxiosError } from "axios";
import api from "../lib/api";

type User = {
  user_id: number;
  nama: string;
  email: string;
  id_role: number;
};

type Pertanyaan = {
  pertanyaan_id: number;
  pertanyaan: string;
};

type Usaha = {
  id_usaha: number;
  nama_usaha: string;
  bidang_usaha: string;
  alamat: string;
  status_verifikasi?: string | null;
};

type AiAnalysis = {
  dampak?: {
    lingkungan?: string | null;
    sosial?: string | null;
    ekonomi?: string | null;
  };
  skor_esg?: {
    lingkungan?: number | null;
    sosial?: number | null;
    governance?: number | null;
    total?: number | null;
    kategori?: string | null;
  };
  rekomendasi?: string | null;
  pengajuan?: {
    jumlah_pinjaman?: number | null;
    tenor_bulanan?: number | null;
    tingkat_bunga_khusus?: number | null;
    syarat_esg?: string | null;
  };
};

type AnalysisResponse = {
  data: AiAnalysis | null;
};

type JawabanResponse = {
  message?: string;
  gemini_analysis?: AiAnalysis | null;
};

function FormPertanyaan() {
  const [user, setUser] = useState<User | null>(null);
  const [usaha, setUsaha] = useState<Usaha[]>([]);
  const [selectedUsahaId, setSelectedUsahaId] = useState<number | null>(null);
  const [pertanyaan, setPertanyaan] = useState<Pertanyaan[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadForm() {
      try {
        const [meResponse, usahaResponse, pertanyaanResponse] =
          await Promise.all([
            api.get("/me"),
            api.get<{ data: Usaha[] }>("/usaha"),
            api.get("/pertanyaan"),
          ]);

        const loggedInUser = meResponse.data.user as User;

        if (loggedInUser.id_role === 2) {
          window.location.assign("/admin/dashboard");
          return;
        }

        const loadedUsaha = usahaResponse.data.data;
        const activeUsahaId = Number(localStorage.getItem("active_usaha_id"));
        const selectedUsaha =
          loadedUsaha.find((item) => item.id_usaha === activeUsahaId) ??
          loadedUsaha[0];
        const loadedPertanyaan = pertanyaanResponse.data.data as Pertanyaan[];

        setUser(loggedInUser);
        setUsaha(loadedUsaha);
        setSelectedUsahaId(selectedUsaha?.id_usaha ?? null);
        setPertanyaan(loadedPertanyaan);
        setAnswers(
          Object.fromEntries(
            loadedPertanyaan.map((item) => [item.pertanyaan_id, ""])
          )
        );
      } catch {
        localStorage.removeItem("token");
        window.location.assign("/login");
      } finally {
        setIsLoading(false);
      }
    }

    loadForm();
  }, []);

  useEffect(() => {
    async function loadAnalysis() {
      if (!selectedUsahaId) {
        setAnalysis(null);
        return;
      }

      try {
        const response = await api.get<AnalysisResponse>("/jawaban/analisis", {
          params: { id_usaha: selectedUsahaId },
        });

        setAnalysis(response.data.data ?? null);
      } catch {
        setAnalysis(null);
      }
    }

    loadAnalysis();
  }, [selectedUsahaId]);

  function handleAnswerChange(pertanyaanId: number, value: string) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [pertanyaanId]: value,
    }));
  }

  async function submitAnswers(e: FormEvent) {
    e.preventDefault();

    if (!selectedUsahaId) {
      setSuccess("");
      setError("Tambahkan usaha dulu sebelum mengisi pertanyaan.");
      return;
    }

    const payload = pertanyaan.map((item) => ({
      pertanyaan_id: item.pertanyaan_id,
      jawaban: answers[item.pertanyaan_id]?.trim() ?? "",
    }));

    const hasEmptyAnswer = payload.some((item) => item.jawaban.length === 0);

    if (hasEmptyAnswer) {
      setSuccess("");
      setError("Isi semua jawaban dulu sebelum submit.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setIsSubmitting(true);

      const response = await api.post<JawabanResponse>("/jawaban", {
        id_usaha: selectedUsahaId,
        jawaban: payload,
      });

      setSuccess(response.data.message ?? "Jawaban berhasil dikirim.");
      setAnalysis(response.data.gemini_analysis ?? null);
    } catch (err) {
      setSuccess("");
      if (
        isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(
          err
        )
      ) {
        const errors = err.response?.data?.errors;
        setError(
          errors
            ? Object.values(errors).flat().join(" ")
            : err.response?.data?.message ?? "Gagal mengirim jawaban."
        );
        return;
      }

      setError("Gagal mengirim jawaban.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleUsahaChange(value: string) {
    const id = Number(value);
    setSelectedUsahaId(id);
    localStorage.setItem("active_usaha_id", String(id));
  }

  function formatValue(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    return typeof value === "number" ? value.toLocaleString("id-ID") : value;
  }

  function formatMoney(value: number | null | undefined) {
    if (value === null || value === undefined) {
      return "-";
    }

    return `Rp ${value.toLocaleString("id-ID")}`;
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
  if (!user) return null;

  if (usaha.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-8 text-ftech-dark">
        <section className="mx-auto mt-10 max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Form Evaluasi ESG</h1>
          <p className="mt-3 text-slate-600">
            Anda perlu menambahkan usaha terlebih dahulu sebelum mengisi form evaluasi.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 md:flex-row">
            <button
              className="rounded-xl bg-gradient-to-r from-ftech-orange to-orange-400 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-ftech-orange/30 hover:scale-[1.02]"
              onClick={() => window.location.assign("/usaha/tambah")}
            >
              Tambah Usaha
            </button>
            <button
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50"
              onClick={() => window.location.assign("/dashboard")}
            >
              Kembali ke Dashboard
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-8 text-ftech-dark">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        {/* Header Card */}
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-ftech-dark via-ftech-medium to-ftech-dark p-6 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-ftech-orange/10 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-wider text-ftech-orange">
              Evaluasi ESG
            </p>
            <h1 className="mt-1 text-3xl font-bold">Form Pertanyaan</h1>
            <p className="mt-2 text-sm text-white/70">Halo, {user.nama} 👋</p>
          </div>
        </header>

        {/* Select Usaha */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-ftech-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Pilih Usaha
            </span>
            <select
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:border-ftech-orange focus:ring-2 focus:ring-ftech-orange/20"
              value={selectedUsahaId ?? ""}
              onChange={(e) => handleUsahaChange(e.target.value)}
            >
              {usaha.map((item) => (
                <option key={item.id_usaha} value={item.id_usaha}>
                  {item.nama_usaha} - {item.status_verifikasi ?? "belum diverifikasi"}
                </option>
              ))}
            </select>
          </label>
        </section>

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

        {/* AI Analysis Result */}
        {analysis && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ftech-orange to-orange-400 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Hasil Analisis AI</h2>
            </div>

            {/* Dampak Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <article className="group rounded-xl bg-gradient-to-br from-green-50 to-white p-5 border border-green-100 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-bold text-green-700">Lingkungan</h3>
                </div>
                <p className="text-sm text-slate-600">
                  {formatValue(analysis.dampak?.lingkungan)}
                </p>
              </article>
              <article className="group rounded-xl bg-gradient-to-br from-blue-50 to-white p-5 border border-blue-100 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="font-bold text-blue-700">Sosial</h3>
                </div>
                <p className="text-sm text-slate-600">
                  {formatValue(analysis.dampak?.sosial)}
                </p>
              </article>
              <article className="group rounded-xl bg-gradient-to-br from-purple-50 to-white p-5 border border-purple-100 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-bold text-purple-700">Ekonomi</h3>
                </div>
                <p className="text-sm text-slate-600">
                  {formatValue(analysis.dampak?.ekonomi)}
                </p>
              </article>
            </div>

            {/* ESG Scores */}
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-slate-200 p-4 text-center hover:border-ftech-orange/50 transition-colors">
                <span className="block text-xs font-semibold uppercase text-slate-400">Lingkungan</span>
                <strong className="mt-1 block text-2xl font-bold text-ftech-orange">{formatValue(analysis.skor_esg?.lingkungan)}</strong>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 text-center hover:border-ftech-orange/50 transition-colors">
                <span className="block text-xs font-semibold uppercase text-slate-400">Sosial</span>
                <strong className="mt-1 block text-2xl font-bold text-ftech-orange">{formatValue(analysis.skor_esg?.sosial)}</strong>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 text-center hover:border-ftech-orange/50 transition-colors">
                <span className="block text-xs font-semibold uppercase text-slate-400">Governance</span>
                <strong className="mt-1 block text-2xl font-bold text-ftech-orange">{formatValue(analysis.skor_esg?.governance)}</strong>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 text-center bg-gradient-to-br from-ftech-orange/10 to-transparent">
                <span className="block text-xs font-semibold uppercase text-slate-400">Total</span>
                <strong className="mt-1 block text-3xl font-bold text-ftech-orange">{formatValue(analysis.skor_esg?.total)}</strong>
              </div>
            </div>

            {/* Rekomendasi & Pengajuan */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <article className="rounded-xl bg-slate-50 p-5">
                <h3 className="font-bold flex items-center gap-2">
                  <svg className="w-5 h-5 text-ftech-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Rekomendasi
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {formatValue(analysis.rekomendasi)}
                </p>
              </article>
              <article className="rounded-xl bg-slate-50 p-5">
                <h3 className="font-bold flex items-center gap-2">
                  <svg className="w-5 h-5 text-ftech-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pengajuan Pinjaman
                </h3>
                <div className="mt-2 space-y-1 text-sm text-slate-600">
                  <p>Jumlah: <span className="font-semibold">{formatMoney(analysis.pengajuan?.jumlah_pinjaman)}</span></p>
                  <p>Tenor: <span className="font-semibold">{formatValue(analysis.pengajuan?.tenor_bulanan)} bulan</span></p>
                  <p>Bunga: <span className="font-semibold">{formatValue(analysis.pengajuan?.tingkat_bunga_khusus)}%</span></p>
                  <p>Syarat: <span className="font-semibold">{formatValue(analysis.pengajuan?.syarat_esg)}</span></p>
                </div>
              </article>
            </div>
          </section>
        )}

        {/* Pertanyaan Form */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-ftech-orange/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-ftech-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Pertanyaan Evaluasi</h2>
          </div>

          {pertanyaan.length === 0 ? (
            <p className="text-slate-600">Belum ada pertanyaan tersedia.</p>
          ) : (
            <form className="mt-5 grid gap-4" onSubmit={submitAnswers}>
              {pertanyaan.map((item, index) => (
                <label
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition-all hover:border-ftech-orange/30 hover:shadow-md"
                  key={item.pertanyaan_id}
                >
                  <p className="font-semibold text-slate-800">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ftech-orange text-white text-xs mr-2">
                      {index + 1}
                    </span>
                    {item.pertanyaan}
                  </p>
                  <textarea
                    className="mt-3 min-h-24 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition-all focus:border-ftech-orange focus:ring-2 focus:ring-ftech-orange/20"
                    value={answers[item.pertanyaan_id] ?? ""}
                    onChange={(e) =>
                      handleAnswerChange(item.pertanyaan_id, e.target.value)
                    }
                    placeholder="Tulis jawaban Anda di sini..."
                  />
                </label>
              ))}

              <div className="flex flex-col gap-3 md:flex-row pt-4">
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
                      Mengirim...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Kirim Jawaban
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition-all hover:bg-slate-50"
                  onClick={() => window.location.assign("/dashboard")}
                >
                  Kembali ke Dashboard
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

export default FormPertanyaan;
