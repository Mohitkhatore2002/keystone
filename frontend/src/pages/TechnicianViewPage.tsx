import React, { useEffect, useState } from 'react';
import type { WorkOrder } from '../types/workOrder';
import { workOrderApi } from '../api/workOrderApi';
import { fileApi } from '../api/fileApi';
import { StatusChip } from '../components/common/StatusChip';
import { PriorityChip } from '../components/common/PriorityChip';
import { WorkOrderDetailsModal } from '../components/modals/WorkOrderDetailsModal';
import { LogPartModal } from '../components/modals/LogPartModal';
import { LogTimeModal } from '../components/modals/LogTimeModal';
import { DigitalSignatureModal } from '../components/modals/DigitalSignatureModal';
import {
  Play,
  Wrench,
  Clock,
  MapPin,
  Building,
  Eye,
  PenTool,
  Camera,
  ShieldCheck
} from 'lucide-react';

export const TechnicianViewPage: React.FC = () => {
  const [jobs, setJobs] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWo, setSelectedWo] = useState<WorkOrder | null>(null);
  const [partModalWo, setPartModalWo] = useState<WorkOrder | null>(null);
  const [timeModalWo, setTimeModalWo] = useState<WorkOrder | null>(null);
  const [signatureWo, setSignatureWo] = useState<WorkOrder | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Before / After Photos State Simulation
  const [beforePhotos, setBeforePhotos] = useState<Record<number, string[]>>({});
  const [afterPhotos, setAfterPhotos] = useState<Record<number, string[]>>({});
  const [signatures, setSignatures] = useState<Record<number, string>>({});

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const data = await workOrderApi.getAllList();
      setJobs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleStatusChange = async (woId: number, targetStatus: any, note?: string) => {
    setErrorMsg('');
    try {
      await workOrderApi.transitionStatus(woId, targetStatus, note);
      showToast(`Status updated to ${targetStatus}`);
      fetchMyJobs();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleFileUpload = async (woId: number, type: 'before' | 'after', e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      showToast(`Uploading ${type.toUpperCase()} photo to backend disk storage...`);
      const res = await fileApi.uploadFile(file, 'work-orders');
      if (type === 'before') {
        setBeforePhotos((prev) => ({ ...prev, [woId]: [...(prev[woId] || []), res.fileUrl] }));
      } else {
        setAfterPhotos((prev) => ({ ...prev, [woId]: [...(prev[woId] || []), res.fileUrl] }));
      }
      showToast(`${type.toUpperCase()} inspection photo saved to backend uploads/work-orders/!`);
    } catch (err) {
      console.error('Failed to upload job photo', err);
      showToast('Photo upload failed.');
    }
  };

  const handleSaveSignature = (woId: number, signatureUrl: string) => {
    setSignatures((prev) => ({ ...prev, [woId]: signatureUrl }));
    handleStatusChange(woId, 'COMPLETED', 'Customer digital sign-off completed on site');
  };

  return (
    <>
      <div className="page-body" style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Toast Notification */}
        {toastMsg && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: '#4F46E5',
              color: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '14px',
              zIndex: 1000,
            }}
          >
            {toastMsg}
          </div>
        )}

        {/* Mobile Header Banner */}
        <div style={{ marginBottom: '20px', background: '#4F46E5', color: '#FFFFFF', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 14px rgba(79,70,229,0.3)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Technician Field Mobile Execution
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', margin: '4px 0 0' }}>
            48px+ touch controls, digital customer signature canvas & inspection photo uploads
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: '#FDF2F2', border: '1px solid #E84D49', color: '#E84D49', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>Loading assigned field jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="card" style={{ padding: '32px', textAlign: 'center', color: '#72788A', borderRadius: '14px' }}>
            No work orders assigned to you currently.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {jobs.map((job) => {
              const bPhotos = beforePhotos[job.id] || [];
              const aPhotos = afterPhotos[job.id] || [];
              const sig = signatures[job.id];

              return (
                <div
                  key={job.id}
                  className="card"
                  style={{
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1px solid #CBD5E1',
                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                    background: '#FFFFFF',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 800, fontSize: '15px', color: '#4F46E5' }}>{job.code}</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <StatusChip status={job.status} />
                      <PriorityChip priority={job.priority} />
                    </div>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>{job.title}</h3>

                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '12px', marginBottom: '16px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 700, color: '#0F172A' }}>
                      <Building size={15} color="#4F46E5" />
                      {job.customerName}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B' }}>
                      <MapPin size={14} color="#6366F1" />
                      {job.siteName} ({job.siteAddress || 'Main Complex'})
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: job.isOverdue ? '#DC2626' : '#64748B', marginTop: '6px', fontWeight: 600 }}>
                      <Clock size={14} />
                      SLA Target: {new Date(job.slaDueAt).toLocaleString()}
                    </div>
                  </div>

                  {/* 📸 BEFORE & AFTER PHOTO INSPECTION TOOL */}
                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '14px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Camera size={14} color="#4F46E5" /> BEFORE & AFTER INSPECTION PHOTOS
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {/* Before Photo Box */}
                      <label style={{ background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '10px', padding: '10px', textAlign: 'center', cursor: 'pointer' }}>
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(job.id, 'before', e)} />
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>+ BEFORE PHOTO</div>
                        {bPhotos.length > 0 && (
                          <img src={bPhotos[bPhotos.length - 1]} alt="Before" style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '6px', marginTop: '6px' }} />
                        )}
                      </label>

                      {/* After Photo Box */}
                      <label style={{ background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '10px', padding: '10px', textAlign: 'center', cursor: 'pointer' }}>
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(job.id, 'after', e)} />
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>+ AFTER PHOTO</div>
                        {aPhotos.length > 0 && (
                          <img src={aPhotos[aPhotos.length - 1]} alt="After" style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '6px', marginTop: '6px' }} />
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Customer Signature Badge */}
                  {sig && (
                    <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '10px', borderRadius: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ShieldCheck size={18} color="#059669" />
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#065F46' }}>
                        Customer Digital Signature Verified & Saved
                      </div>
                    </div>
                  )}

                  {/* 48px+ High-Contrast Touch Control Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                      onClick={() => setSelectedWo(job)}
                      style={{
                        minHeight: '48px',
                        background: '#F1F5F9',
                        border: '1px solid #CBD5E1',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#0F172A',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <Eye size={16} /> View Details & Scope
                    </button>

                    {job.status === 'ASSIGNED' && (
                      <button
                        onClick={() => handleStatusChange(job.id, 'IN_PROGRESS', 'Technician arrived on site')}
                        style={{
                          minHeight: '48px',
                          background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '15px',
                          fontWeight: 800,
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)',
                        }}
                      >
                        <Play size={18} /> Start Field Work
                      </button>
                    )}

                    {job.status === 'IN_PROGRESS' && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <button
                            onClick={() => setPartModalWo(job)}
                            style={{ minHeight: '48px', background: '#EFF6FF', border: '1px solid #93C5FD', color: '#1D4ED8', borderRadius: '10px', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                          >
                            <Wrench size={16} /> Log Parts
                          </button>
                          <button
                            onClick={() => setTimeModalWo(job)}
                            style={{ minHeight: '48px', background: '#FFFBEB', border: '1px solid #FDE68A', color: '#B45309', borderRadius: '10px', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                          >
                            <Clock size={16} /> Log Time
                          </button>
                        </div>

                        {/* Customer Signature Trigger */}
                        <button
                          onClick={() => setSignatureWo(job)}
                          style={{
                            minHeight: '48px',
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: 800,
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                          }}
                        >
                          <PenTool size={16} /> Get Digital Customer Signature
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <WorkOrderDetailsModal workOrder={selectedWo} onClose={() => setSelectedWo(null)} />
      <LogPartModal workOrder={partModalWo} onClose={() => setPartModalWo(null)} onSuccess={fetchMyJobs} />
      <LogTimeModal workOrder={timeModalWo} onClose={() => setTimeModalWo(null)} onSuccess={fetchMyJobs} />
      {signatureWo && (
        <DigitalSignatureModal
          isOpen={true}
          workOrderCode={signatureWo.code}
          onClose={() => setSignatureWo(null)}
          onSave={(sigData) => handleSaveSignature(signatureWo.id, sigData)}
        />
      )}
    </>
  );
};
