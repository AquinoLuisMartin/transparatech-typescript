-- Migration: Add announcements, feedback tables
-- Date: 2024-12-23

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  content TEXT NOT NULL,
  author VARCHAR(255),
  is_sticky BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  subject VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  anonymous BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'pending',
  response TEXT,
  responded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  responded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_announcements_category ON announcements(category);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_is_sticky ON announcements(is_sticky);

CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON feedback(category);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);

-- Add seed data for announcements
INSERT INTO announcements (title, category, priority, content, author, is_sticky, views, tags) VALUES
('New Transparency Portal Launch', 'System Update', 'high', 'We are excited to announce the launch of our new transparency portal. This enhanced platform provides better access to public information, improved search functionality, and a more user-friendly interface for all stakeholders.', 'System Administrator', true, 2341, '["Portal", "Enhancement", "Public Access"]'),
('Q1 2024 Budget Review Session', 'Meeting', 'medium', 'Join us for the quarterly budget review session scheduled for February 15, 2024. We will discuss budget allocations, performance metrics, and upcoming financial initiatives. Public participation is encouraged.', 'Finance Department', false, 1876, '["Budget", "Review", "Public Meeting"]'),
('Updated Data Access Procedures', 'Policy', 'medium', 'New procedures for accessing public data have been implemented to ensure faster response times and improved service quality. Please review the updated guidelines in the documents section.', 'Policy Team', false, 1432, '["Policy", "Data Access", "Procedures"]'),
('Holiday Schedule - February 2024', 'Schedule', 'low', 'Please note the upcoming holiday schedule for February 2024. Offices will be closed on February 14 (Valentine''s Day observed) and February 26 (National Holiday). Emergency services remain available.', 'Administration', false, 987, '["Holiday", "Schedule", "Office Hours"]'),
('Community Feedback Session Results', 'Community', 'medium', 'Thank you to all participants in our recent community feedback session. We received valuable insights that will help shape our future transparency initiatives. A detailed report is now available in the documents section.', 'Community Engagement', false, 1654, '["Community", "Feedback", "Engagement"]'),
('System Maintenance Notice', 'Technical', 'high', 'Scheduled maintenance will be performed on January 22, 2024, from 2:00 AM to 6:00 AM. During this time, the transparency portal may be temporarily unavailable. We apologize for any inconvenience.', 'IT Department', false, 2103, '["Maintenance", "System", "Downtime"]');
