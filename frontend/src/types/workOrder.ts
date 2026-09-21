export type UserRole = "DISPATCHER" | "TECHNICIAN" | "MANAGER" | "CUSTOMER";

export type WorkOrderStatus =
  | "NEW"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "COMPLETED"
  | "CLOSED"
  | "CANCELLED";

export type WorkOrderPriority = "LOW" | "MEDIUM" | "HIGH";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Site {
  id: number;
  customerId: number;
  customerName?: string;
  name: string;
  address: string;
  createdAt: string;
}

export interface Customer {
  id: number;
  name: string;
  contactEmail: string;
  phone?: string;
  sites?: Site[];
  createdAt: string;
}

export interface WorkOrderStatusHistory {
  id: number;
  fromStatus?: WorkOrderStatus;
  toStatus: WorkOrderStatus;
  changedBy: string;
  changedAt: string;
  note?: string;
}

export interface Part {
  id: number;
  name: string;
  sku: string;
  unitCost: number;
  stockQty: number;
}

export interface PartUsage {
  id: number;
  workOrderId: number;
  partId: number;
  partName: string;
  partSku: string;
  unitCost: number;
  qtyUsed: number;
  totalCost: number;
  createdAt: string;
}

export interface TimeLog {
  id: number;
  workOrderId: number;
  technicianId: number;
  technicianName: string;
  minutes: number;
  note?: string;
  loggedAt: string;
}

export interface WorkOrder {
  id: number;
  code: string;
  title: string;
  description?: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  slaDueAt: string;
  isOverdue: boolean;
  customerId: number;
  customerName: string;
  siteId: number;
  siteName: string;
  siteAddress: string;
  assignedToId?: number;
  assignedToName?: string;
  createdById?: number;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  history?: WorkOrderStatusHistory[];
  partUsages?: PartUsage[];
  timeLogs?: TimeLog[];
}

export interface WorkOrderSummaryReport {
  totalWorkOrders: number;
  newCount: number;
  assignedCount: number;
  inProgressCount: number;
  onHoldCount: number;
  completedCount: number;
  closedCount: number;
  cancelledCount: number;
  overdueCount: number;
  slaCompliancePercentage: number;
  overdueWorkOrders: WorkOrder[];
}
