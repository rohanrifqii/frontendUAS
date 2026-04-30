import { useEffect, useState } from 'react';
import api from '../lib/api';

function AdminDashboard() {
  const [pertanyaan, setPertanyaan] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  async function loadPertanyaan() {
    const response = await api.get('/pertanyaan');
    setPertanyaan(response.data.data);
  }

  useEffect(() => {
    loadPertanyaan().catch(() => {
      window.location.href = '/login';
    });
  }, []);

  async function tambahPertanyaan(e: React.FormEvent) {
    e.preventDefault();

    try {
      setError('');

      await api.post('/admin/pertanyaan', {
        pertanyaan: input,
      });

      setInput('');
      loadPertanyaan();
    } catch {
      setError('Gagal menambah pertanyaan');
    }
  }

  return (
    <div>
      <h1>Dashboard Admin</h1>

      {error && <p>{error}</p>}

      <form onSubmit={tambahPertanyaan}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tulis pertanyaan"
        />

        <button type="submit">Tambah</button>
      </form>

      <h2>Daftar Pertanyaan</h2>

      {pertanyaan.map((item) => (
        <p key={item.pertanyaan_id}>{item.pertanyaan}</p>
      ))}
    </div>
  );
}

export default AdminDashboard;
