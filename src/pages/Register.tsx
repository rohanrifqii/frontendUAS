import { useState } from 'react';
import type { FormEvent } from 'react';
import { isAxiosError } from 'axios';
import api from '../lib/api';

function Register() {
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setError('');
      setIsSubmitting(true);

      const response = await api.post('/register', {
        nama,
        username,
        email,
        password,
        password_confirmation: password,
      });

      localStorage.setItem('token', response.data.token);
      window.location.assign('/dashboard');
    } catch (err) {
      if (isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(err)) {
        const errors = err.response?.data?.errors;
        setError(errors ? Object.values(errors).flat().join(' ') : err.response?.data?.message ?? 'Register gagal');
        return;
      }

      setError('Register gagal');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-ftech-dark via-ftech-medium to-ftech-dark px-6 py-10 text-white">
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 flex w-full max-w-md flex-col gap-5 rounded-lg border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-ftech-orange">
            F-Tech Solution
          </p>
          <h1 className="mt-2 text-3xl font-bold">Register</h1>
        </div>

        {error && (
          <p className="rounded-md border border-red-300/40 bg-red-500/15 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        )}

        <label className="flex flex-col gap-2 text-sm font-medium">
          Nama
          <input
            className="rounded-md border border-white/15 bg-white px-3 py-3 text-ftech-dark outline-none focus:border-ftech-orange"
            placeholder="Nama lengkap"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Username
          <input
            className="rounded-md border border-white/15 bg-white px-3 py-3 text-ftech-dark outline-none focus:border-ftech-orange"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Email
          <input
            className="rounded-md border border-white/15 bg-white px-3 py-3 text-ftech-dark outline-none focus:border-ftech-orange"
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Password
          <input
            className="rounded-md border border-white/15 bg-white px-3 py-3 text-ftech-dark outline-none focus:border-ftech-orange"
            type="password"
            placeholder="Minimal 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button
          className="rounded-md bg-ftech-orange px-5 py-3 font-semibold text-white transition hover:bg-ftech-orange/90 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Loading...' : 'Register'}
        </button>

        <button
          type="button"
          className="text-sm font-medium text-white/80 hover:text-white"
          onClick={() => window.location.assign('/login')}
        >
          Sudah punya akun? Login
        </button>
      </form>
    </main>
  );
}

export default Register;
