import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  Map,
  Users,
  Building2,
  Package,
  BarChart3,
  Settings as SettingsIcon,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const isLight = theme === 'zidio-light';

  // Keystone Project Navigation Routes
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Work Orders', icon: ClipboardList, path: '/work-orders' },
    { name: 'Field Touch Tools', icon: Sparkles, path: '/my-jobs' },
    { name: 'Customer Tracking', icon: Building2, path: '/portal' },
    { name: 'Scheduling', icon: Calendar, path: '/scheduling' },
    { name: 'Map View', icon: Map, path: '/map' },
    { name: 'Technicians', icon: Users, path: '/technicians' },
    { name: 'Customers & Sites', icon: Building2, path: '/customers' },
    { name: 'Inventory', icon: Package, path: '/inventory' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Profile', icon: UserIcon, path: '/profile' },
    { name: 'Settings', icon: SettingsIcon, path: '/settings' },
  ];

  return (
    <aside
      className="sidebar"
      style={{
        width: collapsed ? '76px' : '250px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: isLight ? '#FFFFFF' : '#0F0E2C',
        borderRight: isLight ? '1px solid #E6E7F0' : '1px solid #1E243D',
        padding: '18px 16px',
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      <div>
        {/* Brand Header & Logo at Top of Sidebar */}
        <div style={{ marginBottom: '24px', paddingLeft: collapsed ? '2px' : '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
                flexShrink: 0,
              }}
            >
              <Sparkles size={20} color="#FFFFFF" />
            </div>

            {!collapsed && (
              <div>
                <div style={{ fontWeight: 800, fontSize: '17px', color: isLight ? '#0F172A' : '#FFFFFF', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
                  KEYSTONE
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', fontWeight: 500 }}>
                  Operations Hub
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items List */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={true}
                style={({ isActive }) => {
                  if (isLight) {
                    return {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      borderRadius: '12px',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '14px',
                      textDecoration: 'none',
                      padding: collapsed ? '12px' : '10px 16px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      background: isActive ? 'linear-gradient(135deg, #5B4DCC, #4F46E5)' : 'transparent',
                      color: isActive ? '#FFFFFF' : '#475569',
                      boxShadow: isActive ? '0 4px 14px rgba(91, 77, 204, 0.35)' : 'none',
                      transition: 'all 0.15s ease',
                    };
                  } else {
                    return {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      borderRadius: '10px',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '14px',
                      textDecoration: 'none',
                      padding: collapsed ? '12px' : '10px 14px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      background: isActive ? '#1F243D' : 'transparent',
                      color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.65)',
                      borderLeft: isActive ? '3px solid #6366F1' : '3px solid transparent',
                    };
                  }
                }}
                title={collapsed ? item.name : undefined}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} color={isActive ? '#FFFFFF' : isLight ? '#64748B' : '#94A3B8'} />
                    {!collapsed && <span>{item.name}</span>}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls: Theme Switcher, Collapse & Logout */}
      <div style={{ paddingTop: '12px', borderTop: isLight ? '1px solid #F1F5F9' : '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Theme Switcher Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          style={{
            background: isLight ? '#F8FAFC' : '#1E243D',
            border: isLight ? '1px solid #E2E8F0' : '1px solid #2D3748',
            color: isLight ? '#475569' : '#E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            width: '100%',
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'all 0.15s ease',
          }}
          title={collapsed ? (isLight ? 'Switch to Dark' : 'Switch to Light') : undefined}
        >
          {isLight ? <Moon size={16} color="#6366F1" /> : <Sun size={16} color="#F59E0B" />}
          {!collapsed && <span>{isLight ? 'Enterprise Dark' : 'Zidio Light'}</span>}
        </button>

        {/* Collapse Sidebar Button */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'transparent',
            border: 'none',
            color: isLight ? '#64748B' : 'rgba(255,255,255,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            padding: '8px 12px',
            fontSize: '13px',
            width: '100%',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>Collapse Sidebar</span>}
        </button>

        {/* Logout Button */}
        <button
          type="button"
          onClick={logout}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            padding: '8px 12px',
            fontSize: '13px',
            width: '100%',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
