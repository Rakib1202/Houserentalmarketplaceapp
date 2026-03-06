import { Link } from 'react-router';
import { Button } from './ui/button';
import { Search, Home, Shield, TrendingUp, MapPin, Award, Database, Users } from 'lucide-react';
import { DemoDataSeeder } from './DemoDataSeeder';
import { QuickTestLogin } from './QuickTestLogin';
import { useState } from 'react';

export function Landing() {
  const [showSeeder, setShowSeeder] = useState(false);
  const [showTestLogin, setShowTestLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="size-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Dhaka Rent</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/search">
              <Button variant="ghost">Search Properties</Button>
            </Link>
            <Link to="/admin-login">
              <Button variant="ghost" size="sm" className="text-slate-600">
                <Shield className="size-4 mr-1" />
                Admin
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Find Your Perfect Home in Dhaka
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Trusted rental marketplace connecting tenants, property owners, and agents.
          Verified listings, transparent pricing, and reliable service.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/signup">
            <Button size="lg" className="gap-2">
              <Search className="size-5" />
              Search Properties
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="lg" variant="outline" className="gap-2">
              <Home className="size-5" />
              List Your Property
            </Button>
          </Link>
          <Button size="lg" variant="secondary" className="gap-2" onClick={() => setShowSeeder(!showSeeder)}>
            <Database className="size-5" />
            Demo Setup
          </Button>
          <Button size="lg" variant="secondary" className="gap-2" onClick={() => setShowTestLogin(!showTestLogin)}>
            <Users className="size-5" />
            Test Accounts
          </Button>
        </div>
        
        {showSeeder && (
          <div className="mt-8">
            <DemoDataSeeder />
          </div>
        )}
        
        {showTestLogin && (
          <div className="mt-8">
            <QuickTestLogin />
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Dhaka Rent?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="size-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
            <p className="text-gray-600">
              All properties are verified by our admin team to ensure authenticity and prevent fraud.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="size-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Location-Based Search</h3>
            <p className="text-gray-600">
              Find properties by area, rent range, bedrooms, and amenities across Dhaka city.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Award className="size-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Premium Features</h3>
            <p className="text-gray-600">
              Unlock full property details, owner contacts, and priority support with premium access.
            </p>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">For Everyone in the Rental Market</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-2">For Tenants</h3>
              <p className="text-sm text-gray-600 mb-4">
                Search properties, save favorites, contact owners directly
              </p>
              <Link to="/signup">
                <Button variant="outline" size="sm" className="w-full">
                  Find a Home
                </Button>
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-2">For Owners</h3>
              <p className="text-sm text-gray-600 mb-4">
                List properties, manage inquiries, boost visibility
              </p>
              <Link to="/signup">
                <Button variant="outline" size="sm" className="w-full">
                  List Property
                </Button>
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-2">For Agents</h3>
              <p className="text-sm text-gray-600 mb-4">
                Manage multiple listings, verified badge, featured placement
              </p>
              <Link to="/signup">
                <Button variant="outline" size="sm" className="w-full">
                  Join as Agent
                </Button>
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-2">For Employees</h3>
              <p className="text-sm text-gray-600 mb-4">
                Capture property photos, earn ৳5 per approved photo
              </p>
              <Link to="/signup">
                <Button variant="outline" size="sm" className="w-full">
                  Earn Money
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
            <div className="text-gray-600">Verified Properties</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
            <div className="text-gray-600">Happy Tenants</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
            <div className="text-gray-600">Trusted Agents</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Home className="size-6" />
            <span className="text-xl font-bold">Dhaka Rent</span>
          </div>
          <p className="text-gray-400">
            Reliable rental marketplace for Dhaka city
          </p>
        </div>
      </footer>
    </div>
  );
}