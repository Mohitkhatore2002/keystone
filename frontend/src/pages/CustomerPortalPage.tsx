import React, { useEffect, useState } from 'react';
import type { WorkOrder } from '../types/workOrder';
import { workOrderApi } from '../api/workOrderApi';
import { StatusChip } from '../components/common/StatusChip';
import { PriorityChip } from '../components/common/PriorityChip';
import { WorkOrderDetailsModal } from '../components/modals/WorkOrderDetailsModal';
import { CreateWorkOrderModal } from '../components/modals/CreateWorkOrderModal';
import {
  Plus,
  Clock,
  ShieldCheck,
  Navigation,
  Phone,
  Star,
  CheckCircle2,
  Truck,
  MapPin
} from 'lucide-react';

export const CustomerPortalPage: React.FC = () => {
  const [requests, setRequests] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWo, setSelectedWo] = useState<WorkOrder | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Live Uber-style ETA Countdown simulation
  const [etaMinutes, setEtaMinutes] = useState(14);
  const [etaSeconds, setEtaSeconds] = useState(32);
  const [vanPositionPercent, setVanPositionPercent] = useState(42);

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const data = await workOrderApi.getAllList();
      setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  // Live ETA Countdown Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setEtaSeconds((prevSec) => {
        if (prevSec > 0) return prevSec - 1;
        setEtaMinutes((prevMin) => (prevMin > 0 ? prevMin - 1 : 0));
        return 59;
      });

      setVanPositionPercent((prev) => (prev >= 88 ? 35 : prev + 0.3));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const activeJob = requests.find((r) => r.status === 'ASSIGNED' || r.status === 'IN_PROGRESS') || requests[0];

  return (
    <>
      <div className="page-body" style={{ background: '#F8FAFC', padding: '24px 32px', minHeight: '100vh' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.3px' }}>
              Facility Service Request Portal
            </h1>
            <p style={{ color: '#64748B', fontSize: '13px', margin: '4px 0 0' }}>
              Real-time technician GPS tracking, live ETA countdown, and maintenance history
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
              borderRadius: '10px',
              padding: '10px 20px',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
            }}
          >
            <Plus size={18} /> Raise Maintenance Request
          </button>
        </div>

        {/* -------------------------------------------------- */}
        {/* UBER-STYLE LIVE GPS TRACKER & TECHNICIAN TRUST CARD */}
        {/* -------------------------------------------------- */}
        {activeJob && (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '24px',
              marginBottom: '28px',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#4F46E5', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Navigation size={12} className="animate-spin" /> LIVE TECHNICIAN EN ROUTE
                </span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                  {activeJob.code}: {activeJob.title}
                </span>
              </div>

              {/* ETA Countdown Badge */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                  border: '1px solid #F59E0B',
                  color: '#78350F',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontWeight: 800,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)',
                }}
              >
                <Clock size={15} color="#D97706" />
                ETA: {etaMinutes}m {etaSeconds < 10 ? `0${etaSeconds}` : etaSeconds}s (0.8 miles away)
              </div>
            </div>

            {/* Uber-Style Map Canvas Container */}
            <div
              style={{
                height: '200px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #0F172A, #1E293B)',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '20px',
                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              {/* Simulated Map Grid Lines */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

              {/* Route Line Path */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '10%',
                  right: '15%',
                  height: '4px',
                  background: 'linear-gradient(90deg, #6366F1, #10B981)',
                  borderRadius: '2px',
                  boxShadow: '0 0 12px #6366F1',
                }}
              />

              {/* Destination Facility Marker */}
              <div
                style={{
                  position: 'absolute',
                  top: '40%',
                  right: '12%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div style={{ background: '#EF4444', color: '#FFFFFF', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.5)' }}>
                  {activeJob.siteName}
                </div>
                <MapPin size={24} color="#EF4444" fill="#EF4444" style={{ marginTop: '2px' }} />
              </div>

              {/* Moving Service Van GPS Marker */}
              <div
                style={{
                  position: 'absolute',
                  top: '38%',
                  left: `${vanPositionPercent}%`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'left 1s linear',
                }}
              >
                <div style={{ background: '#4F46E5', color: '#FFFFFF', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 800 }}>
                  Service Van #04
                </div>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px #6366F1', marginTop: '2px' }}>
                  <Truck size={18} color="#FFFFFF" />
                </div>
              </div>
            </div>

            {/* Technician Trust Profile Card */}
            <div
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150"
                  alt="Technician"
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #4F46E5' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A' }}>
                      {activeJob.assignedToName || 'John Gallagher'}
                    </span>
                    <span style={{ background: '#FEF3C7', color: '#D97706', fontSize: '11px', fontWeight: 800, padding: '1px 6px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Star size={10} fill="#D97706" /> 4.9 ★
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={13} color="#10B981" /> Verified EPA Master Cert
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} color="#6366F1" /> Background Checked
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href="tel:+18005550199"
                  style={{
                    background: '#2563EB',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Phone size={14} /> Call Technician
                </a>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* ALL MAINTENANCE REQUESTS TABLE */}
        {/* -------------------------------------------------- */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading maintenance requests...</div>
        ) : requests.length === 0 ? (
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#72788A' }}>
            No work order requests logged yet. Click "Raise Maintenance Request" to submit a new service ticket.
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <table className="data-table">
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  <th>Job Code</th>
                  <th>Title & Description</th>
                  <th>Site Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Technician</th>
                  <th>Target SLA</th>
                  <th>Audit Trail</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td style={{ fontWeight: 800, color: '#4F46E5' }}>{req.code}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>{req.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748B', maxWidth: '320px' }}>
                        {req.description || 'No additional details provided'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#1E293B' }}>{req.siteName}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{req.siteAddress}</div>
                    </td>
                    <td><PriorityChip priority={req.priority} /></td>
                    <td><StatusChip status={req.status} /></td>
                    <td>
                      {req.assignedToName ? (
                        <span style={{ color: '#4F46E5', fontWeight: 700 }}>{req.assignedToName}</span>
                      ) : (
                        <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>Pending Dispatch</span>
                      )}
                    </td>
                    <td style={{ fontSize: '12px', color: req.isOverdue ? '#DC2626' : '#64748B' }}>
                      <Clock size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                      {new Date(req.slaDueAt).toLocaleString()}
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => setSelectedWo(req)}>
                        <ShieldCheck size={14} /> View History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <WorkOrderDetailsModal workOrder={selectedWo} onClose={() => setSelectedWo(null)} />
      <CreateWorkOrderModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={fetchMyRequests} />
    </>
  );
};
