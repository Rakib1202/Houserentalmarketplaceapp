import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { authAPI } from '../utils/api';

interface TestAccount {
  phone: string;
  name: string;
  role: string;
  description: string;
}

const testAccounts: TestAccount[] = [
  {
    phone: '01700000000',
    name: 'Admin User',
    role: 'admin',
    description: 'Full platform access, approve properties & users',
  },
  {
    phone: '01711111111',
    name: 'John Tenant',
    role: 'tenant',
    description: 'Search properties, save favorites, send inquiries',
  },
  {
    phone: '01722222222',
    name: 'Sarah Owner',
    role: 'owner',
    description: 'List properties, manage inquiries',
  },
  {
    phone: '01733333333',
    name: 'Mike Agent',
    role: 'agent',
    description: 'Manage multiple listings, verified badge',
  },
  {
    phone: '01744444444',
    name: 'Lisa Employee',
    role: 'employee',
    description: 'Upload photos, track earnings',
  },
];

export function QuickTestLogin() {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [accounts, setAccounts] = useState<Record<string, string>>({});

  const createTestAccounts = async () => {
    setCreating(true);
    const newAccounts: Record<string, string> = {};

    try {
      for (const account of testAccounts) {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-449053da/signup`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              phone: account.phone,
              name: account.name,
              role: account.role,
            }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          newAccounts[account.phone] = data.password;
        }
      }

      setAccounts(newAccounts);
      toast.success('All test accounts created!');
    } catch (error) {
      console.error('Error creating test accounts:', error);
      toast.error('Failed to create test accounts');
    } finally {
      setCreating(false);
    }
  };

  const handleLogin = async (phone: string, password: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ phone, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success('Logged in successfully!');
      navigate(`/${data.user.role}`);
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Quick Test Login</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(accounts).length === 0 ? (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Create test accounts for all user roles to quickly test the app.
            </p>
            <Button onClick={createTestAccounts} disabled={creating} className="w-full">
              {creating ? 'Creating Accounts...' : 'Create Test Accounts'}
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              Click any account below to login instantly:
            </p>
            {testAccounts.map((account) => (
              <div
                key={account.phone}
                className="flex items-center justify-between p-4 border rounded hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{account.name}</h4>
                    <Badge variant="outline">{account.role}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{account.description}</p>
                  <p className="text-xs text-gray-500">
                    Phone: {account.phone} | Password: {accounts[account.phone]}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleLogin(account.phone, accounts[account.phone])}
                >
                  Login
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
