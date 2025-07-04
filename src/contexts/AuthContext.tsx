import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { initDatabase } from '@/utils/database';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('Initializing auth system...');
        await initDatabase();
        console.log('Database initialized for auth');
        
        // Check for saved user session
        const savedUser = localStorage.getItem('al-hikmah-user');
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            console.log('Restoring user session:', userData);
            setUser(userData);
          } catch (error) {
            console.error('Error parsing saved user:', error);
            localStorage.removeItem('al-hikmah-user');
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth system:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Login attempt:', { username, password });
      
      // Ensure database is ready
      await initDatabase();
      
      // Query for user with exact credentials using Supabase
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .eq('status', 'active');
      
      console.log('🔍 Database query result:', users);
      
      if (error) {
        console.error('❌ Database error:', error);
        return false;
      }
      
      if (users && users.length > 0) {
        const userData = users[0] as User;
        console.log('✅ Login successful for user:', userData);
        
        setUser(userData);
        localStorage.setItem('al-hikmah-user', JSON.stringify(userData));
        
        return true;
      } else {
        console.log('❌ No matching user found');
        return false;
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user...');
    setUser(null);
    localStorage.removeItem('al-hikmah-user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};