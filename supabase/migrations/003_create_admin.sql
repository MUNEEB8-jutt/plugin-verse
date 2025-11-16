-- This script creates the admin user
-- Note: You need to run this AFTER creating the admin user in Supabase Auth Dashboard
-- or use the Supabase API to create the user programmatically

-- Instructions:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add user" → "Create new user"
-- 3. Email: admin@gmail.com
-- 4. Password: admin@786
-- 5. After creating, get the user ID and run the UPDATE below

-- Alternative: Use this function to create admin user programmatically
-- You'll need to call this from your application or API

-- Update user metadata to set admin role
-- Replace 'USER_ID_HERE' with the actual UUID of the admin user
-- Example: UPDATE auth.users SET raw_user_meta_data = '{"role": "admin"}' WHERE email = 'admin@gmail.com';

-- Function to set user as admin (call this after user is created)
CREATE OR REPLACE FUNCTION public.set_user_as_admin(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"admin"'
  )
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- After creating admin@gmail.com in Auth, run:
-- SELECT public.set_user_as_admin('admin@gmail.com');
