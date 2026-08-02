import { useState } from 'react';
import type { Endpoint } from '../../api/endpoints';
import { useLanguage } from '../../context/LanguageContext';
import { EndpointCard } from './EndpointCard';
import { Server, Users } from 'lucide-react';
import './EndpointList.css';

interface Props {
  endpoints: Endpoint[];
  onCheck: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (endpoint: Endpoint) => void;
}

export const EndpointList = ({ endpoints, onCheck, onDelete, onEdit }: Props) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'mine' | 'shared'>('all');

  if (endpoints.length === 0) {
    return <div className="empty-state glass">{t('noEndpoints')}</div>;
  }

  const ownedEndpoints = endpoints.filter(e => e.isOwner !== false);
  const sharedEndpoints = endpoints.filter(e => e.isOwner === false);
  const hasBothTypes = ownedEndpoints.length > 0 && sharedEndpoints.length > 0;

  return (
    <div className="endpoint-list-wrapper">
      {hasBothTypes && (
        <div className="endpoint-filter-tabs">
          <button
            className={`filter-tab-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            {t('allFilter')} ({endpoints.length})
          </button>
          <button
            className={`filter-tab-btn ${filter === 'mine' ? 'active' : ''}`}
            onClick={() => setFilter('mine')}
          >
            <Server size={14} />
            {t('myEndpoints')} ({ownedEndpoints.length})
          </button>
          <button
            className={`filter-tab-btn ${filter === 'shared' ? 'active' : ''}`}
            onClick={() => setFilter('shared')}
          >
            <Users size={14} />
            {t('sharedWithMe')} ({sharedEndpoints.length})
          </button>
        </div>
      )}

      {(filter === 'all' || filter === 'mine') && (ownedEndpoints.length > 0 || filter === 'mine') && (
        <div className="endpoint-section">
          {sharedEndpoints.length > 0 && (
            <div className="endpoint-section-title">
              <Server size={18} className="text-accent" />
              <h3>{t('myEndpoints')}</h3>
              <span className="count-badge">{ownedEndpoints.length}</span>
            </div>
          )}
          {ownedEndpoints.length === 0 ? (
            <div className="empty-state glass">{t('noOwnedEndpoints')}</div>
          ) : (
            <div className="endpoint-list">
              {ownedEndpoints.map(ep => (
                <EndpointCard key={ep.id} endpoint={ep} onCheck={onCheck} onDelete={onDelete} onEdit={onEdit} />
              ))}
            </div>
          )}
        </div>
      )}

      {(filter === 'all' || filter === 'shared') && (sharedEndpoints.length > 0 || filter === 'shared') && (
        <div className="endpoint-section shared-section" style={{ marginTop: hasBothTypes && filter === 'all' ? '12px' : '0' }}>
          {(ownedEndpoints.length > 0 || filter === 'shared') && (
            <div className="endpoint-section-title shared-section-title">
              <Users size={18} className="text-shared" />
              <h3>{t('sharedWithMe')}</h3>
              <span className="count-badge shared-badge-count">{sharedEndpoints.length}</span>
            </div>
          )}
          {sharedEndpoints.length === 0 ? (
            <div className="empty-state glass">{t('noSharedEndpoints')}</div>
          ) : (
            <div className="endpoint-list">
              {sharedEndpoints.map(ep => (
                <EndpointCard key={ep.id} endpoint={ep} onCheck={onCheck} onDelete={onDelete} onEdit={onEdit} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

