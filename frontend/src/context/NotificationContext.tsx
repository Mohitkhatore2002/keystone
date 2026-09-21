import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { workOrderApi } from '../api/workOrderApi';
import type { WorkOrder } from '../types/workOrder';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  tag: string;
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  workOrderId?: number;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  refreshBackendNotifications: () => Promise<void>;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-1',
    title: 'Pro tip',
    message: 'Check the step details panel to avoid common mistakes.',
    timestamp: '01:02 PM',
    tag: 'Info',
    read: false,
    type: 'info',
  },
  {
    id: 'n-2',
    title: 'Pro tip',
    message: 'Check the step details panel to avoid common mistakes.',
    timestamp: '01:01 PM',
    tag: 'Info',
    read: false,
    type: 'info',
  },
  {
    id: 'n-3',
    title: 'Pro tip',
    message: 'Check the step details panel to avoid common mistakes.',
    timestamp: '01:01 PM',
    tag: 'Info',
    read: false,
    type: 'info',
  },
  {
    id: 'n-4',
    title: 'Work Order Assigned',
    message: 'Work order WO-1004 (HVAC Compressor Fault) assigned to Alex Rivers.',
    timestamp: '12:45 PM',
    tag: 'Work Order',
    read: true,
    type: 'success',
    link: '/work-orders',
  },
  {
    id: 'n-5',
    title: 'Stock Threshold Warning',
    message: 'Part 20A Circuit Breakers reached low stock limit (Qty: 4).',
    timestamp: '11:20 AM',
    tag: 'Inventory',
    read: true,
    type: 'warning',
    link: '/inventory',
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('keystone_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('keystone_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Dynamically calculate live real unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newNotif: AppNotification = {
      ...notif,
      id: `n-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: formattedTime,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  // Fetch real notifications from live backend Spring Boot database work orders
  const refreshBackendNotifications = useCallback(async () => {
    try {
      const workOrders: WorkOrder[] = await workOrderApi.getAllList();
      const existingIds = new Set(notifications.map((n) => n.workOrderId));

      const newDbNotifs: AppNotification[] = [];

      workOrders.forEach((wo) => {
        if (!existingIds.has(wo.id)) {
          if (wo.isOverdue) {
            newDbNotifs.push({
              id: `wo-overdue-${wo.id}`,
              title: `SLA Breach Alert (${wo.code})`,
              message: `Work Order "${wo.title}" for ${wo.customerName} has breached SLA deadline!`,
              timestamp: 'Just now',
              tag: 'SLA Alert',
              read: false,
              type: 'error',
              link: '/work-orders',
              workOrderId: wo.id,
            });
          } else if (wo.status === 'NEW') {
            newDbNotifs.push({
              id: `wo-new-${wo.id}`,
              title: `New Unassigned Work Order (${wo.code})`,
              message: `"${wo.title}" raised for ${wo.customerName} requires technician assignment.`,
              timestamp: 'Today',
              tag: 'Work Order',
              read: false,
              type: 'info',
              link: '/work-orders',
              workOrderId: wo.id,
            });
          }
        }
      });

      if (newDbNotifs.length > 0) {
        setNotifications((prev) => [...newDbNotifs, ...prev]);
      }
    } catch (err) {
      console.warn('Could not fetch backend work orders for live notifications', err);
    }
  }, [notifications]);

  useEffect(() => {
    refreshBackendNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllAsRead,
        markAsRead,
        clearAll,
        addNotification,
        refreshBackendNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
