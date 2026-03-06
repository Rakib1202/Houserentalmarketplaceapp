import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { 
  Building2, 
  Users, 
  Clock, 
  DollarSign, 
  AlertCircle, 
  Camera,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { usersAPI, propertiesAPI, supportTicketsAPI } from '../../utils/api';

interface DashboardStats {
  totalProperties: number;
  pendingApprovals: number;
  totalTenants: number;
  totalOwners: number;
  totalAgents: number;
  totalEmployees: number;
  premiumRevenue: number;
  fakeReports: number;
  pendingPhotos: number;
  approvedPhotos: number;
  totalEarnings: number;
  activeListings: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    pendingApprovals: 0,
    totalTenants: 0,
    totalOwners: 0,
    totalAgents: 0,
    totalEmployees: 0,
    premiumRevenue: 0,
    fakeReports: 0,
    pendingPhotos: 0,
    approvedPhotos: 0,
    totalEarnings: 0,
    activeListings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/dashboard-stats`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setStats(data.stats);
        setRecentActivities(data.recentActivities || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: Building2,
      color: 'bg-blue-500',
      link: '/admin/properties',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: Clock,
      color: 'bg-yellow-500',
      link: '/admin/properties/approvals',
      change: '',
      trend: null,
    },
    {
      title: 'Active Listings',
      value: stats.activeListings,
      icon: CheckCircle,
      color: 'bg-green-500',
      link: '/admin/properties',
      change: '+8%',
      trend: 'up',
    },
    {
      title: 'Total Users',
      value: stats.totalTenants + stats.totalOwners + stats.totalAgents + stats.totalEmployees,
      icon: Users,
      color: 'bg-purple-500',
      link: '/admin/users',
      change: '+23',
      trend: 'up',
    },
    {
      title: 'Premium Revenue',
      value: `৳${stats.premiumRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      link: '/admin/payments',
      change: '+15%',
      trend: 'up',
    },
    {
      title: 'Fake Reports',
      value: stats.fakeReports,
      icon: AlertCircle,
      color: 'bg-red-500',
      link: '/admin/reports',
      change: '-5',
      trend: 'down',
    },
    {
      title: 'Pending Photos',
      value: stats.pendingPhotos,
      icon: Camera,
      color: 'bg-orange-500',
      link: '/admin/photos',
      change: '',
      trend: null,
    },
    {
      title: 'Employee Earnings',
      value: `৳${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-teal-500',
      link: '/admin/earnings',
      change: `${stats.approvedPhotos} photos`,
      trend: null,
    },
  ];

  const userBreakdown = [
    { role: 'Tenants', count: stats.totalTenants, color: 'bg-blue-500' },
    { role: 'Property Owners', count: stats.totalOwners, color: 'bg-green-500' },
    { role: 'Premium Agents', count: stats.totalAgents, color: 'bg-purple-500' },
    { role: 'Employees', count: stats.totalEmployees, color: 'bg-orange-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                      {stat.change && (
                        <div className="flex items-center gap-1 mt-2">
                          {stat.trend === 'up' ? (
                            <TrendingUp className="size-4 text-green-600" />
                          ) : stat.trend === 'down' ? (
                            <TrendingDown className="size-4 text-red-600" />
                          ) : null}
                          <span
                            className={`text-sm ${
                              stat.trend === 'up'
                                ? 'text-green-600'
                                : stat.trend === 'down'
                                ? 'text-red-600'
                                : 'text-gray-600'
                            }`}
                          >
                            {stat.change}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className={`${stat.color} p-3 rounded-full`}>
                      <Icon className="size-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* User Breakdown and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>User Breakdown</CardTitle>
            <CardDescription>Platform users by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${item.color} size-3 rounded-full`}></div>
                    <span className="text-sm font-medium">{item.role}</span>
                  </div>
                  <span className="text-lg font-bold">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'approval' ? 'bg-green-100' :
                      activity.type === 'report' ? 'bg-red-100' :
                      activity.type === 'payment' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      {activity.type === 'approval' && <CheckCircle className="size-4 text-green-600" />}
                      {activity.type === 'report' && <AlertCircle className="size-4 text-red-600" />}
                      {activity.type === 'payment' && <DollarSign className="size-4 text-blue-600" />}
                      {activity.type === 'photo' && <Camera className="size-4 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No recent activities</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/properties/approvals">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="size-4 mr-2" />
                Review Approvals
              </Button>
            </Link>
            <Link to="/admin/photos">
              <Button variant="outline" className="w-full justify-start">
                <Camera className="size-4 mr-2" />
                Approve Photos
              </Button>
            </Link>
            <Link to="/admin/reports">
              <Button variant="outline" className="w-full justify-start">
                <AlertCircle className="size-4 mr-2" />
                Review Reports
              </Button>
            </Link>
            <Link to="/admin/analytics">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="size-4 mr-2" />
                View Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
