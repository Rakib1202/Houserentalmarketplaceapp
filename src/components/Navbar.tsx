import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { 
  Home, 
  Building2, 
  User, 
  Heart, 
  DollarSign, 
  FileText, 
  Briefcase,
  Search,
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const propertyTypes = [
  { id: 'family', label: 'Family', icon: '🏠' },
  { id: 'bachelor', label: 'Bachelor', icon: '🎓' },
  { id: 'office', label: 'Office', icon: '🏢' },
  { id: 'sublet', label: 'Sublet', icon: '🏘️' },
  { id: 'hostel', label: 'Hostel', icon: '🏨' },
  { id: 'shop', label: 'Shop', icon: '🏪' },
];

export function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Building2 className="size-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Dhaka Rent</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Home className="size-4" />
                <span>Home</span>
              </Link>
              
              <Link 
                to="/properties" 
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Building2 className="size-4" />
                <span>Property List</span>
              </Link>
              
              <Link 
                to="/profile" 
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <User className="size-4" />
                <span>Profile</span>
              </Link>
              
              <Link 
                to="/saved" 
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Heart className="size-4" />
                <span>Saved Property</span>
              </Link>
              
              <Link 
                to="/earn-money" 
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <DollarSign className="size-4" />
                <span>Earn Money</span>
              </Link>
              
              <Link 
                to="/articles" 
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <FileText className="size-4" />
                <span>Article</span>
              </Link>
              
              <Link 
                to="/career" 
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Briefcase className="size-4" />
                <span>Career</span>
              </Link>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2 flex-1 max-w-md mx-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Property Type Filters */}
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-8 py-3 overflow-x-auto">
              {propertyTypes.map((type) => (
                <Link
                  key={type.id}
                  to={`/properties?type=${type.id}`}
                  className="flex flex-col items-center gap-1 min-w-fit group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {type.icon}
                  </span>
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 font-medium transition-colors">
                    {type.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white top-16">
          <div className="p-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </form>
            
            <div className="space-y-2">
              <Link 
                to="/" 
                className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="size-5" />
                <span>Home</span>
              </Link>
              
              <Link 
                to="/properties" 
                className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Building2 className="size-5" />
                <span>Property List</span>
              </Link>
              
              <Link 
                to="/profile" 
                className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="size-5" />
                <span>Profile</span>
              </Link>
              
              <Link 
                to="/saved" 
                className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="size-5" />
                <span>Saved Property</span>
              </Link>
              
              <Link 
                to="/earn-money" 
                className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <DollarSign className="size-5" />
                <span>Earn Money</span>
              </Link>
              
              <Link 
                to="/articles" 
                className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText className="size-5" />
                <span>Article</span>
              </Link>
              
              <Link 
                to="/career" 
                className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Briefcase className="size-5" />
                <span>Career</span>
              </Link>
            </div>

            <div className="pt-4 border-t space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
              >
                Login
              </Button>
              <Button 
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/signup');
                }}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
