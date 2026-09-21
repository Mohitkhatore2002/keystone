import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Search,
  Bell,
  X,
  Moon,
  Sun,
  Settings,
  HelpCircle,
  Mail,
  MessageCircle,
  BookOpen,
  User as UserIcon,
  LogOut as LogOutIcon,
  ChevronDown
} from 'lucide-react';
import { workOrderApi } from '../../api/workOrderApi';
import type { WorkOrder } from '../../types/workOrder';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, unreadCount, markAllAsRead, markAsRead, clearAll } = useNotifications();

  const isLight = theme === 'zidio-light';

  // Map route to breadcrumb label
  const getBreadcrumbLabel = (path: string) => {
    switch (path) {
      case '/dashboard':
        return 'Overview';
      case '/work-orders':
        return 'Work Orders';
      case '/scheduling':
        return 'Scheduling';
      case '/map':
        return 'Map View';
      case '/technicians':
        return 'Technicians';
      case '/inventory':
        return 'Inventory';
      case '/analytics':
        return 'Analytics';
      case '/board':
        return 'Dispatch Board';
      case '/settings':
        return 'Settings';
      case '/profile':
        return 'Your Profile';
      default:
        return 'Overview';
    }
  };

  const breadcrumb = getBreadcrumbLabel(location.pathname);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WorkOrder[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setIsHelpOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('global-header-search');
        if (input) input.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Global live search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await workOrderApi.getAllList();
        const filtered = res.filter(
          (wo: WorkOrder) =>
            wo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            wo.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (wo.assignedToName && wo.assignedToName.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setSearchResults(filtered.slice(0, 5));
        setShowSearchDropdown(true);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!user) return null;

  return (
    <header
      className="header-bar"
      style={{
        height: '64px',
        padding: '0 28px',
        background: isLight ? '#FFFFFF' : '#15192D',
        borderBottom: isLight ? '1px solid #E6E7F0' : '1px solid #1F243D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        transition: 'all 0.2s ease',
      }}
    >
      {/* Left Breadcrumbs Trail */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', flexShrink: 0 }}>
        <span style={{ color: '#94A3B8', fontWeight: 500 }}>Dashboard</span>
        <span style={{ color: '#CBD5E1' }}>/</span>
        <span style={{ color: isLight ? '#0F172A' : '#F1F5F9', fontWeight: 700 }}>
          {breadcrumb}
        </span>
      </div>

      {/* Right Controls Area containing all actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
        {/* Search Input Box with ⌘K Badge */}
        <div ref={searchRef} style={{ position: 'relative', width: '260px' }}>
          <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '10px', zIndex: 2 }} />
          <input
            id="global-header-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
            placeholder="Search projects, lessons..."
            style={{
              width: '100%',
              padding: '7px 44px 7px 34px',
              borderRadius: '20px',
              border: isLight ? '1px solid #E2E8F0' : '1px solid #2D3748',
              background: isLight ? '#F8FAFC' : '#1E243D',
              fontSize: '13px',
              color: isLight ? '#1E293B' : '#F8FAFC',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
          />
          {/* ⌘K Badge */}
          <div
            style={{
              position: 'absolute',
              right: '8px',
              top: '6px',
              background: isLight ? '#FFFFFF' : '#2D3748',
              border: isLight ? '1px solid #CBD5E1' : '1px solid #475569',
              borderRadius: '6px',
              padding: '1px 5px',
              fontSize: '10px',
              fontWeight: 700,
              color: '#64748B',
              pointerEvents: 'none',
            }}
          >
            ⌘K
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '42px',
                left: 0,
                right: 0,
                background: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.15)',
                border: '1px solid #E2E8F0',
                maxHeight: '320px',
                overflowY: 'auto',
                zIndex: 150,
                padding: '8px 0',
              }}
            >
              <div style={{ padding: '6px 16px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                Work Orders & Records
              </div>
              {isSearching ? (
                <div style={{ padding: '12px 16px', fontSize: '13px', color: '#64748B' }}>Searching...</div>
              ) : searchResults.length === 0 ? (
                <div style={{ padding: '12px 16px', fontSize: '13px', color: '#64748B' }}>No matching work orders found</div>
              ) : (
                searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                      navigate('/work-orders');
                    }}
                    style={{
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                      borderBottom: '1px solid #F1F5F9',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>
                        <span style={{ color: '#4F46E5', marginRight: '6px' }}>{item.code}</span>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                        Customer: {item.customerName} {item.assignedToName ? `• Tech: ${item.assignedToName}` : ''}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: item.status === 'COMPLETED' ? '#DCFCE7' : item.status === 'IN_PROGRESS' ? '#DBEAFE' : '#FEF3C7',
                        color: item.status === 'COMPLETED' ? '#166534' : item.status === 'IN_PROGRESS' ? '#1E40AF' : '#92400E',
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      {/* Theme Toggle Icon (Moon / Sun) */}
      <button
        type="button"
        onClick={toggleTheme}
        style={{
          background: 'none',
          border: 'none',
          color: isLight ? '#64748B' : '#94A3B8',
          cursor: 'pointer',
          padding: '6px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      >
        {isLight ? <Moon size={18} /> : <Sun size={18} color="#F59E0B" />}
      </button>

      {/* Live Notification Bell with Dropdown Popover */}
      <div ref={notifRef} style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          style={{
            position: 'relative',
            cursor: 'pointer',
            padding: '6px',
            background: isNotifOpen ? (isLight ? '#F1F5F9' : '#1E243D') : 'transparent',
            border: 'none',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none',
          }}
        >
          <Bell size={18} color={isLight ? '#64748B' : '#94A3B8'} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                background: '#EF4444',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 700,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Popover Menu */}
        {isNotifOpen && (
          <div
            style={{
              position: 'absolute',
              top: '44px',
              right: '-10px',
              width: '380px',
              background: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(226, 232, 240, 0.8)',
              zIndex: 200,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px 20px 12px 20px',
                borderBottom: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0F172A' }}>Notifications</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748B' }}>Live updates • saved for this browser</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={clearAll}
                      style={{ background: 'none', border: 'none', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      Clear
                    </button>
                    <button
                      onClick={markAllAsRead}
                      style={{ background: 'none', border: 'none', color: '#6366F1', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      Mark all read
                    </button>
                  </>
                )}
                <button onClick={() => setIsNotifOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px' }}>
                  <X size={16} />
                </button>
              </div>
            </div>

            <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '8px 0' }} className="custom-notification-scrollbar">
              {notifications.length === 0 ? (
                <div style={{ padding: '32px 20px', textAlign: 'center', color: '#94A3B8' }}>
                  <Bell size={28} color="#CBD5E1" style={{ marginBottom: '8px' }} />
                  <p style={{ fontSize: '13px', margin: 0 }}>No notifications yet</p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      markAsRead(item.id);
                      if (item.link) {
                        navigate(item.link);
                        setIsNotifOpen(false);
                      }
                    }}
                    style={{
                      padding: '14px 20px',
                      borderBottom: '1px solid #F8FAFC',
                      cursor: 'pointer',
                      background: item.read ? '#FFFFFF' : '#F8FAFC',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = item.read ? '#F8FAFC' : '#F1F5F9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = item.read ? '#FFFFFF' : '#F8FAFC')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {!item.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366F1' }} />}
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>{item.title}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>{item.timestamp}</span>
                    </div>
                    <p style={{ margin: '4px 0 8px 0', fontSize: '13px', color: '#475569', lineHeight: 1.4 }}>{item.message}</p>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px' }}>
                      {item.tag}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Settings Icon */}
      <button
        type="button"
        onClick={() => navigate('/settings')}
        style={{ background: 'none', border: 'none', color: isLight ? '#64748B' : '#94A3B8', cursor: 'pointer', padding: '6px' }}
        title="Settings"
      >
        <Settings size={18} />
      </button>

      {/* Help Question Icon with Popover Menu */}
      <div ref={helpRef} style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setIsHelpOpen(!isHelpOpen)}
          style={{
            background: isHelpOpen ? (isLight ? '#F1F5F9' : '#1E243D') : 'none',
            border: 'none',
            color: isLight ? '#64748B' : '#94A3B8',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none',
          }}
          title="Help & Documentation"
        >
          <HelpCircle size={18} />
        </button>

        {/* Help Popover Menu matching Screenshot */}
        {isHelpOpen && (
          <div
            style={{
              position: 'absolute',
              top: '44px',
              right: '-10px',
              width: '230px',
              background: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(226, 232, 240, 0.8)',
              zIndex: 200,
              padding: '8px 0',
              overflow: 'hidden',
            }}
          >
            {/* Menu Item 1: Open Help Center */}
            <div
              onClick={() => {
                setIsHelpOpen(false);
                setIsHelpModalOpen(true);
              }}
              style={{
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1E293B',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
            >
              <HelpCircle size={18} color="#6366F1" />
              <span>Open Help Center</span>
            </div>

            {/* Menu Item 2: Email support */}
            <div
              onClick={() => {
                setIsHelpOpen(false);
                window.open('mailto:support@keystone-ops.com?subject=Keystone%20Platform%20Support%20Request', '_blank');
              }}
              style={{
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1E293B',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
            >
              <Mail size={18} color="#64748B" />
              <span>Email support</span>
            </div>

            {/* Menu Item 3: Chat on WhatsApp */}
            <div
              onClick={() => {
                setIsHelpOpen(false);
                window.open('https://wa.me/919999999999?text=Hi%20Keystone%20Support,%20I%20need%20help%20with%20my%20dispatch%20portal', '_blank');
              }}
              style={{
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1E293B',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
            >
              <MessageCircle size={18} color="#10B981" />
              <span>Chat on WhatsApp</span>
            </div>

            {/* Menu Item 4: FAQ & docs */}
            <div
              onClick={() => {
                setIsHelpOpen(false);
                setIsHelpModalOpen(true);
              }}
              style={{
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1E293B',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
            >
              <BookOpen size={18} color="#64748B" />
              <span>FAQ & docs</span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Help & Documentation Modal */}
      {isHelpModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              width: '540px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366F1, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HelpCircle size={22} color="#FFFFFF" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '19px', fontWeight: 800, color: '#0F172A' }}>Help Center & Documentation</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748B' }}>Find quick answers and operational guides</p>
                </div>
              </div>
              <button onClick={() => setIsHelpModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>How do I create a new Work Order?</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                  Go to the <strong>Work Orders</strong> page in the sidebar and click the purple <strong>"+ New Work Order"</strong> button. Fill in customer details, priority, and assign a technician.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>How does technician live location tracking work?</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                  Visit the <strong>Map View</strong> page to see real-time GPS coordinates of active field engineers and dispatched jobs on the interactive map.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>How are inventory stock levels updated?</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                  Parts and spare items can be logged in the <strong>Inventory</strong> section. Stock levels automatically update when technicians log spare parts usage on completed jobs.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Need direct human support?</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                  Contact our 24/7 dispatch operations desk via WhatsApp or email <strong>support@keystone-ops.com</strong>.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                onClick={() => setIsHelpModalOpen(false)}
                style={{
                  background: '#4F46E5',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Pill (Avatar + Name + Email + Down Arrow) */}
      <div ref={profileRef} style={{ position: 'relative' }}>
        <div
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '20px',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = isLight ? '#F1F5F9' : '#1E243D')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          {/* User Avatar Image or Letter Badge */}
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #6366F1',
              }}
            />
          ) : (
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {(user.name || user.email || 'M').charAt(0).toUpperCase()}
            </div>
          )}
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: isLight ? '#0F172A' : '#FFFFFF', lineHeight: 1.2 }}>
              {user.name || 'Mohit khatore'}
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '1px' }}>
              {user.email || 'khatoremohit992@gmail.com'}
            </div>
          </div>
          <ChevronDown size={14} color="#94A3B8" />
        </div>

        {/* Profile Dropdown Menu matching Screenshot */}
        {isProfileOpen && (
          <div
            style={{
              position: 'absolute',
              top: '46px',
              right: 0,
              width: '210px',
              background: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(226, 232, 240, 0.8)',
              zIndex: 200,
              padding: '6px 0',
              overflow: 'hidden',
            }}
          >
            {/* Option 1: Profile */}
            <div
              onClick={() => {
                setIsProfileOpen(false);
                navigate('/profile');
              }}
              style={{
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1E293B',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
            >
              <UserIcon size={18} color="#475569" />
              <span>Profile</span>
            </div>

            {/* Option 2: Help */}
            <div
              onClick={() => {
                setIsProfileOpen(false);
                setIsHelpModalOpen(true);
              }}
              style={{
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1E293B',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
            >
              <HelpCircle size={18} color="#475569" />
              <span>Help</span>
            </div>

            {/* Option 3: Settings */}
            <div
              onClick={() => {
                setIsProfileOpen(false);
                navigate('/settings');
              }}
              style={{
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1E293B',
                transition: 'background 0.15s ease',
                borderBottom: '1px solid #F1F5F9',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
            >
              <Settings size={18} color="#475569" />
              <span>Settings</span>
            </div>

            {/* Option 4: Log out */}
            <div
              onClick={() => {
                setIsProfileOpen(false);
                logout();
              }}
              style={{
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: '#EF4444',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#FEF2F2')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
            >
              <LogOutIcon size={18} color="#EF4444" />
              <span>Log out</span>
            </div>
          </div>
        )}
      </div>
    </div>
  </header>
);
};
