import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { authAPI } from '../../utils/api';
import { toast } from 'sonner@2.0.3';

interface GoogleSignInProps {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  role?: 'tenant' | 'owner' | 'agent' | 'employee';
  className?: string;
}

declare global {
  interface Window {
    google?: any;
  }
}

export function GoogleSignIn({ 
  onSuccess, 
  onError, 
  role = 'tenant',
  className = '' 
}: GoogleSignInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Google Sign-In script
    const loadGoogleScript = () => {
      if (window.google) {
        setIsScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeGoogle();
      };
      document.body.appendChild(script);
    };

    const initializeGoogle = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      
      if (!clientId || clientId.includes('YOUR_') || clientId.includes('DISABLED')) {
        console.info('Google OAuth is disabled. Phone + Password authentication is still available.');
        return;
      }

      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });

        setIsScriptLoaded(true);

        // Render the button
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          {
            theme: 'outline',
            size: 'large',
            width: 320,
            text: 'continue_with',
          }
        );
      }
    };

    loadGoogleScript();
  }, []);

  const handleCredentialResponse = async (response: any) => {
    setIsLoading(true);

    try {
      const result = await authAPI.googleLogin(response.credential, role);

      // Store token and user data
      if (result.accessToken) {
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('user', JSON.stringify(result.user));
      }

      toast.success(result.message || 'Signed in successfully!');

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      toast.error(error.message || 'Failed to sign in with Google');

      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSignIn = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isGoogleDisabled = !clientId || clientId.includes('YOUR_') || clientId.includes('DISABLED');
  
  if (isGoogleDisabled) {
    return null; // Silently hide Google Sign-In when disabled
  }

  return (
    <div className={className}>
      {isScriptLoaded ? (
        <div className="space-y-3">
          <div id="googleSignInButton" className="flex justify-center"></div>
          
          {isLoading && (
            <div className="text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="text-sm text-gray-600 mt-2">Signing in...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-600">Loading Google Sign-In...</span>
        </div>
      )}
    </div>
  );
}

// Alternative: Custom Google Sign-In Button
export function GoogleSignInButton({ 
  onSuccess, 
  onError, 
  role = 'tenant' 
}: GoogleSignInProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = () => {
    if (window.google) {
      setIsLoading(true);
      window.google.accounts.id.prompt((notification: any) => {
        setIsLoading(false);
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Handle error
          toast.error('Google Sign-In was dismissed');
        }
      });
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          <span>Signing in...</span>
        </>
      ) : (
        <>
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continue with Google</span>
        </>
      )}
    </Button>
  );
}
