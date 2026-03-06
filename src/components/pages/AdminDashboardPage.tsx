import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Calendar, 
  DollarSign, 
  Settings,
  TrendingUp,
  Eye,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

export function AdminDashboardPage() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const stats = [
    { 
      title: 'Total Listings', 
      value: '850', 
      icon: Building2, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    { 
      title: 'Total Users', 
      value: '12,430', 
      icon: Users, 
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50'
    },
    { 
      title: 'Safe Bookings', 
      value: '4,567', 
      icon: CheckCircle, 
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    },
    { 
      title: 'Total Revenue', 
      value: '৳115,780', 
      icon: DollarSign, 
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50'
    },
  ];

  const properties = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&h=100&fit=crop',
      title: 'Modern 3BHK Apartment',
      location: 'Dhanmondi, Dhaka',
      price: '৳25,000',
      status: 'Active',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100&h=100&fit=crop',
      title: 'Cozy Bachelor Flat',
      location: 'Gulshan, Dhaka',
      price: '৳18,000',
      status: 'Active',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=100&h=100&fit=crop',
      title: 'Luxury Penthouse',
      location: 'Banani, Dhaka',
      price: '৳35,000',
      status: 'Pending',
    },
  ];

  const bookings = [
    { id: 1, customer: 'Ahmed Khan', property: 'Modern Apartment', date: '2024-02-10', status: 'Approved' },
    { id: 2, customer: 'Fatima Rahman', property: 'Bachelor Flat', date: '2024-02-09', status: 'Approved' },
    { id: 3, customer: 'Rahim Hossain', property: 'Family House', date: '2024-02-08', status: 'Pending' },
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 85000 },
    { month: 'Feb', revenue: 95000 },
    { month: 'Mar', revenue: 78000 },
    { month: 'Apr', revenue: 102000 },
    { month: 'May', revenue: 115780 },
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-lg fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2 rounded-xl">
              <Building2 className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">HouseRentBD</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="size-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="px-8 py-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-sm text-gray-600">Welcome back, Admin!</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">administrator@houserentbd.com</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className={`bg-gradient-to-br ${stat.bgColor} border-none shadow-lg hover:shadow-xl transition-shadow rounded-2xl`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl shadow-lg`}>
                        <Icon className="size-6 text-white" />
                      </div>
                      <TrendingUp className="size-5 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Revenue Chart */}
          <Card className="shadow-lg rounded-2xl border border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-5 text-blue-600" />
                Monthly Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700 w-12">{data.month}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-10 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full flex items-center justify-end pr-4 transition-all duration-500"
                        style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                      >
                        <span className="text-sm font-bold text-white">৳{data.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Admin Properties List */}
            <Card className="shadow-lg rounded-2xl border border-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="size-5 text-blue-600" />
                  Properties List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div key={property.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-16 h-16 rounded-xl object-cover shadow-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{property.title}</h3>
                        <p className="text-sm text-gray-600">{property.location}</p>
                        <p className="text-sm font-semibold text-blue-600 mt-1">{property.price}/mo</p>
                      </div>
                      <Badge className={property.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {property.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Booking Today List */}
            <Card className="shadow-lg rounded-2xl border border-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="size-5 text-blue-600" />
                  Bookings Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{booking.customer}</h3>
                        <Badge className={booking.status === 'Approved' ? 'bg-green-500' : 'bg-yellow-500'}>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{booking.property}</p>
                      <p className="text-xs text-gray-500">{booking.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
