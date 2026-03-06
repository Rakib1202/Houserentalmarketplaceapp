import { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Search, Edit, Trash2, Lock, Power, 
  MessageSquare, Activity, Mail, Phone, Eye, EyeOff 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner@2.0.3';
import { supportEmployeesAPI } from '../../utils/api';

interface LiveChatEmployee {
  _id?: string;
  id: string;
  name: string;
  email: string;
  employeeId: string; // Login ID
  password?: string;
  phone: string;
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  onlineStatus: 'online' | 'offline' | 'busy';
  createdAt: string;
  lastActive: string;
  totalChats: number;
  maxConcurrentChats: number;
}

export function LiveChatEmployees() {
  const [employees, setEmployees] = useState<LiveChatEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<LiveChatEmployee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showPassword, setShowPassword] = useState(false);
  const [viewPassword, setViewPassword] = useState<string | null>(null);

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    employeeId: '',
    password: '',
    phone: '',
    department: 'General Support',
    maxConcurrentChats: 5
  });

  // Fetch employees from MongoDB
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response: any = await supportEmployeesAPI.getAll();
      const employeesData = response.employees.map((emp: any) => ({
        ...emp,
        id: emp._id,
      }));
      setEmployees(employeesData);
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      toast.error(error.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate Employee ID
  const generateEmployeeId = async () => {
    try {
      const response: any = await supportEmployeesAPI.getNextId();
      return response.nextId;
    } catch (error) {
      const count = employees.length + 1;
      return `SUPPORT${String(count).padStart(3, '0')}`;
    }
  };

  const handleCreateEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.employeeId || !newEmployee.password || !newEmployee.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate phone number (BD format)
    if (!/^01[0-9]{9}$/.test(newEmployee.phone)) {
      toast.error('Invalid phone number. Must be 11 digits starting with 01');
      return;
    }

    // Check if employee ID already exists
    if (employees.some(e => e.employeeId === newEmployee.employeeId)) {
      toast.error('Employee ID already exists');
      return;
    }

    try {
      // Call MongoDB API
      const response: any = await supportEmployeesAPI.create({
        name: newEmployee.name,
        email: newEmployee.email,
        employeeId: newEmployee.employeeId,
        password: newEmployee.password, // Plain password - backend will hash it
        phone: newEmployee.phone,
        department: newEmployee.department,
        maxConcurrentChats: newEmployee.maxConcurrentChats
      });

      const createdEmployee = {
        ...response.employee,
        id: response.employee._id
      };

      await fetchEmployees(); // Refresh list
      setShowCreateModal(false);
      setNewEmployee({
        name: '',
        email: '',
        employeeId: '',
        password: '',
        phone: '',
        department: 'General Support',
        maxConcurrentChats: 5
      });
      
      toast.success(`Live Chat Employee created successfully! Login ID: ${createdEmployee.employeeId}`);
      toast.info(`Password: ${newEmployee.password} (Save this, it won't be shown again)`);
    } catch (error: any) {
      console.error('Error creating employee:', error);
      toast.error(error.message || 'Failed to create employee');
    }
  };

  const handleEditEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      const response: any = await supportEmployeesAPI.updateStatus(
        selectedEmployee._id || selectedEmployee.id,
        selectedEmployee.status
      );

      await fetchEmployees(); // Refresh list
      setShowEditModal(false);
      setSelectedEmployee(null);
      toast.success('Employee updated successfully!');
    } catch (error: any) {
      console.error('Error updating employee:', error);
      toast.error(error.message || 'Failed to update employee');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      await supportEmployeesAPI.delete(id);
      await fetchEmployees(); // Refresh list
      toast.success('Employee deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting employee:', error);
      toast.error(error.message || 'Failed to delete employee');
    }
  };

  const toggleStatus = async (id: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      await supportEmployeesAPI.updateStatus(id, newStatus);
      await fetchEmployees(); // Refresh list
      toast.success(`Employee ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || employee.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOnlineStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Live Chat Support Employees</h1>
        <p className="text-gray-600 mt-1">Create and manage live chat support employee accounts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
              <Users className="size-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {employees.filter(e => e.status === 'active').length}
                </p>
              </div>
              <Activity className="size-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Online Now</p>
                <p className="text-2xl font-bold text-blue-600">
                  {employees.filter(e => e.onlineStatus === 'online').length}
                </p>
              </div>
              <Power className="size-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Chats</p>
                <p className="text-2xl font-bold text-purple-600">
                  {employees.reduce((sum, e) => sum + e.totalChats, 0)}
                </p>
              </div>
              <MessageSquare className="size-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
          <Input
            placeholder="Search by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
        
        <Button onClick={() => {
          setNewEmployee({ ...newEmployee, employeeId: generateEmployeeId() });
          setShowCreateModal(true);
        }} className="gap-2">
          <UserPlus className="size-4" />
          Create Employee
        </Button>
      </div>

      {/* Employees Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Employee</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Login ID</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Department</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Online</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Chats</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Mail className="size-3" />
                          {employee.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Phone className="size-3" />
                          {employee.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono font-semibold text-blue-600">
                        {employee.employeeId}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Lock className="size-3" />
                          Password: Encrypted
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-700">{employee.department}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${getOnlineStatusColor(employee.onlineStatus)}`}></span>
                        <span className="text-sm capitalize">{employee.onlineStatus}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="font-medium">{employee.totalChats}</div>
                        <div className="text-xs text-gray-500">Max: {employee.maxConcurrentChats}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowEditModal(true);
                          }}
                        >
                          <Edit className="size-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleStatus(
                            employee.id,
                            employee.status === 'active' ? 'inactive' : 'active'
                          )}
                          className={employee.status === 'active' ? 'text-red-600' : 'text-green-600'}
                        >
                          <Power className="size-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredEmployees.length === 0 && (
              <div className="text-center py-12">
                <Users className="size-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No employees found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Employee Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create Live Chat Employee</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <Label>Employee ID (Login ID) *</Label>
                  <Input
                    value={newEmployee.employeeId}
                    onChange={(e) => setNewEmployee({ ...newEmployee, employeeId: e.target.value.toUpperCase() })}
                    placeholder="SUPPORT001"
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    placeholder="employee@houserentbd.com"
                  />
                </div>
                
                <div>
                  <Label>Phone *</Label>
                  <Input
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    placeholder="01712345678"
                    maxLength={11}
                  />
                </div>
              </div>

              <div>
                <Label>Password *</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">This will be used to login to the support panel</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Department *</Label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="General Support">General Support</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Sales Support">Sales Support</option>
                    <option value="Customer Care">Customer Care</option>
                  </select>
                </div>
                
                <div>
                  <Label>Max Concurrent Chats</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={newEmployee.maxConcurrentChats}
                    onChange={(e) => setNewEmployee({ ...newEmployee, maxConcurrentChats: parseInt(e.target.value) || 5 })}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Login Credentials:</strong><br />
                  Employee ID: <span className="font-mono font-semibold">{newEmployee.employeeId || 'SUPPORT###'}</span><br />
                  Password: {newEmployee.password || '(not set)'}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleCreateEmployee} className="flex-1">
                  Create Employee
                </Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Edit Employee</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={selectedEmployee.name}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={selectedEmployee.email}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={selectedEmployee.phone}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, phone: e.target.value })}
                    maxLength={11}
                  />
                </div>
                
                <div>
                  <Label>Department</Label>
                  <select
                    value={selectedEmployee.department}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, department: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="General Support">General Support</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Sales Support">Sales Support</option>
                    <option value="Customer Care">Customer Care</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <select
                    value={selectedEmployee.status}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, status: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                
                <div>
                  <Label>Max Concurrent Chats</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={selectedEmployee.maxConcurrentChats}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, maxConcurrentChats: parseInt(e.target.value) || 5 })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleEditEmployee} className="flex-1">
                  Update Employee
                </Button>
                <Button variant="outline" onClick={() => {
                  setShowEditModal(false);
                  setSelectedEmployee(null);
                }}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}