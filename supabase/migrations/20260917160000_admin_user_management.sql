-- Migration: Add is_disabled column and admin RLS policies for user_profiles
-- Allows super-admins to view all users, update roles, and disable accounts

-- 1. Add is_disabled column to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS is_disabled BOOLEAN NOT NULL DEFAULT false;

-- 2. Create index for is_disabled
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_disabled ON public.user_profiles(is_disabled);

-- 3. Helper function: check if current user is Admin (reads from user_profiles, safe for non-user_profiles tables)
-- For user_profiles itself we use auth metadata to avoid recursion
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND (
      au.raw_user_meta_data->>'role' = 'Admin'
      OR au.raw_user_meta_data->>'role' = 'admin'
    )
  )
  OR EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid()
    AND lower(up.role) = 'admin'
  )
$$;

-- 4. Drop and recreate RLS policies on user_profiles

-- Users can read and update their own profile
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Managers and Admins can read all profiles (needed for team metrics)
DROP POLICY IF EXISTS "managers_read_all_profiles" ON public.user_profiles;
CREATE POLICY "managers_read_all_profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND (
      au.raw_user_meta_data->>'role' = 'Manager'
      OR au.raw_user_meta_data->>'role' = 'Admin'
      OR au.raw_user_meta_data->>'role' = 'manager'
      OR au.raw_user_meta_data->>'role' = 'admin'
    )
  )
  OR EXISTS (
    SELECT 1 FROM public.user_profiles up2
    WHERE up2.id = auth.uid()
    AND lower(up2.role) IN ('manager', 'admin')
  )
);

-- Admins can update any user's role and is_disabled status
DROP POLICY IF EXISTS "admins_update_any_profile" ON public.user_profiles;
CREATE POLICY "admins_update_any_profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());
