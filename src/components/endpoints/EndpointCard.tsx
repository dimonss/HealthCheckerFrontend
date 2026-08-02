import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Activity, Clock, Trash2, Users, Pencil, Send } from 'lucide-react';
import { type Endpoint, toggleEndpointTelegramNotify } from '../../api/endpoints';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from './StatusBadge';
import { Button } from '../ui/Button';
import './EndpointCard.css';

interface Props {
  endpoint: Endpoint;
  onCheck: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (endpoint: Endpoint) => void;
}

export const EndpointCard = ({ endpoint, onCheck, onDelete, onEdit }: Props) => {
  const { t, language } = useLanguage();
  const [isExiting, setIsExiting] = useState(false);
  const [isTgNotify, setIsTgNotify] = useState<boolean>(endpoint.isTelegramNotify !== false);
  const [togglingTg, setTogglingTg] = useState(false);

  const handleTgToggle = async () => {
    const nextVal = !isTgNotify;
    setIsTgNotify(nextVal);
    setTogglingTg(true);
    try {
      await toggleEndpointTelegramNotify(endpoint.id, nextVal);
    } catch (e) {
      console.error(e);
      setIsTgNotify(!nextVal);
    } finally {
      setTogglingTg(false);
    }
  };

  const formatInterval = (seconds: number): string => {
    if (seconds < 3600) {
      return t('unitMin', { count: Math.round(seconds / 60) });
    }
    return t('unitHour', { count: Math.round(seconds / 3600) });
  };

  const handleDeleteClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDelete(endpoint.id);
    }, 320);
  };

  const dateLocale = language === 'ru' ? 'ru-RU' : 'en-US';
  const rawStatus = endpoint.lastStatus || 'unknown';
  const normalizedStatus = rawStatus === 'error' ? 'down' : rawStatus;
  const isShared = endpoint.isOwner === false;
  const canEdit = endpoint.isOwner !== false || endpoint.accessRole === 'editor';

  return (
    <div className={`endpoint-card glass status-card-${normalizedStatus} ${isShared ? 'is-shared-card' : ''} ${isExiting ? 'animate-card-exit' : ''}`}>
      <div className="ec-header">
        <Link to={`/endpoint/${endpoint.id}`} className="ec-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h3>{endpoint.name}</h3>
            {isShared && (
              <span className="shared-owner-tag" title={t('sharedBy', { name: endpoint.ownerName || '' })}>
                <Users size={12} />
                <span>{t('sharedBy', { name: endpoint.ownerName || '' })}</span>
                {endpoint.accessRole && (
                  <span className={`role-chip ${endpoint.accessRole}`}>
                    {endpoint.accessRole === 'editor' ? t('roleEditor') : t('roleViewer')}
                  </span>
                )}
              </span>
            )}
          </div>
          <span className="ec-url">{endpoint.url}</span>
        </Link>
        <StatusBadge status={endpoint.lastStatus || 'unknown'} />
      </div>

      
      <div className="ec-body">
        <div className="ec-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="ec-method">{endpoint.method}</span>
            <button
              type="button"
              className={`tg-notify-toggle ${isTgNotify ? 'active' : 'inactive'}`}
              onClick={handleTgToggle}
              disabled={togglingTg}
              title={isTgNotify ? t('tgNotifyEnabled') : t('tgNotifyDisabled')}
            >
              <Send size={12} />
              <span>{isTgNotify ? t('tgOn') : t('tgOff')}</span>
            </button>
          </div>
          <div className="ec-meta">
            <Clock size={14} />
            <span>{t('every', { interval: formatInterval(endpoint.checkIntervalSeconds) })}</span>
          </div>
          {endpoint.lastCheckedAt && (
            <div className="ec-meta">
              <Activity size={14} />
              <span>{new Date(endpoint.lastCheckedAt).toLocaleString(dateLocale)}</span>
            </div>
          )}
        </div>
        
        <div className="ec-actions">
          <Button variant="secondary" size="sm" onClick={() => onCheck(endpoint.id)}>
            <Play size={14} /> {t('check')}
          </Button>
          {canEdit && onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(endpoint)}
              title={t('edit')}
            >
              <Pencil size={16} />
            </Button>
          )}
          {endpoint.isOwner !== false && (
            <Button
              variant="ghost"
              size="sm"
              className="btn-icon-danger"
              onClick={handleDeleteClick}
              disabled={isExiting}
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

