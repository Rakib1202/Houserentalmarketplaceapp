import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { propertiesAPI, authAPI } from '../utils/api';

const sampleProperties = [
  {
    title: '3 Bed Luxury Apartment in Dhanmondi',
    description: 'Beautiful 3 bedroom apartment with modern amenities, lift, parking, and 24/7 security. Perfect for families.',
    area: 'Dhanmondi',
    address: 'Road 5, Dhanmondi',
    fullAddress: 'House 23, Road 5, Dhanmondi, Dhaka 1205',
    rent: 45000,
    advance: 90000,
    bedrooms: 3,
    bathrooms: 2,
    size: 1500,
    tenantType: 'family',
    amenities: ['Lift', 'Parking', 'Generator', 'Gas', 'Security', 'Balcony'],
    rules: 'No pets allowed. No smoking inside.',
    photos: [
      'https://images.unsplash.com/photo-1757924461488-ef9ad0670978?w=800',
      'https://images.unsplash.com/photo-1613575831056-0acd5da8f085?w=800',
      'https://images.unsplash.com/photo-1609363650758-e4b1400add8e?w=800',
    ],
  },
  {
    title: '2 Bed Modern Flat in Gulshan',
    description: 'Spacious 2 bedroom flat with balcony, furnished kitchen, and all modern facilities. Located in prime area.',
    area: 'Gulshan',
    address: 'Gulshan 2, Circle',
    fullAddress: 'Road 11, House 45, Gulshan 2, Dhaka 1212',
    rent: 55000,
    advance: 110000,
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    tenantType: 'both',
    amenities: ['Lift', 'Parking', 'Generator', 'Security', 'Furnished', 'WiFi'],
    rules: 'Well-behaved pets allowed.',
    photos: [
      'https://images.unsplash.com/photo-1610177534644-34d881503b83?w=800',
      'https://images.unsplash.com/photo-1757439402224-56c48352f719?w=800',
    ],
  },
  {
    title: 'Bachelor Studio in Banani',
    description: 'Compact studio apartment perfect for working professionals. Includes basic furniture and WiFi.',
    area: 'Banani',
    address: 'Road 12, Banani',
    fullAddress: 'House 8/A, Road 12, Banani, Dhaka 1213',
    rent: 18000,
    advance: 36000,
    bedrooms: 1,
    bathrooms: 1,
    size: 500,
    tenantType: 'bachelor',
    amenities: ['Lift', 'Security', 'WiFi', 'Furnished'],
    rules: 'No parties. No guests after 10 PM.',
    photos: [
      'https://images.unsplash.com/photo-1757924461488-ef9ad0670978?w=800',
    ],
  },
  {
    title: '4 Bed Duplex in Uttara',
    description: 'Luxurious duplex with 4 bedrooms, rooftop access, parking for 2 cars. Ideal for large families.',
    area: 'Uttara',
    address: 'Sector 7, Uttara',
    fullAddress: 'House 15, Road 3, Sector 7, Uttara, Dhaka 1230',
    rent: 65000,
    advance: 130000,
    bedrooms: 4,
    bathrooms: 3,
    size: 2200,
    tenantType: 'family',
    amenities: ['Parking', 'Generator', 'Gas', 'Security', 'Garden', 'Balcony'],
    rules: 'Family only. No commercial use.',
    photos: [
      'https://images.unsplash.com/photo-1613575831056-0acd5da8f085?w=800',
      'https://images.unsplash.com/photo-1609363650758-e4b1400add8e?w=800',
    ],
  },
  {
    title: '2 Bed Furnished Apartment in Bashundhara',
    description: 'Fully furnished 2 bedroom apartment with modern appliances, gym access, and swimming pool.',
    area: 'Bashundhara',
    address: 'Block B, Bashundhara R/A',
    fullAddress: 'House 23, Road 2, Block B, Bashundhara R/A, Dhaka 1229',
    rent: 38000,
    advance: 76000,
    bedrooms: 2,
    bathrooms: 2,
    size: 1100,
    tenantType: 'both',
    amenities: ['Lift', 'Parking', 'Gym', 'Swimming Pool', 'Security', 'Furnished'],
    rules: 'Pets allowed with permission.',
    photos: [
      'https://images.unsplash.com/photo-1610177534644-34d881503b83?w=800',
      'https://images.unsplash.com/photo-1757924461488-ef9ad0670978?w=800',
    ],
  },
];

export function DemoDataSeeder() {
  const [seeding, setSeeding] = useState(false);

  const createDemoAccount = async () => {
    setSeeding(true);
    try {
      // Create admin account
      const adminResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            phone: '01700000000',
            name: 'Admin User',
            role: 'admin',
          }),
        }
      );

      const adminData = await adminResponse.json();
      if (!adminResponse.ok) throw new Error(adminData.error);

      toast.success(`Admin created! Phone: 01700000000, Password: ${adminData.password}`);

      // Login as admin
      const loginResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            phone: '01700000000',
            password: adminData.password,
          }),
        }
      );

      const loginData = await loginResponse.json();
      if (!loginResponse.ok) throw new Error(loginData.error);

      // Create sample properties
      for (const property of sampleProperties) {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-449053da/properties`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${loginData.accessToken}`,
            },
            body: JSON.stringify(property),
          }
        );
      }

      toast.success(`Created ${sampleProperties.length} demo properties!`);
      toast.info('You can now login with phone: 01700000000');

    } catch (error) {
      console.error('Error seeding data:', error);
      toast.error('Failed to seed demo data');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Demo Data Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Click the button below to create an admin account and populate the app with sample properties.
        </p>
        <Button onClick={createDemoAccount} disabled={seeding} className="w-full">
          {seeding ? 'Setting up...' : 'Create Demo Data'}
        </Button>
      </CardContent>
    </Card>
  );
}
