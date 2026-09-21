import React from 'react';
import type { WorkOrderPriority } from '../../types/workOrder';

export const PriorityChip: React.FC<{ priority: WorkOrderPriority }> = ({ priority }) => {
  const getPillClass = (p: WorkOrderPriority) => {
    switch (p) {
      case 'HIGH': return 'pill-priority-high';
      case 'MEDIUM': return 'pill-priority-medium';
      case 'LOW': return 'pill-priority-low';
      default: return '';
    }
  };

  return <span className={`pill ${getPillClass(priority)}`}>{priority}</span>;
};
