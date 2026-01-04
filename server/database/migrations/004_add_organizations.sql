-- Migration: Add organizations table
-- Date: 2024-12-23

CREATE TABLE IF NOT EXISTS organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  acronym VARCHAR(50),
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',
  established_date DATE,
  contact_email VARCHAR(255),
  president VARCHAR(255),
  adviser VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data
INSERT INTO organizations (name, acronym, description, status, established_date, contact_email, president, adviser) VALUES
('Alliance of Computer Engineering Students', 'ACES', 'Student organization for Computer Engineering students promoting technical excellence and innovation.', 'active', '2018-08-15', 'aces@pupsmb.edu.ph', 'Maria Santos', 'Prof. John Dela Cruz'),
('Integrated Students in Information Technology Education', 'iSITE', 'Organization dedicated to advancing IT education and fostering technological innovation among students.', 'active', '2017-09-20', 'isite@pupsmb.edu.ph', 'Carlos Rodriguez', 'Prof. Anna Reyes'),
('Junior Philippine Institute of Accountancy - Sta Maria', 'JPIA', 'Academic organization for Accountancy students.', 'active', '2015-06-01', 'jpia@pupsmb.edu.ph', 'Jane Doe', 'Prof. Smith'),
('Association of Future Teachers', 'AFT', 'Professional development organization for education students.', 'active', '2016-06-10', 'aft@pupsmb.edu.ph', 'Jennifer Garcia', 'Prof. Michael Torres'),
('Hospitality Management Society', 'HMSOC', 'Organization promoting excellence in hospitality and tourism management.', 'active', '2019-03-12', 'hmsoc@pupsmb.edu.ph', 'Mark Wilson', 'Prof. Sarah Johnson'),
('Chamber of Entrepreneurs and Managers', 'CEM', 'Organization for business and management students.', 'active', '2018-11-05', 'cem@pupsmb.edu.ph', 'David Brown', 'Prof. Robert Lee'),
('Diploma in Office Management SY-Quest', 'DOMT', 'Organization for office management students.', 'active', '2020-01-15', 'domt@pupsmb.edu.ph', 'Lisa Taylor', 'Prof. Emily Davis');
