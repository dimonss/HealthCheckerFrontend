import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { RotateCcw, X, Trash2 } from 'lucide-react';
import './UndoToast.css';

export interface ToastItemData {
  id: string;
  message: string;
  durationMs?: number;
  onUndo: () => void;
  onClose: () => void;
}

interface SingleToastProps {
  message: string;
  durationMs?: number;
  onUndo: () => void;
  onClose: () => void;
}

export const UndoToastItem = ({
  message,
  durationMs = 5000,
  onUndo,
  onClose,
}: SingleToastProps) => {
  const [timeLeft, setTimeLeft] = useState(Math.ceil(durationMs / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="undo-toast glass animate-toast-in">
      <div className="undo-toast-content">
        <div className="undo-toast-icon">
          <Trash2 size={18} />
        </div>

        <div className="undo-toast-info">
          <span className="undo-toast-text">{message}</span>
          <span className="undo-toast-timer">({timeLeft}с)</span>
        </div>

        <div className="undo-toast-actions">
          <button className="undo-toast-btn" onClick={onUndo}>
            <RotateCcw size={15} />
            <span>Отменить</span>
          </button>
          <button className="undo-toast-close" onClick={onClose} title="Закрыть">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="undo-toast-progress-track">
        <div
          className="undo-toast-progress-bar"
          style={{ animationDuration: `${durationMs}ms` }}
        />
      </div>
    </div>
  );
};

interface UndoToastStackProps {
  items: ToastItemData[];
}

export const UndoToastStack = ({ items }: UndoToastStackProps) => {
  if (items.length === 0) return null;

  return createPortal(
    <div className="undo-toast-stack-wrapper">
      {items.map((item) => (
        <UndoToastItem
          key={item.id}
          message={item.message}
          durationMs={item.durationMs}
          onUndo={item.onUndo}
          onClose={item.onClose}
        />
      ))}
    </div>,
    document.body
  );
};
