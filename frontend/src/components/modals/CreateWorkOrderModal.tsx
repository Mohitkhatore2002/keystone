import React, { useState, useEffect } from 'react';
import type { Customer, Site, User, WorkOrderPriority } from '../../types/workOrder';
import { customerApi } from '../../api/customerApi';
import { authApi } from '../../api/authApi';
import { workOrderApi } from '../../api/workOrderApi';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateWorkOrderModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<WorkOrderPriority>('MEDIUM');
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | ''>('');
  const [selectedSiteId, setSelectedSiteId] = useState<number | ''>('');
  const [assignedToId, setAssignedToId] = useState<number | ''>('');
  const [slaHours, setSlaHours] = useState<number>(24);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      customerApi.getAll().then((res) => {
        setCustomers(res);
        if (res.length > 0) {
          setSelectedCustomerId(res[0].id);
        }
      }).catch(console.error);

      if (user?.role === 'DISPATCHER' || user?.role === 'MANAGER') {
        authApi.getTechnicians().then(setTechnicians).catch(console.error);
      }
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (selectedCustomerId) {
      customerApi.getSites(Number(selectedCustomerId)).then((res) => {
        setSites(res);
        if (res.length > 0) {
          setSelectedSiteId(res[0].id);
        } else {
          setSelectedSiteId('');
        }
      }).catch(console.error);
    }
  }, [selectedCustomerId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedCustomerId || !selectedSiteId) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const slaDate = new Date(Date.now() + slaHours * 3600 * 1000).toISOString();

      await workOrderApi.create({
        title,
        description,
        priority,
        slaDueAt: slaDate,
        customerId: Number(selectedCustomerId),
        siteId: Number(selectedSiteId),
        assignedToId: assignedToId ? Number(assignedToId) : undefined,
      });

      addNotification({
        title: 'Work Order Created',
        message: `Work Order "${title}" raised successfully.`,
        tag: 'Work Order',
        type: 'info',
        link: '/work-orders',
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create work order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Raise New Work Order</h2>
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
            <label className="form-label">Job Title *</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. HVAC Chiller Maintenance in Main Tower"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Customer Organisation *</label>
              <select
                className="form-select"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
                required
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Site Location *</label>
              <select
                className="form-select"
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(Number(e.target.value))}
                required
              >
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.address})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Priority Level *</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as WorkOrderPriority)}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">SLA Resolution Target</label>
              <select
                className="form-select"
                value={slaHours}
                onChange={(e) => setSlaHours(Number(e.target.value))}
              >
                <option value={2}>2 Hours (Critical Emergency)</option>
                <option value={4}>4 Hours (High Priority)</option>
                <option value={24}>24 Hours (Standard Maintenance)</option>
                <option value={48}>48 Hours (Low Priority)</option>
              </select>
            </div>
          </div>

          {(user?.role === 'DISPATCHER' || user?.role === 'MANAGER') && (
            <div className="form-group">
              <label className="form-label">Assign Technician (Optional)</label>
              <select
                className="form-select"
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">Unassigned (Status: NEW)</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Problem Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide specific details about equipment symptoms, access codes, or floor numbers..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Submit Work Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
