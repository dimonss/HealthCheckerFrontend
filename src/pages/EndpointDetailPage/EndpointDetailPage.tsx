import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCheckHistory, getCheckStats, getCheckChartData, type Check, type CheckStats, type ChartDataPoint } from '../../api/checks';
import { getEndpoints, checkEndpoint, type Endpoint } from '../../api/endpoints';
import { useLanguage } from '../../context/LanguageContext';
import { ResponseTimeChart, type TimePeriod } from '../../components/charts/ResponseTimeChart';
import { UptimeChart } from '../../components/charts/UptimeChart';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { Pagination } from '../../components/ui/Pagination';
import { ArrowLeft, Play, Clock, Zap, TrendingUp } from 'lucide-react';
import './EndpointDetailPage.css';

export const EndpointDetailPage = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const [endpoint, setEndpoint] = useState<Endpoint | null>(null);
  const [history, setHistory] = useState<Check[]>([]);
  const [chartHistory, setChartHistory] = useState<ChartDataPoint[]>([]);
  const [stats, setStats] = useState<CheckStats>({ uptime: 100, avgResponseTime: 0, minResponseTime: 0, maxResponseTime: 0, totalChecks: 0 });
  const [allTimeTotalChecks, setAllTimeTotalChecks] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [chartPeriod, setChartPeriod] = useState<TimePeriod>('24h');

  const fetchEndpointAndAllTimeStats = useCallback(async () => {
    if (!id) return;
    try {
      const eps = await getEndpoints();
      const ep = eps.find(e => e.id === id);
      if (ep) setEndpoint(ep);

      const allStats = await getCheckStats(id).catch(() => ({ uptime: 100, avgResponseTime: 0, minResponseTime: 0, maxResponseTime: 0, totalChecks: 0 }));
      setAllTimeTotalChecks(allStats.totalChecks);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchChartHistoryAndStats = useCallback(async () => {
    if (!id) return;
    setChartLoading(true);
    try {
      const [cHist, st] = await Promise.all([
        getCheckChartData(id, chartPeriod),
        getCheckStats(id, chartPeriod).catch(() => ({ uptime: 100, avgResponseTime: 0, minResponseTime: 0, maxResponseTime: 0, totalChecks: 0 }))
      ]);
      setChartHistory(cHist);
      setStats(st);
    } finally {
      setChartLoading(false);
    }
  }, [id, chartPeriod]);

  const fetchHistoryPage = useCallback(async () => {
    if (!id) return;
    setHistoryLoading(true);
    try {
      const offset = (page - 1) * pageSize;
      const hist = await getCheckHistory(id, pageSize, offset);
      setHistory(hist);
    } finally {
      setHistoryLoading(false);
    }
  }, [id, page, pageSize]);

  useEffect(() => {
    fetchEndpointAndAllTimeStats();
  }, [fetchEndpointAndAllTimeStats]);

  useEffect(() => {
    fetchChartHistoryAndStats();
  }, [fetchChartHistoryAndStats]);

  useEffect(() => {
    fetchHistoryPage();
  }, [fetchHistoryPage]);

  const handleManualCheck = async () => {
    if (!id) return;
    setChecking(true);
    try {
      await checkEndpoint(id);
      await fetchEndpointAndAllTimeStats();
      await fetchChartHistoryAndStats();
      await fetchHistoryPage();
    } finally {
      setChecking(false);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  if (loading) return <Loader />;
  if (!endpoint) return <div className="not-found">{t('endpointNotFound')}</div>;

  const totalPages = Math.max(1, Math.ceil(allTimeTotalChecks / pageSize));
  const dateLocale = language === 'ru' ? 'ru-RU' : 'en-US';

  const chartData = [...chartHistory].reverse().map(h => ({
    timestamp: new Date(h.checkedAt).getTime(),
    value: h.responseTimeMs || 0,
    status: h.status
  }));

  return (
    <div className="endpoint-detail animate-fade-in">
      <div className="ed-header">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={20} /> {t('back')}
        </Link>
        <div className="ed-title-row">
          <h1>{endpoint.name}</h1>
          <Badge variant={endpoint.lastStatus === 'up' ? 'up' : endpoint.lastStatus === 'down' ? 'down' : 'neutral'}>
            {endpoint.lastStatus || 'unknown'}
          </Badge>
          <Button variant="secondary" size="sm" onClick={handleManualCheck} isLoading={checking}>
            <Play size={14} /> {t('check')}
          </Button>
        </div>
        <a href={endpoint.url} target="_blank" rel="noreferrer" className="ed-url">{endpoint.url}</a>
      </div>

      <div className="stats-mini-grid">
        <Card className="mini-stat">
          <Clock size={18} />
          <div>
            <span className="mini-label">{t('avgResponseTime')}</span>
            <span className="mini-value">{stats.avgResponseTime} {t('ms')}</span>
          </div>
        </Card>
        <Card className="mini-stat">
          <Zap size={18} />
          <div>
            <span className="mini-label">{t('minMaxResponseTime')}</span>
            <span className="mini-value">{stats.minResponseTime} / {stats.maxResponseTime} {t('ms')}</span>
          </div>
        </Card>
        <Card className="mini-stat">
          <TrendingUp size={18} />
          <div>
            <span className="mini-label">{t('checksForPeriod')}</span>
            <span className="mini-value">{stats.totalChecks}</span>
          </div>
        </Card>
      </div>

      <div className="charts-grid">
        <div className="chart-main">
          <ResponseTimeChart
            data={chartData}
            period={chartPeriod}
            onPeriodChange={setChartPeriod}
            loading={chartLoading}
          />
        </div>
        <div className="chart-side">
          <UptimeChart percentage={stats.uptime} />
        </div>
      </div>

      <div className="history-section glass">
        <div className="history-header">
          <h3>{t('checkHistory')}</h3>
        </div>

        {historyLoading && history.length === 0 ? (
          <Loader />
        ) : history.length === 0 ? (
          <p className="no-data">{t('noHistoryData')}</p>
        ) : (
          <>
            <div className={`table-responsive ${historyLoading ? 'table-loading' : ''}`}>
              <table className="history-table">
                <thead>
                  <tr>
                    <th>{t('colStatus')}</th>
                    <th>{t('colResponseTime')}</th>
                    <th>{t('colResponseCode')}</th>
                    <th>{t('colDateTime')}</th>
                    <th>{t('colError')}</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(h => (
                    <tr key={h.id}>
                      <td>
                        <Badge variant={h.status === 'up' ? 'up' : 'down'}>{h.status}</Badge>
                      </td>
                      <td>{h.responseTimeMs ?? '-'} {t('ms')}</td>
                      <td>{h.statusCode || '-'}</td>
                      <td>{new Date(h.checkedAt).toLocaleString(dateLocale)}</td>
                      <td className="error-cell">{h.errorMessage || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={allTimeTotalChecks}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

