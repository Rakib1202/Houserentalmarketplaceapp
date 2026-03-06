import { useState } from 'react';
import { 
  Users, UserPlus, Search, Filter, Edit, Trash2, Lock, Power, 
  UserX, MoreVertical, Mail, Phone, Calendar, Activity 
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SupportAgent {
  id: string;
  agent_name: string;
  email: string;
  department: string;
  role: string;
  account_status: 'active' | 'inactive' | 'suspended';
  status: 'online' | 'offline' | 'busy' | 'away';
  created_at: string;
  last_active: string;
  total_chats: number;
  max_concurrent_chats: number;
}

export function AdminSupportAgents() {
  const [agents, setAgents] = useState<SupportAgent[]>([
    {
      id: '1',
      agent_name: 'Rahul Ahmed',
      email: 'rahul@support.com',
      department: 'General Support',
      role: 'agent',
      account_status: 'active',
      status: 'online',
      created_at: '2024-01-15',
      last_active: '2024-02-11T11:30:00Z',
      total_chats: 247,
      max_concurrent_chats: 5
    },
    {
      id: '2',
      agent_name: 'Fatima Khan',
      email: 'fatima@support.com',
      department: 'Technical Support',
      role: 'agent',
      account_status: 'active',
      status: 'busy',
      created_at: '2024-01-20',
      last_active: '2024-02-11T11:25:00Z',
      total_chats: 189,
      max_concurrent_chats: 5
    },
    {
      id: '3',
      agent_name: 'Karim Hassan',
      email: 'karim@support.com',
      department: 'Sales Support',
      role: 'supervisor',
      account_status: 'inactive',
      status: 'offline',
      created_at: '2024-02-01',
      last_active: '2024-02-10T18:00:00Z',
      total_chats: 98,
      max_concurrent_chats: 7
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<SupportAgent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [newAgent, setNewAgent] = useState({
    agent_name: '',
    email: '',
    password: '',
    department: 'General Support',
    role: 'agent',
    max_concurrent_chats: 5
  });

  const [resetPassword, setResetPassword] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const handleCreateAgent = () => {
    if (!newAgent.agent_name || !newAgent.email || !newAgent.password) {
      toast.error('Please fill all required fields');
      return;
    }

    const agent: SupportAgent = {
      id: Date.now().toString(),
      agent_name: newAgent.agent_name,
      email: newAgent.email,
      department: newAgent.department,
      role: newAgent.role,
      account_status: 'active',
      status: 'offline',
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString(),
      total_chats: 0,
      max_concurrent_chats: newAgent.max_concurrent_chats
    };

    setAgents([...agents, agent]);
    setShowCreateModal(false);
    setNewAgent({
      agent_name: '',
      email: '',
      password: '',
      department: 'General Support',
      role: 'agent',
      max_concurrent_chats: 5
    });
    toast.success('Support agent created successfully!');
  };

  const handleEditAgent = () => {
    if (!selectedAgent) return;

    setAgents(agents.map(a => a.id === selectedAgent.id ? selectedAgent : a));
    setShowEditModal(false);
    setSelectedAgent(null);
    toast.success('Agent updated successfully!');
  };

  const handleResetPassword = () => {
    if (resetPassword.newPassword !== resetPassword.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (resetPassword.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setShowResetPasswordModal(false);
    setResetPassword({ newPassword: '', confirmPassword: '' });
    toast.success('Password reset successfully!');
  };

  const handleActivate = (agentId: string) => {
    setAgents(agents.map(a => 
      a.id === agentId ? { ...a, account_status: 'active' as const } : a
    ));
    toast.success('Agent activated');
  };

  const handleDeactivate = (agentId: string) => {
    setAgents(agents.map(a => 
      a.id === agentId ? { ...a, account_status: 'inactive' as const, status: 'offline' as const } : a
    ));
    toast.warning('Agent deactivated');
  };

  const handleSuspend = (agentId: string) => {
    setAgents(agents.map(a => 
      a.id === agentId ? { ...a, account_status: 'suspended' as const, status: 'offline' as const } : a
    ));
    toast.error('Agent suspended');
  };

  const handleDelete = (agentId: string) => {
    if (confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      setAgents(agents.filter(a => a.id !== agentId));
      toast.success('Agent deleted successfully');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      case 'busy': return 'bg-yellow-500';
      case 'away': return 'bg-orange-500';
      default: return 'bg-gray-400';
    }
  };

  const getAccountStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || agent.account_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { label: 'Total Agents', value: agents.length, color: 'bg-blue-500' },
    { label: 'Active', value: agents.filter(a => a.account_status === 'active').length, color: 'bg-green-500' },
    { label: 'Online Now', value: agents.filter(a => a.status === 'online').length, color: 'bg-purple-500' },
    { label: 'Suspended', value: agents.filter(a => a.account_status === 'suspended').length, color: 'bg-red-500' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Support Accounts</h1>
        <p className="text-gray-600 mt-1">Create and manage customer support agent accounts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <UserPlus className="w-5 h-5" />
              Create Agent
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">{agent.agent_name.charAt(0)}</span>
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(agent.status)} rounded-full border-2 border-white`}></div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{agent.agent_name}</div>
                        <div className="text-sm text-gray-500">{agent.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{agent.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                      {agent.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getAccountStatusColor(agent.account_status)}`}>
                      {agent.account_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{agent.total_chats}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedAgent(agent);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAgent(agent);
                          setShowResetPasswordModal(true);
                        }}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded transition"
                        title="Reset Password"
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                      {agent.account_status !== 'active' && (
                        <button
                          onClick={() => handleActivate(agent.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                          title="Activate"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      )}
                      {agent.account_status === 'active' && (
                        <button
                          onClick={() => handleDeactivate(agent.id)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded transition"
                          title="Deactivate"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleSuspend(agent.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        title="Suspend"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(agent.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Support Agent</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newAgent.agent_name}
                  onChange={(e) => setNewAgent({ ...newAgent, agent_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Agent name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newAgent.email}
                  onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="agent@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newAgent.password}
                  onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Secure password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={newAgent.department}
                  onChange={(e) => setNewAgent({ ...newAgent, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>General Support</option>
                  <option>Technical Support</option>
                  <option>Sales Support</option>
                  <option>Billing Support</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newAgent.role}
                  onChange={(e) => setNewAgent({ ...newAgent, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="agent">Agent</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Concurrent Chats</label>
                <input
                  type="number"
                  value={newAgent.max_concurrent_chats}
                  onChange={(e) => setNewAgent({ ...newAgent, max_concurrent_chats: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="10"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateAgent}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create Agent
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Support Agent</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={selectedAgent.agent_name}
                  onChange={(e) => setSelectedAgent({ ...selectedAgent, agent_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={selectedAgent.department}
                  onChange={(e) => setSelectedAgent({ ...selectedAgent, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>General Support</option>
                  <option>Technical Support</option>
                  <option>Sales Support</option>
                  <option>Billing Support</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={selectedAgent.role}
                  onChange={(e) => setSelectedAgent({ ...selectedAgent, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="agent">Agent</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleEditAgent}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedAgent(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reset Password for {selectedAgent.agent_name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={resetPassword.newPassword}
                  onChange={(e) => setResetPassword({ ...resetPassword, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={resetPassword.confirmPassword}
                  onChange={(e) => setResetPassword({ ...resetPassword, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleResetPassword}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Reset Password
              </button>
              <button
                onClick={() => {
                  setShowResetPasswordModal(false);
                  setSelectedAgent(null);
                  setResetPassword({ newPassword: '', confirmPassword: '' });
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
