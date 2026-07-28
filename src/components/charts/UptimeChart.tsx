import './Charts.css';

export const UptimeChart = ({ percentage }: { percentage: number }) => {
  const color = percentage > 99 ? 'var(--color-up)' : percentage > 95 ? '#f59e0b' : 'var(--color-down)';
  
  return (
    <div className="chart-container glass uptime-container">
      <h3>Общий Uptime</h3>
      <div className="uptime-value" style={{ color }}>
        {percentage.toFixed(2)}%
      </div>
      <div className="uptime-bar-bg">
        <div className="uptime-bar-fill" style={{ width: `${percentage}%`, background: color }}></div>
      </div>
    </div>
  );
};
