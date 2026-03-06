import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Plus, Home, MessageSquare, Clock } from 'lucide-react';
import { PropertyCard } from '../property/PropertyCard';
import { PropertyForm } from '../property/PropertyForm';
import { toast } from 'sonner';
import { propertiesAPI, inquiriesAPI } from '../../utils/api';
import type { User, Property, Inquiry } from '../../types';

export function OwnerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');

    if (!userStr || !accessToken) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);

    if (!['owner', 'agent'].includes(parsedUser.role)) {
      navigate(`/${parsedUser.role}`);
      return;
    }

    fetchData(accessToken, parsedUser.id);
  }, []);

  const fetchData = async (accessToken: string, userId: string) => {
    setLoading(true);
    try {
      // Fetch all properties
      const propsData = await propertiesAPI.getAll({ status: 'all' });
      // Filter to only user's properties
      const myProperties = propsData.properties.filter((p: Property) => p.ownerId === userId);
      setProperties(myProperties);

      // Fetch inquiries
      const inqData = await inquiriesAPI.getAll();
      setInquiries(inqData.inquiries);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await propertiesAPI.delete(propertyId);
      setProperties(properties.filter((p) => p.id !== propertyId));
      toast.success('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProperty(undefined);
    // Refresh data
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && user) {
      fetchData(accessToken, user.id);
    }
  };

  if (!user) {
    return null;
  }

  if (showForm) {
    return (
      <DashboardLayout user={user}>
        <div className="max-w-4xl mx-auto">
          <PropertyForm
            property={editingProperty}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingProperty(undefined);
            }}
          />
        </div>
      </DashboardLayout>
    );
  }

  const pendingProperties = properties.filter((p) => p.status === 'pending');
  const approvedProperties = properties.filter((p) => p.status === 'approved');
  const rejectedProperties = properties.filter((p) => p.status === 'rejected');

  return (
    <DashboardLayout user={user}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user.role === 'agent' ? 'Agent Dashboard' : 'Property Management'}
            </h1>
            <p className="text-gray-600">Manage your property listings</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="size-5" />
            Add Property
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Home className="size-12 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold text-2xl mb-1">{properties.length}</h3>
              <p className="text-sm text-gray-600">Total Properties</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="size-12 mx-auto mb-3 text-yellow-600" />
              <h3 className="font-semibold text-2xl mb-1">{pendingProperties.length}</h3>
              <p className="text-sm text-gray-600">Pending Approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Home className="size-12 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold text-2xl mb-1">{approvedProperties.length}</h3>
              <p className="text-sm text-gray-600">Approved</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="size-12 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold text-2xl mb-1">{inquiries.length}</h3>
              <p className="text-sm text-gray-600">Inquiries</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Properties</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : properties.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Home className="size-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No properties yet
                  </h3>
                  <p className="text-gray-500 mb-4">Start by adding your first property</p>
                  <Button onClick={() => setShowForm(true)} className="gap-2">
                    <Plus className="size-5" />
                    Add Property
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Pending */}
                {pendingProperties.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Clock className="size-5 text-yellow-600" />
                      Pending Approval ({pendingProperties.length})
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pendingProperties.map((property) => (
                        <div key={property.id}>
                          <PropertyCard property={property} showStatus />
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                setEditingProperty(property);
                                setShowForm(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(property.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Approved */}
                {approvedProperties.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Home className="size-5 text-green-600" />
                      Approved ({approvedProperties.length})
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {approvedProperties.map((property) => (
                        <div key={property.id}>
                          <PropertyCard property={property} showStatus />
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                setEditingProperty(property);
                                setShowForm(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(property.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rejected */}
                {rejectedProperties.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-red-600">
                      Rejected ({rejectedProperties.length})
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {rejectedProperties.map((property) => (
                        <div key={property.id}>
                          <PropertyCard property={property} showStatus />
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                setEditingProperty(property);
                                setShowForm(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(property.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inquiries" className="mt-6">
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : inquiries.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="size-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No inquiries yet</h3>
                  <p className="text-gray-500">
                    When tenants contact you, inquiries will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <Card key={inquiry.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{inquiry.propertyTitle}</h3>
                          <p className="text-sm text-gray-600">
                            From: {inquiry.tenantName} ({inquiry.tenantPhone})
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge>{inquiry.status}</Badge>
                      </div>
                      <p className="text-gray-700 mb-4">{inquiry.message}</p>
                      <div className="flex gap-2">
                        <Button size="sm" asChild>
                          <a href={`tel:${inquiry.tenantPhone}`}>Call Tenant</a>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={`https://wa.me/${inquiry.tenantPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            WhatsApp
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
