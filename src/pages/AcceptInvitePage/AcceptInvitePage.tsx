import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getInviteInfo, acceptInvite, type InviteInfoResponse } from '../../api/invites';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserCheck, ShieldAlert, Activity, ArrowRight, CheckCircle } from 'lucide-react';
import './AcceptInvitePage.css';

export const AcceptInvitePage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [inviteInfo, setInviteInfo] = useState<InviteInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const autoAcceptTriedRef = useRef(false);

  useEffect(() => {
    if (token) {
      loadInfo(token);
      if (!user) {
        sessionStorage.setItem('redirect_path', `/invite/${token}`);
      }
    }
  }, [token, user]);

  const loadInfo = async (invToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getInviteInfo(invToken);
      setInviteInfo(res);
    } catch (e: any) {
      console.error(e);
      setError(e.response?.data?.message || t('invalidInvite'));
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!token) return;
    setAccepting(true);
    setError(null);
    try {
      await acceptInvite(token);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (e: any) {
      console.error(e);
      setError(e.response?.data?.message || e.message || 'Ошибка при принятии приглашения');
    } finally {
      setAccepting(false);
    }
  };

  // If user explicitly clicked "Войти, чтобы принять" before auth, auto-accept after auth redirect
  useEffect(() => {
    if (user && token && inviteInfo && inviteInfo.isValid && !success && !accepting && !error && !autoAcceptTriedRef.current) {
      const pendingAutoAccept = sessionStorage.getItem('auto_accept_invite');
      if (pendingAutoAccept === token) {
        autoAcceptTriedRef.current = true;
        sessionStorage.removeItem('auto_accept_invite');
        handleAccept();
      }
    }
  }, [user, token, inviteInfo, success, accepting, error]);

  if (loading) {
    return (
      <div className="accept-invite-container">
        <div className="accept-invite-card glass">
          <Activity className="brand-icon spin" size={40} />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Загрузка приглашения...</p>
        </div>
      </div>
    );
  }

  if (error || !inviteInfo || !inviteInfo.isValid) {
    return (
      <div className="accept-invite-container">
        <div className="accept-invite-card glass">
          <div className="accept-invite-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <ShieldAlert size={32} />
          </div>
          <h2 className="accept-invite-title">{t('invalidInvite')}</h2>
          <p className="accept-invite-desc">{error || t('invalidInvite')}</p>
          <Link to="/dashboard" className="btn-primary" style={{ width: '100%' }}>
            {t('dashboard')}
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="accept-invite-container">
        <div className="accept-invite-card glass">
          <div className="accept-invite-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <CheckCircle size={32} />
          </div>
          <h2 className="accept-invite-title">{t('inviteAccepted')}</h2>
          <p className="accept-invite-desc">Перенаправление на дашборд...</p>
        </div>
      </div>
    );
  }

  const inviterName = inviteInfo.inviter?.name || 'Пользователь';
  const endpointName = inviteInfo.endpoint?.name
    ? `"${inviteInfo.endpoint.name}"`
    : t('allEndpoints');

  return (
    <div className="accept-invite-container">
      <div className="accept-invite-card glass">
        <div className="accept-invite-icon">
          <UserCheck size={32} />
        </div>
        <h2 className="accept-invite-title">{t('acceptInviteTitle')}</h2>
        <p className="accept-invite-desc">
          {t('acceptInviteDesc', { inviter: inviterName, endpoint: endpointName })}
        </p>

        <div className="accept-invite-details">
          <div className="detail-row">
            <span className="detail-label">Пригласил:</span>
            <span className="detail-value">{inviterName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{t('selectScope')}:</span>
            <span className="detail-value">{endpointName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{t('selectRole')}:</span>
            <span className="detail-value">
              {inviteInfo.invite.role === 'editor' ? t('roleEditor') : t('roleViewer')}
            </span>
          </div>
        </div>

        <div className="accept-invite-actions">
          {user ? (
            <button className="btn-primary btn-accept" onClick={handleAccept} disabled={accepting}>
              <span>{t('acceptInviteBtn')}</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <Link
              to={`/?returnUrl=${encodeURIComponent(`/invite/${token}`)}`}
              className="btn-primary btn-accept"
              onClick={() => {
                sessionStorage.setItem('redirect_path', `/invite/${token}`);
                sessionStorage.setItem('auto_accept_invite', token || '');
              }}
            >
              <span>Войти, чтобы принять</span>
              <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
