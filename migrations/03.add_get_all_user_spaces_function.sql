-- Create a function to get all spaces for a user that bypasses RLS policies
-- This function completely avoids the circular policy reference issue
CREATE OR REPLACE FUNCTION get_all_user_spaces()
RETURNS SETOF spaces AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get the current user's ID
  current_user_id := auth.uid();
  
  -- Return all spaces where:
  -- 1. The user is the creator, OR
  -- 2. The user is a member via space_users
  RETURN QUERY
  SELECT DISTINCT s.*
  FROM spaces s
  WHERE s.created_by = current_user_id
  UNION
  SELECT DISTINCT s.*
  FROM spaces s
  JOIN space_users su ON s.id = su.space_id
  WHERE su.user_id = current_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_all_user_spaces TO authenticated;
