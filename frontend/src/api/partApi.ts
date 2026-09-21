import axiosInstance from './axiosInstance';
import type { Part } from '../types/workOrder';

export const partApi = {
  getAll: async (): Promise<Part[]> => {
    const res = await axiosInstance.get<Part[]>('/parts');
    return res.data;
  },
  create: async (part: Partial<Part>): Promise<Part> => {
    const res = await axiosInstance.post<Part>('/parts', part);
    return res.data;
  },
};

