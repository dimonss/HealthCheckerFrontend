import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getEndpoints, type Endpoint } from '../../api/endpoints';
import {
  createInvite,
  getInvites,
  revokeInvite,
  getAccessGrants,
  revokeAccess,
  type InviteLink,
  type AccessGrantItem
} from '../../api/invites';
import { X, Copy, Check, UserPlus, Link as LinkIcon, Trash2, LogOut } from 'lucide-react';
import './InviteModal.css';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getInviteUrl = (token: string) => {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${window.location.origin}${basePath}/invite/${token}`;
};

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'create' | 'links' | 'access'>('create');

  const [endpointsList, setEndpointsList] = useState<Endpoint[]>([]);
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('all');
  const [role, setRole] = useState<'viewer' | 'editor'>('viewer');
  const [expiresInHours, setExpiresInHours] = useState<number | null>(null);

  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [invitesList, setInvitesList] = useState<InviteLink[]>([]);
  const [grantedList, setGrantedList] = useState<AccessGrantItem[]>([]);
  const [receivedList, setReceivedList] = useState<AccessGrantItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    } else {
      setGeneratedLink(null);
      setError(null);
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [eps, invs, accs] = await Promise.all([
        getEndpoints(),
        getInvites(),
        getAccessGrants()
      ]);
      // Filter owned endpoints for share scope dropdown
      setEndpointsList(eps.filter(e => e.isOwner !== false));
      setInvitesList(invs);
      setGrantedList(accs.grantedToOthers);
      setReceivedList(accs.receivedFromOthers);
    } catch (e: any) {
      console.error(e);
      setError(e.response?.data?.message || e.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await createInvite({
        endpointId: selectedEndpointId === 'all' ? null : selectedEndpointId,
        role,
        expiresInHours
      });

      const fullLink = getInviteUrl(result.token);
      setGeneratedLink(fullLink);
      setCopied(false);

      // Refresh invites list
      const invs = await getInvites();
      setInvitesList(invs);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Ошибка при создании ссылки');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (linkToCopy: string) => {
    navigator.clipboard.writeText(linkToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevokeInvite = async (id: string) => {
    try {
      await revokeInvite(id);
      setInvitesList(invitesList.filter(i => i.id !== id));
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleRevokeAccess = async (accessId: string) => {
    try {
      await revokeAccess(accessId);
      setGrantedList(grantedList.filter(g => g.id !== accessId));
      setReceivedList(receivedList.filter(r => r.id !== accessId));
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="invite-modal-overlay" onClick={onClose}>
      <div className="invite-modal" onClick={e => e.stopPropagation()}>
        <div className="invite-modal-header">
          <div className="invite-modal-title">
            <UserPlus size={22} className="text-primary" />
            <span>{t('accessManagement')}</span>
          </div>
          <button className="invite-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="invite-tabs">
          <button
            className={`invite-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            {t('createInviteLink')}
          </button>
          <button
            className={`invite-tab-btn ${activeTab === 'links' ? 'active' : ''}`}
            onClick={() => setActiveTab('links')}
          >
            {t('activeLinks')} ({invitesList.length})
          </button>
          <button
            className={`invite-tab-btn ${activeTab === 'access' ? 'active' : ''}`}
            onClick={() => setActiveTab('access')}
          >
            {t('grantedAccess')} ({grantedList.length + receivedList.length})
          </button>
        </div>

        <div className="invite-modal-body">
          {error && <div className="error-banner" style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

          {activeTab === 'create' && (
            <form onSubmit={handleCreateInvite} className="invite-form">
              <div className="form-group">
                <label>{t('selectScope')}</label>
                <select
                  className="form-select"
                  value={selectedEndpointId}
                  onChange={e => setSelectedEndpointId(e.target.value)}
                >
                  <option value="all">{t('allEndpoints')}</option>
                  {endpointsList.map(ep => (
                    <option key={ep.id} value={ep.id}>
                      {ep.name} ({ep.url})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{t('selectRole')}</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                >
                  <option value="viewer">{t('roleViewer')}</option>
                  <option value="editor">{t('roleEditor')}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t('expirePeriod')}</label>
                <select
                  className="form-select"
                  value={expiresInHours === null ? 'never' : String(expiresInHours)}
                  onChange={e => setExpiresInHours(e.target.value === 'never' ? null : Number(e.target.value))}
                >
                  <option value="never">{t('expireNever')}</option>
                  <option value="24">{t('expire24h')}</option>
                  <option value="168">{t('expire7d')}</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                <LinkIcon size={18} />
                <span>{t('generateLinkBtn')}</span>
              </button>

              {generatedLink && (
                <div className="generated-link-box">
                  <label>{t('createInviteLink')}</label>
                  <div className="link-input-row">
                    <input type="text" className="form-input" value={generatedLink} readOnly />
                    <button
                      type="button"
                      className="btn-copy"
                      onClick={() => handleCopyLink(generatedLink)}
                    >
                      {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                      <span>{copied ? t('codeCopied') : t('copyLink')}</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {activeTab === 'links' && (
            <div className="invite-items-list">
              {invitesList.length === 0 ? (
                <div className="empty-state">{t('noActiveLinks')}</div>
              ) : (
                invitesList.map(inv => {
                  const fullUrl = getInviteUrl(inv.token);
                  return (
                    <div key={inv.id} className="invite-item-card">
                      <div className="invite-item-info">
                        <div className="invite-item-title">{inv.endpointName}</div>
                        <div className="invite-item-meta">
                          <span className={`role-badge ${inv.role}`}>
                            {inv.role === 'editor' ? t('roleEditor') : t('roleViewer')}
                          </span>
                          <span>
                            {inv.expiresAt
                              ? `До ${new Date(inv.expiresAt).toLocaleDateString()}`
                              : t('expireNever')}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn-copy"
                          onClick={() => handleCopyLink(fullUrl)}
                          title={t('copyLink')}
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          className="btn-danger-sm"
                          onClick={() => handleRevokeInvite(inv.id)}
                          title={t('revoke')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'access' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                  {t('grantedAccess')} ({grantedList.length})
                </h4>
                {grantedList.length === 0 ? (
                  <div className="empty-state" style={{ padding: '1rem' }}>{t('noGrantedAccess')}</div>
                ) : (
                  <div className="invite-items-list">
                    {grantedList.map(item => (
                      <div key={item.id} className="invite-item-card">
                        <div className="invite-item-info">
                          <div className="invite-item-title">{item.user?.name || 'Пользователь'}</div>
                          <div className="invite-item-meta">
                            <span>{item.endpointName}</span>
                            <span className={`role-badge ${item.role}`}>
                              {item.role === 'editor' ? t('roleEditor') : t('roleViewer')}
                            </span>
                            <span>
                              {item.expiresAt
                                ? `До ${new Date(item.expiresAt).toLocaleDateString()}`
                                : t('expireNever')}
                            </span>
                          </div>
                        </div>
                        <button
                          className="btn-danger-sm"
                          onClick={() => handleRevokeAccess(item.id)}
                        >
                          {t('revoke')}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                  {t('sharedWithMe')} ({receivedList.length})
                </h4>
                {receivedList.length === 0 ? (
                  <div className="empty-state" style={{ padding: '1rem' }}>{t('noSharedWithMe')}</div>
                ) : (
                  <div className="invite-items-list">
                    {receivedList.map(item => (
                      <div key={item.id} className="invite-item-card">
                        <div className="invite-item-info">
                          <div className="invite-item-title">{t('sharedBy', { name: item.inviter?.name || '' })}</div>
                          <div className="invite-item-meta">
                            <span>{item.endpointName}</span>
                            <span className={`role-badge ${item.role}`}>
                              {item.role === 'editor' ? t('roleEditor') : t('roleViewer')}
                            </span>
                            <span>
                              {item.expiresAt
                                ? `До ${new Date(item.expiresAt).toLocaleDateString()}`
                                : t('expireNever')}
                            </span>
                          </div>
                        </div>
                        <button
                          className="btn-danger-sm"
                          onClick={() => handleRevokeAccess(item.id)}
                        >
                          <LogOut size={14} style={{ marginRight: '4px' }} />
                          {t('leaveAccess')}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
