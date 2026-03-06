import { useState, useEffect } from 'react';
import { MessageCircle, X, Mail, Facebook, Linkedin, Instagram, Send, User as UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { supportTicketsAPI } from '../utils/api';

type SupportOption = 'menu' | 'chat' | 'messenger' | 'email' | 'linkedin' | 'instagram';

interface ChatMessage {
  sender: 'customer' | 'support';
  senderName: string;
  message: string;
  timestamp: string;
}

export function LiveSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<SupportOption>('menu');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [currentTicketId, setCurrentTicketId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [chatStarted, setChatStarted] = useState(false);

  // Contact information
  const contactInfo = {
    messenger: 'https://m.me/houserentbd',
    email: 'support@houserentbd.com',
    linkedin: 'https://www.linkedin.com/company/houserentbd',
    instagram: 'https://ig.me/m/houserentbd',
  };

  // Check if user is logged in and get their info
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setCustomerName(userData.fullName || userData.name || 'Guest');
        setCustomerEmail(userData.email || '');
        setCustomerPhone(userData.phone || '');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Poll for new messages when chat is active
  useEffect(() => {
    if (!currentTicketId || !chatStarted) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await supportTicketsAPI.getById(currentTicketId);
        if (response.ticket && response.ticket.messages) {
          setChatMessages(response.ticket.messages);
        }
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [currentTicketId, chatStarted]);

  const startChat = async () => {
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      toast.error('Please fill in all contact information');
      return;
    }

    try {
      // Create a new support ticket
      const response = await supportTicketsAPI.create({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        subject: 'Live Chat Support',
        category: 'General',
        priority: 'medium',
        message: 'User has started a live chat session'
      });

      if (response.ticket) {
        setCurrentTicketId(response.ticket._id);
        setChatMessages(response.ticket.messages || []);
        setChatStarted(true);
        toast.success('Connected to support! Send your message.');
      }
    } catch (error: any) {
      console.error('Error starting chat:', error);
      toast.error(error.message || 'Failed to start chat. Please try again.');
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    if (!chatStarted || !currentTicketId) {
      // If chat not started, start it first
      await startChat();
      return;
    }

    try {
      const response = await supportTicketsAPI.addMessage(currentTicketId, {
        message: messageInput.trim(),
        sender: 'customer',
        senderName: customerName
      });

      if (response.ticket) {
        setChatMessages(response.ticket.messages || []);
        setMessageInput('');
        toast.success('Message sent!');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.message || 'Failed to send message');
    }
  };

  const openExternalSupport = (platform: 'messenger' | 'email' | 'linkedin' | 'instagram') => {
    const links = {
      messenger: contactInfo.messenger,
      email: `mailto:${contactInfo.email}`,
      linkedin: contactInfo.linkedin,
      instagram: contactInfo.instagram,
    };

    window.open(links[platform], '_blank');
    setIsOpen(false);
  };

  const renderMenu = () => (
    <div className="space-y-2">
      <Button
        onClick={() => setCurrentView('chat')}
        className="w-full justify-start gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
      >
        <MessageCircle className="size-5" />
        <div className="text-left">
          <div className="font-semibold">Live Chat</div>
          <div className="text-xs opacity-90">Chat with our support team</div>
        </div>
      </Button>

      <Button
        onClick={() => openExternalSupport('messenger')}
        className="w-full justify-start gap-3 bg-gradient-to-r from-[#0084FF] to-[#0066CC] hover:from-[#0066CC] hover:to-[#0052A3]"
      >
        <Facebook className="size-5" />
        <div className="text-left">
          <div className="font-semibold">Facebook Messenger</div>
          <div className="text-xs opacity-90">Chat via Facebook</div>
        </div>
      </Button>

      <Button
        onClick={() => openExternalSupport('instagram')}
        className="w-full justify-start gap-3 bg-gradient-to-r from-[#E4405F] to-[#C13584] hover:from-[#C13584] hover:to-[#833AB4]"
      >
        <Instagram className="size-5" />
        <div className="text-left">
          <div className="font-semibold">Instagram Chat</div>
          <div className="text-xs opacity-90">Message us on Instagram</div>
        </div>
      </Button>

      <Button
        onClick={() => openExternalSupport('linkedin')}
        className="w-full justify-start gap-3 bg-gradient-to-r from-[#0077B5] to-[#005885] hover:from-[#005885] hover:to-[#004269]"
      >
        <Linkedin className="size-5" />
        <div className="text-left">
          <div className="font-semibold">LinkedIn</div>
          <div className="text-xs opacity-90">Connect on LinkedIn</div>
        </div>
      </Button>

      <Button
        onClick={() => openExternalSupport('email')}
        className="w-full justify-start gap-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
      >
        <Mail className="size-5" />
        <div className="text-left">
          <div className="font-semibold">Email Support</div>
          <div className="text-xs opacity-90">{contactInfo.email}</div>
        </div>
      </Button>
    </div>
  );

  const renderChat = () => {
    if (!chatStarted) {
      // Show contact form before starting chat
      return (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView('menu')}
              className="h-8 w-8 p-0"
            >
              ←
            </Button>
            <div className="flex-1">
              <div className="font-semibold">Start Live Chat</div>
              <div className="text-xs text-gray-500">Please provide your contact info</div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Your Name</label>
              <Input
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <Input
                placeholder="01XXXXXXXXX"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button 
              onClick={startChat} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <MessageCircle className="size-4 mr-2" />
              Start Chat
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-[400px]">
        {/* Chat Header */}
        <div className="flex items-center gap-2 pb-3 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentView('menu');
              setChatStarted(false);
              setCurrentTicketId(null);
              setChatMessages([]);
            }}
            className="h-8 w-8 p-0"
          >
            ←
          </Button>
          <div className="flex-1">
            <div className="font-semibold">Live Support</div>
            <div className="text-xs text-gray-500">We typically reply instantly</div>
          </div>
          <div className="size-2 bg-green-500 rounded-full" title="Online" />
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {chatMessages.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8">
              <MessageCircle className="size-12 mx-auto mb-2 opacity-20" />
              <p>Connected! Send your first message.</p>
            </div>
          ) : (
            chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${msg.sender === 'customer' ? 'text-right' : 'text-left'}`}>
                  <div className="text-xs text-gray-500 mb-1 px-1">
                    {msg.senderName}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      msg.sender === 'customer'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Chat Input */}
        <div className="pt-3 border-t flex gap-2">
          <Input
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon" className="bg-blue-600 hover:bg-blue-700">
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen ? (
          <Card className="w-[380px] shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">How can we help?</CardTitle>
                  <p className="text-sm opacity-90 mt-1">Choose your preferred contact method</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsOpen(false);
                    setCurrentView('menu');
                  }}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <X className="size-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {currentView === 'menu' && renderMenu()}
              {currentView === 'chat' && renderChat()}
            </CardContent>
          </Card>
        ) : (
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="size-16 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 animate-bounce hover:animate-none transition-all"
          >
            <MessageCircle className="size-7" />
          </Button>
        )}
      </div>
    </>
  );
}
