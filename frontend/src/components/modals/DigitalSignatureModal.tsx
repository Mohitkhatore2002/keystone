import React, { useRef, useState } from 'react';
import { X, CheckCircle2, RotateCcw, PenTool } from 'lucide-react';
import { fileApi } from '../../api/fileApi';

interface Props {
  isOpen: boolean;
  workOrderCode: string;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
}

export const DigitalSignatureModal: React.FC<Props> = ({ isOpen, workOrderCode, onClose, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSigned(true);

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#4F46E5';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSigned) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      setUploading(true);
      try {
        const res = await fileApi.uploadFile(blob, 'signatures', `signature_${workOrderCode}.png`);
        onSave(res.fileUrl);
        onClose();
      } catch (err) {
        console.error('Failed to upload signature file', err);
        const dataUrl = canvas.toDataURL('image/png');
        onSave(dataUrl);
        onClose();
      } finally {
        setUploading(false);
      }
    }, 'image/png');
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ backdropFilter: 'blur(4px)', background: 'rgba(15, 23, 42, 0.6)' }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px', borderRadius: '20px', padding: '24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PenTool size={20} color="#6366F1" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
              Digital Customer Sign-Off Canvas
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#94A3B8" />
          </button>
        </div>

        <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
          Please ask the client representative to sign below to confirm work order satisfaction for <strong>{workOrderCode}</strong>.
        </div>

        {/* HTML5 Signature Canvas */}
        <div style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
          <canvas
            ref={canvasRef}
            width={470}
            height={200}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{ cursor: 'crosshair', display: 'block', width: '100%', touchAction: 'none' }}
          />

          {!hasSigned && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', color: '#CBD5E1', fontWeight: 600, fontSize: '14px' }}>
              Draw Signature Here
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <button
            onClick={handleClear}
            style={{
              background: '#F1F5F9',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              color: '#475569',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <RotateCcw size={13} /> Clear Canvas
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{ background: '#F1F5F9', border: 'none', padding: '10px 16px', borderRadius: '8px', color: '#475569', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasSigned || uploading}
              style={{
                background: (hasSigned && !uploading) ? '#4F46E5' : '#CBD5E1',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: (hasSigned && !uploading) ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <CheckCircle2 size={14} /> {uploading ? 'Saving to Backend Disk...' : 'Save Signature & Complete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
