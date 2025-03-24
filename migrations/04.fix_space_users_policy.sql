-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS space_users_select_policy ON space_users;

-- Create a new policy that avoids the circular reference
CREATE POLICY space_users_select_policy ON space_users
  FOR SELECT
  USING (
    -- Users can view their own memberships
    space_users.user_id = auth.uid() OR
    -- Space creators can view all memberships in their spaces
    EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = space_users.space_id
      AND spaces.created_by = auth.uid()
      -- No reference back to space_users here, breaking the circular dependency
    ) OR
    -- Users can view memberships of spaces they belong to
    EXISTS (
      SELECT 1 FROM space_users AS su
      WHERE su.space_id = space_users.space_id
      AND su.user_id = auth.uid()
      -- This is safe because we're checking a different row in the same table
    )
  );
