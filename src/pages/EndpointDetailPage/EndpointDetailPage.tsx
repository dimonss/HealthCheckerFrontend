import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCheckHistory, getCheckStats, Check, CheckStats } from '../../api/checks';
import { getEndpoints, checkEndpoint, Endpoint } from '../../api/endpoints';
import { ResponseTimeChart } from '../../components/charts/ResponseTimeChart';
import { UptimeChart } from '../../components/charts/UptimeChart';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { ArrowLeft, Play, Clock, Zap, TrendingUp } from 'lucide-react';
import './EndpointDetailPage.css';

export const EndpointDetailPage = () => {
  const { id } = useParams();
  const [endpoint, setEndpoint] = useState<Endpoint | null>(null);
  const [history, setHistory] = useState<Check[]>([]);
  const [stats, setStats] = useState<CheckStats>({ uptime: 100, avgResponseTime: 0, minResponseTime: 0, maxResponseTime: 0, totalChecks: 0 });
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      const eps = await getEndpoints();
      const ep = eps.find(e => e.id === id);
      if (ep) setEndpoint(ep);
      
      const [hist, st] = await Promise.all([
        getCheckHistory(id),
        getCheckStats(id).catch(() => ({ uptime: 100, avgResponseTime: 0, minResponseTime: 0, maxResponseTime: 0, totalChecks: 0 }))
      ]);
      setHistory(hist);
      setStats(st);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleManualCheck = async () => {
    if (!id) return;
    setChecking(true);
    try {
      await checkEndpoint(id);
      await fetchDetail();
    } finally {
      setChecking(false);
    }
  };

  if (loading) return <Loader />;
  if (!endpoint) return <div className="not-found">Эндпоинт не найден</div>;

  const chartData = [...history].reverse().map(h => ({
    time: new Date(h.checkedAt).toLocaleTimeString('ru', { hour: '2-digit', minute:'2-digit' }),
    value: h.responseTimeMs || 0
  }));

  return (
    <div className="endpoint-detail animate-fade-in">
      <div className="ed-header">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={20} /> Назад
        </Link>
        <div className="ed-title-row">
          <h1>{endpoint.name}</h1>
          <Badge variant={endpoint.lastStatus === 'up' ? 'up' : endpoint.lastStatus === 'down' ? 'down' : 'neutral'}>
            {endpoint.lastStatus || 'unknown'}
          </Badge>
          <Button variant="secondary" size="sm" onClick={handleManualCheck} isLoading={checking}>
            <Play size={14} /> Проверить
          </Button>
        </div>
        <a href={endpoint.url} target="_blank" rel="noreferrer" className="ed-url">{endpoint.url}</a>
      </div>

      <div className="stats-mini-grid">
        <Card className="mini-stat">
          <Clock size={18} />
          <div>
            <span className="mini-label">Среднее время</span>
            <span className="mini-value">{stats.avgResponseTime} мс</span>
          </div>
        </Card>
        <Card className="mini-stat">
          <Zap size={18} />
          <div>
            <span className="mini-label">Мин / Макс</span>
            <span className="mini-value">{stats.minResponseTime} / {stats.maxResponseTime} мс</span>
          </div>
        </Card>
        <Card className="mini-stat">
          <TrendingUp size={18} />
          <div>
            <span className="mini-label">Всего проверок</span>
            <span className="mini-value">{stats.totalChecks}</span>
          </div>
        </Card>
      </div>

      <div className="charts-grid">
        <div className="chart-main">
          <ResponseTimeChart data={chartData} />
        </div>
        <div className="chart-side">
          <UptimeChart percentage={stats.uptime} />
        </div>
      </div>

      <div className="history-section glass">
        <h3>История проверок</h3>
        {history.length === 0 ? (
          <p className="no-data">Нет данных. Нажмите "Проверить" для первой проверки.</p>
        ) : (
          <div className="table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Статус</th>
                  <th>Время ответа</th>
                  <th>Код ответа</th>
                  <th>Дата и время</th>
                  <th>Ошибка</th>
                </tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.id}>
                    <td>
                      <Badge variant={h.status === 'up' ? 'up' : 'down'}>{h.status}</Badge>
                    </td>
                    <td>{h.responseTimeMs ?? '-'} мс</td>
                    <td>{h.statusCode || '-'}</td>
                    <td>{new Date(h.checkedAt).toLocaleString('ru')}</td>
                    <td className="error-cell">{h.errorMessage || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
