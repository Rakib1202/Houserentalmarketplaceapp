-- ==============================================
-- CUSTOMER SUPPORT SYSTEM - DATABASE SCHEMA
-- Add to existing schema.sql or run separately
-- ==============================================

-- ==============================================
-- SUPPORT AGENTS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS support_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agent_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'busy', 'away')),
  account_status VARCHAR(20) DEFAULT 'active' CHECK (account_status IN ('active', 'inactive', 'suspended')),
  department VARCHAR(100),
  role VARCHAR(50) DEFAULT 'agent' CHECK (role IN ('agent', 'supervisor', 'manager')),
  max_concurrent_chats INTEGER DEFAULT 5,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_support_agents_email ON support_agents(email);
CREATE INDEX idx_support_agents_status ON support_agents(status);
CREATE INDEX idx_support_agents_account_status ON support_agents(account_status);
CREATE INDEX idx_support_agents_department ON support_agents(department);

-- ==============================================
-- CHAT CONVERSATIONS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id VARCHAR(255), -- Anonymous or user ID
  visitor_name VARCHAR(255),
  visitor_email VARCHAR(255),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_agent_id UUID REFERENCES support_agents(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'resolved', 'closed', 'transferred')),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  category VARCHAR(100),
  subject VARCHAR(500),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_at TIMESTAMP WITH TIME ZONE,
  first_response_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_conversations_visitor ON chat_conversations(visitor_id);
CREATE INDEX idx_chat_conversations_user ON chat_conversations(user_id);
CREATE INDEX idx_chat_conversations_agent ON chat_conversations(assigned_agent_id);
CREATE INDEX idx_chat_conversations_status ON chat_conversations(status);
CREATE INDEX idx_chat_conversations_priority ON chat_conversations(priority);
CREATE INDEX idx_chat_conversations_started ON chat_conversations(started_at DESC);

-- ==============================================
-- CHAT MESSAGES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('visitor', 'agent', 'system')),
  sender_id UUID, -- agent_id or user_id
  sender_name VARCHAR(255),
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  message_content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at DESC);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);

-- ==============================================
-- AGENT ANALYTICS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS agent_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES support_agents(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_chats INTEGER DEFAULT 0,
  active_chats INTEGER DEFAULT 0,
  resolved_chats INTEGER DEFAULT 0,
  transferred_chats INTEGER DEFAULT 0,
  avg_response_time_seconds INTEGER DEFAULT 0,
  avg_resolution_time_seconds INTEGER DEFAULT 0,
  total_messages_sent INTEGER DEFAULT 0,
  avg_rating DECIMAL(3, 2) DEFAULT 0.00,
  total_ratings INTEGER DEFAULT 0,
  online_time_minutes INTEGER DEFAULT 0,
  first_login_at TIMESTAMP WITH TIME ZONE,
  last_logout_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_agent_analytics_agent ON agent_analytics(agent_id);
CREATE INDEX idx_agent_analytics_date ON agent_analytics(date DESC);
CREATE UNIQUE INDEX idx_agent_analytics_unique ON agent_analytics(agent_id, date);

-- ==============================================
-- AGENT ACTIVITY LOGS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS agent_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES support_agents(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- login, logout, status_change, chat_assign, chat_resolve, etc.
  details JSONB DEFAULT '{}'::jsonb,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_agent_activity_agent ON agent_activity_logs(agent_id);
CREATE INDEX idx_agent_activity_type ON agent_activity_logs(activity_type);
CREATE INDEX idx_agent_activity_created ON agent_activity_logs(created_at DESC);

-- ==============================================
-- CANNED RESPONSES TABLE (Quick Replies)
-- ==============================================
CREATE TABLE IF NOT EXISTS canned_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  shortcut VARCHAR(50) UNIQUE NOT NULL,
  message TEXT NOT NULL,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES support_agents(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_canned_responses_shortcut ON canned_responses(shortcut);
CREATE INDEX idx_canned_responses_category ON canned_responses(category);

-- ==============================================
-- SUPPORT DEPARTMENTS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS support_departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- TRIGGERS FOR UPDATED_AT
-- ==============================================
CREATE TRIGGER update_support_agents_updated_at BEFORE UPDATE ON support_agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at BEFORE UPDATE ON chat_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_analytics_updated_at BEFORE UPDATE ON agent_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_canned_responses_updated_at BEFORE UPDATE ON canned_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_departments_updated_at BEFORE UPDATE ON support_departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================
ALTER TABLE support_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE canned_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_departments ENABLE ROW LEVEL SECURITY;

-- Agents can view their own data
CREATE POLICY "Agents can view own data" ON support_agents
  FOR SELECT USING (id = auth.uid()::uuid);

CREATE POLICY "Agents can update own status" ON support_agents
  FOR UPDATE USING (id = auth.uid()::uuid);

-- Agents can view assigned conversations
CREATE POLICY "Agents can view assigned chats" ON chat_conversations
  FOR SELECT USING (assigned_agent_id = auth.uid()::uuid);

-- Agents can view messages in their conversations
CREATE POLICY "Agents can view chat messages" ON chat_messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM chat_conversations WHERE assigned_agent_id = auth.uid()::uuid
    )
  );

-- Public can insert chat messages (for visitors)
CREATE POLICY "Visitors can send messages" ON chat_messages
  FOR INSERT WITH CHECK (sender_type = 'visitor');

-- ==============================================
-- SAMPLE DATA
-- ==============================================

-- Insert sample departments
INSERT INTO support_departments (name, description, email, is_active) VALUES
('General Support', 'General customer inquiries', 'support@houserentbd.com', TRUE),
('Property Queries', 'Property-related questions', 'properties@houserentbd.com', TRUE),
('Technical Support', 'Technical issues and bugs', 'tech@houserentbd.com', TRUE),
('Billing & Payments', 'Payment and subscription support', 'billing@houserentbd.com', TRUE)
ON CONFLICT DO NOTHING;

-- Insert sample canned responses
INSERT INTO canned_responses (title, shortcut, message, category, is_active) VALUES
('Welcome Message', '/welcome', 'Hello! Welcome to HouseRentBD. How can I assist you today?', 'Greeting', TRUE),
('Thank You', '/thanks', 'Thank you for contacting us! Is there anything else I can help you with?', 'Closing', TRUE),
('Wait Message', '/wait', 'Please hold on for a moment while I check that information for you.', 'General', TRUE),
('Property Info', '/property', 'I can help you with property information. Could you please provide the property ID or location?', 'Property', TRUE),
('Account Help', '/account', 'I''ll be happy to help with your account. What specific issue are you experiencing?', 'Account', TRUE)
ON CONFLICT (shortcut) DO NOTHING;

-- ==============================================
-- FUNCTIONS FOR ANALYTICS
-- ==============================================

-- Function to update agent analytics
CREATE OR REPLACE FUNCTION update_agent_daily_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert daily analytics
  INSERT INTO agent_analytics (
    agent_id,
    date,
    total_chats,
    resolved_chats
  )
  VALUES (
    NEW.assigned_agent_id,
    CURRENT_DATE,
    1,
    CASE WHEN NEW.status = 'resolved' THEN 1 ELSE 0 END
  )
  ON CONFLICT (agent_id, date)
  DO UPDATE SET
    total_chats = agent_analytics.total_chats + 1,
    resolved_chats = agent_analytics.resolved_chats + CASE WHEN NEW.status = 'resolved' THEN 1 ELSE 0 END,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for analytics update
CREATE TRIGGER trigger_update_agent_analytics
AFTER INSERT OR UPDATE ON chat_conversations
FOR EACH ROW
WHEN (NEW.assigned_agent_id IS NOT NULL)
EXECUTE FUNCTION update_agent_daily_analytics();

-- Function to calculate average response time
CREATE OR REPLACE FUNCTION calculate_avg_response_time(agent_uuid UUID, target_date DATE)
RETURNS INTEGER AS $$
DECLARE
  avg_time INTEGER;
BEGIN
  SELECT AVG(
    EXTRACT(EPOCH FROM (first_response_at - started_at))
  )::INTEGER
  INTO avg_time
  FROM chat_conversations
  WHERE assigned_agent_id = agent_uuid
    AND DATE(started_at) = target_date
    AND first_response_at IS NOT NULL;
  
  RETURN COALESCE(avg_time, 0);
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- VIEWS FOR REPORTING
-- ==============================================

-- Active conversations view
CREATE OR REPLACE VIEW active_conversations_view AS
SELECT 
  c.*,
  a.agent_name,
  a.status as agent_status,
  COUNT(m.id) as message_count,
  MAX(m.created_at) as last_message_at
FROM chat_conversations c
LEFT JOIN support_agents a ON c.assigned_agent_id = a.id
LEFT JOIN chat_messages m ON c.id = m.conversation_id
WHERE c.status IN ('waiting', 'active')
GROUP BY c.id, a.agent_name, a.status;

-- Agent performance view
CREATE OR REPLACE VIEW agent_performance_view AS
SELECT 
  a.id,
  a.agent_name,
  a.department,
  a.status,
  aa.date,
  aa.total_chats,
  aa.resolved_chats,
  aa.avg_response_time_seconds,
  aa.avg_rating,
  aa.online_time_minutes
FROM support_agents a
LEFT JOIN agent_analytics aa ON a.id = aa.agent_id
WHERE aa.date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY aa.date DESC, a.agent_name;
