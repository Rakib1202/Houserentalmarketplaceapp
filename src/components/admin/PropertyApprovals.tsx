import { useEffect, useState } from 'react';
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  MapPin,
  DollarSign,
  User,
  Calendar
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { propertiesAPI } from '../../utils/api';

interface PendingProperty {
  id: string;
  title: string;
  description: string;
  location: string;
  area: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  ownerName: string;
  ownerId: string;
  ownerPhone: string;
  createdAt: string;
  images: string[];
}

export function PropertyApprovals() {
  const [pendingProperties, setPendingProperties] = useState<PendingProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingProperties();
  }, []);

  const fetchPendingProperties = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/properties/pending`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setPendingProperties(data.properties);
      }
    } catch (error) {
      console.error('Error fetching pending properties:', error);
      toast.error('Failed to load pending properties');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (propertyId: string) => {
    if (!confirm('Are you sure you want to approve this property?')) return;

    try {
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/properties/${propertyId}/approve`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success('Property approved successfully');
        fetchPendingProperties();
      } else {
        toast.error('Failed to approve property');
      }
    } catch (error) {
      console.error('Error approving property:', error);
      toast.error('Failed to approve property');
    }
  };

  const handleReject = async (propertyId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/properties/${propertyId}/reject`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ reason: rejectionReason }),
        }
      );

      if (response.ok) {
        toast.success('Property rejected');
        setSelectedProperty(null);
        setRejectionReason('');
        fetchPendingProperties();
      } else {
        toast.error('Failed to reject property');
      }
    } catch (error) {
      console.error('Error rejecting property:', error);
      toast.error('Failed to reject property');
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
        <h1 className="text-2xl font-bold">Property Approvals</h1>
        <p className="text-gray-600">Review and approve pending property listings</p>
      </div>

      {/* Pending Count */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 p-2 rounded-lg">
              <Building2 className="size-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-yellow-900">
                {pendingProperties.length} Properties Awaiting Approval
              </p>
              <p className="text-sm text-yellow-700">Review each listing carefully before approval</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Properties */}
      <div className="grid grid-cols-1 gap-6">
        {pendingProperties.map((property) => (
          <Card key={property.id} className="border-2 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{property.title}</h3>
                    <Badge className="bg-yellow-500">Pending Review</Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{property.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-gray-500" />
                      <div>
                        <p className="text-gray-500">Location</p>
                        <p className="font-medium">{property.area}, {property.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="size-4 text-gray-500" />
                      <div>
                        <p className="text-gray-500">Rent Price</p>
                        <p className="font-medium">৳{property.price.toLocaleString()}/month</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-gray-500" />
                      <div>
                        <p className="text-gray-500">Property Type</p>
                        <p className="font-medium capitalize">{property.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-gray-500" />
                      <div>
                        <p className="text-gray-500">Owner</p>
                        <p className="font-medium">{property.ownerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-gray-500" />
                      <div>
                        <p className="text-gray-500">Submitted</p>
                        <p className="font-medium">
                          {new Date(property.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">Configuration</p>
                      <p className="font-medium">{property.bedrooms} Bed • {property.bathrooms} Bath</p>
                    </div>
                  </div>

                  {/* Owner Contact */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Owner Contact: {property.ownerPhone}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedProperty === property.id ? (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Enter rejection reason..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(property.id)}
                    >
                      Confirm Rejection
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedProperty(null);
                        setRejectionReason('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(property.id)}
                  >
                    <CheckCircle className="size-4 mr-2" />
                    Approve Property
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setSelectedProperty(property.id)}
                  >
                    <XCircle className="size-4 mr-2" />
                    Reject Property
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {pendingProperties.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="size-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">All Caught Up!</p>
              <p className="text-gray-600">No pending property approvals at the moment</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
