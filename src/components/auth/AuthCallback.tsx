import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';

export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get Google credential from URL
        const credential = searchParams.get('credential');
        const role = searchParams.get('role') || 'tenant';
        
        if (!credential) {
          throw new Error('No credential found');
        }

        // Note: Google OAuth callback is handled by the Login component
        // This component is kept for backward compatibility
        // Redirect to login page
        toast.info('Please complete login through the main login page');
        navigate('/login');
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error(error instanceof Error ? error.message : 'Authentication failed');
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}