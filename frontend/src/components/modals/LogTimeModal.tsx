import React, { useState } from 'react';
import type { WorkOrder } from '../../types/workOrder';
import { workOrderApi } from '../../api/workOrderApi';
import { X } from 'lucide-react';

interface Props {
  workOrder: WorkOrder | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const LogTimeModal: React.FC<Props> = ({ workOrder, onClose, onSuccess }) => {
  const [minutes, setMinutes] = useState<number>(60);
  const [note, setNote] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!workOrder) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (minutes <= 0) return;

    setSubmitting(true);
    setError('');

    try {
      await workOrderApi.logTime(workOrder.id, minutes, note);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to log labor time.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Log Labor Time for {workOrder.code}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#72788A" />
          </button>
        </div>

        {error && (
          <div style={{ background: '#FDF2F2', border: '1px solid #E84D49', color: '#E84D49', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Duration (Minutes)</label>
            <input
              type="number"
              className="form-input"
              min={15}
              step={15}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              required
            />
            <span style={{ fontSize: '12px', color: '#72788A' }}>
              Equivalent to: <strong>{(minutes / 60).toFixed(2)} hours</strong>
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Work Log Note</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Conducted thermal imaging test, replaced circuit breaker..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Logging...' : 'Save Time Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
