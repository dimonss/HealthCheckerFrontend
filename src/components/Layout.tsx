import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, LayoutDashboard } from 'lucide-react';
import './Layout.css';

export const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayName = user?.firstName || user?.username || user?.email || 'Пользователь';
  const initial = displayName[0]?.toUpperCase() || 'U';

  return (
    <div className="layout">
      <aside className="sidebar glass">
        <div className="brand">
          <Activity className="brand-icon" />
          <span>HealthChecker</span>
        </div>
        <nav className="nav">
          <Link to="/dashboard" className="nav-item">
            <LayoutDashboard size={20} />
            <span>Дашборд</span>
          </Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{initial}</div>
            <span className="user-name">{displayName}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Выйти</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="header glass">
          <h2>Мониторинг</h2>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
