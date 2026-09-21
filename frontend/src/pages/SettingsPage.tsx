import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Settings as SettingsIcon,
  Droplet,
  User,
  Shield,
  Eye,
  Lock,
  Check,
  Moon,
  Sun,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'zidio-light';

  // Account State
  const [userName, setUserName] = useState(user?.name || 'Mohit khatore');
  const [userEmail, setUserEmail] = useState(user?.email || 'khatoremohit992@gmail.com');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  // Accent Colors State
  const [selectedAccent, setSelectedAccent] = useState<string>(
    localStorage.getItem('keystone_accent') || '#5B4DCC'
  );

  const accentOptions = [
    { color: '#5B4DCC', name: 'Purple' },
    { color: '#10B981', name: 'Emerald Green' },
    { color: '#3B82F6', name: 'Vibrant Blue' },
    { color: '#F59E0B', name: 'Amber Orange' },
    { color: '#EC4899', name: 'Pink Rose' },
  ];

  const handleAccentChange = (color: string) => {
    setSelectedAccent(color);
    localStorage.setItem('keystone_accent', color);
    document.documentElement.style.setProperty('--accent-primary', color);
  };

  // Toggles State
  const [twoFactor, setTwoFactor] = useState<boolean>(
    localStorage.getItem('keystone_2fa') === 'true'
  );
  const [inAppNotifs, setInAppNotifs] = useState<boolean>(
    localStorage.getItem('keystone_inapp_notifs') !== 'false'
  );
  const [activityStatus, setActivityStatus] = useState<boolean>(
    localStorage.getItem('keystone_activity_status') !== 'false'
  );
  const [dataSharing, setDataSharing] = useState<boolean>(
    localStorage.getItem('keystone_data_sharing') === 'true'
  );

  // Password Modal / State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Save Settings Handlers
  const handleToggle2FA = () => {
    const nextVal = !twoFactor;
    setTwoFactor(nextVal);
    localStorage.setItem('keystone_2fa', String(nextVal));
    showSaveToast(nextVal ? 'Two-Factor Authentication Enabled' : 'Two-Factor Authentication Disabled');
  };

  const handleToggleNotifs = () => {
    const nextVal = !inAppNotifs;
    setInAppNotifs(nextVal);
    localStorage.setItem('keystone_inapp_notifs', String(nextVal));
    showSaveToast(nextVal ? 'In-app Notifications Turned On' : 'In-app Notifications Muted');
  };

  const handleToggleActivity = () => {
    const nextVal = !activityStatus;
    setActivityStatus(nextVal);
    localStorage.setItem('keystone_activity_status', String(nextVal));
    showSaveToast(nextVal ? 'Activity Status Visible' : 'Activity Status Hidden');
  };

  const handleToggleDataSharing = () => {
    const nextVal = !dataSharing;
    setDataSharing(nextVal);
    localStorage.setItem('keystone_data_sharing', String(nextVal));
    showSaveToast(nextVal ? 'Diagnostics Sharing Opted In' : 'Diagnostics Sharing Opted Out');
  };

  // Toast Notification State
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showSaveToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordMsg({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
    setTimeout(() => {
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMsg(null);
      showSaveToast('Password Updated Successfully');
    }, 1200);
  };

  return (
    <div
      style={{
        padding: '32px 36px',
        maxWidth: '1280px',
        margin: '0 auto',
        color: isLight ? '#0F172A' : '#F8FAFC',
      }}
    >
      {/* Toast Notification Banner */}
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
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <CheckCircle2 size={18} />
          {toastMsg}
        </div>
      )}

      {/* Settings Page Title & Subtitle */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}
          >
            <SettingsIcon size={22} color="#FFFFFF" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, letterSpacing: '-0.4px' }}>
              Settings
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748B' }}>
              Manage your account, security, and privacy.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Layout: Left Main Cards, Right Security Tip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 340px',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Side: Cards Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section 1: Appearance */}
          <div
            style={{
              background: isLight ? '#FFFFFF' : '#15192D',
              border: isLight ? '1px solid #E2E8F0' : '1px solid #1F243D',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Droplet size={20} color="#6366F1" />
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Appearance</h2>
            </div>
            <p style={{ margin: '-12px 0 20px 0', fontSize: '13px', color: '#64748B' }}>
              Personalize how your dashboard looks. Changes apply instantly and are saved to this browser.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Theme Picker */}
              <div
                style={{
                  background: isLight ? '#F8FAFC' : '#1E243D',
                  border: isLight ? '1px solid #E2E8F0' : '1px solid #2D3748',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Theme</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    Switch between a light and dark dashboard.
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: isLight ? '#E2E8F0' : '#15192D',
                    padding: '3px',
                    borderRadius: '10px',
                    gap: '4px',
                  }}
                >
                  <button
                    onClick={() => theme === 'enterprise-dark' && toggleTheme()}
                    style={{
                      background: isLight ? '#5B4DCC' : 'transparent',
                      color: isLight ? '#FFFFFF' : '#94A3B8',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease',
                      boxShadow: isLight ? '0 2px 8px rgba(91, 77, 204, 0.3)' : 'none',
                    }}
                  >
                    <Sun size={14} /> Light
                  </button>
                  <button
                    onClick={() => theme === 'zidio-light' && toggleTheme()}
                    style={{
                      background: !isLight ? '#5B4DCC' : 'transparent',
                      color: !isLight ? '#FFFFFF' : '#64748B',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease',
                      boxShadow: !isLight ? '0 2px 8px rgba(91, 77, 204, 0.3)' : 'none',
                    }}
                  >
                    <Moon size={14} /> Dark
                  </button>
                </div>
              </div>

              {/* Accent Color Picker */}
              <div
                style={{
                  background: isLight ? '#F8FAFC' : '#1E243D',
                  border: isLight ? '1px solid #E2E8F0' : '1px solid #2D3748',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Accent color</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    Used for highlights, active items, and buttons.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {accentOptions.map((opt) => (
                    <button
                      key={opt.color}
                      onClick={() => handleAccentChange(opt.color)}
                      title={opt.name}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: opt.color,
                        border: selectedAccent === opt.color ? '3px solid #6366F1' : '2px solid transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                        transition: 'transform 0.15s ease',
                        outline: 'none',
                      }}
                    >
                      {selectedAccent === opt.color && <Check size={14} color="#FFFFFF" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Account */}
          <div
            style={{
              background: isLight ? '#FFFFFF' : '#15192D',
              border: isLight ? '1px solid #E2E8F0' : '1px solid #1F243D',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <User size={20} color="#6366F1" />
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Account</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Full Name Row */}
              <div
                style={{
                  background: isLight ? '#F8FAFC' : '#1E243D',
                  border: isLight ? '1px solid #E2E8F0' : '1px solid #2D3748',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ flex: 1, marginRight: '16px' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Full Name</div>
                  {isEditingName ? (
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      style={{
                        marginTop: '4px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #6366F1',
                        fontSize: '13px',
                        width: '240px',
                        outline: 'none',
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: '13px', color: isLight ? '#334155' : '#E2E8F0', marginTop: '2px', fontWeight: 600 }}>
                      {user?.name || userName}
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                    Your displayed name across the platform.
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (isEditingName) {
                      updateUser({ name: userName });
                      setIsEditingName(false);
                      showSaveToast('Profile Name Updated');
                    } else {
                      setIsEditingName(true);
                    }
                  }}
                  style={{
                    background: isEditingName ? '#10B981' : 'transparent',
                    color: isEditingName ? '#FFFFFF' : '#6366F1',
                    border: isEditingName ? 'none' : '1px solid #6366F1',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isEditingName ? 'Save' : 'Edit'}
                </button>
              </div>

              {/* Primary Email Row */}
              <div
                style={{
                  background: isLight ? '#F8FAFC' : '#1E243D',
                  border: isLight ? '1px solid #E2E8F0' : '1px solid #2D3748',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ flex: 1, marginRight: '16px' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Primary Email</div>
                  {isEditingEmail ? (
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      style={{
                        marginTop: '4px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #6366F1',
                        fontSize: '13px',
                        width: '260px',
                        outline: 'none',
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: '13px', color: isLight ? '#334155' : '#E2E8F0', marginTop: '2px', fontWeight: 600 }}>
                      {user?.email || userEmail}
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                    Used for login, dispatch alerts, and security verification.
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (isEditingEmail) {
                      updateUser({ email: userEmail });
                      setIsEditingEmail(false);
                      showSaveToast('Primary Email Updated');
                    } else {
                      setIsEditingEmail(true);
                    }
                  }}
                  style={{
                    background: isEditingEmail ? '#10B981' : 'transparent',
                    color: isEditingEmail ? '#FFFFFF' : '#6366F1',
                    border: isEditingEmail ? 'none' : '1px solid #6366F1',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isEditingEmail ? 'Save' : 'Edit'}
                </button>
              </div>

              {/* Password Row */}
              <div
                style={{
                  background: isLight ? '#F8FAFC' : '#1E243D',
                  border: isLight ? '1px solid #E2E8F0' : '1px solid #2D3748',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Password</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    Change your password for security.
                  </div>
                </div>

                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  style={{
                    background: '#4F46E5',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Security */}
          <div
            style={{
              background: isLight ? '#FFFFFF' : '#15192D',
              border: isLight ? '1px solid #E2E8F0' : '1px solid #1F243D',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Shield size={20} color="#10B981" />
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Security</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 2FA Toggle */}
              <div
                style={{
                  background: isLight ? '#F8FAFC' : '#1E243D',
                  border: isLight ? '1px solid #E2E8F0' : '1px solid #2D3748',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Two-factor login (Email OTP)</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    Require a one-time code sent to your email when signing in.
                  </div>
                </div>

                {/* Toggle Switch */}
                <div
                  onClick={handleToggle2FA}
                  style={{
                    width: '46px',
                    height: '24px',
                    borderRadius: '12px',
                    background: twoFactor ? '#10B981' : '#CBD5E1',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      position: 'absolute',
                      top: '2px',
                      left: twoFactor ? '24px' : '2px',
                      transition: 'left 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  />
                </div>
              </div>

              {/* In-app Notifications Toggle */}
              <div
                style={{
                  background: isLight ? '#F8FAFC' : '#1E243D',
                  border: isLight ? '1px solid #E2E8F0' : '1px solid #2D3748',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>In-app notifications</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    Show notification bell and updates on the dashboard.
                  </div>
                </div>

                {/* Toggle Switch */}
                <div
                  onClick={handleToggleNotifs}
                  style={{
                    width: '46px',
                    height: '24px',
                    borderRadius: '12px',
                    background: inAppNotifs ? '#10B981' : '#CBD5E1',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      position: 'absolute',
                      top: '2px',
                      left: inAppNotifs ? '24px' : '2px',
                      transition: 'left 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Privacy & Visibility */}
          <div
            style={{
              background: isLight ? '#FFFFFF' : '#15192D',
              border: isLight ? '1px solid #E2E8F0' : '1px solid #1F243D',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Eye size={20} color="#059669" />
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Privacy & Visibility</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Activity Status Toggle */}
              <div
                style={{
                  background: isLight ? '#F8FAFC' : '#1E243D',
                  border: isLight ? '1px solid #E2E8F0' : '1px solid #2D3748',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Activity Status</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    Show when you are actively working on dispatched orders.
                  </div>
                </div>

                <div
                  onClick={handleToggleActivity}
                  style={{
                    width: '46px',
                    height: '24px',
                    borderRadius: '12px',
                    background: activityStatus ? '#10B981' : '#CBD5E1',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      position: 'absolute',
                      top: '2px',
                      left: activityStatus ? '24px' : '2px',
                      transition: 'left 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  />
                </div>
              </div>

              {/* Anonymous Data Sharing */}
              <div
                style={{
                  background: isLight ? '#F8FAFC' : '#1E243D',
                  border: isLight ? '1px solid #E2E8F0' : '1px solid #2D3748',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Diagnostic Data Sharing</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    Allow anonymous operational telemetry to improve system performance.
                  </div>
                </div>

                <div
                  onClick={handleToggleDataSharing}
                  style={{
                    width: '46px',
                    height: '24px',
                    borderRadius: '12px',
                    background: dataSharing ? '#10B981' : '#CBD5E1',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      position: 'absolute',
                      top: '2px',
                      left: dataSharing ? '24px' : '2px',
                      transition: 'left 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Security Tip Banner */}
        <div>
          <div
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)',
              borderRadius: '20px',
              padding: '28px 24px',
              color: '#FFFFFF',
              boxShadow: '0 12px 30px rgba(99, 102, 241, 0.35)',
              position: 'sticky',
              top: '84px',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <Shield size={36} color="#FFFFFF" style={{ strokeWidth: 1.8 }} />
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 800 }}>
              Security tip
            </h3>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5, opacity: 0.95 }}>
              Turn on two-factor login so that signing in also requires a code sent to your email.
            </p>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
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
              borderRadius: '16px',
              padding: '28px',
              width: '420px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Lock size={20} color="#4F46E5" />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
                Update Password
              </h3>
            </div>

            {passwordMsg && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '16px',
                  background: passwordMsg.type === 'error' ? '#FEE2E2' : '#DCFCE7',
                  color: passwordMsg.type === 'error' ? '#991B1B' : '#166534',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertCircle size={16} />
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  style={{
                    background: '#F1F5F9',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#4F46E5',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
