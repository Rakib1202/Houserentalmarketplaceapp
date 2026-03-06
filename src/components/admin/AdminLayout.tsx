import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  Camera, 
  AlertCircle, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  CheckCircle,
  DollarSign,
  FileText,
  Briefcase,
  MessageSquare
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/properties', icon: Building2, label: 'Properties' },
  { path: '/admin/properties/approvals', icon: CheckCircle, label: 'Approvals' },
  { path: '/admin/properties/upload', icon: Camera, label: 'Upload Property' },
  { path: '/admin/users', icon: Users, label: 'User Management' },
  { path: '/admin/jobs', icon: Briefcase, label: 'Job Management' },
  { path: '/admin/livechat/employees', icon: MessageSquare, label: 'Live Chat Employees' },
  { path: '/admin/crm', icon: Users, label: 'CRM Dashboard' },
  { path: '/admin/cms', icon: FileText, label: 'CMS Dashboard' },
  { path: '/admin/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { path: '/admin/payments', icon: DollarSign, label: 'Payments' },
  { path: '/admin/photos', icon: Camera, label: 'Photo Approvals' },
  { path: '/admin/earnings', icon: DollarSign, label: 'Employee Earnings' },
  { path: '/admin/reports', icon: AlertCircle, label: 'Reports & Complaints' },
  { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/admin/logs', icon: FileText, label: 'Activity Logs' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      navigate('/admin-login');
      return;
    }
    setAdmin(JSON.parse(adminData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/admin-login');
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col fixed h-full z-50`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-xs text-gray-400">Dhaka Rent</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors ${
                  isActive ? 'bg-gray-800 border-l-4 border-blue-500' : ''
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <Icon className="size-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut className="size-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}
      >
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              {navItems.find(item => item.path === location.pathname)?.label || 'Admin Panel'}
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="size-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {admin.name?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}