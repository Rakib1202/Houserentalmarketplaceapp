import { Search, MapPin, DollarSign, Home, Bed, Bath, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';

export function Homepage() {
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    budget: '',
    propertyType: '',
  });

  const handleSearch = () => {
    // Navigate to search page with filters
    const params = new URLSearchParams();
    if (searchFilters.location) params.append('area', searchFilters.location);
    if (searchFilters.budget) {
      const [min, max] = searchFilters.budget.split('-');
      if (min) params.append('minRent', min + '000');
      if (max && max !== '+') params.append('maxRent', max + '000');
    }
    navigate(`/search?${params.toString()}`);
  };

  const featuredProperties = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      price: '৳25,000',
      title: 'Modern 3BHK Apartment',
      location: 'Dhanmondi, Dhaka',
      beds: 3,
      baths: 2,
      area: '1200 sqft',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
      price: '৳18,000',
      title: 'Cozy Bachelor Flat',
      location: 'Gulshan, Dhaka',
      beds: 1,
      baths: 1,
      area: '650 sqft',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop',
      price: '৳35,000',
      title: 'Luxury Penthouse',
      location: 'Banani, Dhaka',
      beds: 4,
      baths: 3,
      area: '2000 sqft',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
      price: '৳22,000',
      title: 'Family Apartment',
      location: 'Uttara, Dhaka',
      beds: 3,
      baths: 2,
      area: '1400 sqft',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[600px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&h=600&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/85 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Side - Text */}
            <div className="text-white space-y-6 z-10">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                আপনার স্বপ্নের বাসা
                <br />
                <span className="text-cyan-300">খুঁজে নিন সহজেই</span>
              </h1>
              <p className="text-xl text-blue-100">
                Find Your Perfect Home in Dhaka
              </p>
              <p className="text-lg text-blue-200 max-w-xl">
                Browse thousands of verified rental properties across Dhaka. 
                Safe, secure, and trusted by over 10,000 happy tenants.
              </p>

              {/* Search Bar */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select>
                    <SelectTrigger className="h-12 rounded-xl border-gray-200">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-blue-600" />
                        <SelectValue placeholder="Location" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dhanmondi">Dhanmondi</SelectItem>
                      <SelectItem value="gulshan">Gulshan</SelectItem>
                      <SelectItem value="banani">Banani</SelectItem>
                      <SelectItem value="uttara">Uttara</SelectItem>
                      <SelectItem value="mirpur">Mirpur</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="h-12 rounded-xl border-gray-200">
                      <div className="flex items-center gap-2">
                        <DollarSign className="size-4 text-blue-600" />
                        <SelectValue placeholder="Budget" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10-20">৳10,000 - ৳20,000</SelectItem>
                      <SelectItem value="20-30">৳20,000 - ৳30,000</SelectItem>
                      <SelectItem value="30-50">৳30,000 - ৳50,000</SelectItem>
                      <SelectItem value="50+">৳50,000+</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="h-12 rounded-xl border-gray-200">
                      <div className="flex items-center gap-2">
                        <Home className="size-4 text-blue-600" />
                        <SelectValue placeholder="Property Type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="bachelor">Bachelor</SelectItem>
                      <SelectItem value="sublet">Sublet</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button className="h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-xl shadow-lg text-base font-semibold" onClick={handleSearch}>
                    <Search className="size-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:flex justify-end">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=600&fit=crop"
                  alt="Happy customer"
                  className="rounded-3xl shadow-2xl w-[450px] h-[500px] object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6 max-w-xs">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
                      <svg className="size-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">5000+</p>
                      <p className="text-sm text-gray-600">Verified Properties</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                5,000+
              </p>
              <p className="text-gray-600 font-medium">Properties Listed</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                10,000+
              </p>
              <p className="text-gray-600 font-medium">Happy Tenants</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                500+
              </p>
              <p className="text-gray-600 font-medium">Verified Owners</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Home in Dhaka
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our handpicked selection of premium properties across Dhaka's most sought-after neighborhoods
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((property) => (
            <Card key={property.id} className="group hover:shadow-2xl transition-all duration-300 border-gray-100 rounded-2xl overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                  {property.price}/mo
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {property.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex items-center gap-1">
                  <MapPin className="size-4 text-blue-600" />
                  {property.location}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <Bed className="size-4" /> {property.beds} Beds
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="size-4" /> {property.baths} Baths
                  </span>
                  <span>{property.area}</span>
                </div>
                <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-xl" asChild>
                  <Link to="/search">
                    View Details
                    <ArrowRight className="size-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50" asChild>
            <Link to="/search">
              View All Properties
              <ArrowRight className="size-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}