import { useState } from 'react';
import { 
  Search, 
  TrendingUp, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Edit,
  Save,
  BarChart3,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

interface PageSEO {
  id: string;
  pageName: string;
  url: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  ogImage?: string;
  focusKeyword: string;
  seoScore: number;
  status: 'good' | 'warning' | 'poor';
  lastUpdated: string;
}

export function SEOManagement() {
  const [pages, setPages] = useState<PageSEO[]>([
    {
      id: '1',
      pageName: 'Homepage',
      url: '/',
      title: 'HouseRentBD - Find Your Perfect Home in Dhaka',
      metaDescription: 'Discover thousands of rental properties in Dhaka. Connect with verified owners, agents, and find your dream home today.',
      keywords: ['house rent', 'dhaka rental', 'apartment', 'property'],
      focusKeyword: 'house rent dhaka',
      seoScore: 85,
      status: 'good',
      lastUpdated: '2024-02-11',
    },
    {
      id: '2',
      pageName: 'Property Listings',
      url: '/listings',
      title: 'Property Listings - Houses & Apartments in Dhaka',
      metaDescription: 'Browse available rental properties in Dhaka. Filter by location, price, and amenities.',
      keywords: ['property listings', 'rental apartments', 'houses for rent'],
      focusKeyword: 'rental apartments dhaka',
      seoScore: 72,
      status: 'warning',
      lastUpdated: '2024-02-10',
    },
    {
      id: '3',
      pageName: 'About Us',
      url: '/about',
      title: 'About Us - HouseRentBD',
      metaDescription: 'Learn about HouseRentBD and our mission.',
      keywords: ['about', 'company'],
      focusKeyword: 'house rent company',
      seoScore: 45,
      status: 'poor',
      lastUpdated: '2024-01-20',
    },
  ]);

  const [expandedPage, setExpandedPage] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<PageSEO>>({});

  const handleEdit = (page: PageSEO) => {
    setEditingPage(page.id);
    setEditData(page);
  };

  const handleSave = () => {
    if (!editingPage) return;

    setPages(pages.map(p => 
      p.id === editingPage ? { ...p, ...editData, lastUpdated: new Date().toISOString().split('T')[0] } : p
    ));

    setEditingPage(null);
    setEditData({});
    toast.success('SEO settings updated successfully!');
  };

  const handleCancel = () => {
    setEditingPage(null);
    setEditData({});
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return <Badge className="bg-green-500">Good</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">Needs Improvement</Badge>;
      case 'poor':
        return <Badge className="bg-red-500">Poor</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const stats = {
    averageScore: Math.round(pages.reduce((sum, p) => sum + p.seoScore, 0) / pages.length),
    goodPages: pages.filter(p => p.status === 'good').length,
    needsWork: pages.filter(p => p.status !== 'good').length,
    totalPages: pages.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">SEO Management</h1>
        <p className="text-gray-600">Optimize your website content for search engines</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average SEO Score</p>
                <p className={`text-3xl font-bold ${getSEOScoreColor(stats.averageScore)}`}>
                  {stats.averageScore}
                </p>
              </div>
              <TrendingUp className="size-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pages</p>
                <p className="text-3xl font-bold">{stats.totalPages}</p>
              </div>
              <FileText className="size-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Good SEO</p>
                <p className="text-3xl font-bold text-green-600">{stats.goodPages}</p>
              </div>
              <CheckCircle className="size-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Needs Work</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.needsWork}</p>
              </div>
              <AlertCircle className="size-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEO Tips */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Search className="size-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">SEO Best Practices</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>✓ Keep page titles between 50-60 characters</li>
                <li>✓ Write meta descriptions between 150-160 characters</li>
                <li>✓ Use focus keywords naturally in your content</li>
                <li>✓ Include relevant keywords without keyword stuffing</li>
                <li>✓ Use descriptive URLs with keywords</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pages List */}
      <Card>
        <CardHeader>
          <CardTitle>Page SEO Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pages.map((page) => (
              <div key={page.id} className="border rounded-lg">
                {/* Page Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedPage(expandedPage === page.id ? null : page.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        {expandedPage === page.id ? (
                          <ChevronUp className="size-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="size-5 text-gray-400" />
                        )}
                        <FileText className="size-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{page.pageName}</h3>
                          {getStatusBadge(page.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{page.url}</span>
                          <span>Focus: {page.focusKeyword}</span>
                          <span>Updated: {page.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">SEO Score</p>
                        <p className={`text-2xl font-bold ${getSEOScoreColor(page.seoScore)}`}>
                          {page.seoScore}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(page);
                        }}
                      >
                        <Edit className="size-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedPage === page.id && (
                  <div className="border-t p-4 bg-gray-50">
                    {editingPage === page.id ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div>
                          <Label>Page Title *</Label>
                          <Input
                            value={editData.title || ''}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            placeholder="Page title for search engines"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {editData.title?.length || 0}/60 characters (optimal: 50-60)
                          </p>
                        </div>

                        <div>
                          <Label>Meta Description *</Label>
                          <Textarea
                            value={editData.metaDescription || ''}
                            onChange={(e) => setEditData({ ...editData, metaDescription: e.target.value })}
                            placeholder="Brief description for search results"
                            rows={3}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {editData.metaDescription?.length || 0}/160 characters (optimal: 150-160)
                          </p>
                        </div>

                        <div>
                          <Label>Focus Keyword *</Label>
                          <Input
                            value={editData.focusKeyword || ''}
                            onChange={(e) => setEditData({ ...editData, focusKeyword: e.target.value })}
                            placeholder="Main keyword to target"
                          />
                        </div>

                        <div>
                          <Label>Keywords (comma separated)</Label>
                          <Input
                            value={editData.keywords?.join(', ') || ''}
                            onChange={(e) => setEditData({ 
                              ...editData, 
                              keywords: e.target.value.split(',').map(k => k.trim()) 
                            })}
                            placeholder="keyword1, keyword2, keyword3"
                          />
                        </div>

                        <div>
                          <Label>Open Graph Image URL</Label>
                          <Input
                            value={editData.ogImage || ''}
                            onChange={(e) => setEditData({ ...editData, ogImage: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                          />
                          <p className="text-xs text-gray-500 mt-1">Image shown when shared on social media</p>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button onClick={handleSave}>
                            <Save className="size-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="space-y-4">
                        <div>
                          <Label className="text-gray-600">Page Title</Label>
                          <p className="font-medium mt-1">{page.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{page.title.length} characters</p>
                        </div>

                        <div>
                          <Label className="text-gray-600">Meta Description</Label>
                          <p className="text-sm mt-1">{page.metaDescription}</p>
                          <p className="text-xs text-gray-500 mt-1">{page.metaDescription.length} characters</p>
                        </div>

                        <div>
                          <Label className="text-gray-600">Keywords</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {page.keywords.map((keyword, idx) => (
                              <Badge key={idx} variant="outline">{keyword}</Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <Button size="sm" variant="outline" asChild>
                            <a href={page.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="size-4 mr-2" />
                              View Page
                            </a>
                          </Button>
                          <Button size="sm" variant="outline">
                            <BarChart3 className="size-4 mr-2" />
                            View Analytics
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Global SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Global SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Site Title</Label>
            <Input defaultValue="HouseRentBD" placeholder="Your site name" />
          </div>

          <div>
            <Label>Site Tagline</Label>
            <Input defaultValue="Find Your Perfect Home in Dhaka" placeholder="Short site description" />
          </div>

          <div>
            <Label>Default OG Image</Label>
            <Input placeholder="https://example.com/default-og-image.jpg" />
            <p className="text-xs text-gray-500 mt-1">Used when pages don't have specific images</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Google Analytics ID</Label>
              <Input placeholder="G-XXXXXXXXXX" />
            </div>
            <div>
              <Label>Google Search Console</Label>
              <Input placeholder="Verification code" />
            </div>
          </div>

          <Button>
            <Save className="size-4 mr-2" />
            Save Global Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
