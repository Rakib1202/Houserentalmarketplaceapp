import { useState } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  File, 
  Trash2, 
  Download,
  Search,
  Grid3x3,
  List,
  Filter,
  FolderOpen,
  Plus,
  X,
  Copy,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from 'sonner';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video';
  url: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  folder?: string;
  dimensions?: string;
}

export function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([
    {
      id: '1',
      name: 'hero-banner.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
      size: '2.4 MB',
      uploadedAt: '2024-02-10',
      uploadedBy: 'Admin',
      folder: 'Banners',
      dimensions: '1920x1080',
    },
    {
      id: '2',
      name: 'property-1.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
      size: '1.8 MB',
      uploadedAt: '2024-02-09',
      uploadedBy: 'Admin',
      folder: 'Properties',
      dimensions: '1600x900',
    },
    {
      id: '3',
      name: 'apartment-interior.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      size: '1.5 MB',
      uploadedAt: '2024-02-08',
      uploadedBy: 'Admin',
      folder: 'Properties',
      dimensions: '1600x900',
    },
    {
      id: '4',
      name: 'terms-and-conditions.pdf',
      type: 'document',
      url: '#',
      size: '245 KB',
      uploadedAt: '2024-02-05',
      uploadedBy: 'Admin',
      folder: 'Documents',
    },
    {
      id: '5',
      name: 'rental-agreement.pdf',
      type: 'document',
      url: '#',
      size: '180 KB',
      uploadedAt: '2024-02-01',
      uploadedBy: 'Admin',
      folder: 'Documents',
    },
    {
      id: '6',
      name: 'modern-house.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
      size: '2.1 MB',
      uploadedAt: '2024-01-28',
      uploadedBy: 'Admin',
      folder: 'Properties',
      dimensions: '1920x1080',
    },
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'document' | 'video'>('all');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const folders = Array.from(new Set(files.map(f => f.folder).filter(Boolean))) as string[];

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || file.type === filterType;
    const matchesFolder = !selectedFolder || file.folder === selectedFolder;
    return matchesSearch && matchesType && matchesFolder;
  });

  const stats = {
    totalFiles: files.length,
    images: files.filter(f => f.type === 'image').length,
    documents: files.filter(f => f.type === 'document').length,
    totalSize: '12.3 MB', // Calculate from files in production
  };

  const handleCopyUrl = (url: string, fileId: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(fileId);
    toast.success('URL copied to clipboard!');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = (fileId: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      setFiles(files.filter(f => f.id !== fileId));
      setSelectedFile(null);
      toast.success('File deleted successfully!');
    }
  };

  const handleUpload = () => {
    // In production, handle actual file upload
    toast.success('File uploaded successfully!');
    setShowUploadDialog(false);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="size-5 text-blue-600" />;
      case 'document':
        return <File className="size-5 text-green-600" />;
      case 'video':
        return <File className="size-5 text-purple-600" />;
      default:
        return <File className="size-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Media Library</h1>
          <p className="text-gray-600">Manage your images, documents, and files</p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Upload className="size-4 mr-2" />
          Upload Files
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Files</p>
                <p className="text-2xl font-bold">{stats.totalFiles}</p>
              </div>
              <File className="size-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Images</p>
                <p className="text-2xl font-bold">{stats.images}</p>
              </div>
              <ImageIcon className="size-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-2xl font-bold">{stats.documents}</p>
              </div>
              <File className="size-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold">{stats.totalSize}</p>
              </div>
              <FolderOpen className="size-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="document">Documents</option>
                <option value="video">Videos</option>
              </select>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3x3 className="size-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Folders Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Folders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedFolder(null)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  !selectedFolder ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FolderOpen className="size-4" />
                  <span>All Files</span>
                  <Badge variant="secondary" className="ml-auto">{files.length}</Badge>
                </div>
              </button>

              {folders.map(folder => (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedFolder === folder ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="size-4" />
                    <span>{folder}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {files.filter(f => f.folder === folder).length}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4" size="sm">
              <Plus className="size-4 mr-2" />
              New Folder
            </Button>
          </CardContent>
        </Card>

        {/* Files Display */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {selectedFolder || 'All Files'} ({filteredFiles.length})
                </CardTitle>
                {selectedFolder && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedFolder(null)}>
                    <X className="size-4 mr-2" />
                    Clear Filter
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {filteredFiles.length === 0 ? (
                <div className="text-center py-12">
                  <File className="size-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">No files found</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredFiles.map(file => (
                    <div
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className="group relative border rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      {file.type === 'image' ? (
                        <div className="aspect-square bg-gray-100">
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          {getFileIcon(file.type)}
                          <span className="ml-2 text-lg font-semibold text-gray-600">
                            {file.name.split('.').pop()?.toUpperCase()}
                          </span>
                        </div>
                      )}

                      <div className="p-3">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyUrl(file.url, file.id);
                          }}
                        >
                          {copiedUrl === file.id ? (
                            <Check className="size-4" />
                          ) : (
                            <Copy className="size-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(file.id);
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map(file => (
                    <div
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className="flex items-center gap-4 p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      {file.type === 'image' ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="size-12 object-cover rounded"
                        />
                      ) : (
                        <div className="size-12 bg-gray-100 rounded flex items-center justify-center">
                          {getFileIcon(file.type)}
                        </div>
                      )}

                      <div className="flex-1">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          {file.size} • Uploaded {file.uploadedAt}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyUrl(file.url, file.id);
                          }}
                        >
                          {copiedUrl === file.id ? (
                            <Check className="size-4" />
                          ) : (
                            <Copy className="size-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(file.id);
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* File Details Dialog */}
      {selectedFile && (
        <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>File Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {selectedFile.type === 'image' && (
                <div className="bg-gray-100 rounded-lg p-4">
                  <img
                    src={selectedFile.url}
                    alt={selectedFile.name}
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">File Name</p>
                  <p className="font-medium">{selectedFile.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">File Size</p>
                  <p className="font-medium">{selectedFile.size}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <Badge>{selectedFile.type}</Badge>
                </div>
                {selectedFile.dimensions && (
                  <div>
                    <p className="text-sm text-gray-600">Dimensions</p>
                    <p className="font-medium">{selectedFile.dimensions}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Uploaded</p>
                  <p className="font-medium">{selectedFile.uploadedAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Uploaded By</p>
                  <p className="font-medium">{selectedFile.uploadedBy}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">File URL</p>
                <div className="flex gap-2">
                  <Input value={selectedFile.url} readOnly className="font-mono text-sm" />
                  <Button onClick={() => handleCopyUrl(selectedFile.url, selectedFile.id)}>
                    {copiedUrl === selectedFile.id ? (
                      <Check className="size-4 mr-2" />
                    ) : (
                      <Copy className="size-4 mr-2" />
                    )}
                    Copy
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" asChild>
                  <a href={selectedFile.url} download>
                    <Download className="size-4 mr-2" />
                    Download
                  </a>
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(selectedFile.id)}>
                  <Trash2 className="size-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="size-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
              <p className="text-sm text-gray-500">Supports: JPG, PNG, PDF, DOC (Max 10MB)</p>
              <Button className="mt-4">
                Browse Files
              </Button>
            </div>

            <div>
              <label className="text-sm font-medium">Folder</label>
              <select className="w-full mt-1 p-2 border rounded-md">
                <option>Select folder...</option>
                {folders.map(folder => (
                  <option key={folder} value={folder}>{folder}</option>
                ))}
                <option value="new">+ Create new folder</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleUpload} className="flex-1">
                Upload
              </Button>
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
