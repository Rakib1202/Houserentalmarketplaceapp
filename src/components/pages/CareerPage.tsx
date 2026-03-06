import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  ArrowRight,
  Users,
  Heart,
  Zap,
  Coffee,
  Laptop,
  TrendingUp,
  Globe,
  Award
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
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
}

export function CareerPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // In demo mode, use sample data
      const demoJobs: Job[] = [
        {
          id: '1',
          title: 'Senior Property Manager',
          department: 'Operations',
          location: 'Dhaka, Bangladesh',
          type: 'Full-Time',
          description: 'We are looking for an experienced Property Manager to oversee our growing portfolio of rental properties in Dhaka.',
          requirements: [
            '5+ years of property management experience',
            'Strong communication skills in English and Bengali',
            'Experience with property management software',
            'Bachelor\'s degree in Business or related field'
          ],
          responsibilities: [
            'Manage day-to-day property operations',
            'Coordinate with property owners and tenants',
            'Oversee maintenance and repairs',
            'Handle lease agreements and renewals'
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
          description: 'Join our tech team to build and enhance our rental marketplace platform.',
          requirements: [
            '3+ years of React/TypeScript experience',
            'Experience with Node.js and databases',
            'Understanding of REST APIs',
            'Portfolio of previous projects'
          ],
          responsibilities: [
            'Develop new features for the platform',
            'Maintain and optimize existing code',
            'Collaborate with design team',
            'Participate in code reviews'
          ],
          applicationLink: 'mailto:careers@houserentbd.com?subject=Application for Full Stack Developer',
          salary: '৳80,000 - ৳150,000/month',
          isActive: true,
          postedDate: '2024-02-08'
        },
        {
          id: '3',
          title: 'Customer Success Specialist',
          department: 'Customer Support',
          location: 'Dhaka, Bangladesh',
          type: 'Full-Time',
          description: 'Help our customers find their perfect home and ensure their satisfaction.',
          requirements: [
            '2+ years in customer service',
            'Excellent communication skills',
            'Problem-solving mindset',
            'Fluent in Bengali and English'
          ],
          responsibilities: [
            'Respond to customer inquiries',
            'Resolve customer issues',
            'Gather customer feedback',
            'Maintain customer satisfaction'
          ],
          applicationLink: 'mailto:careers@houserentbd.com?subject=Application for Customer Success Specialist',
          salary: '৳35,000 - ৳55,000/month',
          isActive: true,
          postedDate: '2024-02-10'
        },
        {
          id: '4',
          title: 'Digital Marketing Manager',
          department: 'Marketing',
          location: 'Dhaka, Bangladesh',
          type: 'Full-Time',
          description: 'Drive our digital marketing strategy and grow our user base.',
          requirements: [
            '4+ years in digital marketing',
            'Experience with SEO/SEM',
            'Social media marketing expertise',
            'Analytics and reporting skills'
          ],
          responsibilities: [
            'Develop marketing campaigns',
            'Manage social media presence',
            'Analyze marketing metrics',
            'Optimize conversion rates'
          ],
          applicationLink: 'mailto:careers@houserentbd.com?subject=Application for Digital Marketing Manager',
          salary: '৳70,000 - ৳120,000/month',
          isActive: true,
          postedDate: '2024-02-01'
        }
      ];

      setJobs(demoJobs);
      setLoading(false);

      // In production, fetch from API:
      /*
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/careers/jobs`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );
      const data = await response.json();
      setJobs(data.jobs.filter((job: Job) => job.isActive));
      setLoading(false);
      */
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const departments = ['All', ...Array.from(new Set(jobs.map(job => job.department)))];
  const filteredJobs = selectedDepartment === 'All' 
    ? jobs 
    : jobs.filter(job => job.department === selectedDepartment);

  const benefits = [
    {
      icon: Heart,
      title: 'Health Care',
      description: 'Comprehensive medical insurance for you and your family',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Coffee,
      title: 'Catered Meals',
      description: 'Free breakfast, lunch, and unlimited snacks',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Laptop,
      title: 'Flexible Environment',
      description: 'Work from home options and flexible hours',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Learning opportunities and clear advancement paths',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Great Team',
      description: 'Work with talented, passionate colleagues',
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: Award,
      title: 'Competitive Pay',
      description: 'Industry-leading salaries and performance bonuses',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Briefcase className="size-5" />
              <span className="text-sm font-medium">Join Our Team</span>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Build Your Career with <span className="text-yellow-300">Dhaka Rent</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Help us revolutionize the rental market in Bangladesh. We're looking for passionate individuals to join our growing team.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <a href="#openings">View Open Positions</a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work With Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Work With Us?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're building the future of rental housing in Bangladesh. Join us and make a real impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 text-center">
                <div className="size-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="size-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Mission-Driven</h3>
                <p className="text-gray-600">
                  We're solving real problems for millions of people looking for quality rental homes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 text-center">
                <div className="size-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="size-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Fast Growth</h3>
                <p className="text-gray-600">
                  Join a rapidly expanding startup where your work makes an immediate impact.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 text-center">
                <div className="size-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="size-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Inclusive Culture</h3>
                <p className="text-gray-600">
                  Diverse team, collaborative environment, and genuine care for every team member.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
            <p className="text-lg text-gray-600">
              We take care of our team so they can do their best work
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className={`size-12 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="size-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section id="openings" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Current Openings</h2>
            <p className="text-lg text-gray-600 mb-8">
              Find your next opportunity and join our amazing team
            </p>

            {/* Department Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {departments.map(dept => (
                <Button
                  key={dept}
                  variant={selectedDepartment === dept ? 'default' : 'outline'}
                  onClick={() => setSelectedDepartment(dept)}
                  className={selectedDepartment === dept ? 'bg-blue-600' : ''}
                >
                  {dept}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block size-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-gray-600">Loading positions...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="size-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No openings available at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {filteredJobs.map(job => (
                <Card key={job.id} className="border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="size-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Briefcase className="size-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
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

                        <p className="text-gray-700 mb-4">{job.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            <span>{job.location}</span>
                          </div>
                          {job.salary && (
                            <div className="flex items-center gap-1">
                              <Clock className="size-4" />
                              <span>{job.salary}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="size-4" />
                            <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Link to={`/careers/${job.id}`}>
                          <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                            View Details
                            <ArrowRight className="size-4 ml-2" />
                          </Button>
                        </Link>
                        {job.applicationLink && (
                          <a href={job.applicationLink} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="w-full md:w-auto">
                              Quick Apply
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See the Perfect Role?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
            <a href="mailto:careers@houserentbd.com">Send Your Resume</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
