import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FileText, Edit, Trash2, Plus, Eye, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

interface ContentItem {
  id: string;
  title: string;
  type: 'page' | 'article' | 'banner' | 'notification';
  status: 'published' | 'draft';
  author: string;
  createdAt: string;
  updatedAt: string;
  views: number;
}

export function CMSDashboard() {
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'About Us Page',
      type: 'page',
      status: 'published',
      author: 'Admin',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      views: 1245,
    },
    {
      id: '2',
      title: 'How to Find Perfect Home',
      type: 'article',
      status: 'published',
      author: 'Admin',
      createdAt: '2024-02-01',
      updatedAt: '2024-02-05',
      views: 892,
    },
    {
      id: '3',
      title: 'Winter Discount Banner',
      type: 'banner',
      status: 'published',
      author: 'Admin',
      createdAt: '2024-02-10',
      updatedAt: '2024-02-10',
      views: 3421,
    },
  ]);

  const [showEditor, setShowEditor] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'page',
    content: '',
    metaDescription: '',
    keywords: '',
  });

  const stats = {
    totalPages: content.filter(c => c.type === 'page').length,
    totalArticles: content.filter(c => c.type === 'article').length,
    publishedContent: content.filter(c => c.status === 'published').length,
    draftContent: content.filter(c => c.status === 'draft').length,
  };

  const handleCreateContent = () => {
    setShowEditor(true);
    setEditingContent(null);
    setFormData({ title: '', type: 'page', content: '', metaDescription: '', keywords: '' });
  };

  const handleEdit = (item: ContentItem) => {
    setEditingContent(item);
    setFormData({
      title: item.title,
      type: item.type,
      content: '',
      metaDescription: '',
      keywords: '',
    });
    setShowEditor(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      setContent(prev => prev.filter(item => item.id !== id));
      toast.success('Content deleted successfully');
    }
  };

  const handleSave = (status: 'published' | 'draft') => {
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }

    if (editingContent) {
      setContent(prev => prev.map(item =>
        item.id === editingContent.id
          ? { ...item, ...formData, status, updatedAt: new Date().toISOString().split('T')[0] }
          : item
      ));
      toast.success('Content updated successfully');
    } else {
      const newContent: ContentItem = {
        id: Date.now().toString(),
        title: formData.title,
        type: formData.type as any,
        status,
        author: 'Admin',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        views: 0,
      };
      setContent(prev => [newContent, ...prev]);
      toast.success('Content created successfully');
    }

    setShowEditor(false);
    setFormData({ title: '', type: 'page', content: '', metaDescription: '', keywords: '' });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'page': return 'bg-blue-500';
      case 'article': return 'bg-green-500';
      case 'banner': return 'bg-purple-500';
      case 'notification': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Management System</h1>
          <p className="text-gray-600">Manage website content, pages, and articles</p>
        </div>
        <Button onClick={handleCreateContent}>
          <Plus className="size-4 mr-2" />
          Create Content
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Pages</p>
            <p className="text-2xl font-bold">{stats.totalPages}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Articles</p>
            <p className="text-2xl font-bold">{stats.totalArticles}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Published</p>
            <p className="text-2xl font-bold text-green-600">{stats.publishedContent}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Drafts</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.draftContent}</p>
          </CardContent>
        </Card>
      </div>

      {/* Editor */}
      {showEditor && (
        <Card>
          <CardHeader>
            <CardTitle>{editingContent ? 'Edit Content' : 'Create New Content'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Content title"
                />
              </div>
              <div>
                <Label>Type *</Label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="page">Page</option>
                  <option value="article">Article</option>
                  <option value="banner">Banner</option>
                  <option value="notification">Notification</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Content *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your content here..."
                rows={10}
              />
            </div>

            <div>
              <Label>Meta Description</Label>
              <Textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="SEO meta description"
                rows={3}
              />
            </div>

            <div>
              <Label>Keywords (comma separated)</Label>
              <Input
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={() => handleSave('published')}>
                Publish
              </Button>
              <Button variant="outline" onClick={() => handleSave('draft')}>
                Save as Draft
              </Button>
              <Button variant="ghost" onClick={() => setShowEditor(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content List */}
      <Card>
        <CardHeader>
          <CardTitle>All Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {content.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4 flex-1">
                  <FileText className="size-8 text-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <Badge className={getTypeColor(item.type)}>
                        {item.type}
                      </Badge>
                      <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        Updated {item.updatedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="size-3" />
                        {item.views} views
                      </span>
                      <span>By {item.author}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="size-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                    <Edit className="size-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="size-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">SEO Management</h3>
            <p className="text-sm text-gray-600 mb-4">Optimize content for search engines</p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/admin/cms/seo')}>
              Manage SEO
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Media Library</h3>
            <p className="text-sm text-gray-600 mb-4">Manage images and files</p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/admin/cms/media')}>
              Open Library
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-teal-50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Analytics</h3>
            <p className="text-sm text-gray-600 mb-4">View content performance</p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/admin/cms/analytics')}>
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}