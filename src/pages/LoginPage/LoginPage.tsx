import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { useTelegramAuth } from '../../hooks/useTelegramAuth';
import { loginGoogle, loginTelegram } from '../../api/auth';
import { Activity } from 'lucide-react';
import './LoginPage.css';

export const LoginPage = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (response: any) => {
    try {
      const data = await loginGoogle(response.credential);
      login(data.user);
    } catch (e) {
      setError(t('googleError'));
    }
  };

  const handleTelegramSuccess = async (user: any) => {
    try {
      const data = await loginTelegram(user);
      login(data.user);
    } catch (e) {
      setError(t('telegramError'));
    }
  };

  useGoogleAuth(import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy', handleGoogleSuccess);
  useTelegramAuth(import.meta.env.VITE_TELEGRAM_BOT_NAME || 'dummy_bot', 'telegram-login-container', handleTelegramSuccess);

  return (
    <div className="login-page">
      <div className="login-lang-switcher">
        <LanguageSwitcher />
      </div>

      <div className="login-card glass animate-fade-in">
        <div className="login-header">
          <div className="login-logo">
            <Activity size={40} className="logo-icon" />
          </div>
          <h1>{t('loginTitle')}</h1>
          <p>{t('loginSubtitle')}</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="auth-buttons">
          <div id="google-btn" className="auth-btn-wrapper"></div>
          <div className="divider"><span>{t('or')}</span></div>
          <div id="telegram-login-container" className="auth-btn-wrapper"></div>
        </div>
      </div>
    </div>
  );
};

