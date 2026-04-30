import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

import './index.css';

function App() {
  const path = window.location.pathname;

  if (path === '/login') return <Login />;
  if (path === '/register') return <Register />;
  if (path === '/dashboard') return <Dashboard />;
  if (path === '/admin/dashboard') return <AdminDashboard />;

  return <Index />;
}

export default App;
