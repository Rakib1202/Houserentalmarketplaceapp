import { Link } from 'react-router';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MapPin, Bed, Home, Heart, Star } from 'lucide-react';
import type { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
  showStatus?: boolean;
}

export function PropertyCard({ property, onFavorite, isFavorite, showStatus }: PropertyCardProps) {
  const getTenantTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      family: 'Family',
      bachelor: 'Bachelor',
      both: 'Family/Bachelor',
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {property.photos && property.photos.length > 0 ? (
          <img
            src={property.photos[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home className="size-12 text-gray-400" />
          </div>
        )}
        
        {property.featured && (
          <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
            <Star className="size-3 mr-1" />
            Featured
          </Badge>
        )}
        
        {showStatus && (
          <Badge className={`absolute top-2 right-2 ${getStatusColor(property.status)}`}>
            {property.status}
          </Badge>
        )}

        {onFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
            onClick={() => onFavorite(property.id)}
          >
            <Heart className={`size-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
        )}
      </div>

      <CardContent className="p-4">
        <Link to={`/property/${property.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 mb-2">
            {property.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin className="size-4" />
          {property.area}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Bed className="size-4" />
            {property.bedrooms} Beds
          </div>
          <div className="flex items-center gap-1">
            <Home className="size-4" />
            {property.size} sqft
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-2xl font-bold text-blue-600">৳{property.rent.toLocaleString()}</div>
            <div className="text-xs text-gray-500">per month</div>
          </div>
          <Badge variant="outline">{getTenantTypeLabel(property.tenantType)}</Badge>
        </div>

        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {property.amenities.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{property.amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
