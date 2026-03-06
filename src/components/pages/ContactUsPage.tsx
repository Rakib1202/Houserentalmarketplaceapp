import { useState } from 'react';
import { Send, Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Have questions? We're here to help! Reach out to us and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Contact Form */}
          <div>
            <Card className="shadow-2xl rounded-2xl border border-gray-100">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-medium">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      className="mt-2 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="mt-2 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+880 1700-000000"
                      className="mt-2 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-700 font-medium">Your Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      className="mt-2 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-xl text-base font-semibold shadow-lg"
                  >
                    <Send className="size-5 mr-2" />
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Map & Contact Info */}
          <div className="space-y-6">
            {/* Map Card */}
            <Card className="shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
              <div className="aspect-video bg-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.898889076524!2d90.37478931498174!3d23.750893484588455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </Card>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-3 rounded-xl">
                      <Phone className="size-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                  </div>
                  <p className="text-gray-700">+880 1700-000000</p>
                  <p className="text-gray-700">+880 1800-000000</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-3 rounded-xl">
                      <Mail className="size-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                  </div>
                  <p className="text-gray-700">support@houserentbd.com</p>
                  <p className="text-gray-700">info@houserentbd.com</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-br from-green-600 to-emerald-500 p-3 rounded-xl">
                      <MapPin className="size-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                  </div>
                  <p className="text-gray-700">Main Office</p>
                  <p className="text-gray-700">Dhaka 1212, Bangladesh</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 rounded-2xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-br from-orange-600 to-red-500 p-3 rounded-xl">
                      <Clock className="size-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Hours</h3>
                  </div>
                  <p className="text-gray-700">Mon - Sat: 9 AM - 8 PM</p>
                  <p className="text-gray-700">Sunday: 10 AM - 6 PM</p>
                </CardContent>
              </Card>
            </div>

            {/* Support Image */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop"
                    alt="Support team"
                    className="w-20 h-20 rounded-full object-cover shadow-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Need Quick Support?</h3>
                    <p className="text-sm text-gray-600 mb-3">Chat with our friendly team</p>
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-xl shadow-lg">
                      <MessageSquare className="size-4 mr-2" />
                      Start Live Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Get Directions Button */}
            <Button 
              variant="outline" 
              className="w-full h-12 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold"
            >
              <MapPin className="size-5 mr-2" />
              Get Directions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
