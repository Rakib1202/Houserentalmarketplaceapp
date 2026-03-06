import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { Upload, X, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { propertiesAPI } from '../../utils/api';
import type { Property, TenantType } from '../../types';

interface PropertyFormProps {
  property?: Property;
  onSuccess: () => void;
  onCancel: () => void;
}

const dhakaAreas = [
  'Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur', 'Mohammadpur',
  'Bashundhara', 'Baridhara', 'Lalmatia', 'Tejgaon', 'Farmgate', 'Shyamoli',
  'Rampura', 'Badda', 'Khilkhet', 'Kakrail', 'Motijheel', 'Wari'
];

const amenitiesList = [
  'Lift', 'Parking', 'Generator', 'Gas', 'Security', 'CCTV',
  'Balcony', 'Furnished', 'WiFi', 'Gym', 'Swimming Pool', 'Garden'
];

export function PropertyForm({ property, onSuccess, onCancel }: PropertyFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    area: property?.area || '',
    address: property?.address || '',
    fullAddress: property?.fullAddress || '',
    rent: property?.rent || 0,
    advance: property?.advance || 0,
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    size: property?.size || 0,
    tenantType: (property?.tenantType as TenantType) || 'both',
    amenities: property?.amenities || [],
    rules: property?.rules || '',
    photos: property?.photos || [],
  });

  const handleAmenityToggle = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter((a) => a !== amenity)
        : [...formData.amenities, amenity],
    });
  };

  const handlePhotoUrlAdd = () => {
    const url = prompt('Enter photo URL:');
    if (url) {
      setFormData({
        ...formData,
        photos: [...formData.photos, url],
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check photo limit (reduced to 2 for maximum database compatibility)
    const MAX_PHOTOS = 2;
    const remainingSlots = MAX_PHOTOS - formData.photos.length;
    if (remainingSlots === 0) {
      toast.error(`Maximum ${MAX_PHOTOS} photos allowed. Please remove some photos first.`);
      e.target.value = '';
      return;
    }

    setUploadingImages(true);
    const uploadedUrls: string[] = [];
    const filesToProcess = Math.min(files.length, remainingSlots);

    try {
      // Convert files to compressed base64 data URLs
      for (let i = 0; i < filesToProcess; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Max size is 5MB`);
          continue;
        }

        // Compress and convert to data URL
        const compressedDataUrl = await compressImage(file);
        
        // Check if compressed image is still too large
        if (compressedDataUrl.length > 100 * 1024) { // 100KB limit per image
          toast.error(`${file.name} is still too large after compression. Please use a smaller image.`);
          continue;
        }
        
        uploadedUrls.push(compressedDataUrl);
      }

      if (uploadedUrls.length > 0) {
        setFormData({
          ...formData,
          photos: [...formData.photos, ...uploadedUrls],
        });
        toast.success(`${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''} uploaded successfully!`);
      }

      if (filesToProcess < files.length) {
        toast.warning(`Only ${filesToProcess} photos uploaded. Maximum ${MAX_PHOTOS} photos allowed.`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
      // Reset input
      e.target.value = '';
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if image is too large - more aggressive compression
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = height * (MAX_WIDTH / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = width * (MAX_HEIGHT / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.5 quality for even smaller file size
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5);
          
          // Log compression results for debugging
          const originalSize = (event.target?.result as string).length;
          const compressedSize = compressedDataUrl.length;
          console.log(`Image compressed: ${(originalSize / 1024).toFixed(1)}KB → ${(compressedSize / 1024).toFixed(1)}KB (${((1 - compressedSize / originalSize) * 100).toFixed(1)}% reduction)`);
          
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const removePhoto = (index: number) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, i) => i !== index),
    });
    toast.success('Photo removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (property) {
        await propertiesAPI.update(property.id, formData);
        toast.success('Property updated successfully!');
      } else {
        await propertiesAPI.create(formData);
        toast.success('Property created successfully!');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{property ? 'Edit Property' : 'Add New Property'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Spacious 3 Bed Apartment in Dhanmondi"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your property..."
                rows={4}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="area">Area *</Label>
              <Select
                value={formData.area}
                onValueChange={(value) => setFormData({ ...formData, area: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  {dhakaAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="address">Short Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g., Road 5, Dhanmondi"
                required
              />
            </div>

            <div>
              <Label htmlFor="fullAddress">Full Address (Premium Only)</Label>
              <Input
                id="fullAddress"
                value={formData.fullAddress}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                placeholder="e.g., House 23, Road 5, Dhanmondi, Dhaka 1205"
              />
            </div>
          </div>

          {/* Property Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rent">Monthly Rent (৳) *</Label>
              <Input
                id="rent"
                type="number"
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: parseInt(e.target.value) || 0 })}
                placeholder="25000"
                required
              />
            </div>

            <div>
              <Label htmlFor="advance">Advance (৳) *</Label>
              <Input
                id="advance"
                type="number"
                value={formData.advance}
                onChange={(e) => setFormData({ ...formData, advance: parseInt(e.target.value) || 0 })}
                placeholder="50000"
                required
              />
            </div>

            <div>
              <Label htmlFor="bedrooms">Bedrooms *</Label>
              <Input
                id="bedrooms"
                type="number"
                min="1"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 1 })}
                required
              />
            </div>

            <div>
              <Label htmlFor="bathrooms">Bathrooms *</Label>
              <Input
                id="bathrooms"
                type="number"
                min="1"
                value={formData.bathrooms}
                onChange={(e) =>
                  setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 1 })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="size">Size (sqft) *</Label>
              <Input
                id="size"
                type="number"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: parseInt(e.target.value) || 0 })}
                placeholder="1200"
                required
              />
            </div>

            <div>
              <Label htmlFor="tenantType">Tenant Type *</Label>
              <Select
                value={formData.tenantType}
                onValueChange={(value) => setFormData({ ...formData, tenantType: value as TenantType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="family">Family Only</SelectItem>
                  <SelectItem value="bachelor">Bachelor Only</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <Label className="mb-3 block">Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity)}
                  />
                  <label
                    htmlFor={amenity}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div>
            <Label htmlFor="rules">House Rules</Label>
            <Textarea
              id="rules"
              value={formData.rules}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
              placeholder="e.g., No pets, No smoking, etc."
              rows={3}
            />
          </div>

          {/* Photos */}
          <div>
            <Label className="mb-3 block">Photos</Label>
            <div className="space-y-4">
              {/* Upload Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Upload from Device Button */}
                <label
                  htmlFor="fileUpload"
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg cursor-pointer transition-all ${
                    uploadingImages 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                  }`}
                >
                  {uploadingImages ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload from Device
                    </>
                  )}
                  <input
                    id="fileUpload"
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploadingImages}
                  />
                </label>

                {/* Add URL Button */}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePhotoUrlAdd}
                  className="gap-2"
                >
                  <LinkIcon className="w-4 h-4" />
                  Add Photo URL
                </Button>

                <p className="text-xs text-gray-500">
                  {formData.photos.length}/2 photos • Max 100KB per photo after compression
                </p>
              </div>

              {/* Photo Grid */}
              {formData.photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.photos.map((photo, index) => (
                    <div 
                      key={index} 
                      className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all"
                    >
                      <img 
                        src={photo} 
                        alt={`Photo ${index + 1}`} 
                        className="w-full h-32 object-cover"
                      />
                      {/* Photo Number Badge */}
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        #{index + 1}
                      </div>
                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {/* Main Photo Badge */}
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          Main Photo
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-2">No photos uploaded yet</p>
                  <p className="text-xs text-gray-500">
                    Upload images from your device or add photo URLs
                  </p>
                </div>
              )}

              {/* Helper Text */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>Tips:</strong> Upload multiple photos at once. First photo will be the main display photo. 
                  You can upload images directly from your device (JPG, PNG, WebP) or paste image URLs.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : property ? 'Update Property' : 'Create Property'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}