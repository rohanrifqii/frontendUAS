import { useEffect, useState } from "react";
import type { FormEvent } from "react";
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

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [pertanyaan, setPertanyaan] = useState<Pertanyaan[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [meResponse, pertanyaanResponse] = await Promise.all([
          api.get("/me"),
          api.get("/pertanyaan"),
        ]);

        const loggedInUser = meResponse.data.user as User;

        if (loggedInUser.id_role === 2) {
          window.location.href = "/admin/dashboard";
          return;
        }

        const loadedPertanyaan = pertanyaanResponse.data.data as Pertanyaan[];

        setUser(loggedInUser);
        setPertanyaan(loadedPertanyaan);
        setAnswers(
          Object.fromEntries(
            loadedPertanyaan.map((item) => [item.pertanyaan_id, ""])
          )
        );
      } catch {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  function handleAnswerChange(pertanyaanId: number, value: string) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [pertanyaanId]: value,
    }));
  }

  async function submitAnswers(e: FormEvent) {
    e.preventDefault();

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

      await api.post("/jawaban", {
        jawaban: payload,
      });

      setSuccess("Jawaban berhasil dikirim.");
    } catch {
      setSuccess("");
      setError("Gagal mengirim jawaban.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function logout() {
    try {
      setError("");
      await api.post("/logout");
    } catch {
      setError("Logout gagal di server, token lokal tetap dihapus.");
    } finally {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }

  if (isLoading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Halo, {user.nama}</p>
      <p>Email: {user.email}</p>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <h2>Pertanyaan</h2>

      {pertanyaan.length === 0 ? (
        <p>Belum ada pertanyaan.</p>
      ) : (
        <form onSubmit={submitAnswers}>
          {pertanyaan.map((item) => (
            <label key={item.pertanyaan_id}>
              <p>{item.pertanyaan}</p>
              <textarea
                value={answers[item.pertanyaan_id] ?? ""}
                onChange={(e) =>
                  handleAnswerChange(item.pertanyaan_id, e.target.value)
                }
                placeholder="Tulis jawaban"
              />
            </label>
          ))}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Mengirim..." : "Submit Jawaban"}
          </button>
        </form>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
