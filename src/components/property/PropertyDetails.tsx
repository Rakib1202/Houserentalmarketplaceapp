import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import {
  MapPin,
  Bed,
  Bath,
  Home,
  Phone,
  MessageCircle,
  Heart,
  ArrowLeft,
  Crown,
} from 'lucide-react';
import { toast } from 'sonner';
import { propertiesAPI, inquiriesAPI } from '../../utils/api';
import type { Property, User } from '../../types';

export function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const data = await propertiesAPI.getById(id as string);
      setProperty(data.property);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleInquiry = async () => {
    if (!user) {
      toast.error('Please login to send inquiry');
      navigate('/login');
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSubmitting(true);
    try {
      await inquiriesAPI.create({
        propertyId: id as string,
        message,
      });
      
      toast.success('Inquiry sent successfully!');
      setMessage('');
    } catch (error) {
      console.error('Error sending inquiry:', error);
      toast.error('Failed to send inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  const canViewFullDetails = user?.premium || user?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Property not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                {property.photos && property.photos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 p-2">
                    {property.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`${property.title} - ${index + 1}`}
                        className="w-full h-64 object-cover rounded"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-96 bg-gray-200 flex items-center justify-center">
                    <Home className="size-24 text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="size-5" />
                      {canViewFullDetails ? property.fullAddress || property.area : property.area}
                    </div>
                  </div>
                  {property.featured && (
                    <Badge className="bg-yellow-500 text-white">Featured</Badge>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <Bed className="size-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <Bath className="size-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <Home className="size-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">{property.size}</div>
                    <div className="text-sm text-gray-600">sqft</div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-gray-600">{property.description}</p>
                </div>

                <Separator className="my-4" />

                <div>
                  <h3 className="font-semibold text-lg mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities?.map((amenity, index) => (
                      <Badge key={index} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {property.rules && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Rules</h3>
                      <p className="text-gray-600">{property.rules}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="text-3xl font-bold text-blue-600">
                    ৳{property.rent.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">per month</div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Advance:</span>
                    <span className="font-semibold">৳{property.advance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tenant Type:</span>
                    <Badge variant="outline">{property.tenantType}</Badge>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Contact Info */}
                <div className="space-y-3">
                  {canViewFullDetails ? (
                    <>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Owner</div>
                        <div className="font-semibold">{property.ownerName}</div>
                      </div>
                      <Button className="w-full gap-2" asChild>
                        <a href={`tel:${property.ownerPhone}`}>
                          <Phone className="size-4" />
                          Call Owner
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full gap-2" asChild>
                        <a
                          href={`https://wa.me/${property.ownerPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="size-4" />
                          WhatsApp
                        </a>
                      </Button>
                    </>
                  ) : (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex items-start gap-2 mb-3">
                        <Crown className="size-5 text-yellow-600 mt-0.5" />
                        <div>
                          <div className="font-semibold text-yellow-900 mb-1">
                            Premium Feature
                          </div>
                          <div className="text-sm text-yellow-800">
                            Upgrade to premium to view full address and contact owner directly
                          </div>
                        </div>
                      </div>
                      <Button className="w-full" variant="default" asChild>
                        <Link to="/pricing">Upgrade to Premium</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Inquiry Form */}
            {user && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Send Inquiry</h3>
                  <Textarea
                    placeholder="Write your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="mb-4"
                  />
                  <Button
                    onClick={handleInquiry}
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? 'Sending...' : 'Send Inquiry'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {!user && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-600 mb-4">Login to send inquiry</p>
                  <Link to="/login">
                    <Button className="w-full">Login</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}