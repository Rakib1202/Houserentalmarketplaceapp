import { Link, useLocation } from 'react-router';
import { Building2, Search, User, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

export function MainNavbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2.5 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
              <Building2 className="size-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              HouseRentBD
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-[15px] font-medium transition-colors ${
                isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/listings"
              className={`text-[15px] font-medium transition-colors ${
                isActive('/listings') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Listings
            </Link>
            <Link
              to="/pricing"
              className={`text-[15px] font-medium transition-colors ${
                isActive('/pricing') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className={`text-[15px] font-medium transition-colors ${
                isActive('/about') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`text-[15px] font-medium transition-colors ${
                isActive('/contact') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Contact Us
            </Link>
            <Link
              to="/careers"
              className={`text-[15px] font-medium transition-colors ${
                isActive('/careers') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Careers
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/search">
              <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
                <Search className="size-5 text-gray-600" />
              </button>
            </Link>
            <Link
              to="/login"
              className="text-[15px] font-medium text-gray-700 hover:text-blue-600 transition-colors px-4"
            >
              Login
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all rounded-xl px-6">
                Register
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-xl"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-6 py-4 space-y-3">
            <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/listings" className="block py-2 text-gray-700 hover:text-blue-600">
              Listings
            </Link>
            <Link to="/pricing" className="block py-2 text-gray-700 hover:text-blue-600">
              Pricing
            </Link>
            <Link to="/about" className="block py-2 text-gray-700 hover:text-blue-600">
              About Us
            </Link>
            <Link to="/contact" className="block py-2 text-gray-700 hover:text-blue-600">
              Contact Us
            </Link>
            <Link to="/careers" className="block py-2 text-gray-700 hover:text-blue-600">
              Careers
            </Link>
            <div className="pt-3 space-y-2">
              <Link to="/login" className="block py-2 text-gray-700">
                Login
              </Link>
              <Link to="/signup" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}