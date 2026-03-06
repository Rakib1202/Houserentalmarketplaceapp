import { useState, useEffect } from 'react';
import { 
  MessageSquare, Send, Search, Filter, Clock, User, 
  CheckCircle, XCircle, Phone, Mail, Home, AlertCircle,
  Paperclip, Smile, MoreVertical, ArrowLeft, RefreshCw
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner@2.0.3';
import { supportTicketsAPI } from '../../utils/api';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo: string | null;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  sender: 'customer' | 'support';
  senderName: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}

export function LiveChatReplyDashboard() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    // Get logged-in employee data
    const employeeData = localStorage.getItem('supportEmployee');
    if (employeeData) {
      setEmployee(JSON.parse(employeeData));
    }

    // Load tickets
    loadTickets();

    // Auto-refresh tickets every 5 seconds for real-time updates
    const refreshInterval = setInterval(() => {
      loadTickets();
    }, 5000);

    return () => clearInterval(refreshInterval);
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await supportTicketsAPI.getAll();
      setTickets(response.tickets || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast.error('Failed to load tickets. Using demo data.');
      // Use demo data if backend not available
      setTickets(getDemoTickets());
    } finally {
      setLoading(false);
    }
  };

  const getDemoTickets = (): SupportTicket[] => [
    {
      id: '1',
      ticketNumber: 'TICK-001',
      customerName: 'Ahmed Rahman',
      customerEmail: 'ahmed@example.com',
      customerPhone: '01712345678',
      subject: 'Unable to view property details',
      category: 'Technical',
      priority: 'high',
      status: 'open',
      assignedTo: null,
      messages: [
        {
          id: 'm1',
          sender: 'customer',
          senderName: 'Ahmed Rahman',
          message: 'I am trying to view the property details for property ID 12345 but the page is not loading. Can you help?',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: '2',
      ticketNumber: 'TICK-002',
      customerName: 'Fatima Khan',
      customerEmail: 'fatima@example.com',
      customerPhone: '01812345678',
      subject: 'Payment verification pending',
      category: 'Payment',
      priority: 'urgent',
      status: 'in-progress',
      assignedTo: 'SUPPORT001',
      messages: [
        {
          id: 'm2',
          sender: 'customer',
          senderName: 'Fatima Khan',
          message: 'I have made a payment of 50,000 BDT for booking but it is still showing as pending. Transaction ID: TRX123456',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        },
        {
          id: 'm3',
          sender: 'support',
          senderName: 'Rahul Ahmed',
          message: 'Hello Fatima, I am checking your payment details. Please wait for a moment.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: 'm4',
          sender: 'customer',
          senderName: 'Fatima Khan',
          message: 'Thank you. Please let me know as soon as possible.',
          timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    },
    {
      id: '3',
      ticketNumber: 'TICK-003',
      customerName: 'Karim Hassan',
      customerEmail: 'karim@example.com',
      customerPhone: '01912345678',
      subject: 'How to upload property photos?',
      category: 'General',
      priority: 'low',
      status: 'open',
      assignedTo: null,
      messages: [
        {
          id: 'm5',
          sender: 'customer',
          senderName: 'Karim Hassan',
          message: 'I am a property owner and I want to know how to upload photos for my property listing.',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    }
  ];

  const handleAssignToMe = async (ticketId: string) => {
    if (!employee) {
      toast.error('Employee information not found');
      return;
    }

    try {
      await supportTicketsAPI.assign(ticketId, employee.employeeId);

      // Update local state
      setTickets(tickets.map(t => 
        t.id === ticketId 
          ? { ...t, assignedTo: employee.employeeId, status: 'in-progress' }
          : t
      ));

      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, assignedTo: employee.employeeId, status: 'in-progress' });
      }

      toast.success('Ticket assigned to you');
    } catch (error: any) {
      console.error('Error assigning ticket:', error);
      toast.error(error.message || 'Failed to assign ticket');
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedTicket || !employee) return;

    try {
      const response = await supportTicketsAPI.addMessage(selectedTicket.id, {
        message: messageText,
        sender: 'support',
        senderName: employee.name
      });

      if (response.ticket) {
        // Update local state
        const updatedTicket = {
          ...selectedTicket,
          messages: response.ticket.messages,
          updatedAt: response.ticket.updatedAt || new Date().toISOString(),
        };

        setSelectedTicket(updatedTicket);
        setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
        setMessageText('');
        
        toast.success('Message sent');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.message || 'Failed to send message');
    }
  };

  const handleResolveTicket = async (ticketId: string) => {
    try {
      await supportTicketsAPI.updateStatus(ticketId, 'resolved');

      setTickets(tickets.map(t => 
        t.id === ticketId ? { ...t, status: 'resolved' } : t
      ));

      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: 'resolved' });
      }

      toast.success('Ticket marked as resolved');
    } catch (error: any) {
      console.error('Error resolving ticket:', error);
      toast.error(error.message || 'Failed to resolve ticket');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Ticket List */}
      <div className={`${selectedTicket ? 'hidden md:block' : 'block'} w-full md:w-96 bg-white border-r flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Live Chat Support</h2>
              <p className="text-sm text-gray-600">
                {employee ? `Welcome, ${employee.name}` : 'Support Dashboard'}
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={loadTickets}>
              <RefreshCw className="size-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-2 py-1.5 text-sm border rounded"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="flex-1 px-2 py-1.5 text-sm border rounded"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Ticket List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="size-8 text-gray-400 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading tickets...</p>
              </div>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="size-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tickets found</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedTicket?.id === ticket.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-gray-500">{ticket.ticketNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{ticket.subject}</h3>
                    <p className="text-xs text-gray-600">{ticket.customerName}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {formatTime(ticket.updatedAt)}
                  </span>
                  <span>{ticket.messages.length} messages</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-yellow-600">{tickets.filter(t => t.status === 'open').length}</div>
              <div className="text-xs text-gray-600">Open</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">{tickets.filter(t => t.status === 'in-progress').length}</div>
              <div className="text-xs text-gray-600">In Progress</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">{tickets.filter(t => t.status === 'resolved').length}</div>
              <div className="text-xs text-gray-600">Resolved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`${selectedTicket ? 'block' : 'hidden md:block'} flex-1 flex flex-col`}>
        {selectedTicket ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTicket(null)}
                  className="md:hidden"
                >
                  <ArrowLeft className="size-4" />
                </Button>
                
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedTicket.customerName}</h2>
                    <p className="text-xs text-gray-500">{selectedTicket.ticketNumber} • {selectedTicket.category}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedTicket.assignedTo !== employee?.employeeId && selectedTicket.status === 'open' && (
                  <Button size="sm" onClick={() => handleAssignToMe(selectedTicket.id)}>
                    Assign to Me
                  </Button>
                )}
                
                {selectedTicket.status === 'in-progress' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleResolveTicket(selectedTicket.id)}
                    className="text-green-600"
                  >
                    <CheckCircle className="size-4 mr-1" />
                    Resolve
                  </Button>
                )}
                
                <div className="flex items-center gap-2 text-xs text-gray-500 border-l pl-3">
                  <Phone className="size-3" />
                  {selectedTicket.customerPhone}
                </div>
              </div>
            </div>

            {/* Customer Info Banner */}
            <div className="bg-blue-50 border-b p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Mail className="size-3" />
                    {selectedTicket.customerEmail}
                  </span>
                  <span className={`px-2 py-1 rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                    Priority: {selectedTicket.priority}
                  </span>
                </div>
                <span className="text-gray-600">
                  Created {formatTime(selectedTicket.createdAt)}
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {selectedTicket.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'support' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${message.sender === 'support' ? 'order-2' : 'order-1'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-700">{message.senderName}</span>
                      <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === 'support'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex items-end gap-2">
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message... (Press Enter to send)"
                  rows={3}
                  className="flex-1 resize-none"
                  disabled={selectedTicket.status === 'resolved' || selectedTicket.status === 'closed'}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || selectedTicket.status === 'resolved'}
                    className="gap-2"
                  >
                    <Send className="size-4" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="size-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a ticket</h3>
              <p className="text-gray-500">Choose a ticket from the list to start replying</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
