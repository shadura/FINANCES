-- Create a helper function to get spaces where a user is a member
-- This function avoids the circular policy reference by directly querying the space_users table
CREATE OR REPLACE FUNCTION get_user_member_spaces(user_id_param UUID)
RETURNS SETOF spaces AS $$
BEGIN
  RETURN QUERY
  SELECT s.*
  FROM spaces s
  JOIN space_users su ON s.id = su.space_id
  WHERE su.user_id = user_id_param
  AND s.created_by != user_id_param; -- Exclude spaces created by the user to avoid duplicates
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_member_spaces TO authenticated;
