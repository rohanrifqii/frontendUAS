import { useEffect, useState } from 'react';
import api from '../lib/api';

function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get('/me')
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      });
  }, []);

  async function logout() {
    await api.post('/logout');
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Halo, {user.nama}</p>
      <p>Email: {user.email}</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
