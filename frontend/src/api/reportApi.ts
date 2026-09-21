import axiosInstance from './axiosInstance';
import type { WorkOrderSummaryReport } from '../types/workOrder';

export const reportApi = {
  getSummary: async (): Promise<WorkOrderSummaryReport> => {
    const res = await axiosInstance.get<WorkOrderSummaryReport>('/reports/summary');
    return res.data;
  },
};
