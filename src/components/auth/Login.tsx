import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Home, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supportEmployeesAPI, authAPI } from '../../utils/api';
import { GoogleSignIn } from './GoogleSignIn';
import type { User } from '../../types';

export function Login() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<'user' | 'support'>('user'); // NEW: Login type selector
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [phone, setPhone] = useState('');
  const [employeeId, setEmployeeId] = useState(''); // NEW: For support employee login
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSupportLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call MongoDB API for support employee login
      const response: any = await supportEmployeesAPI.login({
        employeeId,
        password
      });

      // Store auth token and employee data
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('supportEmployee', JSON.stringify(response.employee));

      toast.success(`Welcome, ${response.employee.name}!`);

      // Navigate to support dashboard
      navigate('/support-dashboard');
    } catch (error: any) {
      console.error('Support login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call MongoDB API for user login
      const response: any = await authAPI.login({ phone, password });

      // Store auth token and user data
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      toast.success('Login successful!');

      // Navigate based on user role
      const role = response.user.role;
      switch (role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'owner':
          navigate('/owner/dashboard');
          break;
        case 'tenant':
          navigate('/tenant/dashboard');
          break;
        case 'agent':
          navigate('/agent/dashboard');
          break;
        case 'employee':
          navigate('/employee/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setLoading(true);

    try {
      // Demo mode: Generate demo OTP
      const demoOTP = '123456';
      sessionStorage.setItem(`demo_login_otp_${phone}`, demoOTP);
      
      toast.success(`OTP sent! Demo OTP: ${demoOTP} (In production, this will be sent via SMS)`);
      setOtpSent(true);
      
      /* Production code - Uncomment after setting up SMS provider:
      const formattedPhone = phone.startsWith('+88') ? phone : `+88${phone}`;
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      toast.success('OTP sent to your phone!');
      setOtpSent(true);
      */
    } catch (error) {
      console.error('OTP send error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // OTP login - to be implemented with SMS provider
      toast.info('OTP login will be available soon. Please use password login for now.');
      
      /* TODO: Implement with SMS provider
      // Demo mode: Verify against stored demo OTP
      const storedDemoOTP = sessionStorage.getItem(`demo_login_otp_${phone}`);
      
      if (otp !== storedDemoOTP) {
        throw new Error('Invalid OTP');
      }

      // Call MongoDB API for OTP verification
      const response: any = await authAPI.login({ phone, otp });

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      sessionStorage.removeItem(`demo_login_otp_${phone}`);

      toast.success('Login successful!');

      // Navigate based on user role
      const role = response.user.role;
      switch (role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'owner':
          navigate('/owner/dashboard');
          break;
        case 'tenant':
          navigate('/tenant/dashboard');
          break;
        case 'agent':
          navigate('/agent/dashboard');
          break;
        case 'employee':
          navigate('/employee/dashboard');
          break;
        default:
          navigate('/');
      }
      */
    } catch (error) {
      console.error('OTP login error:', error);
      toast.error(error instanceof Error ? error.message : 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Google OAuth - to be implemented
      toast.info('Google login will be available soon. Please use password login for now.');
      
      /* TODO: Implement with OAuth provider
      // This will be implemented with a proper OAuth provider
      */
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to login with Google');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Home className="size-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Dhaka Rent</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Login to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Login Type Toggle */}
            <div className="flex gap-2 mb-6">
              <Button
                type="button"
                variant={loginType === 'user' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setLoginType('user')}
              >
                User Login
              </Button>
              <Button
                type="button"
                variant={loginType === 'support' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setLoginType('support')}
              >
                Support Login
              </Button>
            </div>

            {loginType === 'support' ? (
              <form onSubmit={handleSupportLogin} className="space-y-4">
                <div>
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    type="text"
                    placeholder="Enter your employee ID"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                  />
                </div>

                <div className="relative">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="size-5 transition-transform duration-200 hover:scale-110" />
                      ) : (
                        <Eye className="size-5 transition-transform duration-200 hover:scale-110" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            ) : (
              <>
                {/* Login Method Toggle */}
                <div className="flex gap-2 mb-6">
                  <Button
                    type="button"
                    variant={loginMethod === 'password' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      setLoginMethod('password');
                      setOtpSent(false);
                    }}
                  >
                    Password
                  </Button>
                  <Button
                    type="button"
                    variant={loginMethod === 'otp' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      setLoginMethod('otp');
                      setOtpSent(false);
                    }}
                  >
                    OTP
                  </Button>
                </div>

                {loginMethod === 'password' ? (
                  <form onSubmit={handlePasswordLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="relative">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pr-10"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="size-5 transition-transform duration-200 hover:scale-110" />
                          ) : (
                            <Eye className="size-5 transition-transform duration-200 hover:scale-110" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {!otpSent ? (
                      <>
                        <div>
                          <Label htmlFor="phone-otp">Phone Number</Label>
                          <Input
                            id="phone-otp"
                            type="tel"
                            placeholder="01XXXXXXXXX or +8801XXXXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                          />
                        </div>
                        <Button onClick={handleSendOTP} className="w-full" disabled={loading}>
                          {loading ? 'Sending OTP...' : 'Send OTP'}
                        </Button>
                      </>
                    ) : (
                      <form onSubmit={handleOTPLogin} className="space-y-4">
                        <div>
                          <Label htmlFor="otp">OTP Code</Label>
                          <Input
                            id="otp"
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? 'Verifying...' : 'Verify & Login'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => setOtpSent(false)}
                        >
                          Resend OTP
                        </Button>
                      </form>
                    )}
                  </div>
                )}
              </>
            )}

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <GoogleSignIn />

            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>

            <p className="text-center text-sm text-gray-600 mt-2">
              <Link to="/admin-login" className="text-slate-600 hover:underline">
                Admin Login →
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}