import { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    photoEarningAmount: '5',
    featuredListingPrice: '500',
    platformCommission: '10',
    minPropertyPrice: '1000',
    maxPropertyPrice: '1000000',
  });

  const handleSave = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/settings`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(settings),
        }
      );

      if (response.ok) {
        toast.success('Settings saved successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Settings</h1>
        <p className="text-gray-600">Configure platform settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="size-5" />
            Platform Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Photo Earning Amount (৳ per approved photo)</Label>
            <Input
              type="number"
              value={settings.photoEarningAmount}
              onChange={(e) => setSettings({ ...settings, photoEarningAmount: e.target.value })}
            />
          </div>
          <div>
            <Label>Featured Listing Price (৳)</Label>
            <Input
              type="number"
              value={settings.featuredListingPrice}
              onChange={(e) => setSettings({ ...settings, featuredListingPrice: e.target.value })}
            />
          </div>
          <div>
            <Label>Platform Commission (%)</Label>
            <Input
              type="number"
              value={settings.platformCommission}
              onChange={(e) => setSettings({ ...settings, platformCommission: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Min Property Price (৳)</Label>
              <Input
                type="number"
                value={settings.minPropertyPrice}
                onChange={(e) => setSettings({ ...settings, minPropertyPrice: e.target.value })}
              />
            </div>
            <div>
              <Label>Max Property Price (৳)</Label>
              <Input
                type="number"
                value={settings.maxPropertyPrice}
                onChange={(e) => setSettings({ ...settings, maxPropertyPrice: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleSave}>
            <Save className="size-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
