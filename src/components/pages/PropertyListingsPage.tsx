import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { Home, Search } from 'lucide-react';
import { PropertyCard } from '../property/PropertyCard';
import { propertiesAPI } from '../../utils/api';
import type { Property } from '../../types';

export function PropertyListingsPage() {
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
      const params = new URLSearchParams();
      if (filters.area) params.append('area', filters.area);
      if (filters.minRent) params.append('minRent', filters.minRent);
      if (filters.maxRent) params.append('maxRent', filters.maxRent);
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
      if (filters.tenantType) params.append('tenantType', filters.tenantType);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/properties?${params}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setProperties(data.properties || []);
      }
    } catch (error) {
      console.error('Error searching properties:', error);
      // Set empty array on error to show "no properties" message
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProperties();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Properties</h1>
          <p className="text-lg text-gray-600">
            Find your perfect rental home in Dhaka. Over {properties.length} properties available.
          </p>
        </div>

        {/* Search Filters */}
        <Card className="mb-8 border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSearch}>
              <div className="grid md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="area" className="text-gray-700 font-medium">Area</Label>
                  <Input
                    id="area"
                    placeholder="e.g., Dhanmondi, Gulshan"
                    value={filters.area}
                    onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                    className="border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="minRent" className="text-gray-700 font-medium">Min Rent (৳)</Label>
                  <Input
                    id="minRent"
                    type="number"
                    placeholder="10000"
                    value={filters.minRent}
                    onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
                    className="border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="maxRent" className="text-gray-700 font-medium">Max Rent (৳)</Label>
                  <Input
                    id="maxRent"
                    type="number"
                    placeholder="50000"
                    value={filters.maxRent}
                    onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
                    className="border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="bedrooms" className="text-gray-700 font-medium">Bedrooms</Label>
                  <Select
                    value={filters.bedrooms || 'any'}
                    onValueChange={(value) => setFilters({ ...filters, bedrooms: value === 'any' ? '' : value })}
                  >
                    <SelectTrigger className="border-gray-300">
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
                  <Label htmlFor="tenantType" className="text-gray-700 font-medium">Tenant Type</Label>
                  <Select
                    value={filters.tenantType || 'any'}
                    onValueChange={(value) => setFilters({ ...filters, tenantType: value === 'any' ? '' : value })}
                  >
                    <SelectTrigger className="border-gray-300">
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

              <Button 
                type="submit" 
                className="mt-6 w-full md:w-auto gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg" 
                disabled={loading}
              >
                <Search className="size-4" />
                {loading ? 'Searching...' : 'Search Properties'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Found
            </h2>
          </div>

          {properties.length === 0 && !loading && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-blue-100">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Home className="size-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">No properties found</h3>
              <p className="text-gray-600 text-lg">Try adjusting your search filters to find more options</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Searching for properties...</p>
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
