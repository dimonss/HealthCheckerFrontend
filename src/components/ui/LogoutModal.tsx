import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { loginGoogle, loginTelegram } from '../../api/auth';
import { LogOut, AlertTriangle, UserPlus } from 'lucide-react';
import './LogoutModal.css';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutModal = ({ isOpen, onClose }: LogoutModalProps) => {
  const { logout, login, availableProviders } = useAuth();
  const navigate = useNavigate();

  const hasGoogle = availableProviders.includes('google');
  const hasTelegram = availableProviders.includes('telegram');

  // Handle Telegram widget initialization when only 1 provider is active and it's Google
  useEffect(() => {
    if (!isOpen || hasTelegram) return;
    const container = document.getElementById('logout-modal-telegram-container');
    if (!container) return;

    container.innerHTML = '';
    const botName = import.meta.env.VITE_TELEGRAM_BOT_NAME || 'dummy_bot';

    (window as any).onTelegramAuthLogoutModal = async (tgUser: any) => {
      try {
        const data = await loginTelegram(tgUser);
        login(data.user, 'telegram');
      } catch (err) {
        console.error('Telegram auth failed', err);
      }
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '20');
    script.setAttribute('data-onauth', 'onTelegramAuthLogoutModal(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;
    container.appendChild(script);

    return () => {
      delete (window as any).onTelegramAuthLogoutModal;
    };
  }, [isOpen, hasTelegram, login]);

  // Handle Google button initialization when only 1 provider is active and it's Telegram
  useEffect(() => {
    if (!isOpen || hasGoogle) return;
    const container = document.getElementById('logout-modal-google-container');
    if (!container) return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const handleGoogleCallback = async (response: any) => {
      try {
        const data = await loginGoogle(response.credential);
        login(data.user, 'google');
      } catch (err) {
        console.error('Google auth failed', err);
      }
    };

    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCallback,
      });
      window.google.accounts.id.renderButton(container, {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
      });
    }
  }, [isOpen, hasGoogle, login]);

  const handleLogoutProvider = async (provider: 'google' | 'telegram') => {
    await logout(provider);
    if (availableProviders.length <= 1) {
      onClose();
      navigate('/');
    }
  };

  const handleLogoutAll = async () => {
    await logout('all');
    onClose();
    navigate('/');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Выход из аккаунта">
      <div className="logout-modal-content">
        {/* SSO Warning */}
        <div className="sso-warning-card">
          <div className="sso-warning-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="sso-warning-text">
            <h4>Сквозная авторизация экосистемы chalysh.pro</h4>
            <p>
              Выход будет выполнен во всех подключенных веб-приложениях экосистемы
              (HealthChecker, Брелоки, Ретроспектива, Валидатор ТЗ, Space Shooter, ChalyshAuth).
            </p>
          </div>
        </div>

        {/* Both providers authorized */}
        {hasGoogle && hasTelegram ? (
          <div className="logout-accounts-section">
            <p className="logout-accounts-title">Выберите вариант выхода:</p>

            <div className="logout-option-card">
              <div className="logout-option-info">
                <span className="logout-option-name">🔵 Google</span>
                <span className="logout-option-desc">
                  Выйти из Google во всех сервисах. Telegram останется активным.
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleLogoutProvider('google')}
              >
                Выйти из Google
              </Button>
            </div>

            <div className="logout-option-card">
              <div className="logout-option-info">
                <span className="logout-option-name">✈️ Telegram</span>
                <span className="logout-option-desc">
                  Выйти из Telegram во всех сервисах. Google останется активным.
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleLogoutProvider('telegram')}
              >
                Выйти из Telegram
              </Button>
            </div>

            <div className="logout-option-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <div className="logout-option-info">
                <span className="logout-option-name" style={{ color: '#f87171' }}>
                  🚪 Выйти со всех сразу
                </span>
                <span className="logout-option-desc">
                  Полный выход из обоих аккаунтов во всех сервисах chalysh.pro.
                </span>
              </div>
              <Button variant="danger" size="sm" onClick={handleLogoutAll}>
                Выйти со всех
              </Button>
            </div>
          </div>
        ) : (
          /* Only 1 provider authorized */
          <div className="logout-accounts-section">
            <div className="logout-option-card">
              <div className="logout-option-info">
                <span className="logout-option-name">
                  {hasGoogle ? '🔵 Google' : '✈️ Telegram'} (активен)
                </span>
                <span className="logout-option-desc">
                  Текущий аккаунт в сервисе
                </span>
              </div>
              <Button variant="danger" size="sm" onClick={handleLogoutAll}>
                <LogOut size={14} />
                <span>Выйти со всех сервисов</span>
              </Button>
            </div>

            {/* Authorize other provider button/widget */}
            <div className="logout-add-provider-card">
              <div className="logout-add-provider-header">
                <UserPlus size={18} />
                <span>Войти другим способом</span>
              </div>
              <p className="logout-add-provider-desc">
                {hasGoogle
                  ? 'Вы можете также войти через Telegram, чтобы переключаться между разными профилями:'
                  : 'Вы можете также войти через Google, чтобы переключаться между разными профилями:'}
              </p>
              <div className="logout-widget-wrapper">
                {hasGoogle ? (
                  <div id="logout-modal-telegram-container"></div>
                ) : (
                  <div id="logout-modal-google-container"></div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="logout-modal-actions">
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
        </div>
      </div>
    </Modal>
  );
};
