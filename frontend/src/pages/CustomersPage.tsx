import React, { useEffect, useState } from 'react';
import type { Customer, Site } from '../types/workOrder';
import { customerApi } from '../api/customerApi';
import { useTheme } from '../context/ThemeContext';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  X,
  ChevronRight,
  Globe
} from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'zidio-light';

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSites, setCustomerSites] = useState<Record<number, Site[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);
  const [selectedCustomerIdForSite, setSelectedCustomerIdForSite] = useState<number | null>(null);

  // Form Fields
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');

  const [siteName, setSiteName] = useState('');
  const [siteAddress, setSiteAddress] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchCustomersAndSites = async () => {
    setLoading(true);
    try {
      const data = await customerApi.getAll();
      setCustomers(data);

      // Fetch sites for each customer
      const sitesMap: Record<number, Site[]> = {};
      for (const c of data) {
        try {
          const sites = await customerApi.getSites(c.id);
          sitesMap[c.id] = sites;
        } catch (err) {
          sitesMap[c.id] = [];
        }
      }
      setCustomerSites(sitesMap);
    } catch (e) {
      console.error('Failed to load customers', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomersAndSites();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custEmail) return;

    setSubmitting(true);
    try {
      await customerApi.createCustomer({
        name: custName,
        contactEmail: custEmail,
        phone: custPhone || undefined,
      });

      setCustName('');
      setCustEmail('');
      setCustPhone('');
      setIsAddCustomerOpen(false);
      showToast(`Customer "${custName}" onboarded successfully!`);
      fetchCustomersAndSites();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create customer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerIdForSite || !siteName || !siteAddress) return;

    setSubmitting(true);
    try {
      await customerApi.createSite(selectedCustomerIdForSite, {
        name: siteName,
        address: siteAddress,
      });

      setSiteName('');
      setSiteAddress('');
      setIsAddSiteOpen(false);
      showToast(`Facility site "${siteName}" added successfully!`);
      fetchCustomersAndSites();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create site');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtering Logic
  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    const sites = customerSites[c.id] || [];
    const matchesCustomer =
      c.name.toLowerCase().includes(q) ||
      c.contactEmail.toLowerCase().includes(q) ||
      (c.phone && c.phone.toLowerCase().includes(q));

    const matchesSite = sites.some(
      (s) => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
    );

    return matchesCustomer || matchesSite;
  });

  return (
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

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={26} color="#6366F1" />
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', letterSpacing: '-0.4px' }}>
              Customers & Facility Sites
            </h1>
          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#64748B' }}>
            Onboard client organizations and manage physical site locations across your service network.
          </p>
        </div>

        <button
          onClick={() => setIsAddCustomerOpen(true)}
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
          <Plus size={16} /> Onboard New Customer
        </button>
      </div>

      {/* Search Controls */}
      <div
        style={{
          background: isLight ? '#FFFFFF' : '#15192D',
          borderRadius: '12px',
          border: isLight ? '1px solid #E2E8F0' : '1px solid #1F243D',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search customer, email, site name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 12px 7px 34px',
              borderRadius: '8px',
              border: isLight ? '1px solid #CBD5E1' : '1px solid #2D3748',
              background: isLight ? '#FFFFFF' : '#0F172A',
              color: isLight ? '#0F172A' : '#FFFFFF',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
          Total Customers: <strong style={{ color: isLight ? '#0F172A' : '#FFFFFF' }}>{customers.length}</strong>
        </div>
      </div>

      {/* Main Customers List */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading customers and facility sites...</div>
      ) : filteredCustomers.length === 0 ? (
        <div
          style={{
            background: isLight ? '#FFFFFF' : '#15192D',
            borderRadius: '12px',
            border: isLight ? '1px solid #E2E8F0' : '1px solid #1F243D',
            padding: '40px',
            textAlign: 'center',
            color: '#64748B',
          }}
        >
          No customers found matching your search.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '20px' }}>
          {filteredCustomers.map((cust) => {
            const sites = customerSites[cust.id] || [];

            return (
              <div
                key={cust.id}
                style={{
                  background: isLight ? '#FFFFFF' : '#15192D',
                  borderRadius: '16px',
                  border: isLight ? '1px solid #E2E8F0' : '1px solid #1F243D',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {/* Customer Card Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {cust.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: isLight ? '#0F172A' : '#FFFFFF' }}>
                          {cust.name}
                        </h3>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Mail size={12} color="#6366F1" /> {cust.contactEmail}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phone Details */}
                  {cust.phone && (
                    <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                      <Phone size={13} color="#10B981" /> {cust.phone}
                    </div>
                  )}

                  {/* Attached Facility Sites */}
                  <div style={{ borderTop: isLight ? '1px solid #F1F5F9' : '1px solid #1F243D', paddingTop: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        FACILITY SITES ({sites.length})
                      </span>
                      <button
                        onClick={() => {
                          setSelectedCustomerIdForSite(cust.id);
                          setIsAddSiteOpen(true);
                        }}
                        style={{
                          background: '#F1F5F9',
                          border: 'none',
                          color: '#4F46E5',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '4px 8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Plus size={12} /> Add Site
                      </button>
                    </div>

                    {sites.length === 0 ? (
                      <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic', padding: '8px 0' }}>
                        No physical sites attached yet.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {sites.map((s) => (
                          <div
                            key={s.id}
                            style={{
                              background: isLight ? '#F8FAFC' : '#1E243D',
                              borderRadius: '8px',
                              padding: '10px 12px',
                              border: isLight ? '1px solid #E2E8F0' : '1px solid #2D3748',
                            }}
                          >
                            <div style={{ fontWeight: 700, fontSize: '13px', color: isLight ? '#0F172A' : '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Building size={13} color="#6366F1" /> {s.name}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={11} /> {s.address}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Info */}
                <div style={{ fontSize: '11px', color: '#94A3B8', borderTop: isLight ? '1px solid #F1F5F9' : '1px solid #1F243D', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Customer ID: #{cust.id}</span>
                  <span style={{ color: '#6366F1', fontWeight: 600 }}>Active Account</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal 1: Onboard New Customer */}
      {isAddCustomerOpen && (
        <div className="modal-overlay" onClick={() => setIsAddCustomerOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={20} color="#6366F1" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Onboard Customer Organization</h3>
              </div>
              <button onClick={() => setIsAddCustomerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#94A3B8" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Organization Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Plaza Commercial Group"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Contact Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ops@apexplaza.com"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. +1 (800) 555-0199"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  style={{ background: '#F1F5F9', border: 'none', padding: '10px 18px', borderRadius: '8px', color: '#475569', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ background: '#4F46E5', border: 'none', padding: '10px 22px', borderRadius: '8px', color: '#FFFFFF', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  {submitting ? 'Onboarding...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Add Facility Site */}
      {isAddSiteOpen && (
        <div className="modal-overlay" onClick={() => setIsAddSiteOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={20} color="#6366F1" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Add Facility Site Location</h3>
              </div>
              <button onClick={() => setIsAddSiteOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#94A3B8" />
              </button>
            </div>

            <form onSubmit={handleCreateSite} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Site Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme HQ - Tower B"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Physical Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100 Innovation Way, Chicago IL"
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddSiteOpen(false)}
                  style={{ background: '#F1F5F9', border: 'none', padding: '10px 18px', borderRadius: '8px', color: '#475569', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ background: '#4F46E5', border: 'none', padding: '10px 22px', borderRadius: '8px', color: '#FFFFFF', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  {submitting ? 'Adding...' : 'Attach Site Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
