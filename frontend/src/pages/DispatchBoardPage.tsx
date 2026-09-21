import React, { useEffect, useState } from 'react';
import type { WorkOrder, WorkOrderStatus } from '../types/workOrder';
import { workOrderApi } from '../api/workOrderApi';
import { PriorityChip } from '../components/common/PriorityChip';
import { WorkOrderDetailsModal } from '../components/modals/WorkOrderDetailsModal';
import { CreateWorkOrderModal } from '../components/modals/CreateWorkOrderModal';
import { AssignTechnicianModal } from '../components/modals/AssignTechnicianModal';
import { Plus, UserPlus, Clock, RefreshCw } from 'lucide-react';

const KANBAN_COLUMNS: WorkOrderStatus[] = [
  'NEW',
  'ASSIGNED',
  'IN_PROGRESS',
  'ON_HOLD',
  'COMPLETED',
  'CLOSED',
  'CANCELLED',
];

export const DispatchBoardPage: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWo, setSelectedWo] = useState<WorkOrder | null>(null);
  const [assignWo, setAssignWo] = useState<WorkOrder | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchBoardData = async () => {
    setLoading(true);
    try {
      const data = await workOrderApi.getAllList();
      setWorkOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, []);

  const handleStatusTransition = async (woId: number, targetStatus: WorkOrderStatus) => {
    setErrorMsg('');
    try {
      await workOrderApi.transitionStatus(woId, targetStatus, `Board quick transition to ${targetStatus}`);
      fetchBoardData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Illegal status transition');
    }
  };

  const getWorkOrdersByStatus = (status: WorkOrderStatus) => {
    return workOrders.filter((wo) => wo.status === status);
  };

  return (
    <>
      <div className="page-body">
        {/* Top Control Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F0E2C' }}>Interactive Dispatch Board</h2>
            <p style={{ color: '#72788A', fontSize: '13px' }}>
              7-Column lifecycle state machine governing job progress from creation to sign-off
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={fetchBoardData}>
              <RefreshCw size={16} /> Refresh
            </button>
            <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
              <Plus size={18} /> Raise Work Order
            </button>
          </div>
        </div>

        {errorMsg && (
          <div style={{ background: '#FDF2F2', border: '1px solid #E84D49', color: '#E84D49', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
            {errorMsg}
          </div>
        )}

        {/* 7 Kanban Columns */}
        {loading ? (
          <div>Loading Kanban dispatch board...</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(280px, 1fr))',
              gap: '16px',
              overflowX: 'auto',
              paddingBottom: '20px',
            }}
          >
            {KANBAN_COLUMNS.map((colStatus) => {
              const colJobs = getWorkOrdersByStatus(colStatus);

              return (
                <div
                  key={colStatus}
                  style={{
                    background: '#F1F3F9',
                    borderRadius: '12px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '650px',
                  }}
                >
                  {/* Column Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                      paddingBottom: '8px',
                      borderBottom: '2px solid #E6E7F0',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#0F0E2C' }}>
                      {colStatus.replace('_', ' ')}
                    </div>
                    <span className="pill" style={{ background: '#FFFFFF', color: '#0F0E2C', fontSize: '11px' }}>
                      {colJobs.length}
                    </span>
                  </div>

                  {/* Cards in Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                    {colJobs.length === 0 ? (
                      <div style={{ padding: '20px 12px', textAlign: 'center', color: '#A0A5B5', fontSize: '12px', fontStyle: 'italic' }}>
                        No jobs in {colStatus.replace('_', ' ')}
                      </div>
                    ) : (
                      colJobs.map((wo) => (
                        <div
                          key={wo.id}
                          className="card"
                          style={{
                            padding: '14px',
                            cursor: 'pointer',
                            borderLeft: wo.isOverdue ? '4px solid #E84D49' : '1px solid #E6E7F0',
                          }}
                          onClick={() => setSelectedWo(wo)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontWeight: 700, fontSize: '12px', color: '#6C5CE7' }}>{wo.code}</span>
                            <PriorityChip priority={wo.priority} />
                          </div>

                          <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px', color: '#0F0E2C' }}>
                            {wo.title}
                          </div>

                          <div style={{ fontSize: '12px', color: '#72788A', marginBottom: '8px' }}>
                            <div>🏢 {wo.customerName}</div>
                            <div>📍 {wo.siteName}</div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #F0F1FA' }}>
                            <div style={{ fontSize: '12px', color: wo.isOverdue ? '#E84D49' : '#72788A' }}>
                              <Clock size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                              {new Date(wo.slaDueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>

                            {colStatus === 'NEW' && (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAssignWo(wo);
                                }}
                              >
                                <UserPlus size={12} /> Dispatch
                              </button>
                            )}

                            {colStatus === 'COMPLETED' && (
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ color: '#1DA267' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusTransition(wo.id, 'CLOSED');
                                }}
                              >
                                Close Sign-off
                              </button>
                            )}
                          </div>

                          {wo.assignedToName && colStatus !== 'NEW' && (
                            <div style={{ marginTop: '8px', fontSize: '11px', color: '#6C5CE7', fontWeight: 600 }}>
                              Tech: {wo.assignedToName}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <WorkOrderDetailsModal workOrder={selectedWo} onClose={() => setSelectedWo(null)} />
      <AssignTechnicianModal workOrder={assignWo} onClose={() => setAssignWo(null)} onSuccess={fetchBoardData} />
      <CreateWorkOrderModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={fetchBoardData} />
    </>
  );
};
