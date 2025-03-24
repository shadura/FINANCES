-- Create spaces table
CREATE TABLE spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create space_users junction table to manage user-space relationships
CREATE TABLE space_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (space_id, user_id)
);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_spaces_updated_at
BEFORE UPDATE ON spaces
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_space_users_updated_at
BEFORE UPDATE ON space_users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies

-- Enable RLS on tables
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE space_users ENABLE ROW LEVEL SECURITY;

-- Create policies for spaces table
-- 1. Users can view spaces they are members of or created
CREATE POLICY spaces_select_policy ON spaces
  FOR SELECT
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM space_users
      WHERE space_users.space_id = spaces.id
      AND space_users.user_id = auth.uid()
    )
  );

-- 2. Users can create spaces
CREATE POLICY spaces_insert_policy ON spaces
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- 3. Users can update spaces they are members of
CREATE POLICY spaces_update_policy ON spaces
  FOR UPDATE
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM space_users
      WHERE space_users.space_id = spaces.id
      AND space_users.user_id = auth.uid()
    )
  );

-- 4. Only creators can delete spaces
CREATE POLICY spaces_delete_policy ON spaces
  FOR DELETE
  USING (auth.uid() = created_by);

-- Create policies for space_users table
-- 1. Users can view members of spaces they belong to or created
CREATE POLICY space_users_select_policy ON space_users
  FOR SELECT
  USING (
    space_users.user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = space_users.space_id
      AND spaces.created_by = auth.uid()
    )
  );

-- 2. Space creators can add users to their spaces, or users can add themselves to spaces they created
CREATE POLICY space_users_insert_policy ON space_users
  FOR INSERT
  WITH CHECK (
    -- Users can add others to spaces they created
    EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = space_users.space_id
      AND spaces.created_by = auth.uid()
    ) OR 
    -- Users can add themselves to spaces
    (space_users.user_id = auth.uid())
  );

-- 3. Space creators can update memberships
CREATE POLICY space_users_update_policy ON space_users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = space_users.space_id
      AND spaces.created_by = auth.uid()
    )
  );

-- 4. Space creators can remove users or users can remove themselves
CREATE POLICY space_users_delete_policy ON space_users
  FOR DELETE
  USING (
    -- Space creators can remove any user
    EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = space_users.space_id
      AND spaces.created_by = auth.uid()
    ) OR
    -- Users can remove themselves
    space_users.user_id = auth.uid()
  );

-- Trigger to automatically add the creator as a member when a space is created
CREATE OR REPLACE FUNCTION add_space_creator_as_member()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO space_users (space_id, user_id)
  VALUES (NEW.id, NEW.created_by);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_space_creator_trigger
AFTER INSERT ON spaces
FOR EACH ROW
EXECUTE FUNCTION add_space_creator_as_member();

-- Add indexes for better performance
CREATE INDEX idx_space_users_space_id ON space_users(space_id);
CREATE INDEX idx_space_users_user_id ON space_users(user_id);
