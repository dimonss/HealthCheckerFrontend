import { useEffect, useState, useCallback } from 'react';
import { getEndpoints, createEndpoint, deleteEndpoint, checkEndpoint, type Endpoint, type CreateEndpointData } from '../../api/endpoints';
import { getChecksSummary, type ChecksSummary } from '../../api/checks';
import { EndpointList } from '../../components/endpoints/EndpointList';
import { EndpointForm } from '../../components/endpoints/EndpointForm';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { Plus, Server, Activity, AlertTriangle } from 'lucide-react';
import './DashboardPage.css';

export const DashboardPage = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summary, setSummary] = useState<ChecksSummary>({ total: 0, up: 0, down: 0, unknown: 0 });

  const fetchData = useCallback(async () => {
    try {
      const [eps, sum] = await Promise.all([
        getEndpoints(),
        getChecksSummary().catch(() => null)
      ]);
      setEndpoints(eps);
      if (sum) {
        setSummary(sum);
      } else {
        setSummary({
          total: eps.length,
          up: eps.filter(e => e.lastStatus === 'up').length,
          down: eps.filter(e => e.lastStatus === 'down' || e.lastStatus === 'error').length,
          unknown: eps.filter(e => !e.lastStatus || e.lastStatus === 'unknown').length
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = async (data: CreateEndpointData) => {
    await createEndpoint(data);
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if(confirm('Удалить эндпоинт?')) {
      await deleteEndpoint(id);
      fetchData();
    }
  };

  const handleCheck = async (id: string) => {
    await checkEndpoint(id);
    fetchData();
  };

  if (loading) return <Loader />;

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon bg-neutral"><Server size={24}/></div>
          <div className="stat-info">
            <span className="stat-label">Всего эндпоинтов</span>
            <span className="stat-value">{summary.total}</span>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon bg-up"><Activity size={24}/></div>
          <div className="stat-info">
            <span className="stat-label">В сети</span>
            <span className="stat-value text-up">{summary.up}</span>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon bg-down"><AlertTriangle size={24}/></div>
          <div className="stat-info">
            <span className="stat-label">С ошибкой</span>
            <span className="stat-value text-down">{summary.down}</span>
          </div>
        </Card>
      </div>

      <div className="section-header">
        <h2>Ваши эндпоинты</h2>
        {endpoints.length < 10 && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Добавить
          </Button>
        )}
        {endpoints.length >= 10 && (
          <span className="limit-warning">Лимит 10 эндпоинтов достигнут</span>
        )}
      </div>

      <EndpointList endpoints={endpoints} onCheck={handleCheck} onDelete={handleDelete} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Новый эндпоинт">
        <EndpointForm onSubmit={handleAdd} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};
