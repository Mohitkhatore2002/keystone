import React, { useEffect, useState } from 'react';
import type { User, WorkOrder } from '../types/workOrder';
import { workOrderApi } from '../api/workOrderApi';

interface ExtendedTechProfile extends User {
  phone: string;
  skills: string[];
  firstTimeFixRate: string;
  completedJobs: number;
  avatar: string;
  status: 'Online' | 'On Job' | 'Offline';
}

export const TechniciansPage: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  useEffect(() => {
    workOrderApi.getAllList().then(setWorkOrders).catch(console.error);
  }, []);

  const extendedTechs: ExtendedTechProfile[] = [
    {
      id: 3,
      name: 'John Gallagher',
      email: 'tech.john@meridian.com',
      role: 'TECHNICIAN',
      phone: '+1 (555) 345-6789',
      skills: ['HVAC Certified', 'Chiller Repair', 'Duct Work'],
      firstTimeFixRate: '88%',
      completedJobs: 24,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      status: 'On Job',
    },
    {
      id: 4,
      name: 'Sarah Jenkins',
      email: 'tech.sarah@meridian.com',
      role: 'TECHNICIAN',
      phone: '+1 (555) 456-7890',
      skills: ['Commercial Electrical', 'Breaker Panels', 'Lighting'],
      firstTimeFixRate: '92%',
      completedJobs: 31,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      status: 'On Job',
    },
    {
      id: 10,
      name: 'Marcus Cole',
      email: 'tech.marcus@meridian.com',
      role: 'TECHNICIAN',
      phone: '+1 (555) 567-8901',
      skills: ['Commercial Plumbing', 'Pipe Fittings', 'Leak Detection'],
      firstTimeFixRate: '85%',
      completedJobs: 19,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      status: 'Online',
    },
    {
      id: 11,
      name: 'Carlos Ortiz',
      email: 'tech.carlos@meridian.com',
      role: 'TECHNICIAN',
      phone: '+1 (555) 678-9012',
      skills: ['General Maintenance', 'HVAC Filters', 'Safety Compliance'],
      firstTimeFixRate: '80%',
      completedJobs: 15,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      status: 'Online',
    },
  ];

  const getActiveJobsCount = (techId: number) => {
    return workOrders.filter((w) => w.assignedToId === techId && (w.status === 'ASSIGNED' || w.status === 'IN_PROGRESS')).length;
  };

  return (
    <>
      <div className="page-body" style={{ background: '#F8FAFC', padding: '24px 32px' }}>
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Technicians & Field Workforce
            </h1>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0' }}>
              Field engineer capacity, certifications, skills, and workload distribution
            </p>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ padding: '18px', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Workforce</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>{extendedTechs.length} Engineers</div>
          </div>
          <div className="card" style={{ padding: '18px', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Active On Field</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#16A34A', marginTop: '4px' }}>4 Online</div>
          </div>
          <div className="card" style={{ padding: '18px', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Avg First-Time Fix</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#3B82F6', marginTop: '4px' }}>86.2%</div>
          </div>
          <div className="card" style={{ padding: '18px', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Completed Jobs (MTD)</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#9333EA', marginTop: '4px' }}>89 Resolved</div>
          </div>
        </div>

        {/* Technician Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {extendedTechs.map((tech) => {
            const activeJobs = getActiveJobsCount(tech.id);
            return (
              <div key={tech.id} className="card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <img
                    src={tech.avatar}
                    alt={tech.name}
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{tech.name}</h3>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '10px',
                          background: tech.status === 'On Job' ? '#FEF3C7' : '#DCFCE7',
                          color: tech.status === 'On Job' ? '#D97706' : '#15803D',
                        }}
                      >
                        {tech.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                      {tech.email} · {tech.phone}
                    </div>

                    {/* Skill Tags */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                      {tech.skills.map((s) => (
                        <span key={s} style={{ background: '#F1F5F9', color: '#475569', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '6px' }}>
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Performance Stats Bar */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Active Jobs</div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>{activeJobs}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Fix Rate</div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#16A34A' }}>{tech.firstTimeFixRate}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Total Done</div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#3B82F6' }}>{tech.completedJobs}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
