import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';

interface RoleBasedAccessProps {
  children: React.ReactNode;
  allowedRoles: User['role'][];
  fallback?: React.ReactNode;
}

const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({ 
  children, 
  allowedRoles, 
  fallback = null 
}) => {
  const { user } = useAuth();

  // If no user is logged in, don't show anything
  if (!user) {
    return <>{fallback}</>;
  }

  // Check if user's role is in the allowed roles
  if (allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // Return fallback if user doesn't have permission
  return <>{fallback}</>;
};

// Helper function to check permissions
export const hasPermission = (userRole: User['role'], requiredRoles: User['role'][]): boolean => {
  return requiredRoles.includes(userRole);
};

// Role hierarchy for permission checking
export const ROLE_HIERARCHY: Record<User['role'], number> = {
  'super_admin': 5,
  'ketua_yayasan': 4,
  'kepala_sekolah': 3,
  'teacher': 2,
  'parent': 1
};

// Check if user has higher or equal role level
export const hasRoleLevel = (userRole: User['role'], requiredLevel: User['role']): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredLevel];
};

// Permission sets for different roles
export const PERMISSIONS = {
  SUPER_ADMIN: ['super_admin'] as User['role'][],
  MANAGEMENT: ['super_admin', 'ketua_yayasan', 'kepala_sekolah'] as User['role'][],
  STAFF: ['super_admin', 'ketua_yayasan', 'kepala_sekolah', 'teacher'] as User['role'][],
  ALL_USERS: ['super_admin', 'ketua_yayasan', 'kepala_sekolah', 'teacher', 'parent'] as User['role'][]
};

export default RoleBasedAccess;