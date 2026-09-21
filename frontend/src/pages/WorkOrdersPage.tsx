import React, { useEffect, useState } from 'react';
import type { WorkOrder, WorkOrderStatus, WorkOrderPriority } from '../types/workOrder';
import { workOrderApi } from '../api/workOrderApi';
import { StatusChip } from '../components/common/StatusChip';
import { WorkOrderDetailsModal } from '../components/modals/WorkOrderDetailsModal';
import { CreateWorkOrderModal } from '../components/modals/CreateWorkOrderModal';
import { AssignTechnicianModal } from '../components/modals/AssignTechnicianModal';
import {
  Plus,
  Search,
  Filter,
  UserPlus,
  Eye,
  ChevronDown,
  ChevronRight,
  LayoutList,
  Kanban,
  Table as TableIcon,
  Calendar as CalendarIcon,
  BarChart2,
  Flag,
  Clock,
  Building,
  MapPin,
  ShieldAlert,
  User,
  Layers,
  CheckCircle2
} from 'lucide-react';

type ViewMode = 'list' | 'board' | 'table' | 'calendar' | 'gantt';

interface SubtaskItem {
  id: string;
  title: string;
  completed: boolean;
}

export const WorkOrdersPage: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [groupBy, setGroupBy] = useState<'status' | 'priority'>('status');

  // Interactive Collapsible status sections
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [activeStatusDropdownId, setActiveStatusDropdownId] = useState<number | null>(null);

  // Subtasks State (ClickUp Checklist feature)
  const [subtasks, setSubtasks] = useState<Record<number, SubtaskItem[]>>({
    1: [
      { id: 'st1', title: 'Verify power supply voltage to main chiller compressor', completed: true },
      { id: 'st2', title: 'Inspect thermal overload relays & circuit breakers', completed: true },
      { id: 'st3', title: 'Perform load test run & capture refrigerant psi', completed: false },
    ],
    2: [
      { id: 'st4', title: 'Isolate sub-panel breaker box before inspection', completed: true },
      { id: 'st5', title: 'Tighten loose busbar connections & check thermal imaging', completed: false },
    ],
    3: [
      { id: 'st6', title: 'Replace MERV-13 air filter cartridges in HVAC unit 4', completed: false },
      { id: 'st7', title: 'Sanitize intake coils & clean condensate drain line', completed: false },
    ],
  });

  const [selectedWo, setSelectedWo] = useState<WorkOrder | null>(null);
  const [assignWo, setAssignWo] = useState<WorkOrder | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchWorkOrders = async () => {
    setLoading(true);
    try {
      const data = await workOrderApi.getAllList();
      setWorkOrders(data);
    } catch (e) {
      console.error('Failed to fetch work orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const handleStatusTransition = async (woId: number, toStatus: WorkOrderStatus) => {
    try {
      await workOrderApi.transitionStatus(woId, toStatus, `Status updated to ${toStatus} from ClickUp Workspace`);
      setActiveStatusDropdownId(null);
      fetchWorkOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Status transition failed.');
    }
  };

  const toggleGroupCollapse = (groupKey: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const toggleSubtask = (woId: number, subtaskId: string) => {
    setSubtasks((prev) => {
      const currentList = prev[woId] || [];
      return {
        ...prev,
        [woId]: currentList.map((st) => (st.id === subtaskId ? { ...st, completed: !st.completed } : st)),
      };
    });
  };

  // Filtered List
  const filteredWorkOrders = workOrders.filter((wo) => {
    const matchesTab = activeTab === 'ALL' || wo.status === activeTab;
    const matchesPriority = priorityFilter === 'ALL' || wo.priority === priorityFilter;
    const matchesSearch =
      wo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (wo.assignedToName && wo.assignedToName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesPriority && matchesSearch;
  });

  const getStatusCount = (statusName: string) => {
    if (statusName === 'ALL') return workOrders.length;
    return workOrders.filter((w) => w.status === statusName).length;
  };

  // Status Grouping Configuration
  const statusGroupsConfig: { key: WorkOrderStatus; label: string; color: string; bgColor: string }[] = [
    { key: 'NEW', label: 'NEW WORK ORDERS', color: '#2563EB', bgColor: '#EFF6FF' },
    { key: 'ASSIGNED', label: 'ASSIGNED TO TECHS', color: '#7C3AED', bgColor: '#F5F3FF' },
    { key: 'IN_PROGRESS', label: 'IN PROGRESS', color: '#D97706', bgColor: '#FFFBEB' },
    { key: 'ON_HOLD', label: 'ON HOLD', color: '#EA580C', bgColor: '#FFF7ED' },
    { key: 'COMPLETED', label: 'COMPLETED / AWAITING SIGN-OFF', color: '#059669', bgColor: '#ECFDF5' },
    { key: 'CLOSED', label: 'CLOSED & ARCHIVED', color: '#475569', bgColor: '#F8FAFC' },
  ];

  // Helper for ClickUp priority badges
  const renderPriorityFlag = (priority: WorkOrderPriority) => {
    switch (priority) {
      case 'HIGH':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#DC2626', fontSize: '12px', fontWeight: 700 }}>
            <Flag size={14} fill="#DC2626" /> High
          </span>
        );
      case 'MEDIUM':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#D97706', fontSize: '12px', fontWeight: 600 }}>
            <Flag size={14} fill="#D97706" /> Medium
          </span>
        );
      case 'LOW':
      default:
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#2563EB', fontSize: '12px', fontWeight: 500 }}>
            <Flag size={14} fill="#2563EB" /> Low
          </span>
        );
    }
  };

  // Helper for Technician Avatar
  const renderAssigneeAvatar = (name?: string) => {
    if (!name) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={12} color="#94A3B8" />
          </div>
          Unassigned
        </span>
      );
    }

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6E56CF, #7B68EE)',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(110, 86, 207, 0.25)',
          }}
          title={name}
        >
          {initials}
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{name}</span>
      </span>
    );
  };

  return (
    <>
      <div className="page-body" style={{ background: '#F7F8FA', padding: '24px 32px', minHeight: '100vh' }}>
        {/* ClickUp Space Top Breadcrumb & Header */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>
            <span>Keystone Operations</span>
            <span>/</span>
            <span style={{ color: '#6E56CF', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Layers size={13} /> Work Orders Workspace
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Work Orders Directory
                <span
                  style={{
                    background: '#ECE9FE',
                    color: '#6E56CF',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    letterSpacing: '0.4px',
                    textTransform: 'uppercase',
                  }}
                >
                  ClickUp Suite
                </span>
              </h1>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
                Manage dispatch lifecycles, SLA deadlines, technician assignments, and field checklists.
              </p>
            </div>

            {/* ClickUp Purple Action Button */}
            <button
              onClick={() => setIsCreateOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #7B68EE, #6E56CF)',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(110, 86, 207, 0.35)',
                transition: 'transform 0.15s ease, boxShadow 0.15s ease',
              }}
            >
              <Plus size={16} /> Raise Work Order
            </button>
          </div>
        </div>

        {/* ClickUp View Switcher Navigation Bar */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '12px 12px 0 0',
            border: '1px solid #E2E8F0',
            borderBottom: 'none',
            padding: '10px 16px 0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* View Tabs */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { id: 'list', label: 'List View', icon: LayoutList },
              { id: 'board', label: 'Board (Kanban)', icon: Kanban },
              { id: 'table', label: 'Table Grid', icon: TableIcon },
              { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
              { id: 'gantt', label: 'Gantt Chart', icon: BarChart2 },
            ].map((v) => {
              const IconComp = v.icon;
              const isActive = viewMode === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setViewMode(v.id as ViewMode)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px 8px 0 0',
                    border: 'none',
                    borderBottom: isActive ? '3px solid #6E56CF' : '3px solid transparent',
                    background: isActive ? '#F5F3FF' : 'transparent',
                    color: isActive ? '#6E56CF' : '#64748B',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <IconComp size={15} color={isActive ? '#6E56CF' : '#64748B'} />
                  {v.label}
                </button>
              );
            })}
          </div>

          {/* Quick Stats Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>
            <span style={{ background: '#F1F5F9', padding: '4px 10px', borderRadius: '12px' }}>
              Total: <strong style={{ color: '#0F172A' }}>{workOrders.length}</strong>
            </span>
            <span style={{ background: '#EFF6FF', color: '#2563EB', padding: '4px 10px', borderRadius: '12px' }}>
              Active: <strong style={{ color: '#1D4ED8' }}>{getStatusCount('IN_PROGRESS') + getStatusCount('ASSIGNED') + getStatusCount('NEW')}</strong>
            </span>
            <span style={{ background: '#ECFDF5', color: '#059669', padding: '4px 10px', borderRadius: '12px' }}>
              Resolved: <strong style={{ color: '#047857' }}>{getStatusCount('COMPLETED') + getStatusCount('CLOSED')}</strong>
            </span>
          </div>
        </div>

        {/* ClickUp Toolbar & Filters Sub-Bar */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '0 0 12px 12px',
            padding: '14px 20px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
          }}
        >
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { key: 'ALL', label: 'All Jobs' },
              { key: 'NEW', label: 'New' },
              { key: 'ASSIGNED', label: 'Assigned' },
              { key: 'IN_PROGRESS', label: 'In Progress' },
              { key: 'ON_HOLD', label: 'On Hold' },
              { key: 'COMPLETED', label: 'Completed' },
              { key: 'CLOSED', label: 'Closed' },
            ].map((t) => {
              const count = getStatusCount(t.key);
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: isActive ? 700 : 500,
                    border: 'none',
                    cursor: 'pointer',
                    background: isActive ? '#6E56CF' : '#F1F5F9',
                    color: isActive ? '#FFFFFF' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{t.label}</span>
                  <span
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      fontSize: '10px',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search, Filter & Group Controls */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '9px' }} />
              <input
                type="text"
                placeholder="Search code, title, customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 12px 6px 32px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Priority Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={13} color="#64748B" />
              <select
                style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none' }}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>

            {/* Group By Selector */}
            {viewMode === 'list' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Group:</span>
                <select
                  style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none' }}
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as any)}
                >
                  <option value="status">Status</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* VIEW MODE 1: CLICKUP GROUPED LIST VIEW (SIGNATURE LOOK) */}
        {/* ---------------------------------------------------- */}
        {viewMode === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                Loading ClickUp Work Orders...
              </div>
            ) : filteredWorkOrders.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                No work orders match your search and filter criteria.
              </div>
            ) : (
              statusGroupsConfig.map((grp) => {
                const groupItems = filteredWorkOrders.filter((wo) => wo.status === grp.key);
                if (groupItems.length === 0 && activeTab !== 'ALL') return null;

                const isCollapsed = !!collapsedGroups[grp.key];

                return (
                  <div
                    key={grp.key}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      overflow: 'hidden',
                      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
                    }}
                  >
                    {/* Collapsible Group Header Bar */}
                    <div
                      onClick={() => toggleGroupCollapse(grp.key)}
                      style={{
                        background: grp.bgColor,
                        padding: '12px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        userSelect: 'none',
                        borderBottom: isCollapsed ? 'none' : '1px solid #E2E8F0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {isCollapsed ? <ChevronRight size={16} color={grp.color} /> : <ChevronDown size={16} color={grp.color} />}
                        <span
                          style={{
                            background: grp.color,
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '6px',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {grp.label}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: grp.color }}>
                          {groupItems.length} {groupItems.length === 1 ? 'task' : 'tasks'}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsCreateOpen(true);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: grp.color,
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Plus size={14} /> Add Work Order
                      </button>
                    </div>

                    {/* Group Items Table */}
                    {!isCollapsed && (
                      <table className="data-table">
                        <thead>
                          <tr style={{ background: '#F8FAFC' }}>
                            <th style={{ width: '40px' }}></th>
                            <th style={{ width: '130px' }}>Code</th>
                            <th>Work Title & Field Subtasks</th>
                            <th>Customer & Site Location</th>
                            <th style={{ width: '110px' }}>Priority</th>
                            <th style={{ width: '140px' }}>Status (Live)</th>
                            <th>Assigned Tech</th>
                            <th>SLA Due Date</th>
                            <th style={{ textAlign: 'right', width: '140px' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupItems.length === 0 ? (
                            <tr>
                              <td colSpan={9} style={{ textAlign: 'center', color: '#94A3B8', fontSize: '13px', padding: '16px' }}>
                                No work orders in this status group.
                              </td>
                            </tr>
                          ) : (
                            groupItems.map((wo) => {
                              const woSubtasks = subtasks[wo.id] || [];
                              const completedSubtasks = woSubtasks.filter((st) => st.completed).length;

                              return (
                                <tr key={wo.id} style={{ transition: 'background 0.15s ease' }}>
                                  <td>
                                    <input type="checkbox" style={{ cursor: 'pointer' }} />
                                  </td>

                                  {/* Code */}
                                  <td
                                    onClick={() => setSelectedWo(wo)}
                                    style={{
                                      fontWeight: 800,
                                      color: '#6E56CF',
                                      cursor: 'pointer',
                                      fontSize: '13px',
                                    }}
                                  >
                                    {wo.code}
                                  </td>

                                  {/* Work Title & Interactive Subtasks */}
                                  <td>
                                    <div
                                      onClick={() => setSelectedWo(wo)}
                                      style={{ fontWeight: 700, color: '#0F172A', cursor: 'pointer', fontSize: '14px' }}
                                    >
                                      {wo.title}
                                    </div>

                                    {/* Subtasks Progress Pills */}
                                    {woSubtasks.length > 0 && (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                                        <span
                                          style={{
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            color: completedSubtasks === woSubtasks.length ? '#059669' : '#64748B',
                                            background: completedSubtasks === woSubtasks.length ? '#ECFDF5' : '#F1F5F9',
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                          }}
                                        >
                                          <CheckCircle2 size={11} color={completedSubtasks === woSubtasks.length ? '#059669' : '#64748B'} />
                                          {completedSubtasks}/{woSubtasks.length} subtasks
                                        </span>

                                        {/* Inline subtask list toggle */}
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                          {woSubtasks.map((st) => (
                                            <span
                                              key={st.id}
                                              onClick={() => toggleSubtask(wo.id, st.id)}
                                              title={st.title}
                                              style={{
                                                cursor: 'pointer',
                                                fontSize: '10px',
                                                padding: '1px 6px',
                                                borderRadius: '4px',
                                                background: st.completed ? '#D1FAE5' : '#E2E8F0',
                                                color: st.completed ? '#065F46' : '#475569',
                                                textDecoration: st.completed ? 'line-through' : 'none',
                                              }}
                                            >
                                              {st.completed ? '✓' : '○'} {st.title.substring(0, 15)}...
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </td>

                                  {/* Customer & Site */}
                                  <td>
                                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#1E293B' }}>{wo.customerName}</div>
                                    <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      <MapPin size={11} /> {wo.siteName}
                                    </div>
                                  </td>

                                  {/* Priority Flag */}
                                  <td>{renderPriorityFlag(wo.priority)}</td>

                                  {/* Status Chip with ClickUp Live Selector Dropdown */}
                                  <td style={{ position: 'relative' }}>
                                    <div
                                      onClick={() =>
                                        setActiveStatusDropdownId(activeStatusDropdownId === wo.id ? null : wo.id)
                                      }
                                      style={{ cursor: 'pointer', display: 'inline-block' }}
                                      title="Click to change status"
                                    >
                                      <StatusChip status={wo.status} />
                                    </div>

                                    {/* Live Status Transition Dropdown Menu */}
                                    {activeStatusDropdownId === wo.id && (
                                      <div
                                        style={{
                                          position: 'absolute',
                                          top: '38px',
                                          left: '10px',
                                          background: '#FFFFFF',
                                          border: '1px solid #E2E8F0',
                                          borderRadius: '8px',
                                          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
                                          zIndex: 100,
                                          padding: '6px',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: '4px',
                                          minWidth: '150px',
                                        }}
                                      >
                                        {(['NEW', 'ASSIGNED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CLOSED'] as WorkOrderStatus[]).map(
                                          (st) => (
                                            <button
                                              key={st}
                                              onClick={() => handleStatusTransition(wo.id, st)}
                                              style={{
                                                background: wo.status === st ? '#F5F3FF' : 'transparent',
                                                border: 'none',
                                                padding: '6px 10px',
                                                borderRadius: '6px',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                color: wo.status === st ? '#6E56CF' : '#334155',
                                              }}
                                            >
                                              {st.replace('_', ' ')}
                                            </button>
                                          )
                                        )}
                                      </div>
                                    )}
                                  </td>

                                  {/* Assigned Tech Avatar */}
                                  <td>{renderAssigneeAvatar(wo.assignedToName)}</td>

                                  {/* SLA Due Date */}
                                  <td>
                                    <div
                                      style={{
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: wo.isOverdue ? '#DC2626' : '#475569',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                      }}
                                    >
                                      {wo.isOverdue ? <ShieldAlert size={13} color="#DC2626" /> : <Clock size={13} color="#64748B" />}
                                      {new Date(wo.slaDueAt).toLocaleString([], {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </div>
                                  </td>

                                  {/* Action Buttons */}
                                  <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                      <button
                                        type="button"
                                        onClick={() => setSelectedWo(wo)}
                                        style={{
                                          background: '#F1F5F9',
                                          border: '1px solid #CBD5E1',
                                          borderRadius: '6px',
                                          padding: '5px 10px',
                                          fontSize: '12px',
                                          fontWeight: 600,
                                          color: '#334155',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                        }}
                                        title="Inspect Details"
                                      >
                                        <Eye size={13} /> Inspect
                                      </button>

                                      {(!wo.assignedToId || wo.status === 'NEW') && (
                                        <button
                                          type="button"
                                          onClick={() => setAssignWo(wo)}
                                          style={{
                                            background: '#6E56CF',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '5px 10px',
                                            fontSize: '12px',
                                            fontWeight: 700,
                                            color: '#FFFFFF',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                          }}
                                          title="Assign Technician"
                                        >
                                          <UserPlus size={13} /> Assign
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW MODE 2: CLICKUP KANBAN BOARD VIEW */}
        {/* ---------------------------------------------------- */}
        {viewMode === 'board' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', alignItems: 'start' }}>
            {statusGroupsConfig.map((col) => {
              const colItems = filteredWorkOrders.filter((wo) => wo.status === col.key);

              return (
                <div
                  key={col.key}
                  style={{
                    background: '#F1F5F9',
                    borderRadius: '12px',
                    padding: '14px',
                    border: '1px solid #E2E8F0',
                    minHeight: '420px',
                  }}
                >
                  {/* Column Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: col.color }} />
                      <span style={{ fontWeight: 800, fontSize: '13px', color: '#0F172A' }}>{col.label}</span>
                      <span style={{ background: '#CBD5E1', color: '#334155', fontSize: '11px', fontWeight: 700, padding: '1px 7px', borderRadius: '10px' }}>
                        {colItems.length}
                      </span>
                    </div>

                    <button
                      onClick={() => setIsCreateOpen(true)}
                      style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Cards List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {colItems.map((wo) => (
                      <div
                        key={wo.id}
                        onClick={() => setSelectedWo(wo)}
                        style={{
                          background: '#FFFFFF',
                          borderRadius: '10px',
                          padding: '14px',
                          border: '1px solid #E2E8F0',
                          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
                          cursor: 'pointer',
                          transition: 'transform 0.15s ease, boxShadow 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#6E56CF' }}>{wo.code}</span>
                          {renderPriorityFlag(wo.priority)}
                        </div>

                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A', marginBottom: '8px', lineHeight: 1.4 }}>
                          {wo.title}
                        </div>

                        <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>
                          <Building size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                          {wo.customerName}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                          {renderAssigneeAvatar(wo.assignedToName)}
                          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={11} /> {new Date(wo.slaDueAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW MODE 3: CLICKUP TABLE GRID VIEW */}
        {/* ---------------------------------------------------- */}
        {viewMode === 'table' && (
          <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  <th>#</th>
                  <th>Code</th>
                  <th>Work Order Title</th>
                  <th>Customer</th>
                  <th>Site Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Tech</th>
                  <th>SLA Due Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkOrders.map((wo, index) => (
                  <tr key={wo.id} onClick={() => setSelectedWo(wo)} style={{ cursor: 'pointer' }}>
                    <td style={{ color: '#94A3B8', fontWeight: 600 }}>{index + 1}</td>
                    <td style={{ fontWeight: 800, color: '#6E56CF' }}>{wo.code}</td>
                    <td style={{ fontWeight: 700, color: '#0F172A' }}>{wo.title}</td>
                    <td style={{ fontWeight: 500 }}>{wo.customerName}</td>
                    <td style={{ color: '#64748B', fontSize: '12px' }}>{wo.siteName}</td>
                    <td>{renderPriorityFlag(wo.priority)}</td>
                    <td><StatusChip status={wo.status} /></td>
                    <td>{renderAssigneeAvatar(wo.assignedToName)}</td>
                    <td style={{ fontSize: '12px', color: '#475569' }}>
                      {new Date(wo.slaDueAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW MODE 4: CLICKUP CALENDAR VIEW */}
        {/* ---------------------------------------------------- */}
        {viewMode === 'calendar' && (
          <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>September 2026 SLA Schedule</h3>
              <span style={{ fontSize: '13px', color: '#6E56CF', fontWeight: 600 }}>ClickUp Calendar View</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontWeight: 700, fontSize: '12px', color: '#64748B', marginBottom: '10px' }}>
              <div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div><div>SUN</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                const dayStr = day < 10 ? `0${day}` : `${day}`;
                const matchedWos = filteredWorkOrders.filter((wo) => wo.slaDueAt.includes(`-09-${dayStr}`) || day === 5);

                return (
                  <div
                    key={day}
                    style={{
                      background: '#F8FAFC',
                      border: day === 5 ? '2px solid #6E56CF' : '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '8px',
                      minHeight: '90px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '12px', color: day === 5 ? '#6E56CF' : '#475569' }}>
                      {day} Sep
                    </div>
                    {matchedWos.map((w) => (
                      <div
                        key={w.id}
                        onClick={() => setSelectedWo(w)}
                        style={{
                          background: '#6E56CF',
                          color: '#FFFFFF',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '3px 6px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {w.code}: {w.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW MODE 5: CLICKUP GANTT CHART VIEW */}
        {/* ---------------------------------------------------- */}
        {viewMode === 'gantt' && (
          <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
              Work Order Lifecycle Timeline & Progress
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredWorkOrders.map((wo) => {
                let progressPercent = 15;
                if (wo.status === 'ASSIGNED') progressPercent = 35;
                if (wo.status === 'IN_PROGRESS') progressPercent = 65;
                if (wo.status === 'COMPLETED' || wo.status === 'CLOSED') progressPercent = 100;

                return (
                  <div key={wo.id} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '13px', color: '#6E56CF' }}>{wo.code}</div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{wo.title}</div>
                    </div>

                    <div style={{ background: '#F1F5F9', height: '28px', borderRadius: '14px', position: 'relative', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${progressPercent}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #7B68EE, #6E56CF)',
                          borderRadius: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          paddingRight: '12px',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: 800,
                          transition: 'width 0.3s ease',
                        }}
                      >
                        {progressPercent}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ClickUp Task Details Inspector Modal */}
      <WorkOrderDetailsModal workOrder={selectedWo} onClose={() => setSelectedWo(null)} />
      <CreateWorkOrderModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={fetchWorkOrders} />
      {assignWo && (
        <AssignTechnicianModal
          workOrder={assignWo}
          onClose={() => setAssignWo(null)}
          onSuccess={() => {
            setAssignWo(null);
            fetchWorkOrders();
          }}
        />
      )}
    </>
  );
};


