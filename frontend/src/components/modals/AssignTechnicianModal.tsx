import React, { useState, useEffect } from 'react';
import type { User, WorkOrder } from '../../types/workOrder';
import { authApi } from '../../api/authApi';
import { workOrderApi } from '../../api/workOrderApi';
import { useNotifications } from '../../context/NotificationContext';
import { X } from 'lucide-react';

interface Props {
  workOrder: WorkOrder | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssignTechnicianModal: React.FC<Props> = ({ workOrder, onClose, onSuccess }) => {
  const { addNotification } = useNotifications();
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [selectedTechId, setSelectedTechId] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (workOrder) {
      authApi.getTechnicians().then((res) => {
        setTechnicians(res);
        if (res.length > 0) setSelectedTechId(res[0].id);
      }).catch(console.error);
    }
  }, [workOrder]);

  if (!workOrder) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTechId) return;

    setSubmitting(true);
    setError('');

    try {
      await workOrderApi.assign(workOrder.id, Number(selectedTechId));

      const assignedTech = technicians.find((t) => t.id === Number(selectedTechId));
      addNotification({
        title: 'Work Order Assigned',
        message: `Work Order ${workOrder.code} assigned to ${assignedTech?.name || 'Technician'}.`,
        tag: 'Work Order',
        type: 'success',
        link: '/work-orders',
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to assign technician.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Dispatch Technician to {workOrder.code}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#72788A" />
          </button>
        </div>

        {error && (
          <div style={{ background: '#FDF2F2', border: '1px solid #E84D49', color: '#E84D49', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <p style={{ marginBottom: '16px', fontSize: '14px' }}>
          Assigning a technician transitions the job from <strong>NEW</strong> to <strong>ASSIGNED</strong>.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Technician</label>
            <select
              className="form-select"
              value={selectedTechId}
              onChange={(e) => setSelectedTechId(Number(e.target.value))}
              required
            >
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
