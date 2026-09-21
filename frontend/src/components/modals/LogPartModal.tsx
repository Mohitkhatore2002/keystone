import React, { useState, useEffect } from 'react';
import type { Part, WorkOrder } from '../../types/workOrder';
import { partApi } from '../../api/partApi';
import { workOrderApi } from '../../api/workOrderApi';
import { useNotifications } from '../../context/NotificationContext';
import { X } from 'lucide-react';

interface Props {
  workOrder: WorkOrder | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const LogPartModal: React.FC<Props> = ({ workOrder, onClose, onSuccess }) => {
  const { addNotification } = useNotifications();
  const [parts, setParts] = useState<Part[]>([]);
  const [selectedPartId, setSelectedPartId] = useState<number | ''>('');
  const [qtyUsed, setQtyUsed] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (workOrder) {
      partApi.getAll().then((res) => {
        setParts(res);
        if (res.length > 0) setSelectedPartId(res[0].id);
      }).catch(console.error);
    }
  }, [workOrder]);

  if (!workOrder) return null;

  const selectedPart = parts.find((p) => p.id === Number(selectedPartId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartId || qtyUsed <= 0) return;

    setSubmitting(true);
    setError('');

    try {
      await workOrderApi.logPartUsage(workOrder.id, Number(selectedPartId), qtyUsed);

      addNotification({
        title: 'Inventory Part Deducted',
        message: `Logged ${qtyUsed}x ${selectedPart?.name || 'Part'} on ${workOrder.code}. Stock updated.`,
        tag: 'Inventory',
        type: 'warning',
        link: '/inventory',
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to log part usage.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Log Parts Used on {workOrder.code}</h2>
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
            <label className="form-label">Select Inventory Part</label>
            <select
              className="form-select"
              value={selectedPartId}
              onChange={(e) => setSelectedPartId(Number(e.target.value))}
              required
            >
              {parts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) - ${p.unitCost.toFixed(2)} [Stock: {p.stockQty}]
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Quantity Consumed</label>
            <input
              type="number"
              className="form-input"
              min={1}
              max={selectedPart ? selectedPart.stockQty : 99}
              value={qtyUsed}
              onChange={(e) => setQtyUsed(Number(e.target.value))}
              required
            />
          </div>

          {selectedPart && (
            <div style={{ background: '#F8F9FC', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
              <div>Unit Cost: <strong>${selectedPart.unitCost.toFixed(2)}</strong></div>
              <div>Available Stock: <strong>{selectedPart.stockQty}</strong></div>
              <div style={{ marginTop: '4px', fontWeight: 600, color: '#1DA267' }}>
                Total Cost: ${(selectedPart.unitCost * qtyUsed).toFixed(2)}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Logging...' : 'Deduct from Stock & Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
