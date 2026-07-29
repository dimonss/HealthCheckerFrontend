import type { Endpoint } from '../../api/endpoints';
import { useLanguage } from '../../context/LanguageContext';
import { EndpointCard } from './EndpointCard';
import './EndpointList.css';

interface Props {
  endpoints: Endpoint[];
  onCheck: (id: string) => void;
  onDelete: (id: string) => void;
}

export const EndpointList = ({ endpoints, onCheck, onDelete }: Props) => {
  const { t } = useLanguage();

  if (endpoints.length === 0) {
    return <div className="empty-state glass">{t('noEndpoints')}</div>;
  }

  return (
    <div className="endpoint-list">
      {endpoints.map(ep => (
        <EndpointCard key={ep.id} endpoint={ep} onCheck={onCheck} onDelete={onDelete} />
      ))}
    </div>
  );
};

