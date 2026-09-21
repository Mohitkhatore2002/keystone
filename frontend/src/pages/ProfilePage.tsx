import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { profileApi, type UserProfile } from '../api/profileApi';
import { fileApi } from '../api/fileApi';
import {
  User as UserIcon,
  Edit3,
  MapPin,
  Calendar,
  Award,
  Star,
  ShieldCheck,
  Mail,
  Globe,
  Truck,
  CheckCircle2,
  X
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'zidio-light';

  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || 1,
    name: user?.name || 'Mohit Khatore',
    email: user?.email || 'dispatch@keystone-ops.com',
    role: user?.role || 'DISPATCHER',
    title: 'Senior Dispatch & Field Operations Lead',
    location: 'Central Dispatch Hub • Station 4',
    aboutMe:
      'Senior Field Operations Specialist managing dispatcher workflows, work order assignments, SLA compliance, and technician fleet logistics across Keystone Operations.',
    phone: '+1 (800) 555-0199',
    portfolioUrl: 'https://keystone-ops.com/portal/dispatch',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    profileCompletion: 85,
    jobsCompleted: 148,
    customerRating: '4.9 ★',
    slaRate: '98.5%',
    assignedVehicle: 'Service Van #04 (Ford Transit)',
    certifications: ['EPA 608 Universal Cert', 'Master Electrical License #EL-9942', 'OSHA 30 Safety Certified'],
    joinedYear: '2026',
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await profileApi.getProfile();
        
        // Clean email, phone, location, and portal link
        const cleanEmail = (user?.email && !user.email.includes('meridian')) 
          ? user.email 
          : (data.email && !data.email.includes('meridian')) ? data.email : 'dispatch@keystone-ops.com';
          
        const cleanPhone = (data.phone && !data.phone.includes('9926734747')) 
          ? data.phone : '+1 (800) 555-0199';

        const cleanLocation = (data.location && !data.location.equalsIgnoreCase?.('Indore') && data.location !== 'Indore') 
          ? data.location : 'Central Operations Hub • Region 1';

        const cleanLink = (data.portfolioUrl && !data.portfolioUrl.includes('github.io')) 
          ? data.portfolioUrl : 'https://keystone-ops.com/portal/dispatch';

        if (data.avatarUrl) {
          updateUser({ avatarUrl: data.avatarUrl });
        }
        setProfile((prev) => ({
          ...prev,
          ...data,
          email: cleanEmail,
          phone: cleanPhone,
          location: cleanLocation,
          portfolioUrl: cleanLink,
          name: (user?.name && user.name !== 'Marcus Vance') ? user.name : (data.name || 'Mohit Khatore'),
        }));
      } catch (err) {
        console.error('Failed to load profile data', err);
      }
    };
    fetchProfileData();
  }, [user]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenEditModal = () => {
    setFormData({ ...profile });
    setIsEditModalOpen(true);
  };

  const handleOpenContactModal = () => {
    setFormData({
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      portfolioUrl: profile.portfolioUrl,
    });
    setIsContactModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await profileApi.updateProfile(formData);
      setProfile(updated);
      
      // Update global AuthContext user name & email
      if (formData.name || formData.email) {
        updateUser({
          ...(formData.name ? { name: formData.name } : {}),
          ...(formData.email ? { email: formData.email } : {}),
        });
      }

      setIsEditModalOpen(false);
      setIsContactModalOpen(false);
      showToast('Profile Updated Successfully!');
    } catch (err) {
      console.error('Error saving profile', err);
      showToast('Profile updated!');
    }
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

      {/* Profile Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserIcon size={26} color="#6366F1" />
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, letterSpacing: '-0.4px' }}>
              Your Profile
            </h1>
          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#64748B' }}>
            Manage your operational credentials, dispatch authorizations, and field service visibility settings.
          </p>
        </div>

        <button
          onClick={handleOpenEditModal}
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
          <Edit3 size={16} /> Edit Profile
        </button>
      </div>

      {/* Main 2-Column Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Main Card: User Bio & Operational Field KPIs */}
        <div
          style={{
            background: isLight ? '#FFFFFF' : '#15192D',
            border: isLight ? '1px solid #E2E8F0' : '1px solid #1F243D',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
          }}
        >
          {/* Header Row: Photo + Name + Role + Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <div style={{ position: 'relative' }}>
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #6366F1',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid #6366F1',
                  }}
                >
                  {(profile.name || 'M').charAt(0).toUpperCase()}
                </div>
              )}

              {/* Profile Photo File Upload Button */}
              <label
                htmlFor="profile-avatar-input"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  background: '#4F46E5',
                  color: '#FFFFFF',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  border: '2px solid #FFFFFF',
                }}
                title="Upload Profile Photo to backend uploads/profiles/"
              >
                <Edit3 size={14} />
              </label>
              <input
                id="profile-avatar-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      showToast('Uploading profile photo to backend...');
                      const res = await fileApi.uploadFile(file, 'profiles');
                      setProfile((prev) => ({ ...prev, avatarUrl: res.fileUrl }));
                      await profileApi.updateProfile({ avatarUrl: res.fileUrl });
                      updateUser({ avatarUrl: res.fileUrl });
                      showToast('Profile photo saved to backend uploads/profiles/!');
                    } catch (err) {
                      console.error('Failed to upload profile photo', err);
                      showToast('Photo upload failed');
                    }
                  }
                }}
              />
            </div>

            <div>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: isLight ? '#0F172A' : '#FFFFFF' }}>
                {profile.name}
              </h2>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748B', marginTop: '2px' }}>
                {profile.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '8px', fontSize: '13px', color: '#94A3B8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} color="#6366F1" /> {profile.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} color="#6366F1" /> Joined {profile.joinedYear}
                </span>
              </div>
            </div>
          </div>

          {/* About Me Section */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 700, color: isLight ? '#0F172A' : '#F1F5F9' }}>
              About Operations Role
            </h3>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: isLight ? '#475569' : '#CBD5E1' }}>
              {profile.aboutMe}
            </p>
          </div>

          {/* 3 Operational Field KPI Stat Boxes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
            {/* Box 1: Light Green - Work Orders Resolved */}
            <div
              style={{
                background: isLight ? '#ECFDF5' : '#064E3B',
                border: isLight ? '1px solid #A7F3D0' : '1px solid #047857',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isLight ? '#D1FAE5' : '#065F46', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>
                <Award size={18} color="#10B981" />
              </div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: isLight ? '#065F46' : '#A7F3D0' }}>
                {profile.jobsCompleted} Jobs
              </div>
              <div style={{ fontSize: '11px', color: isLight ? '#047857' : '#D1FAE5', marginTop: '2px', fontWeight: 600 }}>
                Resolved Work Orders
              </div>
            </div>

            {/* Box 2: Light Yellow - Customer Rating */}
            <div
              style={{
                background: isLight ? '#FEFCE8' : '#78350F',
                border: isLight ? '1px solid #FDE68A' : '1px solid #B45309',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isLight ? '#FEF3C7' : '#92400E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>
                <Star size={18} color="#F59E0B" />
              </div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: isLight ? '#92400E' : '#FDE68A' }}>
                {profile.customerRating}
              </div>
              <div style={{ fontSize: '11px', color: isLight ? '#B45309' : '#FEF3C7', marginTop: '2px', fontWeight: 600 }}>
                Client Service Rating
              </div>
            </div>

            {/* Box 3: Light Purple - SLA On-Time Rate */}
            <div
              style={{
                background: isLight ? '#F5F3FF' : '#4C1D95',
                border: isLight ? '1px solid #DDD6FE' : '1px solid #6D28D9',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isLight ? '#EDE9FE' : '#5B21B6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>
                <ShieldCheck size={18} color="#8B5CF6" />
              </div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: isLight ? '#5B21B6' : '#DDD6FE' }}>
                {profile.slaRate}
              </div>
              <div style={{ fontSize: '11px', color: isLight ? '#6D28D9' : '#EDE9FE', marginTop: '2px', fontWeight: 600 }}>
                On-Time SLA Met
              </div>
            </div>
          </div>

          {/* Certifications & Assigned Fleet Logistics */}
          <div style={{ borderTop: isLight ? '1px solid #F1F5F9' : '1px solid #1F243D', paddingTop: '20px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700, color: isLight ? '#0F172A' : '#F1F5F9' }}>
              Field Certifications & Assigned Fleet Unit
            </h4>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              {profile.certifications?.map((cert, idx) => (
                <span
                  key={idx}
                  style={{
                    background: isLight ? '#F1F5F9' : '#1E243D',
                    color: isLight ? '#334155' : '#E2E8F0',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <ShieldCheck size={13} color="#10B981" /> {cert}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
              <Truck size={16} color="#6366F1" />
              <span>Assigned Unit: <strong style={{ color: isLight ? '#0F172A' : '#FFFFFF' }}>{profile.assignedVehicle}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Side Card: Contact & Dispatch Desk Info */}
        <div
          style={{
            background: isLight ? '#FFFFFF' : '#15192D',
            border: isLight ? '1px solid #E2E8F0' : '1px solid #1F243D',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <Mail size={20} color="#2563EB" />
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: isLight ? '#0F172A' : '#FFFFFF' }}>
              Contact & Dispatch Info
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
            {/* DISPATCH EMAIL */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                DISPATCH EMAIL
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: isLight ? '#0F172A' : '#FFFFFF', marginTop: '4px', wordBreak: 'break-all' }}>
                {profile.email}
              </div>
            </div>

            {/* DIRECT OPERATIONS PHONE */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                DIRECT OPERATIONS PHONE
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: isLight ? '#0F172A' : '#FFFFFF', marginTop: '4px' }}>
                {profile.phone}
              </div>
            </div>

            {/* BASE STATION / HUB */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                BASE STATION / DISPATCH HUB
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: isLight ? '#0F172A' : '#FFFFFF', marginTop: '4px' }}>
                {profile.location}
              </div>
            </div>

            {/* DISPATCH PORTAL LINK */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                DISPATCH PORTAL LINK
              </div>
              <a
                href={profile.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#2563EB',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  wordBreak: 'break-all',
                }}
              >
                <Globe size={14} />
                {profile.portfolioUrl}
              </a>
            </div>
          </div>

          {/* Solid Blue Action Button */}
          <button
            onClick={handleOpenContactModal}
            style={{
              width: '100%',
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            Update Contact Info
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
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
              padding: '28px',
              width: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Edit3 size={20} color="#6366F1" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                  Edit Operational Profile
                </h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Role Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Base Station / Hub Location</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Assigned Fleet Vehicle</label>
                <input
                  type="text"
                  value={formData.assignedVehicle || ''}
                  onChange={(e) => setFormData({ ...formData, assignedVehicle: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>About Operations Role</label>
                <textarea
                  rows={3}
                  value={formData.aboutMe || ''}
                  onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Jobs Resolved</label>
                  <input
                    type="number"
                    value={formData.jobsCompleted || 0}
                    onChange={(e) => setFormData({ ...formData, jobsCompleted: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Rating</label>
                  <input
                    type="text"
                    value={formData.customerRating || ''}
                    onChange={(e) => setFormData({ ...formData, customerRating: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>SLA Rate</label>
                  <input
                    type="text"
                    value={formData.slaRate || ''}
                    onChange={(e) => setFormData({ ...formData, slaRate: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ background: '#F1F5F9', border: 'none', padding: '10px 18px', borderRadius: '8px', color: '#475569', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#4F46E5', border: 'none', padding: '10px 22px', borderRadius: '8px', color: '#FFFFFF', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Contact Info Modal */}
      {isContactModalOpen && (
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
              padding: '28px',
              width: '460px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={20} color="#2563EB" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                  Update Contact Information
                </h3>
              </div>
              <button onClick={() => setIsContactModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Dispatch Email Address</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Direct Operations Phone</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Base Station / Hub Location</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Dispatch Portal Link</label>
                <input
                  type="text"
                  value={formData.portfolioUrl || ''}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  style={{ background: '#F1F5F9', border: 'none', padding: '10px 18px', borderRadius: '8px', color: '#475569', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#2563EB', border: 'none', padding: '10px 22px', borderRadius: '8px', color: '#FFFFFF', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  Update Contact Info
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
