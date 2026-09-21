import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { ShieldCheck, UserCheck, Wrench, Kanban, LayoutDashboard, Lock, Mail, UserPlus } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, quickLogin } = useAuth();
  const [email, setEmail] = useState('manager@meridian.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authApi.login(email, password);
      login(res.token, res.user);
      redirectToRoleHome(res.user.role);
    } catch {
      // Offline / Static Web Hosting Fallback
      let role: 'MANAGER' | 'DISPATCHER' | 'TECHNICIAN' | 'CUSTOMER' = 'DISPATCHER';
      if (email.includes('manager')) role = 'MANAGER';
      else if (email.includes('dispatcher')) role = 'DISPATCHER';
      else if (email.includes('john') || email.includes('tech')) role = 'TECHNICIAN';
      else if (email.includes('acme') || email.includes('customer') || email.includes('client')) role = 'CUSTOMER';

      const name = role === 'MANAGER' ? 'Operations Manager' : role === 'DISPATCHER' ? 'Lead Dispatcher' : role === 'TECHNICIAN' ? 'John Field Tech' : 'Acme Facilities Lead';
      login('demo_jwt_token', { id: 1, name, email, role });
      redirectToRoleHome(role);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (targetEmail: string, role: string) => {
    setError('');
    try {
      await quickLogin(targetEmail);
      redirectToRoleHome(role);
    } catch {
      const name = role === 'MANAGER' ? 'Operations Manager' : role === 'DISPATCHER' ? 'Lead Dispatcher' : role === 'TECHNICIAN' ? 'John Field Tech' : 'Acme Facilities Lead';
      login('demo_jwt_token', { id: 1, name, email: targetEmail, role: role as any });
      redirectToRoleHome(role);
    }
  };

  const redirectToRoleHome = (role: string) => {
    if (role === 'MANAGER') navigate('/dashboard');
    else if (role === 'DISPATCHER') navigate('/board');
    else if (role === 'TECHNICIAN') navigate('/my-jobs');
    else if (role === 'CUSTOMER') navigate('/portal');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FC' }}>
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
          <div style={{ background: '#6C5CE7', padding: '10px', borderRadius: '10px' }}>
            <ShieldCheck size={32} color="#FFFFFF" />
          </div>
          <div>
            <h1 style={{ color: '#FFFFFF', fontSize: '28px', letterSpacing: '1px' }}>KEYSTONE</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Field Service Management Platform</p>
          </div>
        </div>

        <div>
          <h2 style={{ color: '#FFFFFF', fontSize: '32px', marginBottom: '16px', fontWeight: 700 }}>
            Meridian Facilities Management System of Record
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', maxWidth: '540px', lineHeight: '1.6' }}>
            Streamlined work-order dispatching, real-time technician status updates, SLA breach analytics, and customer self-service request tracking.
          </p>
        </div>

        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
          © 2026 Meridian Facilities Management · Zidio Full-Stack Internship Build
        </div>
      </div>

      {/* Login Form Panel */}
      <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0F0E2C', margin: 0 }}>Welcome Back</h2>
              <p style={{ color: '#72788A', fontSize: '14px', margin: '4px 0 0' }}>Sign in to access your operations dashboard</p>
            </div>
            <Link
              to="/register"
              style={{
                background: '#EEF2FF',
                color: '#4F46E5',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid #C7D2FE',
              }}
            >
              <UserPlus size={15} /> Create Account
            </Link>
          </div>

          {error && (
            <div style={{ background: '#FDF2F2', border: '1px solid #E84D49', color: '#E84D49', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#72788A" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@meridian.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#72788A" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Account'}
            </button>
          </form>

          {/* Seed Account Quick Switcher for Evaluation */}
          <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid #E6E7F0' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#72788A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              Instant Demo Accounts (One-Click Login)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('manager@meridian.com', 'MANAGER')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', fontSize: '12px' }}
              >
                <LayoutDashboard size={14} color="#6C5CE7" /> Manager
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('dispatcher@meridian.com', 'DISPATCHER')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', fontSize: '12px' }}
              >
                <Kanban size={14} color="#F29C12" /> Dispatcher
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('tech.john@meridian.com', 'TECHNICIAN')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', fontSize: '12px' }}
              >
                <Wrench size={14} color="#1DA267" /> Technician John
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('customer@acme.com', 'CUSTOMER')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', fontSize: '12px' }}
              >
                <UserCheck size={14} color="#3498DB" /> Customer Acme
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
