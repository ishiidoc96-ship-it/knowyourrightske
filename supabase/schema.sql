-- Create content table
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'youtube', 'podcast')),
  embed_url TEXT NOT NULL,
  topic_tag TEXT NOT NULL,
  description TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  topic_tag TEXT NOT NULL,
  summary TEXT NOT NULL,
  body JSONB NOT NULL,
  related_content_id UUID REFERENCES content(id),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  topic_tag TEXT,
  email TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'answered')) DEFAULT 'pending',
  answer_link TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID -- References auth.users(id) if using Supabase Auth
);

-- Create gallery table
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_type TEXT NOT NULL CHECK (media_type IN ('video', 'photo')),
  platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'youtube', 'facebook')),
  title TEXT NOT NULL,
  embed_or_image_url TEXT NOT NULL,
  topic_tag TEXT NOT NULL,
  thumbnail_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscribers table
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
