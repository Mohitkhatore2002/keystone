import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Kanban,
  Calendar,
  MessageSquare,
  PhoneCall,
  Inbox,
  Video,
  FileText,
  Palette,
  BookOpen,
  ClipboardList,
  Clock,
  Zap,
  Grid,
  Settings,
  Eye,
  GitCommit,
  CheckSquare,
  Users,
  Repeat,
  Sparkles
} from 'lucide-react';

export const PlatformSuiteHub: React.FC = () => {
  const navigate = useNavigate();

  // App Features Suite (Matching Image 1)
  const appFeatures = [
    {
      name: 'Dashboards',
      subtitle: 'Visualize your data',
      icon: BarChart3,
      bg: '#E11D48',
      color: '#FFFFFF',
      path: '/dashboard',
    },
    {
      name: 'Board view',
      subtitle: 'Kanban-style workflow',
      icon: Kanban,
      bg: '#2563EB',
      color: '#FFFFFF',
      path: '/board',
    },
    {
      name: 'Gantt',
      subtitle: 'Timeline and dependencies',
      icon: Calendar,
      bg: '#EF4444',
      color: '#FFFFFF',
      path: '/scheduling',
    },
    {
      name: 'Chat',
      subtitle: 'Real-time team messaging',
      icon: MessageSquare,
      bg: '#6366F1',
      color: '#FFFFFF',
      path: '/settings',
    },
    {
      name: 'SyncUp',
      subtitle: 'Video meetings & huddles',
      icon: PhoneCall,
      bg: '#0D9488',
      color: '#FFFFFF',
      path: '/map',
    },
    {
      name: 'Inbox',
      subtitle: 'Centralize notifications',
      icon: Inbox,
      bg: '#EA580C',
      color: '#FFFFFF',
      path: '/profile',
    },
    {
      name: 'Clips',
      subtitle: 'Screen & photo evidence',
      icon: Video,
      bg: '#E11D48',
      color: '#FFFFFF',
      path: '/my-jobs',
    },
    {
      name: 'Docs',
      subtitle: 'Collaborative documentation',
      icon: FileText,
      bg: '#0284C7',
      color: '#FFFFFF',
      path: '/customers',
    },
    {
      name: 'Whiteboards',
      subtitle: 'Visual collaboration',
      icon: Palette,
      bg: '#EAB308',
      color: '#FFFFFF',
      path: '/analytics',
    },
    {
      name: 'Wiki',
      subtitle: 'Knowledge base',
      icon: BookOpen,
      bg: '#9333EA',
      color: '#FFFFFF',
      path: '/customers',
    },
    {
      name: 'Forms',
      subtitle: 'Collect information',
      icon: ClipboardList,
      bg: '#4F46E5',
      color: '#FFFFFF',
      path: '/portal',
    },
    {
      name: 'Calendar',
      subtitle: 'Schedule and manage time',
      icon: Calendar,
      bg: '#EC4899',
      color: '#FFFFFF',
      path: '/scheduling',
    },
    {
      name: 'Scheduling',
      subtitle: 'Automate calendar booking',
      icon: Calendar,
      bg: '#F97316',
      color: '#FFFFFF',
      path: '/scheduling',
    },
    {
      name: 'Automations',
      subtitle: 'Workflow automation',
      icon: Zap,
      bg: '#6D28D9',
      color: '#FFFFFF',
      path: '/settings',
    },
    {
      name: 'Time tracking',
      subtitle: 'Monitor time spent',
      icon: Clock,
      bg: '#00B894',
      color: '#FFFFFF',
      path: '/my-jobs',
    },
    {
      name: 'All features',
      subtitle: 'Explore everything',
      icon: Grid,
      bg: '#64748B',
      color: '#FFFFFF',
      path: '/work-orders',
    },
  ];

  // Platform Capabilities Grid (Matching Image 2)
  const capabilities = [
    {
      title: 'Custom fields',
      subtitle:
        'Add dropdowns, priorities, dates, budgets, regions, deal sizes, anything your workflow needs',
      icon: Settings,
      iconBg: '#F5F3FF',
      iconColor: '#6366F1',
    },
    {
      title: 'Multiple views',
      subtitle:
        'See your work as Lists, Boards, Calendars, Timelines, or Gantt charts',
      icon: Eye,
      iconBg: '#F5F3FF',
      iconColor: '#6366F1',
    },
    {
      title: 'Automations',
      subtitle:
        'Trigger status changes, assignments, and notifications automatically when conditions are met.',
      icon: Zap,
      iconBg: '#F5F3FF',
      iconColor: '#6366F1',
    },
    {
      title: 'Dependencies',
      subtitle: 'Map blockers and get alerts when work stalls',
      icon: GitCommit,
      iconBg: '#F5F3FF',
      iconColor: '#6366F1',
    },
    {
      title: 'Subtasks & Checklists',
      subtitle: 'Break big work into trackable, manageable pieces',
      icon: CheckSquare,
      iconBg: '#F5F3FF',
      iconColor: '#6366F1',
    },
    {
      title: 'Multiple Assignees',
      subtitle: 'Assign tasks to multiple people at once',
      icon: Users,
      iconBg: '#F5F3FF',
      iconColor: '#6366F1',
    },
    {
      title: 'Recurring Tasks',
      subtitle: 'Set once, recreates automatically on your schedule',
      icon: Repeat,
      iconBg: '#F5F3FF',
      iconColor: '#6366F1',
    },
    {
      title: 'Comments & Clips',
      subtitle: 'Discuss work in context with mentions and clips',
      icon: MessageSquare,
      iconBg: '#F5F3FF',
      iconColor: '#6366F1',
    },
    {
      title: 'Time Tracking',
      subtitle: 'Track time spent with timers and estimates',
      icon: Clock,
      iconBg: '#F5F3FF',
      iconColor: '#6366F1',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '32px' }}>
      {/* SECTION 1: APP FEATURES SUITE (IMAGE 1 STYLING) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          padding: '32px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={22} color="#6366F1" />
              KEYSTONE Platform Features Suite
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
              One unified workspace for work orders, scheduling, dispatch, team collaboration, and field service management
            </p>
          </div>
          <span style={{ background: '#EEF2FF', color: '#4F46E5', fontSize: '11px', fontWeight: 800, padding: '4px 12px', borderRadius: '12px', letterSpacing: '0.5px' }}>
            16 CORE MODULES
          </span>
        </div>

        {/* 4x4 Grid matching Image 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {appFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: '#FFFFFF',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(15, 23, 42, 0.08)';
                  e.currentTarget.style.background = '#F8FAFC';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = '#FFFFFF';
                }}
              >
                {/* Rounded Vibrant Icon Badge */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: item.bg,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: `0 4px 12px ${item.bg}40`,
                  }}
                >
                  <Icon size={20} />
                </div>

                <div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#0F172A', lineHeight: 1.2 }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', lineHeight: 1.3 }}>
                    {item.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: PLATFORM CAPABILITIES GRID (IMAGE 2 STYLING) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          padding: '32px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Enterprise Capabilities & Workflow Control
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
            Built-in operational utilities for custom fields, automated status transitions, and multi-assignee tracking
          </p>
        </div>

        {/* 3x3 Grid matching Image 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px 24px' }}>
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: cap.iconBg,
                    border: '1px solid #DDD6FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={22} color={cap.iconColor} />
                </div>

                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                    {cap.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                    {cap.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
