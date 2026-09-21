import axiosInstance from './axiosInstance';

export interface FileUploadResponse {
  fileUrl: string;
  fileName: string;
  category: string;
  sizeBytes: number;
}

export const fileApi = {
  uploadFile: async (
    file: File | Blob,
    category: 'profiles' | 'work-orders' | 'signatures' = 'work-orders',
    filename?: string
  ): Promise<FileUploadResponse> => {
    const formData = new FormData();
    if (file instanceof Blob && filename && !(file instanceof File)) {
      formData.append('file', file, filename);
    } else {
      formData.append('file', file);
    }
    formData.append('category', category);

    const res = await axiosInstance.post<FileUploadResponse>('/files/upload', formData, {
      headers: {
        'Content-Type': undefined,
      },
    });

    // Ensure full backend URL if relative path returned
    const data = res.data;
    if (data.fileUrl && data.fileUrl.startsWith('/api')) {
      data.fileUrl = `http://localhost:8080${data.fileUrl}`;
    }
    return data;
  },
};
