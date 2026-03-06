import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Shield, Home } from 'lucide-react';
import { toast } from 'sonner';
import { authAPI } from '../../utils/api';

export function AdminLogin() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if admin is already logged in
  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    const adminToken = localStorage.getItem('adminToken');
    
    if (adminData && adminToken) {
      // Already logged in, redirect to admin dashboard
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Demo mode: Accept demo admin credentials
      const isDemoLogin = (phone === 'admin' || phone === '01700000000' || phone === 'demo') && 
                         (password === 'admin' || password === 'admin123' || password === 'demo');
      
      if (isDemoLogin) {
        // Demo admin user data
        const demoAdminUser = {
          id: 'admin-demo-001',
          phone: phone,
          role: 'admin',
          name: 'Demo Admin',
          email: 'admin@houserentbd.com',
        };

        // Store auth token and user data - use 'admin' and 'adminToken' keys
        localStorage.setItem('adminToken', 'demo-admin-token');
        localStorage.setItem('admin', JSON.stringify(demoAdminUser));

        toast.success('Admin login successful! (Demo Mode)');
        navigate('/admin');
        setLoading(false);
        return;
      }

      // Real API login using MongoDB backend
      const data = await authAPI.adminLogin({ phone, password });

      // Verify admin role
      if (data.user.role !== 'admin') {
        throw new Error('Admin access required. Please use regular login.');
      }

      // Store auth token and user data - use 'admin' and 'adminToken' keys
      localStorage.setItem('adminToken', data.accessToken);
      localStorage.setItem('admin', JSON.stringify(data.user));

      toast.success('Admin login successful!');
      navigate('/admin');
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Home className="size-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">Dhaka Rent</span>
          </Link>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-2 justify-center mb-2">
              <Shield className="size-8 text-blue-400" />
            </div>
            <CardTitle className="text-white text-center">Admin Panel</CardTitle>
            <CardDescription className="text-slate-400 text-center">
              Restricted access for administrators only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-slate-200">Admin Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-slate-900/50 border-slate-600 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900/50 border-slate-600 text-white"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? 'Logging in...' : 'Admin Login'}
              </Button>

              <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3 mt-4">
                <p className="text-xs text-blue-300 text-center font-medium mb-1">
                  Demo Mode Credentials
                </p>
                <p className="text-xs text-blue-200 text-center">
                  Phone: <span className="font-mono font-semibold">admin</span> | Password: <span className="font-mono font-semibold">admin</span>
                </p>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <p className="text-center text-sm text-slate-400">
                  Regular user?{' '}
                  <Link to="/login" className="text-blue-400 hover:underline">
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-500 mt-4">
          This panel is for authorized administrators only. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}