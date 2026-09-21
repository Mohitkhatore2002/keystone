import axiosInstance from './axiosInstance';
import type { WorkOrder, WorkOrderStatus, WorkOrderPriority, PartUsage, TimeLog } from '../types/workOrder';

export interface CreateWorkOrderPayload {
  title: string;
  description?: string;
  priority: WorkOrderPriority;
  slaDueAt: string;
  customerId: number;
  siteId: number;
  assignedToId?: number;
}

export const workOrderApi = {
  getAllList: async (): Promise<WorkOrder[]> => {
    const res = await axiosInstance.get<WorkOrder[]>('/work-orders/all');
    return res.data;
  },
  getById: async (id: number): Promise<WorkOrder> => {
    const res = await axiosInstance.get<WorkOrder>(`/work-orders/${id}`);
    return res.data;
  },
  create: async (payload: CreateWorkOrderPayload): Promise<WorkOrder> => {
    const res = await axiosInstance.post<WorkOrder>('/work-orders', payload);
    return res.data;
  },
  assign: async (id: number, technicianId: number): Promise<WorkOrder> => {
    const res = await axiosInstance.post<WorkOrder>(`/work-orders/${id}/assign`, { technicianId });
    return res.data;
  },
  assignTechnician: async (id: number, technicianId: number): Promise<WorkOrder> => {
    const res = await axiosInstance.post<WorkOrder>(`/work-orders/${id}/assign`, { technicianId });
    return res.data;
  },
  transitionStatus: async (id: number, toStatus: WorkOrderStatus, note?: string): Promise<WorkOrder> => {
    const res = await axiosInstance.post<WorkOrder>(`/work-orders/${id}/status`, { toStatus, note });
    return res.data;
  },
  logPartUsage: async (id: number, partId: number, qtyUsed: number): Promise<PartUsage> => {
    const res = await axiosInstance.post<PartUsage>(`/work-orders/${id}/parts`, { partId, qtyUsed });
    return res.data;
  },
  logTime: async (id: number, minutes: number, note?: string): Promise<TimeLog> => {
    const res = await axiosInstance.post<TimeLog>(`/work-orders/${id}/time`, { minutes, note });
    return res.data;
  },
};
