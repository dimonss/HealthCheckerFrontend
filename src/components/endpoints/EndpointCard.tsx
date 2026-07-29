import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Activity, Clock, Trash2 } from 'lucide-react';
import type { Endpoint } from '../../api/endpoints';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from './StatusBadge';
import { Button } from '../ui/Button';
import './EndpointCard.css';

interface Props {
  endpoint: Endpoint;
  onCheck: (id: string) => void;
  onDelete: (id: string) => void;
}

export const EndpointCard = ({ endpoint, onCheck, onDelete }: Props) => {
  const { t, language } = useLanguage();
  const [isExiting, setIsExiting] = useState(false);

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

  return (
    <div className={`endpoint-card glass ${isExiting ? 'animate-card-exit' : ''}`}>
      <div className="ec-header">
        <Link to={`/endpoint/${endpoint.id}`} className="ec-title">
          <h3>{endpoint.name}</h3>
          <span className="ec-url">{endpoint.url}</span>
        </Link>
        <StatusBadge status={endpoint.lastStatus || 'unknown'} />
      </div>
      
      <div className="ec-body">
        <div className="ec-info">
          <span className="ec-method">{endpoint.method}</span>
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
          <Button
            variant="ghost"
            size="sm"
            className="btn-icon-danger"
            onClick={handleDeleteClick}
            disabled={isExiting}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

