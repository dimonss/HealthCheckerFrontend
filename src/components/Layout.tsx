import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './ui/LanguageSwitcher';
import { ThemeSwitcher } from './ui/ThemeSwitcher';
import { TelegramModal } from './ui/TelegramModal';
import { Activity, LogOut, LayoutDashboard, Menu, X, Send } from 'lucide-react';
import './Layout.css';

export const Layout = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const displayName = user?.firstName || user?.username || user?.email || t('userDefault');
  const initial = displayName[0]?.toUpperCase() || 'U';
  const avatarUrl = user?.photoUrl;

  return (
    <div className="layout">
      {isMobileMenuOpen && (
        <div className="sidebar-backdrop" onClick={closeMobileMenu} />
      )}
      <aside className={`sidebar glass ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header-mobile">
          <div className="brand">
            <Activity className="brand-icon" />
            <span>HealthChecker</span>
          </div>
          <button className="mobile-close-btn" onClick={closeMobileMenu} aria-label="Close navigation">
            <X size={24} />
          </button>
        </div>
        <div className="brand brand-desktop">
          <Activity className="brand-icon" />
          <span>HealthChecker</span>
        </div>
        <nav className="nav">
          <Link to="/dashboard" className="nav-item" onClick={closeMobileMenu}>
            <LayoutDashboard size={20} />
            <span>{t('dashboard')}</span>
          </Link>
          <button
            className="nav-item nav-btn-item"
            onClick={() => {
              closeMobileMenu();
              setIsTelegramModalOpen(true);
            }}
          >
            <Send size={20} className="tg-nav-icon" />
            <span>{t('telegramSettings')}</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            {avatarUrl && !imageError ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="avatar-img"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="avatar">{initial}</div>
            )}
            <span className="user-name">{displayName}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="header glass">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2>{t('monitoring')}</h2>
          </div>
          <div className="header-controls">
            <button
              className="tg-header-btn"
              onClick={() => setIsTelegramModalOpen(true)}
              title={t('telegramSettings')}
            >
              <Send size={18} />
              <span className="tg-header-btn-text">{t('telegramSettings')}</span>
            </button>
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>

      <TelegramModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />
    </div>
  );
};


