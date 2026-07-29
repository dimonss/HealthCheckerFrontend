import { useEffect, useState, useCallback, useRef } from 'react';
import { getEndpoints, createEndpoint, deleteEndpoint, checkEndpoint, type Endpoint, type CreateEndpointData } from '../../api/endpoints';
import { getChecksSummary, type ChecksSummary } from '../../api/checks';
import { EndpointList } from '../../components/endpoints/EndpointList';
import { EndpointForm } from '../../components/endpoints/EndpointForm';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { UndoToastStack } from '../../components/ui/UndoToast';
import { Plus, Server, Activity, AlertTriangle } from 'lucide-react';
import './DashboardPage.css';

interface PendingDeletion {
  endpoint: Endpoint;
  timerId: ReturnType<typeof setTimeout>;
}

export const DashboardPage = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summary, setSummary] = useState<ChecksSummary>({ total: 0, up: 0, down: 0, unknown: 0 });
  const [pendingDeletions, setPendingDeletions] = useState<PendingDeletion[]>([]);

  const pendingRef = useRef<PendingDeletion[]>([]);
  pendingRef.current = pendingDeletions;

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

  // Flush all pending deletions on unmount
  useEffect(() => {
    return () => {
      pendingRef.current.forEach(p => {
        clearTimeout(p.timerId);
        deleteEndpoint(p.endpoint.id).catch(console.error);
      });
    };
  }, []);

  const handleAdd = async (data: CreateEndpointData) => {
    await createEndpoint(data);
    setIsModalOpen(false);
    fetchData();
  };

  const commitSingleDeletion = async (pendingItem: PendingDeletion) => {
    try {
      await deleteEndpoint(pendingItem.endpoint.id);
      getChecksSummary().then(sum => sum && setSummary(sum)).catch(() => {});
    } catch (err) {
      console.error('Ошибка при удалении эндпоинта', err);
      // Restore on failure
      setEndpoints(prev => [...prev, pendingItem.endpoint]);
    } finally {
      setPendingDeletions(prev => prev.filter(p => p.endpoint.id !== pendingItem.endpoint.id));
    }
  };

  const handleDelete = (id: string) => {
    const target = endpoints.find(e => e.id === id);
    if (!target) return;

    // Remove target from visible endpoints
    setEndpoints(prev => prev.filter(e => e.id !== id));

    // Update summary counters optimistically
    setSummary(prev => ({
      ...prev,
      total: Math.max(0, prev.total - 1),
      up: target.lastStatus === 'up' ? Math.max(0, prev.up - 1) : prev.up,
      down: (target.lastStatus === 'down' || target.lastStatus === 'error') ? Math.max(0, prev.down - 1) : prev.down,
      unknown: (!target.lastStatus || target.lastStatus === 'unknown') ? Math.max(0, prev.unknown - 1) : prev.unknown,
    }));

    const timerId = setTimeout(() => {
      commitSingleDeletion({ endpoint: target, timerId });
    }, 5000);

    setPendingDeletions(prev => [...prev, { endpoint: target, timerId }]);
  };

  const handleUndo = (id: string) => {
    const item = pendingDeletions.find(p => p.endpoint.id === id);
    if (!item) return;

    clearTimeout(item.timerId);
    setPendingDeletions(prev => prev.filter(p => p.endpoint.id !== id));

    const restored = item.endpoint;
    setEndpoints(prev => [...prev, restored]);

    setSummary(prev => ({
      ...prev,
      total: prev.total + 1,
      up: restored.lastStatus === 'up' ? prev.up + 1 : prev.up,
      down: (restored.lastStatus === 'down' || restored.lastStatus === 'error') ? prev.down + 1 : prev.down,
      unknown: (!restored.lastStatus || restored.lastStatus === 'unknown') ? prev.unknown + 1 : prev.unknown,
    }));
  };

  const handleConfirmDelete = (id: string) => {
    const item = pendingDeletions.find(p => p.endpoint.id === id);
    if (!item) return;

    clearTimeout(item.timerId);
    commitSingleDeletion(item);
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

      <UndoToastStack
        items={pendingDeletions.map(p => ({
          id: p.endpoint.id,
          message: `Эндпоинт "${p.endpoint.name}" удален`,
          durationMs: 5000,
          onUndo: () => handleUndo(p.endpoint.id),
          onClose: () => handleConfirmDelete(p.endpoint.id),
        }))}
      />
    </div>
  );
};
