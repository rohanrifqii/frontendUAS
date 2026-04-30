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

      await api.post('/register', {
        nama,
        username,
        email,
        password,
        password_confirmation: password,
      });

      window.location.href = '/login';
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
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>

      {error && <p>{error}</p>}

      <input placeholder="Nama" value={nama} onChange={(e) => setNama(e.target.value)} />
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : 'Register'}
      </button>
    </form>
  );
}

export default Register;
