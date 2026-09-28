import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './ui/LanguageSwitcher';
import { ThemeSwitcher } from './ui/ThemeSwitcher';
import { TelegramModal } from './ui/TelegramModal';
import { InviteModal } from './invites/InviteModal';
import { LogoutModal } from './ui/LogoutModal';
import { Activity, LogOut, LayoutDashboard, Menu, X, Send, UserPlus, RefreshCw } from 'lucide-react';
import './Layout.css';

export const Layout = () => {
  const { user, activeProvider, availableProviders, switchProvider } = useAuth();
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsMobileMenuOpen(false);
    setIsLogoutModalOpen(true);
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
              setIsInviteModalOpen(true);
            }}
          >
            <UserPlus size={20} />
            <span>{t('accessManagement')}</span>
          </button>
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
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
              <span className="user-name">{displayName}</span>
              {activeProvider && (
                <span className="account-provider-tag">
                  {activeProvider === 'google' ? '🔵 Google' : '✈️ Telegram'}
                </span>
              )}
            </div>
          </div>
          {availableProviders.length > 1 ? (
            <button
              className="switch-account-btn"
              onClick={() => switchProvider(activeProvider === 'google' ? 'telegram' : 'google')}
              title={activeProvider === 'google' ? 'Переключить на Telegram' : 'Переключить на Google'}
            >
              <RefreshCw size={13} />
              <span>{activeProvider === 'google' ? '✈️ На Telegram' : '🔵 На Google'}</span>
            </button>
          ) : availableProviders.length === 1 && (
            <button
              className="switch-account-btn add-account-btn"
              onClick={() => setIsLogoutModalOpen(true)}
              title={activeProvider === 'google' ? 'Войти через Telegram' : 'Войти через Google'}
            >
              <UserPlus size={13} />
              <span>{activeProvider === 'google' ? '+ ✈️ Войти в TG' : '+ 🔵 Войти в Google'}</span>
            </button>
          )}
          <button className="logout-btn" onClick={handleLogoutClick}>
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

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};



