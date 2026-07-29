import { useLanguage } from '../../context/LanguageContext';

interface StatusBadgeProps {
  status: 'up' | 'down' | 'error' | 'unknown';
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { t } = useLanguage();
  const normalizedStatus = status === 'error' ? 'down' : status;
  const label = status === 'up' ? t('statusOnline') : (status === 'down' || status === 'error') ? t('statusDown') : t('statusUnknown');
  return (
    <div className={`status-badge status-${normalizedStatus}`}>
      <span className="status-dot"></span>
      {label}
    </div>
  );
};

