import axiosInstance from './axiosInstance';
import type { User } from '../types/workOrder';

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'DISPATCHER' | 'TECHNICIAN' | 'MANAGER' | 'CUSTOMER';
  title?: string;
  location?: string;
  phone?: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await axiosInstance.post<LoginResponse>('/auth/login', { email, password });
    return res.data;
  },
  register: async (payload: RegisterPayload): Promise<LoginResponse> => {
    const res = await axiosInstance.post<LoginResponse>('/auth/register', payload);
    return res.data;
  },
  getMe: async (): Promise<User> => {
    const res = await axiosInstance.get<User>('/auth/me');
    return res.data;
  },
  getTechnicians: async (): Promise<User[]> => {
    const res = await axiosInstance.get<User[]>('/auth/technicians');
    return res.data;
  },
};
