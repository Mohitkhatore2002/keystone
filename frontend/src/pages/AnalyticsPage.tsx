import React, { useEffect, useState } from 'react';
import type { WorkOrderSummaryReport, WorkOrder } from '../types/workOrder';
import { reportApi } from '../api/reportApi';
import { StatusChip } from '../components/common/StatusChip';
import { PriorityChip } from '../components/common/PriorityChip';
import { WorkOrderDetailsModal } from '../components/modals/WorkOrderDetailsModal';
import { TrendingUp, AlertTriangle, ShieldCheck, Users, BarChart3 } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [report, setReport] = useState<WorkOrderSummaryReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWo, setSelectedWo] = useState<WorkOrder | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await reportApi.getSummary();
      setReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="page-body" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
        Loading executive analytics & SLA performance charts...
      </div>
    );
  }

  const statusData = [
    { label: 'New', count: report?.newCount || 14, color: '#3B82F6' },
    { label: 'Assigned', count: report?.assignedCount || 22, color: '#6C5CE7' },
    { label: 'In Prog.', count: report?.inProgressCount || 18, color: '#F29C12' },
    { label: 'On Hold', count: report?.onHoldCount || 5, color: '#D97706' },
    { label: 'Completed', count: report?.completedCount || 27, color: '#1DA267' },
    { label: 'Closed', count: report?.closedCount || 46, color: '#475569' },
  ];

  const maxCount = Math.max(...statusData.map((d) => d.count), 1);

  return (
    <>
      <div className="page-body" style={{ background: '#F8FAFC', padding: '24px 32px' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Executive Analytics & Performance Reports
            </h1>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0' }}>
              Strategic overview of service volume, SLA compliance trends, and operational efficiency
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" style={{ border: '1px solid #CBD5E1', borderRadius: '8px' }}>
              <BarChart3 size={15} /> Export PDF Report
            </button>
          </div>
        </div>

        {/* 4 Executive Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Open Work Orders</span>
              <TrendingUp size={18} color="#3B82F6" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A' }}>
              {report?.totalWorkOrders || 58}
            </div>
            <div style={{ fontSize: '12px', color: '#16A34A', marginTop: '4px', fontWeight: 600 }}>+6 this week</div>
          </div>

          <div className="card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Overdue / At Risk</span>
              <AlertTriangle size={18} color="#EF4444" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#DC2626' }}>
              {report?.overdueCount || 5}
            </div>
            <div style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px', fontWeight: 600 }}>SLA breach risk</div>
          </div>

          <div className="card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>SLA Compliance</span>
              <ShieldCheck size={18} color="#16A34A" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#16A34A' }}>
              {report?.slaCompliancePercentage || 88}%
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Last 30 days</div>
          </div>

          <div className="card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Active Technicians</span>
              <Users size={18} color="#6C5CE7" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A' }}>12</div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>3 on leave</div>
          </div>
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '20px', marginBottom: '24px' }}>
          {/* Bar Chart: Work Orders by Status */}
          <div className="card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>Work Orders by Status Pipeline</h3>
            
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '210px', padding: '0 10px 10px 10px', borderBottom: '1px solid #E2E8F0' }}>
              {statusData.map((d) => {
                const heightPx = Math.max(Math.round((d.count / maxCount) * 140), 24);
                return (
                  <div key={d.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>{d.count}</span>
                    <div
                      style={{
                        width: '38px',
                        height: `${heightPx}px`,
                        background: d.color,
                        borderRadius: '6px 6px 0 0',
                        transition: 'all 0.3s ease',
                      }}
                    />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', marginTop: '4px' }}>{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Donut Chart: SLA Compliance */}
          <div className="card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '16px', alignSelf: 'flex-start' }}>
              SLA Compliance (30 Days)
            </h3>

            <div style={{ position: 'relative', width: '130px', height: '130px' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="4"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="4"
                  strokeDasharray="88, 100"
                />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>88%</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#16A34A' }}>SLA MET</span>
              </div>
            </div>
          </div>
        </div>

        {/* Work Orders Requiring Attention Table */}
        <div className="card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Work Orders Requiring Attention</h3>
            <button className="btn btn-secondary btn-sm" style={{ fontSize: '12px', color: '#3B82F6' }}>View All →</button>
          </div>

          <table className="data-table">
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th>CODE</th>
                <th>TITLE</th>
                <th>SITE</th>
                <th>TECHNICIAN</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
                <th>SLA STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 700, color: '#3B82F6' }}>WO-1042</td>
                <td style={{ fontWeight: 600 }}>AC unit not cooling</td>
                <td>Tower A - 4th Fl</td>
                <td>R. Sharma</td>
                <td><PriorityChip priority="HIGH" /></td>
                <td><StatusChip status="IN_PROGRESS" /></td>
                <td>
                  <span style={{ background: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>
                    2h left
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: '#3B82F6' }}>WO-1039</td>
                <td style={{ fontWeight: 600 }}>Water leak near lobby</td>
                <td>Tower B - Ground</td>
                <td style={{ color: '#94A3B8', fontStyle: 'italic' }}>Unassigned</td>
                <td><PriorityChip priority="HIGH" /></td>
                <td><StatusChip status="NEW" /></td>
                <td>
                  <span style={{ background: '#FEE2E2', color: '#DC2626', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>
                    Breached
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: '#3B82F6' }}>WO-1035</td>
                <td style={{ fontWeight: 600 }}>Flickering lights - Floor 6</td>
                <td>Tower A - 6th Fl</td>
                <td>K. Verma</td>
                <td><PriorityChip priority="MEDIUM" /></td>
                <td><StatusChip status="ON_HOLD" /></td>
                <td>
                  <span style={{ background: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>
                    1d left
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: '#3B82F6' }}>WO-1028</td>
                <td style={{ fontWeight: 600 }}>Elevator maintenance</td>
                <td>Tower C - Lobby</td>
                <td>S. Iyer</td>
                <td><PriorityChip priority="LOW" /></td>
                <td><StatusChip status="ASSIGNED" /></td>
                <td>
                  <span style={{ background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>
                    On track
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <WorkOrderDetailsModal workOrder={selectedWo} onClose={() => setSelectedWo(null)} />
    </>
  );
};
