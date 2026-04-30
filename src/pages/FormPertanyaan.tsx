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
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-ftech-dark">
        <p>Loading...</p>
      </main>
    );
  }
  if (!user) return null;

  if (usaha.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8 text-ftech-dark">
        <section className="mx-auto mt-10 max-w-2xl rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-3xl font-bold">Form Pertanyaan</h1>
          <p className="mt-3 text-slate-600">
            Tambahkan usaha dulu sebelum mengisi form pertanyaan.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 md:flex-row">
            <button
              className="rounded-md bg-ftech-orange px-5 py-3 font-semibold text-white transition hover:bg-ftech-orange/90"
              onClick={() => window.location.assign("/usaha/tambah")}
            >
              Tambah Usaha
            </button>
            <button
              className="rounded-md border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
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
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-ftech-dark">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="rounded-lg bg-ftech-dark p-6 text-white shadow">
          <p className="text-sm font-semibold uppercase tracking-wider text-ftech-orange">
            Analisis ESG
          </p>
          <h1 className="mt-1 text-3xl font-bold">Form Pertanyaan</h1>
          <p className="mt-2 text-sm text-white/75">Halo, {user.nama}</p>
        </header>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Pilih usaha
            <select
              className="rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-ftech-orange"
              value={selectedUsahaId ?? ""}
              onChange={(e) => handleUsahaChange(e.target.value)}
            >
              {usaha.map((item) => (
                <option key={item.id_usaha} value={item.id_usaha}>
                  {item.nama_usaha} -{" "}
                  {item.status_verifikasi ?? "belum diverifikasi"}
                </option>
              ))}
            </select>
          </label>
        </section>

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

        {analysis && (
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Hasil Analisis AI</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <article className="rounded-md bg-slate-50 p-4">
                <h3 className="font-bold">Dampak Lingkungan</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {formatValue(analysis.dampak?.lingkungan)}
                </p>
              </article>
              <article className="rounded-md bg-slate-50 p-4">
                <h3 className="font-bold">Dampak Sosial</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {formatValue(analysis.dampak?.sosial)}
                </p>
              </article>
              <article className="rounded-md bg-slate-50 p-4">
                <h3 className="font-bold">Dampak Ekonomi</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {formatValue(analysis.dampak?.ekonomi)}
                </p>
              </article>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-4">
              <p className="rounded-md border border-slate-200 p-4">
                <span className="block text-sm text-slate-500">
                  Lingkungan
                </span>
                <strong>{formatValue(analysis.skor_esg?.lingkungan)}</strong>
              </p>
              <p className="rounded-md border border-slate-200 p-4">
                <span className="block text-sm text-slate-500">Sosial</span>
                <strong>{formatValue(analysis.skor_esg?.sosial)}</strong>
              </p>
              <p className="rounded-md border border-slate-200 p-4">
                <span className="block text-sm text-slate-500">
                  Governance
                </span>
                <strong>{formatValue(analysis.skor_esg?.governance)}</strong>
              </p>
              <p className="rounded-md border border-slate-200 p-4">
                <span className="block text-sm text-slate-500">Total</span>
                <strong>{formatValue(analysis.skor_esg?.total)}</strong>
              </p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <article className="rounded-md bg-slate-50 p-4">
                <h3 className="font-bold">Rekomendasi</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {formatValue(analysis.rekomendasi)}
                </p>
              </article>
              <article className="rounded-md bg-slate-50 p-4">
                <h3 className="font-bold">Pengajuan</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Jumlah pinjaman:{" "}
                  {formatMoney(analysis.pengajuan?.jumlah_pinjaman)}
                </p>
                <p className="text-sm text-slate-600">
                  Tenor: {formatValue(analysis.pengajuan?.tenor_bulanan)} bulan
                </p>
                <p className="text-sm text-slate-600">
                  Bunga khusus:{" "}
                  {formatValue(analysis.pengajuan?.tingkat_bunga_khusus)}%
                </p>
                <p className="text-sm text-slate-600">
                  Syarat ESG: {formatValue(analysis.pengajuan?.syarat_esg)}
                </p>
              </article>
            </div>
          </section>
        )}

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Pertanyaan</h2>

          {pertanyaan.length === 0 ? (
            <p className="mt-4 text-slate-600">Belum ada pertanyaan.</p>
          ) : (
            <form className="mt-5 grid gap-4" onSubmit={submitAnswers}>
              {pertanyaan.map((item, index) => (
                <label
                  className="rounded-md border border-slate-200 bg-slate-50 p-4"
                  key={item.pertanyaan_id}
                >
                  <p className="font-semibold">
                    {index + 1}. {item.pertanyaan}
                  </p>
                  <textarea
                    className="mt-3 min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-3 outline-none focus:border-ftech-orange"
                    value={answers[item.pertanyaan_id] ?? ""}
                    onChange={(e) =>
                      handleAnswerChange(item.pertanyaan_id, e.target.value)
                    }
                    placeholder="Tulis jawaban"
                  />
                </label>
              ))}

              <div className="flex flex-col gap-3 md:flex-row">
                <button
                  className="rounded-md bg-ftech-orange px-5 py-3 font-semibold text-white transition hover:bg-ftech-orange/90 disabled:cursor-not-allowed disabled:opacity-70"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Mengirim..." : "Submit Jawaban"}
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
          )}
        </section>
      </div>
    </main>
  );
}

export default FormPertanyaan;
