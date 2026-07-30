import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage, type TranslationKey } from '../../context/LanguageContext';
import './Charts.css';

export interface DataPoint {
  timestamp: number;
  value: number;
  status?: 'up' | 'down' | 'error';
}

export type TimePeriod = '1h' | '24h' | '7d' | '30d';

interface ResponseTimeChartProps {
  data: DataPoint[];
  period?: TimePeriod;
  onPeriodChange?: (period: TimePeriod) => void;
  loading?: boolean;
}

const PERIOD_CONFIG: { value: TimePeriod; labelKey: TranslationKey }[] = [
  { value: '1h', labelKey: 'period1h' },
  { value: '24h', labelKey: 'period24h' },
  { value: '7d', labelKey: 'period7d' },
  { value: '30d', labelKey: 'period30d' },
];

export const ResponseTimeChart = ({
  data,
  period = '24h',
  onPeriodChange,
  loading = false,
}: ResponseTimeChartProps) => {
  const { t, language } = useLanguage();
  const now = Date.now();
  let periodMs = 24 * 60 * 60 * 1000;
  if (period === '1h') periodMs = 60 * 60 * 1000;
  else if (period === '24h') periodMs = 24 * 60 * 60 * 1000;
  else if (period === '7d') periodMs = 7 * 24 * 60 * 60 * 1000;
  else if (period === '30d') periodMs = 30 * 24 * 60 * 60 * 1000;

  const startTime = now - periodMs;
  const endTime = now;

  const dateLocale = language === 'ru' ? 'ru-RU' : 'en-US';

  const formatXAxisTick = (ts: number, period: TimePeriod) => {
    if (!ts) return '';
    const d = new Date(ts);
    if (period === '7d' || period === '30d') {
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      return `${day}.${month}`;
    }
    return d.toLocaleTimeString(dateLocale, { hour: '2-digit', minute: '2-digit' });
  };

  const formatTooltipLabel = (ts: number) => {
    if (!ts) return '';
    const d = new Date(ts);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const time = d.toLocaleTimeString(dateLocale, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `${day}.${month} ${time}`;
  };

  const gradientStops = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (data.length === 1) {
      const isUp = data[0].status === 'up' || !data[0].status;
      const color = isUp ? 'var(--color-up)' : 'var(--color-down)';
      return [{ offset: 0, color }, { offset: 100, color }];
    }

    const tMin = data[0].timestamp;
    const tMax = data[data.length - 1].timestamp;
    const range = tMax - tMin;

    return data.map((d, index) => {
      const pct = range > 0 
        ? ((d.timestamp - tMin) / range) * 100 
        : (index / (data.length - 1)) * 100;
      const isUp = d.status === 'up' || !d.status;
      const color = isUp ? 'var(--color-up)' : 'var(--color-down)';
      return {
        offset: Math.min(100, Math.max(0, pct)),
        color,
      };
    });
  }, [data]);

  const RenderDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx === undefined || cy === undefined || !payload) return null;
    const isSuccess = payload.status === 'up' || !payload.status;
    const color = isSuccess ? 'var(--color-up)' : 'var(--color-down)';
    return (
      <circle
        cx={cx}
        cy={cy}
        r={data.length > 50 ? 3 : 4}
        fill={color}
        stroke="var(--bg-secondary)"
        strokeWidth={1.5}
      />
    );
  };

  return (
    <div className="chart-container glass">
      <div className="chart-header">
        <h3>{t('responseTimeTitle')}</h3>
        {onPeriodChange && (
          <div className="chart-interval-pills">
            {PERIOD_CONFIG.map((item) => (
              <button
                key={item.value}
                type="button"
                className={`chart-pill ${period === item.value ? 'active' : ''}`}
                onClick={() => onPeriodChange(item.value)}
                disabled={loading}
              >
                {t(item.labelKey)}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={`chart-wrapper ${loading ? 'chart-loading' : ''}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="responseTimeStrokeGradient" x1="0" y1="0" x2="100%" y2="0" gradientUnits="userSpaceOnUse">
                {gradientStops.map((stop, i) => (
                  <stop key={i} offset={`${stop.offset}%`} stopColor={stop.color} stopOpacity={1} />
                ))}
              </linearGradient>
              <linearGradient id="responseTimeFillGradient" x1="0" y1="0" x2="100%" y2="0" gradientUnits="userSpaceOnUse">
                {gradientStops.map((stop, i) => (
                  <stop key={i} offset={`${stop.offset}%`} stopColor={stop.color} stopOpacity={0.25} />
                ))}
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
            <XAxis
              dataKey="timestamp"
              type="number"
              scale="time"
              domain={[startTime, endTime]}
              tickFormatter={(ts) => formatXAxisTick(ts, period)}
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              labelFormatter={formatTooltipLabel}
              formatter={(val: number, _name: any, item: any) => {
                const status = item?.payload?.status;
                const statusText = status ? ` (${status.toUpperCase()})` : '';
                return [`${val} ${t('ms')}${statusText}`, t('responseTimeTooltip')];
              }}
              contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="url(#responseTimeStrokeGradient)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#responseTimeFillGradient)"
              dot={<RenderDot />}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

