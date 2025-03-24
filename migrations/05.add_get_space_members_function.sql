-- Create a function to get all members of a space
-- This function bypasses RLS policies by using SECURITY DEFINER
CREATE OR REPLACE FUNCTION get_space_members(input_space_id UUID)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  display_name TEXT
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the requesting user has access to this space
  IF EXISTS (
    SELECT 1 FROM spaces s
    WHERE s.id = input_space_id AND s.created_by = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM space_users su
    WHERE su.space_id = input_space_id AND su.user_id = auth.uid()
  ) THEN
    -- Return all users in the space with their information
    RETURN QUERY
    SELECT 
      su.user_id,
      u.email::TEXT,
      (u.raw_user_meta_data->>'name')::TEXT as display_name
    FROM space_users su
    JOIN auth.users u ON su.user_id = u.id
    WHERE su.space_id = input_space_id;
  ELSE
    -- If user doesn't have access, return empty result
    RETURN;
  END IF;
END;
$$;
