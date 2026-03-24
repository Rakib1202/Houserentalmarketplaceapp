import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Home, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { authAPI } from '../../utils/api';
import { GoogleSignIn } from './GoogleSignIn';
import type { UserRole } from '../../types';

export function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'details' | 'otp' | 'password'>('details');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('tenant');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    
    if (!phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    
    if (!role) {
      toast.error('Please select your role');
      return;
    }
    
    setLoading(true);

    try {
      // Demo mode: Generate and store a demo OTP for testing
      // In production, remove this and use real Supabase SMS
      const demoOTP = '123456';
      sessionStorage.setItem(`demo_otp_${phone}`, demoOTP);
      sessionStorage.setItem(`demo_signup_data_${phone}`, JSON.stringify({ name, role, phone }));
      
      toast.success(`OTP sent! Demo OTP: ${demoOTP} (In production, this will be sent via SMS)`, {
        duration: 5000
      });
      setStep('otp');
      
      /* Production code - Uncomment after setting up SMS provider in Supabase:
      const formattedPhone = phone.startsWith('+88') ? phone : `+88${phone}`;
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      toast.success('OTP sent to your phone!');
      setStep('otp');
      */
    } catch (error) {
      console.error('OTP send error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Demo mode: Verify against stored demo OTP
      const storedDemoOTP = sessionStorage.getItem(`demo_otp_${phone}`);
      const signupData = JSON.parse(sessionStorage.getItem(`demo_signup_data_${phone}`) || '{}');
      
      if (otp !== storedDemoOTP) {
        throw new Error('Invalid OTP. Please use: 123456');
      }

      // OTP verified - proceed to password setup
      sessionStorage.removeItem(`demo_otp_${phone}`);
      
      toast.success('Phone verified! Now set your password.');
      setStep('password');

      /* TODO: Implement with real SMS provider
      // Check if user already exists
      // Create user profile
      // Verify OTP via SMS provider API
      */
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error instanceof Error ? error.message : 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const signupData = JSON.parse(sessionStorage.getItem(`demo_signup_data_${phone}`) || '{}');

      // Call MongoDB API to create user account
      const response: any = await authAPI.signup({
        fullName: signupData.name || name,
        phone: signupData.phone || phone,
        password: password,
        role: signupData.role || role
      });

      // Clean up session storage
      sessionStorage.removeItem(`demo_signup_data_${phone}`);

      toast.success('Account created successfully! Please login with your phone and password.');
      navigate('/login');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
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
            <CardTitle>
              {step === 'details' && 'Create Account'}
              {step === 'otp' && 'Verify Phone'}
              {step === 'password' && 'Set Password'}
            </CardTitle>
            <CardDescription>
              {step === 'details' && 'Join Dhaka Rent marketplace today'}
              {step === 'otp' && 'Enter the OTP sent to your phone'}
              {step === 'password' && 'Create a password for your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'details' && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="01XXXXXXXXX or +8801XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter with country code (+880) or without (01...)
                  </p>
                </div>

                <div>
                  <Label htmlFor="role">I am a...</Label>
                  <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tenant">Tenant (Looking for rent)</SelectItem>
                      <SelectItem value="owner">Property Owner</SelectItem>
                      <SelectItem value="agent">Real Estate Agent</SelectItem>
                      <SelectItem value="employee">Executive Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <GoogleSignIn />

                <p className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 hover:underline">
                    Login
                  </Link>
                </p>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
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
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep('details')}
                >
                  Back
                </Button>
              </form>
            )}

            {step === 'password' && (
              <form onSubmit={handleSetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password (min 6 characters)"
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

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-5 transition-transform duration-200 hover:scale-110" />
                      ) : (
                        <Eye className="size-5 transition-transform duration-200 hover:scale-110" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Complete Signup'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}