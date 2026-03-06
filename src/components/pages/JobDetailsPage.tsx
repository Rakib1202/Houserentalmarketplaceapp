import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Briefcase, 
  DollarSign,
  CheckCircle,
  Send
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { toast } from 'sonner';

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
}

export function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: null as File | null,
  });

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      // Demo data - in production, fetch from API
      const demoJobs: Job[] = [
        {
          id: '1',
          title: 'Senior Property Manager',
          department: 'Operations',
          location: 'Dhaka, Bangladesh',
          type: 'Full-Time',
          description: 'We are looking for an experienced Property Manager to oversee our growing portfolio of rental properties in Dhaka. You will be responsible for managing relationships with property owners and tenants, ensuring smooth operations, and maintaining high occupancy rates.',
          requirements: [
            '5+ years of property management experience',
            'Strong communication skills in English and Bengali',
            'Experience with property management software',
            'Bachelor\'s degree in Business or related field',
            'Excellent organizational and problem-solving skills',
            'Valid driver\'s license'
          ],
          responsibilities: [
            'Manage day-to-day property operations',
            'Coordinate with property owners and tenants',
            'Oversee maintenance and repairs',
            'Handle lease agreements and renewals',
            'Ensure compliance with local regulations',
            'Manage property budgets and financial reporting',
            'Conduct property inspections'
          ],
          applicationLink: 'mailto:careers@houserentbd.com?subject=Application for Senior Property Manager',
          salary: '৳60,000 - ৳90,000/month',
          isActive: true,
          postedDate: '2024-02-05'
        },
        {
          id: '2',
          title: 'Full Stack Developer',
          department: 'Technology',
          location: 'Remote',
          type: 'Remote',
          description: 'Join our tech team to build and enhance our rental marketplace platform. You\'ll work on exciting features, optimize performance, and help scale our system to serve millions of users.',
          requirements: [
            '3+ years of React/TypeScript experience',
            'Experience with Node.js and databases',
            'Understanding of REST APIs',
            'Portfolio of previous projects',
            'Strong problem-solving skills',
            'Experience with version control (Git)'
          ],
          responsibilities: [
            'Develop new features for the platform',
            'Maintain and optimize existing code',
            'Collaborate with design team',
            'Participate in code reviews',
            'Write technical documentation',
            'Debug and fix issues',
            'Implement responsive designs'
          ],
          applicationLink: 'mailto:careers@houserentbd.com?subject=Application for Full Stack Developer',
          salary: '৳80,000 - ৳150,000/month',
          isActive: true,
          postedDate: '2024-02-08'
        }
      ];

      const foundJob = demoJobs.find(j => j.id === id);
      setJob(foundJob || null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);

    try {
      // In production, send application to API
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Application submitted successfully! We\'ll be in touch soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        coverLetter: '',
        resume: null,
      });
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block size-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
          <Button onClick={() => navigate('/careers')}>
            <ArrowLeft className="size-4 mr-2" />
            Back to Careers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/careers')}>
            <ArrowLeft className="size-4 mr-2" />
            Back to Careers
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="size-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="size-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {job.department}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={
                          job.type === 'Remote' 
                            ? 'border-green-500 text-green-700' 
                            : 'border-gray-500 text-gray-700'
                        }
                      >
                        {job.type}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="size-5 text-blue-600" />
                    <span>{job.location}</span>
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="size-5 text-green-600" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="size-5 text-orange-600" />
                    <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>About the Role</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700 leading-relaxed">{job.description}</p>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Responsibilities</h3>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Application Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Apply for this Position</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="01XXXXXXXXX"
                    />
                  </div>

                  <div>
                    <Label htmlFor="resume">Resume/CV *</Label>
                    <Input
                      id="resume"
                      type="file"
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setFormData({ ...formData, resume: e.target.files?.[0] || null })}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX (max 5MB)</p>
                  </div>

                  <div>
                    <Label htmlFor="coverLetter">Cover Letter</Label>
                    <Textarea
                      id="coverLetter"
                      value={formData.coverLetter}
                      onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                      placeholder="Tell us why you're interested in this role..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={applying}>
                    {applying ? (
                      <>
                        <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="size-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>

                  {job.applicationLink && (
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">Or apply via email:</p>
                      <a 
                        href={job.applicationLink} 
                        className="text-sm text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {job.applicationLink.includes('mailto:') 
                          ? job.applicationLink.replace('mailto:', '').split('?')[0]
                          : 'External Application Link'
                        }
                      </a>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
