import React, { useEffect, useState } from 'react';
import type { WorkOrder, User } from '../types/workOrder';
import { workOrderApi } from '../api/workOrderApi';
import { authApi } from '../api/authApi';
import { WorkOrderDetailsModal } from '../components/modals/WorkOrderDetailsModal';
import { SmartDispatchMatcherModal } from '../components/modals/SmartDispatchMatcherModal';
import { ChevronLeft, ChevronRight, Plus, Sparkles } from 'lucide-react';

export const SchedulingPage: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWo, setSelectedWo] = useState<WorkOrder | null>(null);
  const [smartAssignWo, setSmartAssignWo] = useState<WorkOrder | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wos, techs] = await Promise.all([workOrderApi.getAllList(), authApi.getTechnicians()]);
      setWorkOrders(wos);
      setTechnicians(techs);
    } catch (e) {
      console.error('Failed to load scheduling data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
  ];

  const getTechJobs = (techId: number) => {
    return workOrders.filter((w) => w.assignedToId === techId);
  };

  const unassignedJobs = workOrders.filter((w) => !w.assignedToId || w.status === 'NEW');

  return (
    <>
      <div className="page-body" style={{ background: '#F8FAFC', padding: '24px 32px' }}>
        {/* Page Title & Date Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Dispatch Scheduling Command Center
              <span style={{ background: '#EEF2FF', color: '#4F46E5', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
                AI Matcher Active
              </span>
            </h1>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0' }}>
              Automated AI technician matching based on proximity, skill certifications, and van inventory
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '4px' }}>
              <button type="button" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', border: 'none' }}>
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontSize: '13px', fontWeight: 600, padding: '0 12px', color: '#0F172A' }}>
                Saturday, Sep 5, 2026
              </span>
              <button type="button" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', border: 'none' }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Unassigned Emergency Queue Banner */}
        {unassignedJobs.length > 0 && (
          <div className="card" style={{ padding: '14px 20px', borderRadius: '12px', marginBottom: '20px', background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: '#4F46E5', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} /> UNASSIGNED QUEUE ({unassignedJobs.length})
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E1B4B' }}>
                  {unassignedJobs[0].code}: {unassignedJobs[0].title} ({unassignedJobs[0].customerName})
                </span>
              </div>
              <button
                className="btn btn-primary btn-sm"
                style={{ background: '#4F46E5' }}
                onClick={() => setSmartAssignWo(unassignedJobs[0])}
              >
                <Sparkles size={14} /> AI Smart Assign
              </button>
            </div>
          </div>
        )}

        {/* Gantt Timeline Container */}
        <div className="card" style={{ padding: '0', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading technician schedule timeline...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ width: '220px', padding: '12px 16px', textTransform: 'uppercase', fontSize: '11px', color: '#64748B', fontWeight: 700, textAlign: 'left' }}>
                      TECHNICIAN
                    </th>
                    {timeSlots.map((slot) => (
                      <th
                        key={slot}
                        style={{
                          padding: '12px 8px',
                          textTransform: 'uppercase',
                          fontSize: '11px',
                          color: '#64748B',
                          fontWeight: 700,
                          textAlign: 'center',
                          borderLeft: '1px solid #E2E8F0',
                          minWidth: '90px',
                        }}
                      >
                        {slot}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {technicians.map((tech) => {
                    const jobs = getTechJobs(tech.id);
                    return (
                      <tr key={tech.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        {/* Technician Profile Column */}
                        <td style={{ padding: '16px', background: '#FFFFFF' }}>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>{tech.name}</div>
                          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                            {tech.email}
                          </div>
                          <div style={{ marginTop: '6px', display: 'flex', gap: '4px' }}>
                            <span style={{ fontSize: '10px', background: '#DCFCE7', color: '#15803D', fontWeight: 700, padding: '1px 6px', borderRadius: '8px' }}>
                              {jobs.length} Active Jobs
                            </span>
                          </div>
                        </td>

                        {/* Hourly Slots Matrix */}
                        {timeSlots.map((slot, idx) => {
                          const matchingJob = jobs[idx % jobs.length]; // Render representative job block
                          return (
                            <td
                              key={slot}
                              style={{
                                padding: '6px',
                                borderLeft: '1px solid #F1F5F9',
                                height: '70px',
                                verticalAlign: 'middle',
                                background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                              }}
                            >
                              {matchingJob && idx % 3 === 0 ? (
                                <div
                                  onClick={() => setSelectedWo(matchingJob)}
                                  style={{
                                    background: matchingJob.priority === 'HIGH' ? '#FEE2E2' : '#FEF3C7',
                                    borderLeft: `4px solid ${matchingJob.priority === 'HIGH' ? '#DC2626' : '#D97706'}`,
                                    borderRadius: '6px',
                                    padding: '6px 8px',
                                    fontSize: '11px',
                                    cursor: 'pointer',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                  }}
                                >
                                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{matchingJob.code}</div>
                                  <div style={{ fontSize: '10px', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {matchingJob.customerName}
                                  </div>
                                </div>
                              ) : null}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <WorkOrderDetailsModal workOrder={selectedWo} onClose={() => setSelectedWo(null)} />
      {smartAssignWo && (
        <SmartDispatchMatcherModal
          workOrder={smartAssignWo}
          onClose={() => setSmartAssignWo(null)}
          onSuccess={() => {
            setSmartAssignWo(null);
            fetchData();
          }}
        />
      )}
    </>
  );
};


