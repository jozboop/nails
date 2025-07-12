-- Database schema for NailArt social media app

-- Create artists table
CREATE TABLE artists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    bio TEXT,
    location TEXT,
    average_price DECIMAL(10,2),
    instagram_url TEXT,
    profile_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table
CREATE TABLE posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_artists_user_id ON artists(user_id);
CREATE INDEX idx_posts_artist_id ON posts(artist_id);
CREATE INDEX idx_artists_created_at ON artists(created_at DESC);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for artists table
-- Anyone can read artist profiles
CREATE POLICY "Anyone can view artists" ON artists
    FOR SELECT USING (true);

-- Only authenticated users can create their own artist profile
CREATE POLICY "Users can create their own artist profile" ON artists
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only the artist can update their own profile
CREATE POLICY "Artists can update their own profile" ON artists
    FOR UPDATE USING (auth.uid() = user_id);

-- Only the artist can delete their own profile
CREATE POLICY "Artists can delete their own profile" ON artists
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for posts table
-- Anyone can view posts
CREATE POLICY "Anyone can view posts" ON posts
    FOR SELECT USING (true);

-- Only authenticated users can create posts for their artist profile
CREATE POLICY "Artists can create posts" ON posts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM artists 
            WHERE artists.id = posts.artist_id 
            AND artists.user_id = auth.uid()
        )
    );

-- Only the artist can update their own posts
CREATE POLICY "Artists can update their own posts" ON posts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM artists 
            WHERE artists.id = posts.artist_id 
            AND artists.user_id = auth.uid()
        )
    );

-- Only the artist can delete their own posts
CREATE POLICY "Artists can delete their own posts" ON posts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM artists 
            WHERE artists.id = posts.artist_id 
            AND artists.user_id = auth.uid()
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 