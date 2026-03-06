import { Shield, CheckCircle, Award, Users } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export function AboutUsPage() {
  const features = [
    {
      icon: Users,
      title: 'Trusted by Thousands',
      description: 'Over 10,000 satisfied tenants have found their perfect home through our platform.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'Verified Listings',
      description: 'Every property is personally verified by our team to ensure quality and authenticity.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Award,
      title: 'Easy Booking',
      description: 'Simple and secure booking process with instant confirmation and support.',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  const whyChooseUs = [
    'Wide selection of properties across Dhaka',
    'Secure & verified listings with full transparency',
    '24/7 customer support via phone and chat',
    'No hidden fees or commissions',
    'Virtual tours and detailed property photos',
    'Flexible payment options',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">About Us</h1>
          <p className="text-2xl text-blue-100 mb-4">Welcome to HouseRentBD</p>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Bangladesh's most trusted house rental platform, connecting property owners and tenants 
            across Dhaka since 2020. We make finding your perfect home simple, secure, and stress-free.
          </p>
        </div>
      </div>

      {/* Feature Highlight Cards */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="bg-white/90 backdrop-blur-lg border border-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl group hover:-translate-y-2"
              >
                <CardContent className="p-8 text-center">
                  <div className={`bg-gradient-to-br ${feature.gradient} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="size-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Our Mission
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Making Home Finding Simple & Secure
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              To revolutionize the house rental experience in Dhaka by providing a secure, transparent, 
              and efficient platform that connects property owners with genuine tenants.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe everyone deserves a safe and comfortable home. Our mission is to make the house 
              hunting process simple, fast, and reliable for both tenants and property owners through 
              innovative technology and dedicated customer service.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=500&fit=crop"
              alt="Modern apartments"
              className="rounded-3xl shadow-2xl w-full"
            />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6 max-w-xs">
              <p className="text-3xl font-bold text-blue-600 mb-1">99%</p>
              <p className="text-sm text-gray-600">Customer Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=500&fit=crop"
                alt="Modern building"
                className="rounded-3xl shadow-2xl w-full"
              />
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-2xl p-6 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
                    <CheckCircle className="size-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">24/7</p>
                    <p className="text-sm text-gray-600">Support Available</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Why Choose Us
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Your Trusted Partner in Finding Perfect Home
              </h2>
              <div className="space-y-4">
                {whyChooseUs.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl p-1.5 mt-0.5 group-hover:scale-110 transition-transform">
                      <CheckCircle className="size-5 text-white" />
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-gray-600">
            Our numbers speak for themselves
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 mb-4">
              <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                5000+
              </p>
            </div>
            <p className="text-gray-700 font-medium">Properties Listed</p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-4">
              <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                10K+
              </p>
            </div>
            <p className="text-gray-700 font-medium">Happy Tenants</p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 mb-4">
              <p className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                500+
              </p>
            </div>
            <p className="text-gray-700 font-medium">Verified Owners</p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 mb-4">
              <p className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                50+
              </p>
            </div>
            <p className="text-gray-700 font-medium">Areas Covered</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of happy tenants who found their dream home with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-xl text-lg">
              Browse Properties
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all shadow-xl text-lg">
              List Your Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
