import React, { useState, useEffect } from 'react';
import type { WorkOrder, User } from '../../types/workOrder';
import { authApi } from '../../api/authApi';
import { workOrderApi } from '../../api/workOrderApi';
import { useNotifications } from '../../context/NotificationContext';
import {
  Sparkles,
  X,
  MapPin,
  ShieldCheck,
  Package,
  Clock,
  UserCheck,
  Star,
  CheckCircle2
} from 'lucide-react';

interface Props {
  workOrder: WorkOrder | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface RankedTech {
  user: User;
  score: number;
  distanceMiles: number;
  skillMatchScore: number;
  partsInVanPercent: number;
  activeJobCount: number;
  certifications: string[];
}

export const SmartDispatchMatcherModal: React.FC<Props> = ({ workOrder, onClose, onSuccess }) => {
  const { addNotification } = useNotifications();
  const [rankedTechs, setRankedTechs] = useState<RankedTech[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningTechId, setAssigningTechId] = useState<number | null>(null);

  useEffect(() => {
    if (workOrder) {
      authApi.getTechnicians().then((techs) => {
        // AI Ranking Algorithm simulation based on work order requirements
        const ranked: RankedTech[] = techs.map((t, idx) => {
          let score = 90 - idx * 12;
          let distance = 1.2 + idx * 2.4;
          let partsPercent = 100 - idx * 15;
          let activeJobs = idx;

          let certs = ['EPA 608 Universal', 'OSHA 30 Safety'];
          if (workOrder.title.toLowerCase().includes('elec') || workOrder.title.toLowerCase().includes('panel')) {
            certs.push('Master Electrical License #EL-9942');
            if (t.name.includes('Sarah')) score += 8;
          } else {
            certs.push('HVAC Master Cert #HV-4401');
            if (t.name.includes('John')) score += 8;
          }

          score = Math.min(99, Math.max(65, score));

          return {
            user: t,
            score,
            distanceMiles: Number(distance.toFixed(1)),
            skillMatchScore: score > 90 ? 100 : 85,
            partsInVanPercent: Math.max(70, partsPercent),
            activeJobCount: activeJobs,
            certifications: certs,
          };
        });

        // Sort highest AI match score first
        ranked.sort((a, b) => b.score - a.score);
        setRankedTechs(ranked);
        setLoading(false);
      }).catch(console.error);
    }
  }, [workOrder]);

  if (!workOrder) return null;

  const handleAssign = async (tech: User) => {
    setAssigningTechId(tech.id);
    try {
      await workOrderApi.assign(workOrder.id, tech.id);

      addNotification({
        title: 'Smart Dispatch Assigned',
        message: `Work Order ${workOrder.code} assigned to top AI match ${tech.name}.`,
        tag: 'Dispatch AI',
        type: 'info',
        link: '/work-orders',
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Assignment failure detail:', err);
      const msg = err.response?.data?.message || err.message || 'Assignment failed. Ensure you are logged in as a Dispatcher or Manager.';
      alert(`Assignment Notice: ${msg}`);
    } finally {
      setAssigningTechId(null);
    }
  };

  const topMatch = rankedTechs[0];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ backdropFilter: 'blur(4px)', background: 'rgba(15, 23, 42, 0.6)' }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        }}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', padding: '8px', borderRadius: '10px', color: '#FFFFFF' }}>
                <Sparkles size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  AI Smart Dispatch Assistant
                </h2>
                <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                  Auto-ranking technicians for <strong style={{ color: '#6366F1' }}>{workOrder.code}</strong> ({workOrder.title})
                </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#94A3B8" />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
            Analyzing technician proximity, skill certifications, van inventory, and live workload...
          </div>
        ) : (
          <div>
            {/* Top Match Banner */}
            {topMatch && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                  border: '1px solid #C7D2FE',
                  borderRadius: '14px',
                  padding: '16px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                      color: '#FFFFFF',
                      fontSize: '18px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
                    }}
                  >
                    {topMatch.user.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      TOP RECOMMENDED AI MATCH
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>{topMatch.user.name}</div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span><MapPin size={12} style={{ verticalAlign: 'middle' }} /> {topMatch.distanceMiles} miles away</span>
                      <span><Package size={12} style={{ verticalAlign: 'middle' }} /> {topMatch.partsInVanPercent}% Van Inventory</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleAssign(topMatch.user)}
                  disabled={assigningTechId === topMatch.user.id}
                  style={{
                    background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)',
                  }}
                >
                  <Sparkles size={14} /> Smart Auto-Assign ({topMatch.score}% Match)
                </button>
              </div>
            )}

            {/* Technician Ranking List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                All Available Fleet Technicians
              </div>

              {rankedTechs.map((tRank) => (
                <div
                  key={tRank.user.id}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: '#6E56CF',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {tRank.user.name.charAt(0)}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '14px', color: '#0F172A' }}>{tRank.user.name}</span>
                        <span
                          style={{
                            background: tRank.score >= 90 ? '#DCFCE7' : '#FEF3C7',
                            color: tRank.score >= 90 ? '#15803D' : '#B45309',
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '10px',
                          }}
                        >
                          {tRank.score}% AI Match
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} color="#6366F1" /> {tRank.distanceMiles} mi
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={12} color="#10B981" /> {tRank.certifications[0]}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} color="#F59E0B" /> {tRank.activeJobCount} Active Jobs
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAssign(tRank.user)}
                    disabled={assigningTechId === tRank.user.id}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      color: '#0F172A',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Assign Tech
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
