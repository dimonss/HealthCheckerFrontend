interface StatusBadgeProps {
  status: 'up' | 'down' | 'error' | 'unknown';
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const normalizedStatus = status === 'error' ? 'down' : status;
  const label = status === 'up' ? 'Работает' : (status === 'down' || status === 'error') ? 'Ошибка' : 'Неизвестно';
  return (
    <div className={`status-badge status-${normalizedStatus}`}>
      <span className="status-dot"></span>
      {label}
    </div>
  );
};
