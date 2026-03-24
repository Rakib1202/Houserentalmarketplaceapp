import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Crown, CheckCircle, Star, Zap, Shield, TrendingUp, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { subscriptionsAPI } from '../../utils/api';
import { PaymentGateway } from '../payment/PaymentGateway';

interface Plan {
  _id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  active: boolean;
  popular?: boolean;
}

export function SubscriptionPlansPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response: any = await subscriptionsAPI.getAll({ plansOnly: 'true' });
      setPlans(response.subscriptions || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: Plan) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Please login to subscribe');
      navigate('/login');
      return;
    }

    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    toast.success('Subscription request submitted!');
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6 text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
          <div className="text-center max-w-3xl mx-auto">
            <Crown className="size-16 mx-auto mb-4 text-yellow-300" />
            <h1 className="text-5xl font-bold mb-4">
              Upgrade to Premium
            </h1>
            <p className="text-xl text-blue-100">
              Unlock exclusive features and get the most out of HouseRentBD
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 -mt-10 mb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white shadow-xl border-blue-100">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-3">
                <Shield className="size-6 text-blue-600" />
              </div>
              <p className="font-semibold text-gray-900">Verified Badge</p>
              <p className="text-sm text-gray-600">Stand out from others</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-xl border-purple-100">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-3">
                <Star className="size-6 text-purple-600" />
              </div>
              <p className="font-semibold text-gray-900">Featured Listings</p>
              <p className="text-sm text-gray-600">Top placement</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-xl border-green-100">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-3">
                <Zap className="size-6 text-green-600" />
              </div>
              <p className="font-semibold text-gray-900">Priority Support</p>
              <p className="text-sm text-gray-600">24/7 assistance</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-xl border-orange-100">
            <CardContent className="p-6 text-center">
              <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-3">
                <TrendingUp className="size-6 text-orange-600" />
              </div>
              <p className="font-semibold text-gray-900">Boost Visibility</p>
              <p className="text-sm text-gray-600">10x more views</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Plans Section */}
      <div className="container mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Choose Your Plan
          </h2>
          <p className="text-gray-600">
            Select the perfect plan for your needs
          </p>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No subscription plans available at the moment</p>
            <Button className="mt-4" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const isPopular = index === 1 || plan.popular; // Mark middle plan as popular
              
              return (
                <Card
                  key={plan._id}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                    isPopular
                      ? 'border-2 border-blue-500 shadow-xl scale-105'
                      : 'border border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <CardHeader className={`pb-8 ${isPopular ? 'bg-gradient-to-br from-blue-50 to-purple-50' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <Crown className={`size-10 ${isPopular ? 'text-yellow-500' : 'text-gray-400'}`} />
                      {plan.active && (
                        <Badge variant="default" className="bg-green-500">
                          Active
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>
                      Perfect for {plan.duration <= 30 ? 'trying out' : plan.duration <= 180 ? 'regular users' : 'committed users'}
                    </CardDescription>
                    <div className="mt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">
                          ৳{plan.price.toLocaleString()}
                        </span>
                        <span className="text-gray-600">/ {plan.duration} days</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        ৳{Math.round(plan.price / plan.duration)}/day
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6 pb-8">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${
                        isPopular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                      size="lg"
                      onClick={() => handleSelectPlan(plan)}
                    >
                      <Crown className="size-4 mr-2" />
                      Subscribe Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* FAQ or Additional Info */}
        <div className="mt-16 max-w-3xl mx-auto">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Why Subscribe to Premium?
              </h3>
              <div className="space-y-3 text-gray-700">
                <p>✓ <strong>Stand Out:</strong> Get a verified badge that builds trust</p>
                <p>✓ <strong>Get More Views:</strong> Featured listings appear at the top</p>
                <p>✓ <strong>Save Time:</strong> Priority support gets you answers faster</p>
                <p>✓ <strong>Unlimited Access:</strong> No restrictions on property listings</p>
                <p>✓ <strong>Analytics:</strong> Track your property performance</p>
              </div>
              <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-blue-600">
                <p className="text-sm text-gray-600">
                  <strong>Money-Back Guarantee:</strong> Not satisfied? Get a full refund within 7 days, no questions asked.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentGateway
          open={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPlan(null);
          }}
          planId={selectedPlan._id}
          planName={selectedPlan.name}
          amount={selectedPlan.price}
          duration={selectedPlan.duration}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}