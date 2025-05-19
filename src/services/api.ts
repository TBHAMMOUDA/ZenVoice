// API service for real backend integration
import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: 'https://localhost:7054/', // Replace with actual API URL in production
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication if needed
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Generic error handler
class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number = 400) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Contact interfaces based on API schema
export interface ContactDto {
  id: number;
  name: string;
  email: string;
  phone?: string;
  companyId?: number;
  company?: string;
  isAutoSynced: boolean;
  tags?: TagDto[];
}

export interface CreateContactDto {
  name: string;
  email: string;
  phone?: string;
  companyId?: number;
  tags?: TagDto[];
}

export interface TagDto {
  id?: number;
  name: string;
  description?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// API service
export const api = {
  // Contacts endpoints
  contacts: {
    getAll: async (params: {
      page?: number;
      pageSize?: number;
      searchText?: string;
      isAutoSynced?: boolean;
      companyIds?: number[];
    } = {}): Promise<PaginatedResponse<ContactDto>> => {
      try {
        const response = await apiClient.get('/api/Contacts', { params });
        return response.data;
      } catch (error) {
        console.error('Error fetching contacts:', error);
        if (axios.isAxiosError(error)) {
          throw new ApiError(
            error.response?.data?.message || 'Failed to fetch contacts',
            error.response?.status || 500
          );
        }
        throw new ApiError('Failed to fetch contacts');
      }
    },
    
    getById: async (id: number): Promise<ContactDto> => {
      try {
        const response = await apiClient.get(`/api/Contacts/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching contact ${id}:`, error);
        if (axios.isAxiosError(error)) {
          throw new ApiError(
            error.response?.data?.message || 'Contact not found',
            error.response?.status || 500
          );
        }
        throw new ApiError('Failed to fetch contact');
      }
    },
    
    create: async (contactData: CreateContactDto): Promise<ContactDto> => {
      try {
        const response = await apiClient.post('/api/Contacts', contactData);
        return response.data;
      } catch (error) {
        console.error('Error creating contact:', error);
        if (axios.isAxiosError(error)) {
          throw new ApiError(
            error.response?.data?.message || 'Failed to create contact',
            error.response?.status || 500
          );
        }
        throw new ApiError('Failed to create contact');
      }
    },
    
    update: async (id: number, contactData: CreateContactDto): Promise<ContactDto> => {
      try {
        // The API doesn't have a PUT endpoint for contacts, so we'll use PATCH with the available fields
        const response = await apiClient.patch(`/api/Contacts/${id}`, contactData);
        return response.data;
      } catch (error) {
        console.error(`Error updating contact ${id}:`, error);
        if (axios.isAxiosError(error)) {
          throw new ApiError(
            error.response?.data?.message || 'Failed to update contact',
            error.response?.status || 500
          );
        }
        throw new ApiError('Failed to update contact');
      }
    },
    
    delete: async (id: number): Promise<{ success: boolean }> => {
      try {
        await apiClient.delete(`/api/Contacts/${id}`);
        return { success: true };
      } catch (error) {
        console.error(`Error deleting contact ${id}:`, error);
        if (axios.isAxiosError(error)) {
          throw new ApiError(
            error.response?.data?.message || 'Failed to delete contact',
            error.response?.status || 500
          );
        }
        throw new ApiError('Failed to delete contact');
      }
    },
    
    checkDuplicates: async (contactData: CreateContactDto): Promise<ContactDto[]> => {
      try {
        const response = await apiClient.post('/api/Contacts/duplicates/check', contactData);
        return response.data;
      } catch (error) {
        console.error('Error checking duplicates:', error);
        if (axios.isAxiosError(error)) {
          throw new ApiError(
            error.response?.data?.message || 'Failed to check duplicates',
            error.response?.status || 500
          );
        }
        throw new ApiError('Failed to check duplicates');
      }
    }
  },
  
  // Tags endpoints
  tags: {
    getAll: async (): Promise<TagDto[]> => {
      try {
        const response = await apiClient.get('/api/Tags');
        return response.data;
      } catch (error) {
        console.error('Error fetching tags:', error);
        if (axios.isAxiosError(error)) {
          throw new ApiError(
            error.response?.data?.message || 'Failed to fetch tags',
            error.response?.status || 500
          );
        }
        throw new ApiError('Failed to fetch tags');
      }
    },
    
    create: async (tagData: TagDto): Promise<TagDto> => {
      try {
        const response = await apiClient.post('/api/Tags', tagData);
        return response.data;
      } catch (error) {
        console.error('Error creating tag:', error);
        if (axios.isAxiosError(error)) {
          throw new ApiError(
            error.response?.data?.message || 'Failed to create tag',
            error.response?.status || 500
          );
        }
        throw new ApiError('Failed to create tag');
      }
    }
  },
  
  // Companies endpoints (simplified for contacts integration)
  companies: {
    getAll: async (): Promise<any[]> => {
      try {
        const response = await apiClient.get('/api/Companies');
        return response.data.items;
      } catch (error) {
        console.error('Error fetching companies:', error);
        if (axios.isAxiosError(error)) {
          throw new ApiError(
            error.response?.data?.message || 'Failed to fetch companies',
            error.response?.status || 500
          );
        }
        throw new ApiError('Failed to fetch companies');
      }
    }
  }
};

export default api;
