import { useEffect, useState } from 'react';
import { Camera, CheckCircle, XCircle, User, MapPin } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { photoUploadsAPI } from '../../utils/api';

interface PendingPhoto {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  employeeId: string;
  employeeName: string;
  imageUrl: string;
  uploadedAt: string;
  earningAmount: number;
}

export function PhotoApprovalManagement() {
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingPhotos();
  }, []);

  const fetchPendingPhotos = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/photos/pending`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setPendingPhotos(data.photos);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (photoId: string) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/photos/${photoId}/approve`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success('Photo approved and earning credited');
        fetchPendingPhotos();
      }
    } catch (error) {
      console.error('Error approving photo:', error);
      toast.error('Failed to approve photo');
    }
  };

  const handleReject = async (photoId: string) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/photos/${photoId}/reject`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success('Photo rejected');
        fetchPendingPhotos();
      }
    } catch (error) {
      console.error('Error rejecting photo:', error);
      toast.error('Failed to reject photo');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Photo Approval</h1>
        <p className="text-gray-600">Review employee-uploaded property photos</p>
      </div>

      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Camera className="size-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-orange-900">
                {pendingPhotos.length} Photos Awaiting Approval
              </p>
              <p className="text-sm text-orange-700">
                Each approved photo earns ৳5 for the employee
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingPhotos.map((photo) => (
          <Card key={photo.id}>
            <CardContent className="p-4">
              <img
                src={photo.imageUrl}
                alt={photo.propertyTitle}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h3 className="font-semibold mb-2">{photo.propertyTitle}</h3>
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  <span>{photo.propertyLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="size-4" />
                  <span>{photo.employeeName}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Badge className="bg-green-500">৳{photo.earningAmount} Earning</Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(photo.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(photo.id)}
                >
                  <CheckCircle className="size-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleReject(photo.id)}
                >
                  <XCircle className="size-4 mr-1" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {pendingPhotos.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <Camera className="size-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No pending photos</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
