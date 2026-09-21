import React, { useState } from 'react';
import { WorkOrderDetailsModal } from '../components/modals/WorkOrderDetailsModal';
import { CreateWorkOrderModal } from '../components/modals/CreateWorkOrderModal';
import { PlatformSuiteHub } from '../components/dashboard/PlatformSuiteHub';
import {
  Users,
  AlertTriangle,
  Target,
  ShieldCheck,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Navigation,
  PauseCircle,
  Plus
} from 'lucide-react';

interface ActiveJobItem {
  id: number;
  code: string;
  priority: 'High' | 'Medium' | 'Low';
  customer: string;
  techName: string;
  techAvatar: string;
  status: 'In Progress' | 'On-Site' | 'En Route' | 'Paused';
  slaTimer: string;
  slaUrgent: boolean;
}

export const DashboardPage: React.FC = () => {
  const [selectedWo, setSelectedWo] = useState<any | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const mockWorkOrders: ActiveJobItem[] = [
    {
      id: 1,
      code: 'WO-4521',
      priority: 'High',
      customer: 'Acme Corp',
      techName: 'David Miller',
      techAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      status: 'In Progress',
      slaTimer: '00:14:22',
      slaUrgent: true,
    },
    {
      id: 2,
      code: 'WO-4522',
      priority: 'Medium',
      customer: 'Starlight Retail',
      techName: 'Samantha Ray',
      techAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      status: 'On-Site',
      slaTimer: '01:45:00',
      slaUrgent: false,
    },
    {
      id: 3,
      code: 'WO-4523',
      priority: 'High',
      customer: 'Evergreen Medical',
      techName: 'Marcus Cole',
      techAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      status: 'En Route',
      slaTimer: '00:28:10',
      slaUrgent: true,
    },
    {
      id: 4,
      code: 'WO-4524',
      priority: 'Low',
      customer: 'Beacon Real Estate',
      techName: 'Jenna Vance',
      techAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      status: 'En Route',
      slaTimer: '03:12:00',
      slaUrgent: false,
    },
    {
      id: 5,
      code: 'WO-4525',
      priority: 'High',
      customer: 'Apex Manufacturing',
      techName: 'Curt Miller',
      techAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      status: 'Paused',
      slaTimer: '00:08:44',
      slaUrgent: true,
    },
    {
      id: 6,
      code: 'WO-4526',
      priority: 'Medium',
      customer: 'Summit Logistics',
      techName: 'Carlos Ortiz',
      techAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      status: 'In Progress',
      slaTimer: '02:22:15',
      slaUrgent: false,
    },
    {
      id: 7,
      code: 'WO-4527',
      priority: 'Low',
      customer: 'Hale Residential',
      techName: 'Samantha Ray',
      techAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      status: 'On-Site',
      slaTimer: '04:55:00',
      slaUrgent: false,
    },
  ];

  return (
    <>
      <div className="page-body" style={{ background: '#F8FAFC', padding: '24px 32px' }}>
        {/* Header Title Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Dispatch & Field Operations
            </h1>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0' }}>
              Real-time resource tracking, SLA compliance metrics, and active work orders
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)} style={{ background: '#3B82F6', borderRadius: '8px' }}>
            <Plus size={16} /> Dispatch New Job
          </button>
        </div>

        {/* 4 Executive KPI Metric Cards Banner */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {/* Card 1: FIRST-TIME FIX RATE (FTFR) */}
          <div className="card" style={{ padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0', background: '#FFFFFF', boxShadow: '0 2px 6px rgba(15,23,42,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.5px' }}>
                FIRST-TIME FIX RATE (FTFR)
              </span>
              <Target size={18} color="#4F46E5" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A' }}>92.4%</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#10B981' }}>↑ +4.2%</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', padding: '3px 10px', borderRadius: '20px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#047857' }}>Exceeds Target (88.0%)</span>
            </div>
          </div>

          {/* Card 2: ASSET UTILIZATION % */}
          <div className="card" style={{ padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0', background: '#FFFFFF', boxShadow: '0 2px 6px rgba(15,23,42,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.5px' }}>
                ASSET & FLEET UTILIZATION
              </span>
              <Users size={18} color="#3B82F6" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A' }}>87.5%</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>45/50 Vans</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#EFF6FF', padding: '3px 10px', borderRadius: '20px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#1D4ED8' }}>Active Wrench Time</span>
            </div>
          </div>

          {/* Card 3: SLA COMPLIANCE TIMELINES */}
          <div className="card" style={{ padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0', background: '#FFFFFF', boxShadow: '0 2px 6px rgba(15,23,42,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.5px' }}>
                SLA COMPLIANCE TIMELINE
              </span>
              <ShieldCheck size={18} color="#10B981" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A' }}>98.2%</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Target 95%</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', padding: '3px 10px', borderRadius: '20px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#047857' }}>On-Time Resolution</span>
            </div>
          </div>

          {/* Card 4: URGENT UNASSIGNED QUEUE */}
          <div className="card" style={{ padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0', background: '#FFFFFF', boxShadow: '0 2px 6px rgba(15,23,42,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.5px' }}>
                UNASSIGNED QUEUE
              </span>
              <AlertTriangle size={18} color="#EF4444" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A' }}>7 Jobs</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEE2E2', padding: '3px 10px', borderRadius: '20px' }}>
              <AlertTriangle size={12} color="#DC2626" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#B91C1C' }}>Action Required</span>
            </div>
          </div>
        </div>

        {/* Main Content Split View (60% Left / 40% Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: '20px' }}>
          {/* LEFT COLUMN: Active Work Orders Data Table */}
          <div className="card" style={{ padding: '20px', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Active Work Orders</h3>
                <span style={{ background: '#F1F5F9', color: '#475569', fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px' }}>
                  145 Total
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary btn-sm" style={{ border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '12px' }}>
                  <Filter size={14} /> Filters
                </button>
                <button className="btn btn-primary btn-sm" style={{ background: '#0F172A', borderRadius: '6px', fontSize: '12px' }}>
                  View All
                </button>
              </div>
            </div>

            <table className="data-table" style={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}>
              <thead>
                <tr>
                  <th style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>JOB ID</th>
                  <th style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>PRIORITY</th>
                  <th style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>CUSTOMER</th>
                  <th style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>ASSIGNED TECH</th>
                  <th style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>STATUS</th>
                  <th style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>SLA TIMER</th>
                </tr>
              </thead>
              <tbody>
                {mockWorkOrders.map((item) => (
                  <tr key={item.id} style={{ background: '#FFFFFF', cursor: 'pointer' }} onClick={() => setSelectedWo(item)}>
                    <td style={{ fontWeight: 700, color: '#0F172A', fontSize: '13px' }}>{item.code}</td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 600,
                          background: item.priority === 'High' ? '#FEE2E2' : item.priority === 'Medium' ? '#FEF3C7' : '#F1F5F9',
                          color: item.priority === 'High' ? '#DC2626' : item.priority === 'Medium' ? '#D97706' : '#475569',
                        }}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>{item.customer}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img
                          src={item.techAvatar}
                          alt={item.techName}
                          style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '13px', color: '#1E293B', fontWeight: 500 }}>{item.techName}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 600,
                          background:
                            item.status === 'In Progress'
                              ? '#FEF3C7'
                              : item.status === 'On-Site'
                              ? '#F3E8FF'
                              : item.status === 'En Route'
                              ? '#E0F2FE'
                              : '#F1F5F9',
                          color:
                            item.status === 'In Progress'
                              ? '#D97706'
                              : item.status === 'On-Site'
                              ? '#9333EA'
                              : item.status === 'En Route'
                              ? '#0284C7'
                              : '#64748B',
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: item.slaUrgent ? '#DC2626' : '#334155', fontWeight: 600, fontSize: '12px' }}>
                        <Clock size={13} color={item.slaUrgent ? '#DC2626' : '#64748B'} />
                        <span>{item.slaTimer}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RIGHT COLUMN: Live Fleet Tracking Map & Recent Activity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Fleet Map Widget Card */}
            <div className="card" style={{ padding: '18px', borderRadius: '12px', border: '1px dashed #CBD5E1', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Live Fleet Tracking</h3>
                <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
                  🟢 ACTIVE MAP
                </span>
              </div>

              {/* Styled Dark Map graphic container */}
              <div
                style={{
                  height: '180px',
                  borderRadius: '10px',
                  background: '#0B0F19',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #1E293B',
                }}
              >
                {/* SVG Vector Map overlay */}
                <svg width="100%" height="100%" style={{ opacity: 0.25 }}>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#334155" strokeWidth="0.8" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <path d="M 10 90 Q 120 40 220 120 T 380 70" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 4" />
                </svg>

                {/* Map GPS Vehicle Pins */}
                <div style={{ position: 'absolute', top: '35%', left: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ background: '#22C55E', padding: '6px', borderRadius: '50%', boxShadow: '0 0 10px #22C55E' }}>
                    <Navigation size={12} color="#FFFFFF" />
                  </div>
                </div>

                <div style={{ position: 'absolute', top: '25%', left: '75%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ background: '#EF4444', padding: '6px', borderRadius: '50%', boxShadow: '0 0 10px #EF4444' }}>
                    <Navigation size={12} color="#FFFFFF" />
                  </div>
                </div>

                <div style={{ position: 'absolute', top: '60%', left: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ background: '#3B82F6', padding: '6px', borderRadius: '50%', boxShadow: '0 0 10px #3B82F6' }}>
                    <Navigation size={12} color="#FFFFFF" />
                  </div>
                </div>

                <div style={{ position: 'absolute', top: '70%', left: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ background: '#22C55E', padding: '6px', borderRadius: '50%', boxShadow: '0 0 10px #22C55E' }}>
                    <Navigation size={12} color="#FFFFFF" />
                  </div>
                </div>
              </div>

              {/* Map Legend */}
              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #F1F5F9', fontSize: '11px', fontWeight: 600, color: '#475569' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E' }} /> Available
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6' }} /> En-Route
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} /> Urgent
                </span>
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="card" style={{ padding: '18px', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>Recent Activity</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Event 1 */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ background: '#DCFCE7', padding: '6px', borderRadius: '50%', marginTop: '2px' }}>
                    <CheckCircle2 size={14} color="#16A34A" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: '#0F172A' }}>Job Completed</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>2m ago</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                      David Miller completed WO-4512 at Acme Corp HQ
                    </p>
                  </div>
                </div>

                {/* Event 2 */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ background: '#FEE2E2', padding: '6px', borderRadius: '50%', marginTop: '2px' }}>
                    <AlertCircle size={14} color="#DC2626" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: '#0F172A' }}>SLA Risk Escalation</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>8m ago</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                      WO-4523 has less than 30 mins left to meet SLA
                    </p>
                  </div>
                </div>

                {/* Event 3 */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ background: '#F3E8FF', padding: '6px', borderRadius: '50%', marginTop: '2px' }}>
                    <Navigation size={14} color="#9333EA" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: '#0F172A' }}>Samantha Ray On-Site</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>15m ago</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                      Checked in at Starlight Retail Group for WO-4522
                    </p>
                  </div>
                </div>

                {/* Event 4 */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ background: '#E0F2FE', padding: '6px', borderRadius: '50%', marginTop: '2px' }}>
                    <Navigation size={14} color="#0284C7" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: '#0F172A' }}>Marcus Cole En Route</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>22m ago</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                      Dispatched to Evergreen Medical for urgent WO-4523
                    </p>
                  </div>
                </div>

                {/* Event 5 */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ background: '#F1F5F9', padding: '6px', borderRadius: '50%', marginTop: '2px' }}>
                    <PauseCircle size={14} color="#64748B" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: '#0F172A' }}>Job Paused</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>31m ago</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                      WO-4525 paused by David Miller (Waiting for parts)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ClickUp-Identical Platform Suite & Capabilities Hub */}
        <PlatformSuiteHub />
      </div>

      <WorkOrderDetailsModal workOrder={selectedWo} onClose={() => setSelectedWo(null)} />
      <CreateWorkOrderModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={() => {}} />
    </>
  );
};

