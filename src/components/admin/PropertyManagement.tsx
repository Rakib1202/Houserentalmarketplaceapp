import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { 
  Building2, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin,
  DollarSign,
  Star,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { propertiesAPI } from '../../utils/api';

interface Property {
  id: string;
  title: string;
  location: string;
  area: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  status: 'active' | 'pending' | 'rejected' | 'featured';
  ownerName: string;
  ownerId: string;
  createdAt: string;
  views: number;
  featured: boolean;
  reported: boolean;
}

export function PropertyManagement() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/properties`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setProperties(data.properties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/properties/${propertyId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success('Property deleted successfully');
        fetchProperties();
      } else {
        toast.error('Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    }
  };

  const handleToggleFeatured = async (propertyId: string, currentStatus: boolean) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/properties/${propertyId}/featured`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ featured: !currentStatus }),
        }
      );

      if (response.ok) {
        toast.success(`Property ${!currentStatus ? 'featured' : 'unfeatured'} successfully`);
        fetchProperties();
      } else {
        toast.error('Failed to update property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property');
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.area.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    const matchesType = typeFilter === 'all' || property.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Property Management</h1>
          <p className="text-gray-600">Manage all property listings</p>
        </div>
        <Link to="/admin/properties/approvals">
          <Button>
            <AlertCircle className="size-4 mr-2" />
            Pending Approvals
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 size-4 text-gray-400" />
              <Input
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="bachelor">Bachelor</SelectItem>
                <SelectItem value="sublet">Sublet</SelectItem>
                <SelectItem value="hostel">Hostel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Properties List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <Building2 className="size-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{property.title}</h3>
                        {property.featured && (
                          <Badge className="bg-yellow-500">
                            <Star className="size-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {property.reported && (
                          <Badge variant="destructive">
                            <AlertCircle className="size-3 mr-1" />
                            Reported
                          </Badge>
                        )}
                        <Badge
                          variant={
                            property.status === 'active' ? 'default' :
                            property.status === 'pending' ? 'secondary' :
                            'destructive'
                          }
                        >
                          {property.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4" />
                          <span>{property.area}, {property.location}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span>{property.bedrooms} Bed</span>
                          <span>•</span>
                          <span>{property.bathrooms} Bath</span>
                          <span>•</span>
                          <span className="capitalize">{property.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="size-4" />
                          <span className="font-semibold text-blue-600">৳{property.price.toLocaleString()}/month</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Eye className="size-3" />
                          <span>{property.views} views</span>
                          <span>•</span>
                          <span>Owner: {property.ownerName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleFeatured(property.id, property.featured)}
                  >
                    <Star className="size-4 mr-1" />
                    {property.featured ? 'Unfeature' : 'Feature'}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="size-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteProperty(property.id)}
                  >
                    <Trash2 className="size-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredProperties.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="size-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No properties found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
