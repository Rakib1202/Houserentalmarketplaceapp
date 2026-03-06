import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { Home, Search } from 'lucide-react';
import { PropertyCard } from '../property/PropertyCard';
import { propertiesAPI } from '../../utils/api';
import type { Property } from '../../types';

export function PropertySearch() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    area: '',
    minRent: '',
    maxRent: '',
    bedrooms: '',
    tenantType: '',
  });

  useEffect(() => {
    searchProperties();
  }, []);

  const searchProperties = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filters.area) params.area = filters.area;
      if (filters.minRent) params.minRent = filters.minRent;
      if (filters.maxRent) params.maxRent = filters.maxRent;
      if (filters.bedrooms) params.bedrooms = filters.bedrooms;
      if (filters.tenantType) params.tenantType = filters.tenantType;

      const data = await propertiesAPI.getAll(params);
      setProperties(data.properties);
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProperties();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Home className="size-6 text-blue-600" />
              <span className="text-xl font-bold">Dhaka Rent</span>
            </Link>
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch}>
              <div className="grid md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="area">Area</Label>
                  <Input
                    id="area"
                    placeholder="e.g., Dhanmondi, Gulshan"
                    value={filters.area}
                    onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="minRent">Min Rent (৳)</Label>
                  <Input
                    id="minRent"
                    type="number"
                    placeholder="10000"
                    value={filters.minRent}
                    onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="maxRent">Max Rent (৳)</Label>
                  <Input
                    id="maxRent"
                    type="number"
                    placeholder="50000"
                    value={filters.maxRent}
                    onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Select
                    value={filters.bedrooms || 'any'}
                    onValueChange={(value) => setFilters({ ...filters, bedrooms: value === 'any' ? '' : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tenantType">Tenant Type</Label>
                  <Select
                    value={filters.tenantType || 'any'}
                    onValueChange={(value) => setFilters({ ...filters, tenantType: value === 'any' ? '' : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="bachelor">Bachelor</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="mt-4 w-full md:w-auto gap-2" disabled={loading}>
                <Search className="size-4" />
                {loading ? 'Searching...' : 'Search Properties'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Found
            </h2>
          </div>

          {properties.length === 0 && !loading && (
            <div className="text-center py-12">
              <Home className="size-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
              <p className="text-gray-500">Try adjusting your search filters</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}