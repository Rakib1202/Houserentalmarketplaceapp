import { useEffect, useState } from 'react';
import { CreditCard, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { subscriptionsAPI } from '../../utils/api';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  active: boolean;
  createdAt: string;
}

export function SubscriptionManagement() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    features: '',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/subscriptions`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setPlans(data.plans);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const adminToken = localStorage.getItem('adminToken');
      const url = editingPlan
        ? `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/subscriptions/${editingPlan.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/subscriptions`;

      const response = await fetch(url, {
        method: editingPlan ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          features: formData.features.split('\n').filter(f => f.trim()),
        }),
      });

      if (response.ok) {
        toast.success(editingPlan ? 'Plan updated' : 'Plan created');
        setShowForm(false);
        setEditingPlan(null);
        setFormData({ name: '', price: '', duration: '', features: '' });
        fetchPlans();
      } else {
        toast.error('Failed to save plan');
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Failed to save plan');
    }
  };

  const handleToggleActive = async (planId: string, currentStatus: boolean) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/subscriptions/${planId}/toggle`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ active: !currentStatus }),
        }
      );

      if (response.ok) {
        toast.success(`Plan ${!currentStatus ? 'activated' : 'deactivated'}`);
        fetchPlans();
      }
    } catch (error) {
      console.error('Error toggling plan:', error);
      toast.error('Failed to update plan');
    }
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      duration: plan.duration.toString(),
      features: plan.features.join('\n'),
    });
    setShowForm(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subscription Management</h1>
          <p className="text-gray-600">Manage premium subscription plans</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="size-4 mr-2" />
          Create Plan
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Plan Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Premium Monthly"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (৳)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 999"
                    required
                  />
                </div>
                <div>
                  <Label>Duration (days)</Label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 30"
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Features (one per line)</Label>
                <Textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Featured listings&#10;Priority support&#10;Unlimited property posts"
                  rows={5}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingPlan ? 'Update' : 'Create'} Plan</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPlan(null);
                    setFormData({ name: '', price: '', duration: '', features: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`${plan.active ? '' : 'opacity-60'}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    ৳{plan.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">{plan.duration} days</p>
                </div>
                <Badge variant={plan.active ? 'default' : 'secondary'}>
                  {plan.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(plan)}>
                  <Edit className="size-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant={plan.active ? 'destructive' : 'default'}
                  onClick={() => handleToggleActive(plan.id, plan.active)}
                >
                  {plan.active ? <XCircle className="size-3 mr-1" /> : <CheckCircle className="size-3 mr-1" />}
                  {plan.active ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
