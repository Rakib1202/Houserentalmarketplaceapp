import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Briefcase,
  Users,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '../ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import { jobsAPI } from '../../utils/api';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-Time' | 'Part-Time' | 'Remote' | 'Contract';
  description: string;
  requirements: string[];
  responsibilities: string[];
  applicationLink?: string;
  salary?: string;
  isActive: boolean;
  postedDate: string;
  applicants?: number;
}

export function JobManagement() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed'>('all');
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-Time' as 'Full-Time' | 'Part-Time' | 'Remote' | 'Contract',
    description: '',
    requirements: '',
    responsibilities: '',
    applicationLink: '',
    salary: '',
    isActive: true,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // Demo data
      const demoJobs: Job[] = [
        {
          id: '1',
          title: 'Senior Property Manager',
          department: 'Operations',
          location: 'Dhaka, Bangladesh',
          type: 'Full-Time',
          description: 'Manage our growing portfolio of rental properties.',
          requirements: ['5+ years experience', 'Communication skills'],
          responsibilities: ['Manage operations', 'Handle leases'],
          applicationLink: 'mailto:careers@houserentbd.com',
          salary: '৳60,000 - ৳90,000',
          isActive: true,
          postedDate: '2024-02-05',
          applicants: 12
        },
        {
          id: '2',
          title: 'Full Stack Developer',
          department: 'Technology',
          location: 'Remote',
          type: 'Remote',
          description: 'Build and enhance our rental marketplace platform.',
          requirements: ['3+ years React/TypeScript', 'Node.js experience'],
          responsibilities: ['Develop features', 'Code reviews'],
          applicationLink: 'mailto:careers@houserentbd.com',
          salary: '৳80,000 - ৳150,000',
          isActive: true,
          postedDate: '2024-02-08',
          applicants: 28
        },
        {
          id: '3',
          title: 'Marketing Coordinator',
          department: 'Marketing',
          location: 'Dhaka, Bangladesh',
          type: 'Full-Time',
          description: 'Support our marketing campaigns and brand initiatives.',
          requirements: ['2+ years marketing', 'Social media skills'],
          responsibilities: ['Campaign management', 'Content creation'],
          salary: '৳40,000 - ৳60,000',
          isActive: false,
          postedDate: '2024-01-15',
          applicants: 45
        }
      ];

      setJobs(demoJobs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const jobData = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(r => r.trim()),
        responsibilities: formData.responsibilities.split('\n').filter(r => r.trim()),
      };

      if (editingJob) {
        // Update existing job
        setJobs(jobs.map(j => j.id === editingJob.id ? { ...editingJob, ...jobData } : j));
        toast.success('Job updated successfully!');
      } else {
        // Create new job
        const newJob: Job = {
          id: Date.now().toString(),
          ...jobData,
          postedDate: new Date().toISOString(),
          applicants: 0,
        };
        setJobs([newJob, ...jobs]);
        toast.success('Job created successfully!');
      }

      setShowDialog(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description,
      requirements: job.requirements.join('\n'),
      responsibilities: job.responsibilities.join('\n'),
      applicationLink: job.applicationLink || '',
      salary: job.salary || '',
      isActive: job.isActive,
    });
    setShowDialog(true);
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;

    try {
      setJobs(jobs.filter(j => j.id !== jobId));
      toast.success('Job deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const handleToggleActive = async (jobId: string, currentStatus: boolean) => {
    try {
      setJobs(jobs.map(j => 
        j.id === jobId ? { ...j, isActive: !currentStatus } : j
      ));
      toast.success(`Job ${currentStatus ? 'closed' : 'activated'} successfully!`);
    } catch (error) {
      toast.error('Failed to update job status');
    }
  };

  const resetForm = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      department: '',
      location: '',
      type: 'Full-Time',
      description: '',
      requirements: '',
      responsibilities: '',
      applicationLink: '',
      salary: '',
      isActive: true,
    });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' ? true :
                         filterStatus === 'active' ? job.isActive : !job.isActive;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.isActive).length,
    closed: jobs.filter(j => !j.isActive).length,
    applicants: jobs.reduce((sum, j) => sum + (j.applicants || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Briefcase className="size-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Eye className="size-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Closed</p>
                <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
              </div>
              <EyeOff className="size-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applicants</p>
                <p className="text-2xl font-bold text-purple-600">{stats.applicants}</p>
              </div>
              <Users className="size-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={() => setShowDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="size-4 mr-2" />
                Add New Job
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="inline-block size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-600">Loading jobs...</p>
            </CardContent>
          </Card>
        ) : filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="size-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No jobs found</p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map(job => (
            <Card key={job.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="size-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Briefcase className="size-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1">{job.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{job.department}</Badge>
                          <Badge variant="outline">{job.type}</Badge>
                          <Badge variant={job.isActive ? 'default' : 'secondary'} className={job.isActive ? 'bg-green-600' : 'bg-gray-600'}>
                            {job.isActive ? 'Active' : 'Closed'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📍 {job.location}</p>
                      {job.salary && <p>💰 {job.salary}</p>}
                      <p>👥 {job.applicants || 0} applicants</p>
                      <p>📅 Posted {new Date(job.postedDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(job.id, job.isActive)}
                    >
                      {job.isActive ? <EyeOff className="size-4 mr-2" /> : <Eye className="size-4 mr-2" />}
                      {job.isActive ? 'Close' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(job)}
                    >
                      <Edit className="size-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(job.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="size-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={(open) => {
        setShowDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingJob ? 'Edit Job' : 'Add New Job'}</DialogTitle>
            <DialogDescription>
              {editingJob ? 'Update job details below' : 'Create a new job posting'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Senior Developer"
                />
              </div>

              <div>
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g., Technology"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Dhaka, Bangladesh"
                />
              </div>

              <div>
                <Label htmlFor="type">Job Type *</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-Time">Full-Time</SelectItem>
                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="e.g., ৳60,000 - ৳90,000/month"
              />
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the role..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="responsibilities">Responsibilities (one per line) *</Label>
              <Textarea
                id="responsibilities"
                required
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                placeholder="Manage team&#10;Lead projects&#10;Review code"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requirements (one per line) *</Label>
              <Textarea
                id="requirements"
                required
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="5+ years experience&#10;Bachelor's degree&#10;Strong communication"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="applicationLink">Application Link/Email</Label>
              <Input
                id="applicationLink"
                value={formData.applicationLink}
                onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
                placeholder="mailto:careers@example.com or https://..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="size-4"
              />
              <Label htmlFor="isActive" className="cursor-pointer">Active (visible to applicants)</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                {editingJob ? 'Update Job' : 'Create Job'}
              </Button>
              <Button type="button" variant="outline" onClick={() => {
                setShowDialog(false);
                resetForm();
              }}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
