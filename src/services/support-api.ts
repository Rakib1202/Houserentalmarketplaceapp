import apiClient from '../lib/api-client';

// ==============================================
// SUPPORT TICKETS SERVICE
// ==============================================
export const supportTicketsService = {
  // Get all support tickets
  async getAll(filters?: {
    status?: string;
    priority?: string;
    assignedTo?: string;
    category?: string;
  }) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.priority) queryParams.append('priority', filters.priority);
      if (filters?.assignedTo) queryParams.append('assignedTo', filters.assignedTo);
      if (filters?.category) queryParams.append('category', filters.category);

      const queryString = queryParams.toString();
      const endpoint = `/api/support-tickets${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(endpoint);

      if (response.success && response.data) {
        const { tickets } = response.data as any;
        return { success: true, data: tickets };
      }

      return { success: false, error: response.error || 'Failed to fetch support tickets' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to fetch support tickets' };
    }
  },

  // Get ticket by ID
  async getById(id: string) {
    try {
      const response = await apiClient.get(`/api/support-tickets/${id}`);

      if (response.success && response.data) {
        const { ticket } = response.data as any;
        return { success: true, data: ticket };
      }

      return { success: false, error: response.error || 'Ticket not found' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Ticket not found' };
    }
  },

  // Create new support ticket
  async create(ticketData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    subject: string;
    category: string;
    priority: string;
    message: string;
  }) {
    try {
      const response = await apiClient.post('/api/support-tickets', ticketData);

      if (response.success && response.data) {
        const { ticket } = response.data as any;
        return { success: true, data: ticket };
      }

      return { success: false, error: response.error || 'Failed to create support ticket' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to create support ticket' };
    }
  },

  // Assign ticket to employee
  async assign(ticketId: string, employeeId: string) {
    try {
      const response = await apiClient.post(`/api/support-tickets/${ticketId}/assign`, {
        employeeId,
      });

      if (response.success && response.data) {
        const { ticket } = response.data as any;
        return { success: true, data: ticket };
      }

      return { success: false, error: response.error || 'Failed to assign ticket' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to assign ticket' };
    }
  },

  // Add message to ticket
  async addMessage(ticketId: string, messageData: {
    message: string;
    sender: 'customer' | 'support';
    senderName: string;
  }) {
    try {
      const response = await apiClient.post(`/api/support-tickets/${ticketId}/messages`, messageData);

      if (response.success && response.data) {
        const { ticket } = response.data as any;
        return { success: true, data: ticket };
      }

      return { success: false, error: response.error || 'Failed to add message' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to add message' };
    }
  },

  // Update ticket status
  async updateStatus(ticketId: string, status: 'open' | 'in-progress' | 'resolved' | 'closed') {
    try {
      const response = await apiClient.patch(`/api/support-tickets/${ticketId}/status`, {
        status,
      });

      if (response.success && response.data) {
        const { ticket } = response.data as any;
        return { success: true, data: ticket };
      }

      return { success: false, error: response.error || 'Failed to update ticket status' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to update ticket status' };
    }
  },

  // Delete ticket (Admin only)
  async delete(ticketId: string) {
    try {
      const response = await apiClient.delete(`/api/support-tickets/${ticketId}`);

      if (response.success) {
        return { success: true };
      }

      return { success: false, error: response.error || 'Failed to delete ticket' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to delete ticket' };
    }
  },
};

// ==============================================
// SUPPORT EMPLOYEES SERVICE
// ==============================================
export const supportEmployeesService = {
  // Get all support employees
  async getAll(filters?: {
    department?: string;
    status?: string;
  }) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.department) queryParams.append('department', filters.department);
      if (filters?.status) queryParams.append('status', filters.status);

      const queryString = queryParams.toString();
      const endpoint = `/api/support-employees${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(endpoint);

      if (response.success && response.data) {
        const { employees } = response.data as any;
        return { success: true, data: employees };
      }

      return { success: false, error: response.error || 'Failed to fetch support employees' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to fetch support employees' };
    }
  },

  // Get employee by ID
  async getById(id: string) {
    try {
      const response = await apiClient.get(`/api/support-employees/${id}`);

      if (response.success && response.data) {
        const { employee } = response.data as any;
        return { success: true, data: employee };
      }

      return { success: false, error: response.error || 'Employee not found' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Employee not found' };
    }
  },

  // Create support employee
  async create(employeeData: any) {
    try {
      const response = await apiClient.post('/api/support-employees', employeeData);

      if (response.success && response.data) {
        const { employee } = response.data as any;
        return { success: true, data: employee };
      }

      return { success: false, error: response.error || 'Failed to create support employee' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to create support employee' };
    }
  },

  // Update support employee
  async update(id: string, employeeData: any) {
    try {
      const response = await apiClient.put(`/api/support-employees/${id}`, employeeData);

      if (response.success && response.data) {
        const { employee } = response.data as any;
        return { success: true, data: employee };
      }

      return { success: false, error: response.error || 'Failed to update support employee' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to update support employee' };
    }
  },

  // Update employee status
  async updateStatus(id: string, status: string) {
    try {
      const response = await apiClient.patch(`/api/support-employees/${id}/status`, {
        status,
      });

      if (response.success && response.data) {
        const { employee } = response.data as any;
        return { success: true, data: employee };
      }

      return { success: false, error: response.error || 'Failed to update employee status' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to update employee status' };
    }
  },

  // Delete support employee
  async delete(id: string) {
    try {
      const response = await apiClient.delete(`/api/support-employees/${id}`);

      if (response.success) {
        return { success: true };
      }

      return { success: false, error: response.error || 'Failed to delete employee' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to delete employee' };
    }
  },
};

// ==============================================
// JOBS SERVICE (Career Page)
// ==============================================
export const jobsService = {
  // Get all jobs
  async getAll(filters?: {
    status?: string;
    jobType?: string;
    department?: string;
  }) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.jobType) queryParams.append('jobType', filters.jobType);
      if (filters?.department) queryParams.append('department', filters.department);

      const queryString = queryParams.toString();
      const endpoint = `/api/jobs${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(endpoint);

      if (response.success && response.data) {
        const { jobs } = response.data as any;
        return { success: true, data: jobs };
      }

      return { success: false, error: response.error || 'Failed to fetch jobs' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to fetch jobs' };
    }
  },

  // Get job by ID
  async getById(id: string) {
    try {
      const response = await apiClient.get(`/api/jobs/${id}`);

      if (response.success && response.data) {
        const { job } = response.data as any;
        return { success: true, data: job };
      }

      return { success: false, error: response.error || 'Job not found' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Job not found' };
    }
  },

  // Create job posting
  async create(jobData: any) {
    try {
      const response = await apiClient.post('/api/jobs', jobData);

      if (response.success && response.data) {
        const { job } = response.data as any;
        return { success: true, data: job };
      }

      return { success: false, error: response.error || 'Failed to create job' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to create job' };
    }
  },

  // Update job posting
  async update(id: string, jobData: any) {
    try {
      const response = await apiClient.put(`/api/jobs/${id}`, jobData);

      if (response.success && response.data) {
        const { job } = response.data as any;
        return { success: true, data: job };
      }

      return { success: false, error: response.error || 'Failed to update job' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to update job' };
    }
  },

  // Delete job posting
  async delete(id: string) {
    try {
      const response = await apiClient.delete(`/api/jobs/${id}`);

      if (response.success) {
        return { success: true };
      }

      return { success: false, error: response.error || 'Failed to delete job' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to delete job' };
    }
  },

  // Submit job application
  async apply(jobId: string, applicationData: any) {
    try {
      const response = await apiClient.post(`/api/jobs/${jobId}/apply`, applicationData);

      if (response.success && response.data) {
        return { success: true, data: response.data };
      }

      return { success: false, error: response.error || 'Failed to submit application' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to submit application' };
    }
  },
};

// ==============================================
// INQUIRIES SERVICE (Contact Form)
// ==============================================
export const inquiriesService = {
  // Get all inquiries
  async getAll(filters?: {
    status?: string;
    category?: string;
  }) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.category) queryParams.append('category', filters.category);

      const queryString = queryParams.toString();
      const endpoint = `/api/inquiries${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(endpoint);

      if (response.success && response.data) {
        const { inquiries } = response.data as any;
        return { success: true, data: inquiries };
      }

      return { success: false, error: response.error || 'Failed to fetch inquiries' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to fetch inquiries' };
    }
  },

  // Get inquiry by ID
  async getById(id: string) {
    try {
      const response = await apiClient.get(`/api/inquiries/${id}`);

      if (response.success && response.data) {
        const { inquiry } = response.data as any;
        return { success: true, data: inquiry };
      }

      return { success: false, error: response.error || 'Inquiry not found' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Inquiry not found' };
    }
  },

  // Create inquiry (Contact form submission)
  async create(inquiryData: any) {
    try {
      const response = await apiClient.post('/api/inquiries', inquiryData);

      if (response.success && response.data) {
        const { inquiry } = response.data as any;
        return { success: true, data: inquiry };
      }

      return { success: false, error: response.error || 'Failed to submit inquiry' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to submit inquiry' };
    }
  },

  // Update inquiry status
  async updateStatus(id: string, status: string) {
    try {
      const response = await apiClient.patch(`/api/inquiries/${id}/status`, {
        status,
      });

      if (response.success && response.data) {
        const { inquiry } = response.data as any;
        return { success: true, data: inquiry };
      }

      return { success: false, error: response.error || 'Failed to update inquiry status' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to update inquiry status' };
    }
  },

  // Delete inquiry
  async delete(id: string) {
    try {
      const response = await apiClient.delete(`/api/inquiries/${id}`);

      if (response.success) {
        return { success: true };
      }

      return { success: false, error: response.error || 'Failed to delete inquiry' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to delete inquiry' };
    }
  },
};

// Export all support services
export default {
  tickets: supportTicketsService,
  employees: supportEmployeesService,
  jobs: jobsService,
  inquiries: inquiriesService,
};
