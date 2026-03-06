// Type definitions for Dhaka House Rent App

export type UserRole = 'tenant' | 'owner' | 'agent' | 'employee' | 'admin';

export type TenantType = 'family' | 'bachelor' | 'both';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  verified: boolean;
  premium: boolean;
  createdAt: string;
  email?: string;
  profilePhoto?: string;
}

export interface Property {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  title: string;
  description: string;
  area: string;
  address: string;
  fullAddress: string; // Premium only
  rent: number;
  advance: number;
  bedrooms: number;
  bathrooms: number;
  size: number; // in sqft
  tenantType: TenantType;
  amenities: string[];
  rules: string;
  photos: string[];
  latitude?: number;
  longitude?: number;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  featuredUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantPhone: string;
  propertyId: string;
  propertyTitle: string;
  message: string;
  status: 'pending' | 'contacted' | 'closed';
  createdAt: string;
}

export interface Favorite {
  userId: string;
  propertyId: string;
  createdAt: string;
}

export interface EmployeePhoto {
  id: string;
  employeeId: string;
  employeeName: string;
  propertyId?: string;
  area: string;
  photoUrl: string;
  approved: boolean;
  earnings: number; // ৳5 per approved photo
  createdAt: string;
  approvedAt?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  userRole: UserRole;
  plan: 'basic' | 'pro' | 'premium';
  amount: number;
  startDate: string;
  expiresAt: string;
  active: boolean;
}

export interface SearchFilters {
  area?: string;
  minRent?: number;
  maxRent?: number;
  bedrooms?: number;
  tenantType?: TenantType;
  amenities?: string[];
}

export interface Analytics {
  totalUsers: number;
  totalProperties: number;
  totalInquiries: number;
  totalRevenue: number;
  pendingApprovals: number;
  activeSubscriptions: number;
}
