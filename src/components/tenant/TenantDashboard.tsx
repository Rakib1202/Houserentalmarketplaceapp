import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Heart, MessageSquare, Search, Crown } from 'lucide-react';
import { PropertyCard } from '../property/PropertyCard';
import { toast } from 'sonner';
import { favoritesAPI, inquiriesAPI } from '../../utils/api';
import type { User, Property, Inquiry } from '../../types';

export function TenantDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');

    if (!userStr || !accessToken) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);

    if (parsedUser.role !== 'tenant') {
      navigate(`/${parsedUser.role}`);
      return;
    }

    fetchData(accessToken);
  }, []);

  const fetchData = async (accessToken: string) => {
    setLoading(true);
    try {
      // Fetch favorites
      const favData = await favoritesAPI.getAll();
      setFavorites(favData.favorites);

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

  const removeFavorite = async (propertyId: string) => {
    try {
      await favoritesAPI.remove(propertyId);
      setFavorites(favorites.filter((p) => p.id !== propertyId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
  };

  if (!user) {
    return null;
  }

  const isPremium = user.premium;

  return (
    <DashboardLayout user={user}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Find your perfect home in Dhaka</p>
        </div>

        {/* Premium Upgrade Banner */}
        {!isPremium && (
          <Card className="col-span-full bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
            <CardContent className="p-6 flex items-center gap-4">
              <Crown className="size-12 text-yellow-600" />
              <div>
                <h3 className="text-xl font-semibold text-yellow-900 mb-1">
                  Upgrade to Premium
                </h3>
                <p className="text-yellow-800">
                  Unlock full property addresses, direct owner contacts, and priority support
                </p>
              </div>
              <Link to="/pricing" className="ml-auto">
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  Upgrade Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/search">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Search className="size-12 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold text-lg mb-1">Search Properties</h3>
                <p className="text-sm text-gray-600">Find your perfect home</p>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="size-12 mx-auto mb-3 text-red-500" />
              <h3 className="font-semibold text-lg mb-1">{favorites.length} Favorites</h3>
              <p className="text-sm text-gray-600">Saved properties</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="size-12 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold text-lg mb-1">{inquiries.length} Inquiries</h3>
              <p className="text-sm text-gray-600">Sent messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="favorites" className="w-full">
          <TabsList>
            <TabsTrigger value="favorites">Saved Properties</TabsTrigger>
            <TabsTrigger value="inquiries">My Inquiries</TabsTrigger>
          </TabsList>

          <TabsContent value="favorites" className="mt-6">
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : favorites.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="size-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No saved properties</h3>
                  <p className="text-gray-500 mb-4">
                    Start saving properties you like to view them here
                  </p>
                  <Link to="/search">
                    <Button>Search Properties</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onFavorite={removeFavorite}
                    isFavorite={true}
                  />
                ))}
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
                  <p className="text-gray-500 mb-4">
                    Contact property owners to get more information
                  </p>
                  <Link to="/search">
                    <Button>Browse Properties</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <Card key={inquiry.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{inquiry.propertyTitle}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            Sent on {new Date(inquiry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            inquiry.status === 'contacted' ? 'default' : 'secondary'
                          }
                        >
                          {inquiry.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{inquiry.message}</p>
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