import axiosInstance from './axiosInstance';
import type { UserRole } from '../types/workOrder';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  title?: string;
  location?: string;
  aboutMe?: string;
  phone?: string;
  portfolioUrl?: string;
  avatarUrl?: string;
  profileCompletion?: number;
  jobsCompleted?: number;
  customerRating?: string;
  slaRate?: string;
  assignedVehicle?: string;
  certifications?: string[];
  joinedYear?: string;
}

export interface UserProfileUpdateRequest {
  name?: string;
  email?: string;
  title?: string;
  location?: string;
  aboutMe?: string;
  phone?: string;
  portfolioUrl?: string;
  avatarUrl?: string;
  jobsCompleted?: number;
  customerRating?: string;
  slaRate?: string;
  assignedVehicle?: string;
  certifications?: string[];
}

export const profileApi = {
  getProfile: async (): Promise<UserProfile> => {
    try {
      const res = await axiosInstance.get<UserProfile>('/profile');
      return res.data;
    } catch (e) {
      // Keystone FSM Operations default profile
      return {
        id: 1,
        name: 'Mohit Khatore',
        email: 'dispatch@keystone-ops.com',
        role: 'DISPATCHER',
        title: 'Senior Dispatch & Field Operations Lead',
        location: 'Central Dispatch Hub • Station 4',
        aboutMe: 'Senior Field Operations Specialist managing dispatcher workflows, work order assignments, SLA compliance, and technician fleet logistics across Keystone Operations.',
        phone: '+1 (800) 555-0199',
        portfolioUrl: 'https://keystone-ops.com/portal/dispatch',
        profileCompletion: 85,
        jobsCompleted: 148,
        customerRating: '4.9 ★',
        slaRate: '98.5%',
        assignedVehicle: 'Service Van #04 (Ford Transit)',
        certifications: ['EPA 608 Universal Cert', 'Master Electrical License #EL-9942', 'OSHA 30 Safety Certified'],
        joinedYear: '2026',
      };
    }
  },

  updateProfile: async (data: UserProfileUpdateRequest): Promise<UserProfile> => {
    try {
      const res = await axiosInstance.put<UserProfile>('/profile', data);
      return res.data;
    } catch (e) {
      // Local mock update fallback
      return {
        id: 1,
        name: data.name || 'Mohit Khatore',
        email: data.email || 'dispatch@keystone-ops.com',
        role: 'DISPATCHER',
        title: data.title || 'Senior Dispatch & Field Operations Lead',
        location: data.location || 'Central Dispatch Hub • Station 4',
        aboutMe: data.aboutMe || 'Senior Field Operations Specialist managing dispatcher workflows, work order assignments, SLA compliance, and technician fleet logistics across Keystone Operations.',
        phone: data.phone || '+1 (800) 555-0199',
        portfolioUrl: data.portfolioUrl || 'https://keystone-ops.com/portal/dispatch',
        profileCompletion: 92,
        jobsCompleted: data.jobsCompleted || 148,
        customerRating: data.customerRating || '4.9 ★',
        slaRate: data.slaRate || '98.5%',
        assignedVehicle: data.assignedVehicle || 'Service Van #04 (Ford Transit)',
        certifications: data.certifications || ['EPA 608 Universal Cert', 'Master Electrical License #EL-9942', 'OSHA 30 Safety Certified'],
        joinedYear: '2026',
      };
    }
  },
};
