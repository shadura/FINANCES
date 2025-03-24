import { useSupabaseClient } from '#imports'
import type { Database } from '~/types/supabase'

export interface Space {
  id: string
  name: string
  created_at: string
  updated_at: string
  created_by: string
}

/**
 * Fetches all spaces available to the current user
 * @returns A list of spaces the user is a member of
 */
export const getUserSpaces = async (): Promise<Space[]> => {
  const supabase = useSupabaseClient<Database>()
  
  try {
    // Use a direct SQL query to bypass RLS policies completely
    // This avoids the circular reference issue
    const { data, error } = await supabase.rpc('get_all_user_spaces')
    
    if (error) {
      console.error('Error fetching spaces:', error)
      throw error
    }
    
    return data || []
  } catch (error) {
    console.error('Error in getUserSpaces:', error)
    
    // Fallback approach if the RPC function isn't available yet
    // Just return an empty array for now to prevent breaking the UI
    console.log('Using fallback approach for spaces')
    return []
  }
}

/**
 * Creates a new space
 * @param name The name of the space
 * @returns The newly created space
 */
export const createSpace = async (name: string): Promise<Space> => {
  const supabase = useSupabaseClient<Database>()
  
  const { data, error } = await supabase
    .from('spaces')
    .insert({ name })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating space:', error)
    throw error
  }
  
  return data
}

/**
 * Adds a user to a space
 * @param spaceId The ID of the space
 * @param userId The ID of the user to add
 * @returns The created space_user record
 */
export const addUserToSpace = async (spaceId: string, userId: string) => {
  const supabase = useSupabaseClient<Database>()
  
  const { data, error } = await supabase
    .from('space_users')
    .insert({
      space_id: spaceId,
      user_id: userId
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error adding user to space:', error)
    throw error
  }
  
  return data
}

/**
 * Removes a user from a space
 * @param spaceId The ID of the space
 * @param userId The ID of the user to remove
 */
export const removeUserFromSpace = async (spaceId: string, userId: string) => {
  const supabase = useSupabaseClient<Database>()
  
  const { error } = await supabase
    .from('space_users')
    .delete()
    .match({
      space_id: spaceId,
      user_id: userId
    })
  
  if (error) {
    console.error('Error removing user from space:', error)
    throw error
  }
  
  return true
}

export interface SpaceMember {
  user_id: string
  email: string
  display_name: string | null
}

/**
 * Gets all members of a space
 * @param spaceId The ID of the space
 * @returns A list of space members with their details
 */
export const getSpaceMembers = async (spaceId: string): Promise<SpaceMember[]> => {
  const supabase = useSupabaseClient<Database>()
  
  try {
    // Use a direct SQL query via RPC to bypass RLS policies completely
    // This avoids the circular reference issue
    const { data, error } = await supabase.rpc('get_space_members', { input_space_id: spaceId })
    
    if (error) {
      console.error('Error fetching space members:', error)
      throw error
    }
    
    return data || []
  } catch (error) {
    console.error('Error in getSpaceMembers:', error)
    
    // Fallback approach if the RPC function isn't available yet
    console.log('Using fallback approach for space members')
    
    // Direct query with a timeout to prevent infinite recursion
    try {
      const { data: spaceUsers, error: spaceUsersError } = await supabase
        .from('space_users')
        .select('user_id')
        .eq('space_id', spaceId)
        .timeout(2000) // Add a timeout to prevent hanging
      
      if (spaceUsersError) {
        console.error('Error in fallback query:', spaceUsersError)
        return []
      }
      
      // If we have user IDs, try to get their details
      if (spaceUsers && spaceUsers.length > 0) {
        const userIds = spaceUsers.map(item => item.user_id)
        
        // Get user profiles from auth.users
        // Note: This might not work depending on your RLS policies for auth.users
        // This is just a fallback attempt
        const { data: users, error: usersError } = await supabase
          .from('profiles') // Assuming you have a profiles table
          .select('id, email, display_name')
          .in('id', userIds)
          .timeout(2000)
        
        if (usersError || !users) {
          console.error('Error fetching user details:', usersError)
          // Return just the IDs as partial data
          return spaceUsers.map(item => ({
            user_id: item.user_id,
            email: '',
            display_name: null
          }))
        }
        
        // Map user details to space members
        return spaceUsers.map(spaceUser => {
          const user = users.find(u => u.id === spaceUser.user_id)
          return {
            user_id: spaceUser.user_id,
            email: user?.email || '',
            display_name: user?.display_name || null
          }
        })
      }
      
      return []
    } catch (timeoutError) {
      console.error('Timeout in fallback query:', timeoutError)
      return []
    }
  }
}
