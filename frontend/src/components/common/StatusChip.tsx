import React from 'react';
import type { WorkOrderStatus } from '../../types/workOrder';

export const StatusChip: React.FC<{ status: WorkOrderStatus }> = ({ status }) => {
  const getPillClass = (s: WorkOrderStatus) => {
    switch (s) {
      case 'NEW': return 'pill-new';
      case 'ASSIGNED': return 'pill-assigned';
      case 'IN_PROGRESS': return 'pill-in-progress';
      case 'ON_HOLD': return 'pill-on-hold';
      case 'COMPLETED': return 'pill-completed';
      case 'CLOSED': return 'pill-closed';
      case 'CANCELLED': return 'pill-cancelled';
      default: return '';
    }
  };

  return <span className={`pill ${getPillClass(status)}`}>{status.replace('_', ' ')}</span>;
};
