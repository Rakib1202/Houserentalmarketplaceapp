import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
// Replace these with your actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string;
          role: 'tenant' | 'owner' | 'agent' | 'employee' | 'admin';
          avatar_url?: string;
          created_at: string;
          updated_at: string;
          status: 'active' | 'inactive' | 'suspended';
          verified: boolean;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      properties: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          description: string;
          property_type: string;
          price: number;
          bedrooms: number;
          bathrooms: number;
          size_sqft: number;
          location: string;
          area: string;
          address: string;
          latitude?: number;
          longitude?: number;
          amenities: string[];
          images: string[];
          status: 'pending' | 'approved' | 'rejected' | 'rented';
          featured: boolean;
          views: number;
          created_at: string;
          updated_at: string;
          approved_at?: string;
          approved_by?: string;
        };
        Insert: Omit<Database['public']['Tables']['properties']['Row'], 'id' | 'created_at' | 'updated_at' | 'views'>;
        Update: Partial<Database['public']['Tables']['properties']['Insert']>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_name: string;
          plan_type: 'basic' | 'premium' | 'business';
          price: number;
          start_date: string;
          end_date: string;
          status: 'active' | 'expired' | 'cancelled';
          features: string[];
          auto_renew: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
      };
      photo_uploads: {
        Row: {
          id: string;
          employee_id: string;
          property_id: string;
          photo_url: string;
          status: 'pending' | 'approved' | 'rejected';
          uploaded_at: string;
          reviewed_at?: string;
          reviewed_by?: string;
          earnings: number;
        };
        Insert: Omit<Database['public']['Tables']['photo_uploads']['Row'], 'id' | 'uploaded_at' | 'earnings'>;
        Update: Partial<Database['public']['Tables']['photo_uploads']['Insert']>;
      };
      employee_earnings: {
        Row: {
          id: string;
          employee_id: string;
          month: string;
          total_photos: number;
          approved_photos: number;
          total_earnings: number;
          paid: boolean;
          paid_at?: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['employee_earnings']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['employee_earnings']['Insert']>;
      };
      complaints: {
        Row: {
          id: string;
          reporter_id: string;
          reported_user_id?: string;
          property_id?: string;
          category: string;
          subject: string;
          description: string;
          status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
          priority: 'low' | 'medium' | 'high';
          created_at: string;
          updated_at: string;
          resolved_at?: string;
          resolved_by?: string;
        };
        Insert: Omit<Database['public']['Tables']['complaints']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['complaints']['Insert']>;
      };
      cms_content: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          type: 'page' | 'article' | 'banner' | 'notification';
          status: 'published' | 'draft';
          author_id: string;
          meta_title?: string;
          meta_description?: string;
          keywords?: string[];
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cms_content']['Row'], 'id' | 'created_at' | 'updated_at' | 'views'>;
        Update: Partial<Database['public']['Tables']['cms_content']['Insert']>;
      };
      seo_settings: {
        Row: {
          id: string;
          page_name: string;
          url: string;
          title: string;
          meta_description: string;
          keywords: string[];
          og_image?: string;
          focus_keyword: string;
          seo_score: number;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['seo_settings']['Row'], 'id' | 'updated_at' | 'seo_score'>;
        Update: Partial<Database['public']['Tables']['seo_settings']['Insert']>;
      };
      media_files: {
        Row: {
          id: string;
          name: string;
          file_url: string;
          file_type: 'image' | 'document' | 'video';
          file_size: number;
          folder?: string;
          dimensions?: string;
          uploaded_by: string;
          uploaded_at: string;
        };
        Insert: Omit<Database['public']['Tables']['media_files']['Row'], 'id' | 'uploaded_at'>;
        Update: Partial<Database['public']['Tables']['media_files']['Insert']>;
      };
      page_analytics: {
        Row: {
          id: string;
          page_url: string;
          views: number;
          unique_visitors: number;
          avg_time_seconds: number;
          bounce_rate: number;
          date: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['page_analytics']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['page_analytics']['Insert']>;
      };
      job_postings: {
        Row: {
          id: string;
          title: string;
          department: string;
          location: string;
          job_type: 'full-time' | 'part-time' | 'remote' | 'contract';
          description: string;
          requirements: string[];
          responsibilities: string[];
          salary_min?: number;
          salary_max?: number;
          application_email: string;
          status: 'active' | 'closed';
          applicants_count: number;
          posted_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['job_postings']['Row'], 'id' | 'created_at' | 'updated_at' | 'applicants_count'>;
        Update: Partial<Database['public']['Tables']['job_postings']['Insert']>;
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          payment_type: 'subscription' | 'commission' | 'refund';
          payment_method: string;
          transaction_id: string;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
      crm_leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          source: string;
          status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
          assigned_to?: string;
          property_interest?: string;
          budget?: number;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['crm_leads']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['crm_leads']['Insert']>;
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id?: string;
          details?: any;
          ip_address?: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['activity_logs']['Row'], 'id' | 'created_at'>;
        Update: never;
      };
    };
  };
}

// Helper function to handle errors
export function handleSupabaseError(error: any): string {
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
