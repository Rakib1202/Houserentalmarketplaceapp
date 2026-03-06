import { useEffect, useState } from 'react';
import { TrendingUp, MapPin, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { propertiesAPI, usersAPI } from '../../utils/api';

export function Analytics() {
  const [analytics, setAnalytics] = useState<any>({
    popularAreas: [],
    priceRanges: [],
    propertyTypes: [],
    userActivity: {},
    conversionRates: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/analytics`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      const data = await response.json();
      if (response.ok) setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics & Insights</h1>
        <p className="text-gray-600">Platform performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-5" />
              Most Searched Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.popularAreas.map((area: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm">{area.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(area.count / analytics.popularAreas[0]?.count) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-8">{area.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="size-5" />
              Popular Price Ranges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.priceRanges.map((range: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm">{range.range}</span>
                  <span className="text-sm font-semibold">{range.count} listings</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5" />
              Property Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.propertyTypes.map((type: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{type.type}</span>
                  <span className="text-sm font-semibold">{type.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5" />
              Conversion Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Inquiry Rate</span>
                <span className="text-sm font-semibold">{analytics.conversionRates.inquiryRate || 0}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Premium Conversion</span>
                <span className="text-sm font-semibold">{analytics.conversionRates.premiumRate || 0}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active User Rate</span>
                <span className="text-sm font-semibold">{analytics.conversionRates.activeRate || 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
