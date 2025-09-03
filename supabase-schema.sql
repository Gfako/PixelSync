-- PixelSync Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create meetings table
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    date VARCHAR(50) NOT NULL,
    time VARCHAR(50) NOT NULL,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('past', 'upcoming')),
    notes TEXT,
    transcript TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create participants table
CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    company VARCHAR(255),
    website VARCHAR(500),
    title VARCHAR(255),
    avatar VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meeting_participants junction table
CREATE TABLE meeting_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(meeting_id, participant_id)
);

-- Create meeting_tags table
CREATE TABLE meeting_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_meetings_date ON meetings(date);
CREATE INDEX idx_participants_email ON participants(email);
CREATE INDEX idx_meeting_participants_meeting_id ON meeting_participants(meeting_id);
CREATE INDEX idx_meeting_participants_participant_id ON meeting_participants(participant_id);
CREATE INDEX idx_meeting_tags_meeting_id ON meeting_tags(meeting_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for meetings table
CREATE TRIGGER update_meetings_updated_at 
    BEFORE UPDATE ON meetings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO participants (name, email, company, title) VALUES 
('George', 'george@pixelsync.io', 'PixelSync', 'Product Manager'),
('Maria', 'maria@company.com', 'TechCorp', 'Designer'),
('Jay', 'jay@startup.com', 'StartupCo', 'CEO'),
('John', 'john@enterprise.com', 'Enterprise Inc', 'CTO'),
('Sarah', 'sarah@copywriter.com', 'WordCraft', 'Copywriter'),
('Alex', 'alex@devstudio.com', 'DevStudio', 'Developer'),
('Sam', 'sam@devstudio.com', 'DevStudio', 'Developer');

-- Insert sample meetings
WITH meeting_data AS (
    INSERT INTO meetings (title, date, time, type, status, notes, transcript) VALUES 
    ('George <> maria', '08/30/2025', 'Yesterday', 'Partnership', 'past', 'Great discussion about potential partnership opportunities.', 'This is a sample transcript of the meeting between George and Maria. They discussed various aspects of a potential partnership including timeline, deliverables, and mutual benefits.'),
    ('George <> Jay', '08/22/2025', '2:00 PM', 'UI Design', 'past', NULL, 'Meeting transcript with Jay discussing UI improvements and user experience enhancements.'),
    ('George <> John', '09/01/2025', 'Tomorrow', 'Development', 'upcoming', 'Meeting recording and summary available.', NULL),
    ('Copywriting of the app', '11/10/2025', 'Nov 10', 'Marketing', 'upcoming', 'Reviewing app copy and messaging strategy.', NULL),
    ('Implement Apps', '12/15/2025', 'Dec 15', 'Development', 'upcoming', 'Technical implementation discussion for new app features.', NULL)
    RETURNING id, title
),
participant_mapping AS (
    SELECT 
        md.id as meeting_id,
        md.title,
        p.id as participant_id
    FROM meeting_data md
    CROSS JOIN participants p
    WHERE 
        (md.title = 'George <> maria' AND p.email IN ('george@pixelsync.io', 'maria@company.com')) OR
        (md.title = 'George <> Jay' AND p.email IN ('george@pixelsync.io', 'jay@startup.com')) OR
        (md.title = 'George <> John' AND p.email IN ('george@pixelsync.io', 'john@enterprise.com')) OR
        (md.title = 'Copywriting of the app' AND p.email IN ('george@pixelsync.io', 'sarah@copywriter.com')) OR
        (md.title = 'Implement Apps' AND p.email IN ('george@pixelsync.io', 'alex@devstudio.com', 'sam@devstudio.com'))
)
INSERT INTO meeting_participants (meeting_id, participant_id)
SELECT meeting_id, participant_id FROM participant_mapping;

-- Insert sample tags
WITH meeting_tags_data AS (
    SELECT m.id as meeting_id, unnest(
        CASE 
            WHEN m.title = 'George <> maria' THEN ARRAY['Partnerships']
            WHEN m.title = 'George <> Jay' THEN ARRAY['UI Design']
            WHEN m.title = 'George <> John' THEN ARRAY['Development']
            WHEN m.title = 'Copywriting of the app' THEN ARRAY['Marketing']
            WHEN m.title = 'Implement Apps' THEN ARRAY['Development']
        END
    ) as tag
    FROM meetings m
)
INSERT INTO meeting_tags (meeting_id, tag)
SELECT meeting_id, tag FROM meeting_tags_data;