import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import type { UserRole } from '../types/workOrder';
import {
  ShieldCheck,
  Wrench,
  Kanban,
  LayoutDashboard,
  UserCheck,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState<UserRole>('TECHNICIAN');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your entries.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    setLoading(true);

    try {
      let defaultTitle = 'Operations Lead';
      if (role === 'TECHNICIAN') defaultTitle = 'Certified Field Service Engineer';
      else if (role === 'DISPATCHER') defaultTitle = 'Senior Dispatch Controller';
      else if (role === 'MANAGER') defaultTitle = 'Fleet Operations Director';
      else if (role === 'CUSTOMER') defaultTitle = 'Facility & Site Operations Lead';

      try {
        const res = await authApi.register({
          name,
          email,
          password,
          role,
          title: defaultTitle,
          phone: phone || '+1 (800) 555-0199',
          location: location || 'Central Operations Hub',
        });
        login(res.token, res.user);
      } catch {
        // Offline / Vercel Cloud Preview registration fallback
        const mockUser = {
          id: Date.now(),
          name: name || 'Registered User',
          email: email || 'user@keystone-ops.com',
          role: role,
        };
        login('demo_registered_jwt_token', mockUser);
      }

      // Redirect user to their corresponding role home dashboard
      if (role === 'MANAGER') navigate('/dashboard');
      else if (role === 'DISPATCHER') navigate('/board');
      else if (role === 'TECHNICIAN') navigate('/my-jobs');
      else if (role === 'CUSTOMER') navigate('/portal');
    } finally {
      setLoading(false);
    }
  };

  const roleCards = [
    {
      id: 'TECHNICIAN',
      title: 'Technician',
      desc: 'Field Mobile Execution, Subtask Checklists & Signature Capture',
      icon: Wrench,
      color: '#10B981',
      bg: '#ECFDF5',
    },
    {
      id: 'DISPATCHER',
      title: 'Dispatcher',
      desc: 'AI Smart Dispatch, Scheduling Command Center & Fleet Routing',
      icon: Kanban,
      color: '#F59E0B',
      bg: '#FEF3C7',
    },
    {
      id: 'MANAGER',
      title: 'Manager',
      desc: 'Executive SLA Dashboards, Inventory & Financial Analytics',
      icon: LayoutDashboard,
      color: '#6366F1',
      bg: '#EEF2FF',
    },
    {
      id: 'CUSTOMER',
      title: 'Customer',
      desc: 'Facility Portal, SLA Work Order Requests & Uber-Style Map',
      icon: UserCheck,
      color: '#3B82F6',
      bg: '#EFF6FF',
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Brand Hero Panel */}
      <div
        style={{
          flex: '1',
          background: 'linear-gradient(135deg, #0F0E2C 0%, #1A194B 100%)',
          color: '#FFFFFF',
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: '#6366F1', padding: '10px', borderRadius: '12px' }}>
            <ShieldCheck size={32} color="#FFFFFF" />
          </div>
          <div>
            <h1 style={{ color: '#FFFFFF', fontSize: '28px', letterSpacing: '1px', margin: 0, fontWeight: 800 }}>KEYSTONE</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: '2px 0 0' }}>Field Service Management Platform</p>
          </div>
        </div>

        <div>
          <span style={{ background: 'rgba(99, 102, 241, 0.25)', border: '1px solid #6366F1', color: '#A5B4FC', fontSize: '11px', fontWeight: 800, padding: '4px 12px', borderRadius: '12px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Instant Onboarding
          </span>
          <h2 style={{ color: '#FFFFFF', fontSize: '32px', marginTop: '14px', marginBottom: '16px', fontWeight: 800, lineHeight: 1.2 }}>
            Register Your Account on Keystone Operations Hub
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', maxWidth: '520px', lineHeight: '1.6' }}>
            Join our enterprise fleet management platform. Register as a Dispatcher, Field Engineer, Manager, or Client Organization to access live operational tools.
          </p>
        </div>

        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
          © 2026 Meridian Facilities Management · Zidio Full-Stack Internship Build
        </div>
      </div>

      {/* Registration Form Panel */}
      <div style={{ flex: '1.2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '540px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Create New Account</h2>
            <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>
              Select your operational role and set up your security credentials
            </p>
          </div>

          {error && (
            <div style={{ background: '#FDF2F2', border: '1px solid #E84D49', color: '#E84D49', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Role Picker Label */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                1. Select Operational Role
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {roleCards.map((rc) => {
                  const isSelected = role === rc.id;
                  const Icon = rc.icon;
                  return (
                    <div
                      key={rc.id}
                      onClick={() => setRole(rc.id as UserRole)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: isSelected ? `2px solid ${rc.color}` : '1px solid #CBD5E1',
                        background: isSelected ? rc.bg : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? `0 4px 12px ${rc.color}25` : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Icon size={16} color={rc.color} />
                          <span style={{ fontWeight: 800, fontSize: '14px', color: '#0F172A' }}>{rc.title}</span>
                        </div>
                        {isSelected && <CheckCircle2 size={16} color={rc.color} />}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.3 }}>{rc.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Personal & Security Details */}
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              2. Account & Security Information
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mohit Khatore"
                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Phone Number (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (800) 555-0199"
                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Base Hub / Location</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Station 4 Hub"
                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading ? 'Creating Account...' : <>Complete Registration & Enter Platform <ArrowRight size={18} /></>}
            </button>
          </form>

          {/* Already have an account navigation */}
          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E2E8F0', fontSize: '14px', color: '#64748B' }}>
            Already have an operational account?{' '}
            <Link to="/login" style={{ color: '#4F46E5', fontWeight: 800, textDecoration: 'none' }}>
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
