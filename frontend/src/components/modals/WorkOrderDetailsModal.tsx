import React, { useState } from 'react';
import type { WorkOrder } from '../../types/workOrder';
import { StatusChip } from '../common/StatusChip';
import { PriorityChip } from '../common/PriorityChip';
import {
  X,
  Clock,
  MapPin,
  Building,
  User,
  Wrench,
  ShieldAlert,
  ListTodo,
  FileText,
  History,
  Layers,
  Share2
} from 'lucide-react';

interface Props {
  workOrder: WorkOrder | null;
  onClose: () => void;
}

export const WorkOrderDetailsModal: React.FC<Props> = ({ workOrder, onClose }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'checklist' | 'inventory' | 'history'>('details');
  const [subtasksList, setSubtasksList] = useState([
    { id: 1, text: 'Safety Pre-check: Isolate electrical sub-panel & verify zero voltage', done: true },
    { id: 2, text: 'Diagnose primary AC compressor thermal sensor tripping threshold', done: true },
    { id: 3, text: 'Flush condensate line & measure motor amp draw under load', done: false },
    { id: 4, text: 'Obtain digital customer sign-off receipt on completion', done: false },
  ]);

  if (!workOrder) return null;

  const toggleSubtask = (id: number) => {
    setSubtasksList((prev) => prev.map((st) => (st.id === id ? { ...st, done: !st.done } : st)));
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ backdropFilter: 'blur(4px)', background: 'rgba(15, 23, 42, 0.55)' }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '780px',
          borderRadius: '16px',
          padding: '0',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(110, 86, 207, 0.25)',
          border: '1px solid #E2E8F0',
        }}
      >
        {/* ClickUp Task Header Bar */}
        <div style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '16px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#64748B' }}>
              <span style={{ color: '#6E56CF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Layers size={13} /> Work Orders Workspace
              </span>
              <span>/</span>
              <span style={{ fontWeight: 800, color: '#6E56CF' }}>{workOrder.code}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Work order link copied to clipboard!');
                }}
                style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Share2 size={13} /> Share Link
              </button>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{workOrder.title}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <StatusChip status={workOrder.status} />
            <PriorityChip priority={workOrder.priority} />
            {workOrder.isOverdue && (
              <span className="pill pill-cancelled" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldAlert size={12} /> SLA BREACH
              </span>
            )}
          </div>
        </div>

        {/* ClickUp Modal Navigation Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', background: '#FFFFFF', padding: '0 24px' }}>
          {[
            { id: 'details', label: 'Details', icon: FileText },
            { id: 'checklist', label: `Field Subtasks (${subtasksList.filter(s => s.done).length}/${subtasksList.length})`, icon: ListTodo },
            { id: 'inventory', label: 'Labor & Parts', icon: Wrench },
            { id: 'history', label: 'Audit History', icon: History },
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '12px 18px',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #6E56CF' : '3px solid transparent',
                  background: 'transparent',
                  color: isActive ? '#6E56CF' : '#64748B',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <IconComponent size={15} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Content Body */}
        <div style={{ padding: '24px', background: '#FFFFFF', maxHeight: '60vh', overflowY: 'auto' }}>
          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building size={14} color="#6E56CF" /> CUSTOMER & FACILITY SITE
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A' }}>{workOrder.customerName}</div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="#6E56CF" />
                    {workOrder.siteName} ({workOrder.siteAddress || 'Main Complex'})
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} color="#6E56CF" /> ASSIGNMENT & SLA TIMELINE
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A' }}>
                    Assigned: <span style={{ color: '#6E56CF' }}>{workOrder.assignedToName || 'Unassigned'}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: workOrder.isOverdue ? '#DC2626' : '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> SLA Target: {new Date(workOrder.slaDueAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Description & Field Scope</h4>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '10px', fontSize: '14px', lineHeight: 1.6, color: '#334155' }}>
                  {workOrder.description || 'Comprehensive dispatch diagnostic requested by facility manager. Verify system parameters, record operational logs, and ensure client sign-off.'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FIELD CHECKLIST / SUBTASKS */}
          {activeTab === 'checklist' && (
            <div>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ListTodo size={18} color="#6E56CF" /> Interactive Field Subtasks Checklist
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {subtasksList.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => toggleSubtask(st.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: st.done ? '#ECFDF5' : '#F8FAFC',
                      border: st.done ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={st.done}
                      onChange={() => {}}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#6E56CF' }}
                    />
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: st.done ? '#065F46' : '#1E293B',
                        textDecoration: st.done ? 'line-through' : 'none',
                      }}
                    >
                      {st.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LABOR & PARTS INVENTORY */}
          {activeTab === 'inventory' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wrench size={16} color="#059669" /> Consumed Parts Inventory
                </h4>
                {workOrder.partUsages && workOrder.partUsages.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Part</th>
                        <th>SKU</th>
                        <th>Unit Cost</th>
                        <th>Qty Used</th>
                        <th>Total Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workOrder.partUsages.map((part) => (
                        <tr key={part.id}>
                          <td style={{ fontWeight: 700 }}>{part.partName}</td>
                          <td>{part.partSku}</td>
                          <td>${part.unitCost.toFixed(2)}</td>
                          <td>{part.qtyUsed}</td>
                          <td style={{ fontWeight: 700, color: '#059669' }}>${part.totalCost.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', fontSize: '13px', color: '#64748B', textAlign: 'center' }}>
                    No parts logged yet for this work order.
                  </div>
                )}
              </div>

              <div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="#D97706" /> Technician Labor Hours Log
                </h4>
                {workOrder.timeLogs && workOrder.timeLogs.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Technician</th>
                        <th>Duration</th>
                        <th>Labor Note</th>
                        <th>Logged At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workOrder.timeLogs.map((log) => (
                        <tr key={log.id}>
                          <td style={{ fontWeight: 700 }}>{log.technicianName}</td>
                          <td>{log.minutes} mins ({(log.minutes / 60).toFixed(1)} hrs)</td>
                          <td>{log.note || '-'}</td>
                          <td>{new Date(log.loggedAt).toLocaleTimeString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', fontSize: '13px', color: '#64748B', textAlign: 'center' }}>
                    No labor hours logged yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT HISTORY */}
          {activeTab === 'history' && (
            <div>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={16} color="#6E56CF" /> ClickUp Activity Audit Trail
              </h4>

              <div style={{ borderLeft: '2px solid #6E56CF', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {workOrder.history && workOrder.history.length > 0 ? (
                  workOrder.history.map((item) => (
                    <div key={item.id}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                        {item.fromStatus ? `${item.fromStatus} → ${item.toStatus}` : `Initial Status: ${item.toStatus}`}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                        Updated by <strong>{item.changedBy}</strong> at {new Date(item.changedAt).toLocaleString()}
                      </div>
                      {item.note && <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic', marginTop: '4px' }}>"{item.note}"</div>}
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '13px', color: '#64748B' }}>No status audit logs recorded yet.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', padding: '14px 24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: '#6E56CF',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
