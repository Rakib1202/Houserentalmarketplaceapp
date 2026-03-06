import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Camera, DollarSign, Clock, CheckCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { photoUploadsAPI, employeeEarningsAPI } from '../../utils/api';
import type { User, EmployeePhoto } from '../../types';

interface EarningsSummary {
  totalEarnings: number;
  approvedPhotos: number;
  pendingPhotos: number;
  totalPhotos: number;
}

export function EmployeeDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [photos, setPhotos] = useState<EmployeePhoto[]>([]);
  const [earnings, setEarnings] = useState<EarningsSummary>({
    totalEarnings: 0,
    approvedPhotos: 0,
    pendingPhotos: 0,
    totalPhotos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [uploadForm, setUploadForm] = useState({
    area: '',
    photoUrl: '',
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');

    if (!userStr || !accessToken) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);

    if (parsedUser.role !== 'employee') {
      navigate(`/${parsedUser.role}`);
      return;
    }

    fetchData(accessToken);
  }, []);

  const fetchData = async (accessToken: string) => {
    setLoading(true);
    try {
      // Fetch photos
      const photosResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/employee/photos`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (photosResponse.ok) {
        const photosData = await photosResponse.json();
        setPhotos(photosData.photos);
      }

      // Fetch earnings
      const earningsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/employee/earnings`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (earningsResponse.ok) {
        const earningsData = await earningsResponse.json();
        setEarnings(earningsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadForm.area || !uploadForm.photoUrl) {
      toast.error('Please fill in all fields');
      return;
    }

    setUploading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/employee/photos`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(uploadForm),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      toast.success('Photo uploaded successfully! Waiting for admin approval.');
      setUploadForm({ area: '', photoUrl: '' });
      
      // Refresh data
      if (accessToken) {
        fetchData(accessToken);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Dashboard</h1>
          <p className="text-gray-600">Upload property photos and track your earnings</p>
        </div>

        {/* Earnings Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="size-12 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold text-2xl mb-1">৳{earnings.totalEarnings}</h3>
              <p className="text-sm text-gray-600">Total Earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="size-12 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold text-2xl mb-1">{earnings.approvedPhotos}</h3>
              <p className="text-sm text-gray-600">Approved Photos</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="size-12 mx-auto mb-3 text-yellow-600" />
              <h3 className="font-semibold text-2xl mb-1">{earnings.pendingPhotos}</h3>
              <p className="text-sm text-gray-600">Pending Review</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Camera className="size-12 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold text-2xl mb-1">{earnings.totalPhotos}</h3>
              <p className="text-sm text-gray-600">Total Uploads</p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="size-5" />
              Upload New Photo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="area">Area / Location</Label>
                <Input
                  id="area"
                  placeholder="e.g., Dhanmondi, Road 5"
                  value={uploadForm.area}
                  onChange={(e) => setUploadForm({ ...uploadForm, area: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="photoUrl">Photo URL</Label>
                <Input
                  id="photoUrl"
                  placeholder="Enter image URL"
                  value={uploadForm.photoUrl}
                  onChange={(e) => setUploadForm({ ...uploadForm, photoUrl: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload your image to a service like Imgur and paste the URL here
                </p>
              </div>

              {uploadForm.photoUrl && (
                <div>
                  <Label>Preview</Label>
                  <img
                    src={uploadForm.photoUrl}
                    alt="Preview"
                    className="w-full max-w-md h-64 object-cover rounded border"
                  />
                </div>
              )}

              <Button type="submit" disabled={uploading} className="w-full gap-2">
                <Camera className="size-4" />
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Photo History */}
        <Card>
          <CardHeader>
            <CardTitle>My Photos</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : photos.length === 0 ? (
              <div className="text-center py-12">
                <Camera className="size-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No photos uploaded yet</h3>
                <p className="text-gray-500">Start uploading photos to earn ৳5 per approved photo</p>
              </div>
            ) : (
              <div className="space-y-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="flex items-center gap-4 p-4 border rounded">
                    <img
                      src={photo.photoUrl}
                      alt={photo.area}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{photo.area}</h4>
                        <Badge variant={photo.approved ? 'default' : 'secondary'}>
                          {photo.approved ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Uploaded: {new Date(photo.createdAt).toLocaleDateString()}
                      </p>
                      {photo.approved && photo.approvedAt && (
                        <p className="text-sm text-green-600 font-semibold">
                          Earned: ৳{photo.earnings}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
