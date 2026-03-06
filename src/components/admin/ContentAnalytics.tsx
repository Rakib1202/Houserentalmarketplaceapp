import { useState } from 'react';
import {
  TrendingUp,
  Eye,
  Users,
  Clock,
  ArrowUp,
  ArrowDown,
  FileText,
  Share2,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface PageAnalytics {
  id: string;
  pageName: string;
  url: string;
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: string;
  bounceRate: number;
  trend: 'up' | 'down';
  trendPercent: number;
}

export function ContentAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const pageAnalytics: PageAnalytics[] = [
    {
      id: '1',
      pageName: 'Homepage',
      url: '/',
      views: 45672,
      uniqueVisitors: 32418,
      avgTimeOnPage: '2:34',
      bounceRate: 32.5,
      trend: 'up',
      trendPercent: 12.3,
    },
    {
      id: '2',
      pageName: 'Property Listings',
      url: '/listings',
      views: 38942,
      uniqueVisitors: 28634,
      avgTimeOnPage: '4:12',
      bounceRate: 28.7,
      trend: 'up',
      trendPercent: 8.5,
    },
    {
      id: '3',
      pageName: 'Property Details',
      url: '/property/*',
      views: 52318,
      uniqueVisitors: 38291,
      avgTimeOnPage: '5:47',
      bounceRate: 22.4,
      trend: 'up',
      trendPercent: 15.7,
    },
    {
      id: '4',
      pageName: 'About Us',
      url: '/about',
      views: 8453,
      uniqueVisitors: 6872,
      avgTimeOnPage: '1:52',
      bounceRate: 45.2,
      trend: 'down',
      trendPercent: 3.2,
    },
    {
      id: '5',
      pageName: 'Contact Us',
      url: '/contact',
      views: 12638,
      uniqueVisitors: 10294,
      avgTimeOnPage: '2:18',
      bounceRate: 38.6,
      trend: 'up',
      trendPercent: 5.8,
    },
    {
      id: '6',
      pageName: 'Career Page',
      url: '/careers',
      views: 5729,
      uniqueVisitors: 4836,
      avgTimeOnPage: '3:25',
      bounceRate: 34.1,
      trend: 'up',
      trendPercent: 22.4,
    },
  ];

  const totalViews = pageAnalytics.reduce((sum, page) => sum + page.views, 0);
  const totalUniqueVisitors = pageAnalytics.reduce((sum, page) => sum + page.uniqueVisitors, 0);
  const avgBounceRate = (pageAnalytics.reduce((sum, page) => sum + page.bounceRate, 0) / pageAnalytics.length).toFixed(1);

  const topPerformers = [...pageAnalytics]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  const contentTypes = [
    { type: 'Pages', count: 12, views: 87634, color: 'bg-blue-500' },
    { type: 'Articles', count: 28, views: 45291, color: 'bg-green-500' },
    { type: 'Job Posts', count: 6, views: 5729, color: 'bg-purple-500' },
  ];

  const trafficSources = [
    { source: 'Organic Search', percentage: 42.3, visits: 52841, color: 'bg-green-500' },
    { source: 'Direct', percentage: 28.7, visits: 35892, color: 'bg-blue-500' },
    { source: 'Social Media', percentage: 18.4, visits: 23016, color: 'bg-purple-500' },
    { source: 'Referral', percentage: 10.6, visits: 13251, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Content Analytics</h1>
          <p className="text-gray-600">Track content performance and user engagement</p>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Page Views</p>
                <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                  <ArrowUp className="size-4" />
                  <span>12.5% from last period</span>
                </div>
              </div>
              <Eye className="size-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unique Visitors</p>
                <p className="text-3xl font-bold">{totalUniqueVisitors.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                  <ArrowUp className="size-4" />
                  <span>8.3% from last period</span>
                </div>
              </div>
              <Users className="size-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Time on Site</p>
                <p className="text-3xl font-bold">3:42</p>
                <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                  <ArrowUp className="size-4" />
                  <span>5.2% from last period</span>
                </div>
              </div>
              <Clock className="size-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Bounce Rate</p>
                <p className="text-3xl font-bold">{avgBounceRate}%</p>
                <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                  <ArrowDown className="size-4" />
                  <span>2.1% from last period</span>
                </div>
              </div>
              <TrendingUp className="size-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Performers */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((page, index) => (
                <div key={page.id} className="flex items-center gap-4">
                  <div className="flex items-center justify-center size-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{page.pageName}</h3>
                      <Badge variant="outline" className="text-xs">{page.url}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Eye className="size-3" />
                        {page.views.toLocaleString()} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="size-3" />
                        {page.uniqueVisitors.toLocaleString()} visitors
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {page.avgTimeOnPage}
                      </span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 ${page.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {page.trend === 'up' ? (
                      <ArrowUp className="size-4" />
                    ) : (
                      <ArrowDown className="size-4" />
                    )}
                    <span className="font-semibold">{page.trendPercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Types */}
        <Card>
          <CardHeader>
            <CardTitle>Content Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentTypes.map(type => (
                <div key={type.type}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`size-3 rounded-full ${type.color}`} />
                      <span className="font-medium">{type.type}</span>
                    </div>
                    <Badge variant="secondary">{type.count}</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {type.views.toLocaleString()} total views
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Pages Performance */}
      <Card>
        <CardHeader>
          <CardTitle>All Pages Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Page</th>
                  <th className="text-right py-3 px-4 font-semibold">Views</th>
                  <th className="text-right py-3 px-4 font-semibold">Visitors</th>
                  <th className="text-right py-3 px-4 font-semibold">Avg. Time</th>
                  <th className="text-right py-3 px-4 font-semibold">Bounce Rate</th>
                  <th className="text-right py-3 px-4 font-semibold">Trend</th>
                </tr>
              </thead>
              <tbody>
                {pageAnalytics.map(page => (
                  <tr key={page.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{page.pageName}</p>
                        <p className="text-sm text-gray-500">{page.url}</p>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4">
                      {page.uniqueVisitors.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4">
                      {page.avgTimeOnPage}
                    </td>
                    <td className="text-right py-3 px-4">
                      <Badge variant={page.bounceRate < 30 ? 'default' : 'secondary'}>
                        {page.bounceRate}%
                      </Badge>
                    </td>
                    <td className="text-right py-3 px-4">
                      <div className={`flex items-center justify-end gap-1 ${
                        page.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {page.trend === 'up' ? (
                          <ArrowUp className="size-4" />
                        ) : (
                          <ArrowDown className="size-4" />
                        )}
                        <span className="font-semibold">{page.trendPercent}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Traffic Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trafficSources.map(source => (
              <div key={source.source}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{source.source}</span>
                  <div className="text-right">
                    <span className="font-bold">{source.percentage}%</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({source.visits.toLocaleString()} visits)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${source.color} h-2 rounded-full transition-all`}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="pt-6">
            <BarChart3 className="size-8 text-blue-600 mb-3" />
            <h3 className="font-semibold mb-2">Detailed Reports</h3>
            <p className="text-sm text-gray-600 mb-4">
              Generate comprehensive analytics reports
            </p>
            <button className="text-blue-600 font-medium text-sm hover:underline">
              Generate Report →
            </button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="pt-6">
            <PieChart className="size-8 text-purple-600 mb-3" />
            <h3 className="font-semibold mb-2">Export Data</h3>
            <p className="text-sm text-gray-600 mb-4">
              Download analytics data as CSV or PDF
            </p>
            <button className="text-purple-600 font-medium text-sm hover:underline">
              Export Data →
            </button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
          <CardContent className="pt-6">
            <Share2 className="size-8 text-green-600 mb-3" />
            <h3 className="font-semibold mb-2">Share Insights</h3>
            <p className="text-sm text-gray-600 mb-4">
              Share analytics with your team
            </p>
            <button className="text-green-600 font-medium text-sm hover:underline">
              Share Report →
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
