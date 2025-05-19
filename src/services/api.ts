// Auto-generated API client based on OpenAPI 3.0.1 spec
import axios, { AxiosError } from 'axios';

// --- Axios instance ---
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || window.location.origin,
  headers: { 'Content-Type': 'application/json' },
});

// Revive ISO date strings into Date objects
apiClient.interceptors.response.use(response => {
  function revive(key: string, value: any) {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
      return new Date(value);
    }
    return value;
  }
  response.data = JSON.parse(JSON.stringify(response.data), revive);
  return response;
});

// --- Error handling ---
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}
function toApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ message?: string }>;
    const status = err.response?.status ?? 500;
    const message = err.response?.data?.message ?? err.message;
    throw new ApiError(status, message);
  }
  throw new ApiError(500, (error as Error).message);
}

// --- DTO Types generated from OpenAPI spec ---
export interface CategoryDto { id?: number; name: string; description?: string; }
export interface CreateCompanyDto {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  categoryId?: number;
  serviceIds?: number[];
}
export enum CompanyStatus { 
    Active,
    Inactive,
    Archived,
    Pending
}
export interface UpdateCompanyDto {
  id?: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  categoryId: number;
  serviceIds?: number[];
}
export interface UpdateStatusCompanyDto{ 
  id?: number; 
  status: CompanyStatus;
}

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
export interface CreateContactDto { name: string; email: string; phone?: string; companyId?: number; tags?: TagDto[]; }
export enum ContactStatus { 
    Active,
    Inactive,
    Archived,
    Pending
}
export interface ChangeStatusContactDto { id: number; status: ContactStatus; }
export interface ExternalContactDto { externalId: number; name: string; email: string; phone?: string; companyId: number; }
export interface ExternalSyncContactDto { id: number; contacts?: ExternalContactDto[]; }

export interface ServiceDto { id: number; name: string; description?: string; }
export interface CreateServiceDto { name: string; description?: string; }
export interface UpdateServiceDto { name: string; description?: string; }

export interface TagDto { 
  id?: number; 
  name: string; 
  description?: string; 
}

export interface CompanyDto {
  id?: number;
  name: string;
  description?: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  status: CompanyStatus;
  categoryId?: number;
  categoryName: string;
  services?: ServiceDto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// --- Categories API ---
export const categoriesApi = {
  getAll: async (): Promise<CategoryDto[]> => {
    try {
      const { data } = await apiClient.get<CategoryDto[]>('/api/Categories');
      return data;
    } catch (e) { toApiError(e); }
  },
  getById: async (id: number): Promise<CategoryDto> => {
    try {
      const { data } = await apiClient.get<CategoryDto>(`/api/Categories/${id}`);
      return data;
    } catch (e) { toApiError(e); }
  },
  create: async (dto: CategoryDto): Promise<CategoryDto> => {
    try {
      const { data } = await apiClient.post<CategoryDto>('/api/Categories', dto);
      return data;
    } catch (e) { toApiError(e); }
  },
  update: async (id: number, dto: CategoryDto): Promise<CategoryDto> => {
    try {
      const { data } = await apiClient.put<CategoryDto>(`/api/Categories/${id}`, dto);
      return data;
    } catch (e) { toApiError(e); }
  },
};

// --- Companies API ---
export const companiesApi = {
  getAll: async (): Promise<CompanyDto[]> => {
    try {
      const { data } = await apiClient.get<CompanyDto[]>('/api/Companies');
      return data;
    } catch (e) { toApiError(e); }
  },
  getById: async (id: number): Promise<CompanyDto> => {
    try {
      const { data } = await apiClient.get<CompanyDto>(`/api/Companies/${id}`);
      return data;
    } catch (e) { toApiError(e); }
  },
  create: async (dto: CreateCompanyDto): Promise<CompanyDto> => {
    try {
      const { data } = await apiClient.post<CompanyDto>('/api/Companies', dto);
      return data;
    } catch (e) { toApiError(e); }
  },
  update: async (id: number, dto: UpdateCompanyDto): Promise<CompanyDto> => {
    try {
      const { data } = await apiClient.put<CompanyDto>(`/api/Companies/${id}`, dto);
      return data;
    } catch (e) { toApiError(e); }
  },
  patchStatus: async (id: number, dto: UpdateStatusCompanyDto): Promise<CompanyDto> => {
    try {
      const { data } = await apiClient.patch<CompanyDto>(`/api/Companies/${id}`, dto);
      return data;
    } catch (e) { toApiError(e); }
  },
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/api/Companies/${id}`);
    } catch (e) { toApiError(e); }
  },
};

// --- Contacts API ---
export const contactsApi = {
  getAll: async (params?: object): Promise<PaginatedResponse<ContactDto>> => {
    try {
      const { data } = await apiClient.get<PaginatedResponse<ContactDto>>('/api/Contacts', { params });
      return data;
    } catch (e) { toApiError(e); }
  },
  getById: async (id: number): Promise<ContactDto> => {
    try {
      const { data } = await apiClient.get<ContactDto>(`/api/Contacts/${id}`);
      return data;
    } catch (e) { toApiError(e); }
  },
  create: async (dto: CreateContactDto): Promise<ContactDto> => {
    try {
      const { data } = await apiClient.post<ContactDto>('/api/Contacts', dto);
      return data;
    } catch (e) { toApiError(e); }
  },
  updateStatus: async (id: number, dto: ChangeStatusContactDto): Promise<ContactDto> => {
    try {
      const { data } = await apiClient.patch<ContactDto>(`/api/Contacts/${id}`, dto);
      return data;
    } catch (e) { toApiError(e); }
  },
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/api/Contacts/${id}`);
    } catch (e) { toApiError(e); }
  },
  checkDuplicates: async (dto: CreateContactDto): Promise<ContactDto[]> => {
    try {
      const { data } = await apiClient.post<ContactDto[]>('/api/Contacts/duplicates/check', dto);
      return data;
    } catch (e) { toApiError(e); }
  },
  getDuplicates: async (id: number): Promise<ContactDto[]> => {
    try {
      const { data } = await apiClient.get<ContactDto[]>(`/api/Contacts/${id}/duplicates`);
      return data;
    } catch (e) { toApiError(e); }
  },
  merge: async (id: number, ids: number[]): Promise<ContactDto> => {
    try {
      const { data } = await apiClient.post<ContactDto>(`/api/Contacts/${id}/merge`, ids);
      return data;
    } catch (e) { toApiError(e); }
  },
  externalSync: async (dto: ExternalSyncContactDto): Promise<void> => {
    try {
      await apiClient.post('/api/Contacts/external-sync', dto);
    } catch (e) { toApiError(e); }
  },
};

// --- Services API ---
export const servicesApi = {
  getAll: async (): Promise<ServiceDto[]> => {
    try {
      const { data } = await apiClient.get<ServiceDto[]>('/api/Services');
      return data;
    } catch (e) { toApiError(e); }
  },
  getById: async (id: number): Promise<ServiceDto> => {
    try {
      const { data } = await apiClient.get<ServiceDto>(`/api/Services/${id}`);
      return data;
    } catch (e) { toApiError(e); }
  },
  create: async (dto: CreateServiceDto): Promise<ServiceDto> => {
    try {
      const { data } = await apiClient.post<ServiceDto>('/api/Services', dto);
      return data;
    } catch (e) { toApiError(e); }
  },
  update: async (id: number, dto: UpdateServiceDto): Promise<ServiceDto> => {
    try {
      const { data } = await apiClient.put<ServiceDto>(`/api/Services/${id}`, dto);
      return data;
    } catch (e) { toApiError(e); }
  },
};

// --- Tags API ---
export const tagsApi = {
  getAll: async (): Promise<TagDto[]> => {
    try {
      const { data } = await apiClient.get<TagDto[]>('/api/Tags');
      return data;
    } catch (e) { toApiError(e); }
  },
  create: async (dto: TagDto): Promise<TagDto> => {
    try {
      const { data } = await apiClient.post<TagDto>('/api/Tags', dto);
      return data;
    } catch (e) { toApiError(e); }
  },
  getById: async (id: number): Promise<TagDto> => {
    try {
      const { data } = await apiClient.get<TagDto>(`/api/Tags/${id}`);
      return data;
    } catch (e) { toApiError(e); }
  },
  update: async (id: number, dto: TagDto): Promise<TagDto> => {
    try {
      const { data } = await apiClient.put<TagDto>(`/api/Tags/${id}`, dto);
      return data;
    } catch (e) { toApiError(e); }
  },
};
