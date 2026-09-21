import React, { useEffect, useState } from 'react';
import type { Part } from '../types/workOrder';
import { partApi } from '../api/partApi';
import { useTheme } from '../context/ThemeContext';
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  X,
  Sparkles,
  DollarSign
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'zidio-light';

  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [partName, setPartName] = useState('');
  const [sku, setSku] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [stockQty, setStockQty] = useState('50');
  const [isSkuUserCustomized, setIsSkuUserCustomized] = useState(false);
  const [modalError, setModalError] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Helper for generating category-aware SKUs
  const generateSku = (name?: string) => {
    let prefix = 'GEN';
    if (name) {
      const lower = name.toLowerCase();
      if (lower.includes('hvac') || lower.includes('filter') || lower.includes('chiller') || lower.includes('air') || lower.includes('duct')) {
        prefix = 'HVAC';
      } else if (lower.includes('elec') || lower.includes('breaker') || lower.includes('wire') || lower.includes('panel') || lower.includes('light') || lower.includes('fuse')) {
        prefix = 'ELEC';
      } else if (lower.includes('plum') || lower.includes('pipe') || lower.includes('valve') || lower.includes('leak') || lower.includes('copper') || lower.includes('drain')) {
        prefix = 'PLUM';
      } else if (lower.includes('motor') || lower.includes('pump') || lower.includes('compressor') || lower.includes('fan')) {
        prefix = 'MECH';
      }
    }
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    return `PART-${prefix}-${randomCode}`;
  };

  const fetchParts = async () => {
    setLoading(true);
    try {
      const data = await partApi.getAll();
      setParts(data);
    } catch (e) {
      console.error('Failed to load inventory parts', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenAddModal = () => {
    setPartName('');
    const autoSku = generateSku();
    setSku(autoSku);
    setIsSkuUserCustomized(false);
    setUnitCost('25.00');
    setStockQty('50');
    setModalError('');
    setIsAddOpen(true);
  };

  const handlePartNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPartName(val);
    if (!isSkuUserCustomized) {
      setSku(generateSku(val));
    }
  };

  const handleRegenerateSku = () => {
    const newSku = generateSku(partName);
    setSku(newSku);
    setIsSkuUserCustomized(false);
  };

  const handleAddPart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partName || !sku || !unitCost || !stockQty) {
      setModalError('Please fill in all required fields.');
      return;
    }

    setModalError('');
    try {
      await partApi.create({
        name: partName,
        sku: sku,
        unitCost: parseFloat(unitCost),
        stockQty: parseInt(stockQty, 10),
      });

      setIsAddOpen(false);
      showToast(`Spare part "${partName}" (${sku}) created successfully!`);
      fetchParts();
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Failed to add inventory part.');
    }
  };

  const filteredParts = parts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = parts.reduce((acc, p) => acc + p.unitCost * p.stockQty, 0);
  const lowStockCount = parts.filter((p) => p.stockQty < 25).length;

  return (
    <>
      <div className="page-body" style={{ background: isLight ? '#F8FAFC' : '#0B0F19', padding: '28px 36px', minHeight: '100vh' }}>
        {/* Toast Notification */}
        {toastMsg && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
              color: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 600,
              fontSize: '14px',
              zIndex: 1000,
            }}
          >
            <CheckCircle2 size={18} />
            {toastMsg}
          </div>
        )}

        {/* Header Title Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Package size={26} color="#6366F1" />
              <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: isLight ? '#0F172A' : '#FFFFFF', letterSpacing: '-0.4px' }}>
                Inventory & Spare Parts Control
              </h1>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#64748B' }}>
              Real-time stock level tracking, auto-generated SKU cataloging, and unit cost valuation.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            style={{
              background: 'linear-gradient(135deg, #5B4DCC, #4F46E5)',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 22px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(91, 77, 204, 0.35)',
              transition: 'all 0.15s ease',
            }}
          >
            <Plus size={16} /> Add New Part
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          <div
            style={{
              background: isLight ? '#FFFFFF' : '#15192D',
              borderRadius: '14px',
              border: isLight ? '1px solid #E2E8F0' : '1px solid #1F243D',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              PARTS CATALOG SIZE
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: isLight ? '#0F172A' : '#FFFFFF', marginTop: '4px' }}>
              {parts.length} <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>SKUs Listed</span>
            </div>
          </div>

          <div
            style={{
              background: isLight ? '#FFFFFF' : '#15192D',
              borderRadius: '14px',
              border: isLight ? '1px solid #E2E8F0' : '1px solid #1F243D',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              TOTAL INVENTORY VALUATION
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>
              ${totalValue.toFixed(2)}
            </div>
          </div>

          <div
            style={{
              background: isLight ? '#FFFFFF' : '#15192D',
              borderRadius: '14px',
              border: isLight ? '1px solid #E2E8F0' : '1px solid #1F243D',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              LOW STOCK ALERTS
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: lowStockCount > 0 ? '#EF4444' : '#10B981', marginTop: '4px' }}>
              {lowStockCount} <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>Below Threshold</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            background: isLight ? '#FFFFFF' : '#15192D',
            borderRadius: '12px',
            border: isLight ? '1px solid #E2E8F0' : '1px solid #1F243D',
            padding: '14px 20px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search by part name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 12px 7px 34px',
                borderRadius: '8px',
                border: isLight ? '1px solid #CBD5E1' : '1px solid #2D3748',
                background: isLight ? '#FFFFFF' : '#0F172A',
                color: isLight ? '#0F172A' : '#FFFFFF',
                fontSize: '12px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Parts Table */}
        <div
          style={{
            background: isLight ? '#FFFFFF' : '#15192D',
            borderRadius: '16px',
            border: isLight ? '1px solid #E2E8F0' : '1px solid #1F243D',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
          }}
        >
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading inventory catalog...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr style={{ background: isLight ? '#F8FAFC' : '#1E243D' }}>
                  <th>SKU Code (Auto)</th>
                  <th>Part Name & Category</th>
                  <th>Unit Cost</th>
                  <th>Available Stock</th>
                  <th>Inventory Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredParts.map((part) => {
                  const isLow = part.stockQty < 25;
                  return (
                    <tr key={part.id}>
                      <td style={{ fontWeight: 800, color: '#6366F1', fontSize: '13px' }}>
                        <span style={{ background: isLight ? '#EEF2FF' : '#1E1B4B', padding: '3px 8px', borderRadius: '6px' }}>
                          {part.sku}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: isLight ? '#0F172A' : '#FFFFFF' }}>{part.name}</td>
                      <td style={{ fontWeight: 700, color: '#10B981' }}>${part.unitCost.toFixed(2)}</td>
                      <td style={{ fontWeight: 700, color: isLow ? '#EF4444' : isLight ? '#0F172A' : '#FFFFFF' }}>
                        {part.stockQty} Units
                      </td>
                      <td>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: isLow ? '#FEE2E2' : '#DCFCE7',
                            color: isLow ? '#B91C1C' : '#15803D',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {isLow ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                          {isLow ? 'LOW STOCK' : 'IN STOCK'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add New Part Modal with Auto-Generated SKU */}
      {isAddOpen && (
        <div className="modal-overlay" onClick={() => setIsAddOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '480px', borderRadius: '16px', padding: '24px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={20} color="#6366F1" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Add Inventory Spare Part</h3>
              </div>
              <button onClick={() => setIsAddOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#94A3B8" />
              </button>
            </div>

            {modalError && (
              <div style={{ background: '#FDF2F2', border: '1px solid #E84D49', color: '#E84D49', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
                {modalError}
              </div>
            )}

            <form onSubmit={handleAddPart} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Part Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Copper Fitting 1/2 in, MERV-13 Filter"
                  value={partName}
                  onChange={handlePartNameChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                  required
                />
              </div>

              {/* SKU Code (Auto Generated) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={13} color="#6366F1" /> SKU Code (Auto-Generated) *
                  </label>
                  <button
                    type="button"
                    onClick={handleRegenerateSku}
                    style={{ background: 'none', border: 'none', color: '#6366F1', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    <RefreshCw size={11} /> Regenerate
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => {
                      setSku(e.target.value);
                      setIsSkuUserCustomized(true);
                    }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', fontWeight: 700, color: '#4F46E5', outline: 'none', background: '#F5F3FF' }}
                    required
                  />
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
                  SKU is generated automatically based on part category prefix. You can edit if needed.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Unit Cost ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="25.00"
                    value={unitCost}
                    onChange={(e) => setUnitCost(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Initial Stock Qty *</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={stockQty}
                    onChange={(e) => setStockQty(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  style={{ background: '#F1F5F9', border: 'none', padding: '10px 18px', borderRadius: '8px', color: '#475569', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#4F46E5', border: 'none', padding: '10px 22px', borderRadius: '8px', color: '#FFFFFF', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  Create Spare Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
