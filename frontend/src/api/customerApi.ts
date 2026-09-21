import axiosInstance from './axiosInstance';
import type { Customer, Site } from '../types/workOrder';

export const customerApi = {
  getAll: async (): Promise<Customer[]> => {
    const res = await axiosInstance.get<Customer[]>('/customers');
    return res.data;
  },
  getSites: async (customerId: number): Promise<Site[]> => {
    const res = await axiosInstance.get<Site[]>(`/customers/${customerId}/sites`);
    return res.data;
  },
  createCustomer: async (data: { name: string; contactEmail: string; phone?: string }): Promise<Customer> => {
    const res = await axiosInstance.post<Customer>('/customers', data);
    return res.data;
  },
  createSite: async (customerId: number, data: { name: string; address: string }): Promise<Site> => {
    const res = await axiosInstance.post<Site>(`/customers/${customerId}/sites`, data);
    return res.data;
  },
};
