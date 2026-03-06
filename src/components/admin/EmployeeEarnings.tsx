import { useEffect, useState } from 'react';
import { DollarSign, User, Camera, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { toast } from 'sonner';
import { employeeEarningsAPI } from '../../utils/api';

interface EmployeeEarning {
  employeeId: string;
  employeeName: string;
  employeePhone: string;
  totalPhotos: number;
  approvedPhotos: number;
  rejectedPhotos: number;
  pendingPhotos: number;
  totalEarnings: number;
  lastUpload: string;
}

export function EmployeeEarnings() {
  const [employees, setEmployees] = useState<EmployeeEarning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeEarnings();
  }, []);

  const fetchEmployeeEarnings = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/employee-earnings`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setEmployees(data.employees);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalEarnings = employees.reduce((sum, e) => sum + e.totalEarnings, 0);
  const totalApprovedPhotos = employees.reduce((sum, e) => sum + e.approvedPhotos, 0);

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Employee Earnings</h1>
        <p className="text-gray-600">Track photo upload earnings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Earnings Paid</p>
            <p className="text-2xl font-bold text-green-600">৳{totalEarnings.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Approved Photos</p>
            <p className="text-2xl font-bold">{totalApprovedPhotos}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Active Employees</p>
            <p className="text-2xl font-bold">{employees.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {employees.map((employee) => (
          <Card key={employee.employeeId}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <User className="size-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{employee.employeeName}</h3>
                    <p className="text-sm text-gray-600 mb-3">{employee.employeePhone}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Total Photos</p>
                        <p className="font-semibold">{employee.totalPhotos}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Approved</p>
                        <p className="font-semibold text-green-600">{employee.approvedPhotos}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Pending</p>
                        <p className="font-semibold text-yellow-600">{employee.pendingPhotos}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Rejected</p>
                        <p className="font-semibold text-red-600">{employee.rejectedPhotos}</p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Last upload: {new Date(employee.lastUpload).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold text-green-600">৳{employee.totalEarnings.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    ৳5 per approved photo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {employees.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <User className="size-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No employee earnings data</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
