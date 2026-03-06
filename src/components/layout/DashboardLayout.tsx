import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Home, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import type { User as UserType } from '../../types';

interface DashboardLayoutProps {
  children: ReactNode;
  user: UserType;
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const getRoleName = (role: string) => {
    const roleNames: Record<string, string> = {
      tenant: 'Tenant',
      owner: 'Property Owner',
      agent: 'Real Estate Agent',
      employee: 'Executive Employee',
      admin: 'Administrator',
    };
    return roleNames[role] || role;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Home className="size-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Dhaka Rent</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="size-5 text-gray-600" />
              <div className="text-sm">
                <div className="font-semibold">{user.name}</div>
                <div className="text-gray-500">{getRoleName(user.role)}</div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
