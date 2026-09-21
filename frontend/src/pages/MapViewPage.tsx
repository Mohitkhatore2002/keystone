import React, { useState } from 'react';
import { Navigation } from 'lucide-react';

interface TechMapStatus {
  id: number;
  name: string;
  email: string;
  status: 'Available' | 'En Route' | 'On Site' | 'Urgent';
  location: string;
  activeWoCode?: string;
  distance: string;
  battery: string;
  lat: number;
  lng: number;
}

export const MapViewPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const mockTechPositions: TechMapStatus[] = [
    { id: 3, name: 'John Gallagher', email: 'tech.john@meridian.com', status: 'En Route', location: '100 Innovation Way', activeWoCode: 'WO-2026-101', distance: '2.4 miles', battery: '92%', lat: 41.8781, lng: -87.6298 },
    { id: 4, name: 'Sarah Jenkins', email: 'tech.sarah@meridian.com', status: 'On Site', location: '450 Industrial Pkwy', activeWoCode: 'WO-2026-102', distance: '0.1 miles', battery: '85%', lat: 41.8850, lng: -87.6320 },
    { id: 10, name: 'Marcus Cole', email: 'tech.marcus@meridian.com', status: 'Urgent', location: '880 Metro Blvd', activeWoCode: 'WO-2026-104', distance: '5.8 miles', battery: '64%', lat: 41.8650, lng: -87.6150 },
    { id: 11, name: 'Carlos Ortiz', email: 'tech.carlos@meridian.com', status: 'Available', location: 'Meridian Depot Central', distance: '0.0 miles', battery: '98%', lat: 41.8900, lng: -87.6400 },
  ];

  const filteredTechs = mockTechPositions.filter((t) => selectedFilter === 'ALL' || t.status === selectedFilter);

  return (
    <>
      <div className="page-body" style={{ background: '#F8FAFC', padding: '24px 32px' }}>
        {/* Title & Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Live Fleet GIS & Route Tracker
            </h1>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0' }}>
              Real-time vehicle telemetry, GPS coordinates, and active client job site pins
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', background: '#FFFFFF', padding: '4px', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
            {['ALL', 'Available', 'En Route', 'On Site', 'Urgent'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedFilter(f)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: selectedFilter === f ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedFilter === f ? '#0F172A' : 'transparent',
                  color: selectedFilter === f ? '#FFFFFF' : '#475569',
                }}
              >
                {f === 'ALL' ? 'All Vehicles' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Split Screen: Map (70%) + Roster Sidebar (30%) */}
        <div style={{ display: 'grid', gridTemplateColumns: '70% 30%', gap: '20px' }}>
          {/* MAP CANVAS */}
          <div className="card" style={{ padding: '0', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0', height: '620px', position: 'relative' }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                background: '#0B0F19',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Grid Background Pattern */}
              <svg width="100%" height="100%" style={{ opacity: 0.2 }}>
                <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="0.8" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#mapGrid)" />
                <path d="M 50 150 Q 250 80 450 320 T 750 180" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray="6 6" />
              </svg>

              {/* Vector Map Pins for Technicians */}
              {filteredTechs.map((t, idx) => {
                const color = t.status === 'Available' ? '#22C55E' : t.status === 'En Route' ? '#3B82F6' : t.status === 'On Site' ? '#9333EA' : '#EF4444';
                return (
                  <div
                    key={t.id}
                    style={{
                      position: 'absolute',
                      top: `${25 + idx * 18}%`,
                      left: `${20 + idx * 22}%`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ background: color, padding: '8px', borderRadius: '50%', boxShadow: `0 0 16px ${color}` }}>
                      <Navigation size={16} color="#FFFFFF" />
                    </div>
                    <div style={{ background: '#FFFFFF', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 700, color: '#0F172A', marginTop: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                      {t.name.split(' ')[0]} ({t.status})
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Controls Floating Badge */}
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: '#FFFFFF', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#0F172A', border: '1px solid #CBD5E1' }}>
              🟢 Live Telemetry Stream · 4 Vehicles Tracked
            </div>
          </div>

          {/* ROSTER SIDEBAR */}
          <div className="card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', height: '620px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Vehicle Fleet Status</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredTechs.map((tech) => (
                <div
                  key={tech.id}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>{tech.name}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: tech.status === 'Available' ? '#DCFCE7' : tech.status === 'En Route' ? '#E0F2FE' : '#FEE2E2',
                        color: tech.status === 'Available' ? '#15803D' : tech.status === 'En Route' ? '#0369A1' : '#B91C1C',
                      }}
                    >
                      {tech.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>
                    📍 {tech.location}
                  </div>

                  {tech.activeWoCode && (
                    <div style={{ fontSize: '12px', background: '#F1F5F9', padding: '4px 8px', borderRadius: '6px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                      Job: {tech.activeWoCode}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8' }}>
                    <span>Distance: {tech.distance}</span>
                    <span>Battery: {tech.battery}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
