import { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  Shield, 
  ShieldOff, 
  CheckCircle, 
  XCircle,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { usersAPI } from '../../utils/api';

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'tenant' | 'owner' | 'agent' | 'employee';
  verified: boolean;
  premium: boolean;
  blocked: boolean;
  createdAt: string;
  totalListings?: number;
  totalInquiries?: number;
  totalPhotos?: number;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId: string, currentStatus: boolean) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/users/${userId}/block`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ blocked: !currentStatus }),
        }
      );

      if (response.ok) {
        toast.success(`User ${!currentStatus ? 'blocked' : 'unblocked'} successfully`);
        fetchUsers();
      } else {
        toast.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleToggleVerify = async (userId: string, currentStatus: boolean) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/users/${userId}/verify`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ verified: !currentStatus }),
        }
      );

      if (response.ok) {
        toast.success(`User ${!currentStatus ? 'verified' : 'unverified'} successfully`);
        fetchUsers();
      } else {
        toast.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user status');
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'tenant': return 'bg-blue-500';
      case 'owner': return 'bg-green-500';
      case 'agent': return 'bg-purple-500';
      case 'employee': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-gray-600">Manage all platform users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Tenants</p>
            <p className="text-2xl font-bold">{users.filter(u => u.role === 'tenant').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Property Owners</p>
            <p className="text-2xl font-bold">{users.filter(u => u.role === 'owner').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Premium Users</p>
            <p className="text-2xl font-bold">{users.filter(u => u.premium).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 size-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="tenant">Tenants</SelectItem>
                <SelectItem value="owner">Property Owners</SelectItem>
                <SelectItem value="agent">Premium Agents</SelectItem>
                <SelectItem value="employee">Employees</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`${getRoleColor(user.role)} size-12 rounded-full flex items-center justify-center text-white font-semibold text-lg`}>
                    {user.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role.toUpperCase()}
                      </Badge>
                      {user.premium && (
                        <Badge className="bg-yellow-500">Premium</Badge>
                      )}
                      {user.verified && (
                        <Badge className="bg-green-500">
                          <CheckCircle className="size-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {user.blocked && (
                        <Badge variant="destructive">Blocked</Badge>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="size-4" />
                        <span>{user.phone}</span>
                      </div>
                      {user.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="size-4" />
                          <span>{user.email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4" />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        {user.totalListings !== undefined && (
                          <span>{user.totalListings} listings</span>
                        )}
                        {user.totalInquiries !== undefined && (
                          <span>{user.totalInquiries} inquiries</span>
                        )}
                        {user.totalPhotos !== undefined && (
                          <span>{user.totalPhotos} photos uploaded</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant={user.verified ? 'outline' : 'default'}
                    onClick={() => handleToggleVerify(user.id, user.verified)}
                  >
                    {user.verified ? (
                      <>
                        <XCircle className="size-4 mr-1" />
                        Unverify
                      </>
                    ) : (
                      <>
                        <CheckCircle className="size-4 mr-1" />
                        Verify
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant={user.blocked ? 'default' : 'destructive'}
                    onClick={() => handleToggleBlock(user.id, user.blocked)}
                  >
                    {user.blocked ? (
                      <>
                        <Shield className="size-4 mr-1" />
                        Unblock
                      </>
                    ) : (
                      <>
                        <ShieldOff className="size-4 mr-1" />
                        Block
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="size-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No users found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
