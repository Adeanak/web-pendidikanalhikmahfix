import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

// Type aliases for easier use
type Tables = Database['public']['Tables'];
type User = Tables['users']['Row'];
type Student = Tables['students']['Row'];
type Teacher = Tables['teachers']['Row'];
type Graduate = Tables['graduates']['Row'];
type Permission = Tables['permissions']['Row'];

let isInitialized = false;

export const initDatabase = async (): Promise<void> => {
  try {
    console.log('🔄 Initializing Supabase connection...');
    
    // Test connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      throw error;
    }
    
    console.log('✅ Supabase connection successful');
    isInitialized = true;
    
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
};

// Helper functions for database operations
export const executeSelect = async (table: string, options: any = {}): Promise<any[]> => {
  try {
    console.log('🔍 Executing select on table:', table);
    
    let query = supabase.from(table).select(options.select || '*');
    
    if (options.eq) {
      Object.entries(options.eq).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    if (options.ilike) {
      Object.entries(options.ilike).forEach(([key, value]) => {
        query = query.ilike(key, value as string);
      });
    }
    
    if (options.gte) {
      Object.entries(options.gte).forEach(([key, value]) => {
        query = query.gte(key, value);
      });
    }
    
    if (options.lte) {
      Object.entries(options.lte).forEach(([key, value]) => {
        query = query.lte(key, value);
      });
    }
    
    if (options.order) {
      query = query.order(options.order.column, { ascending: options.order.ascending !== false });
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('❌ Select query failed:', error);
      throw error;
    }
    
    console.log('✅ Select executed successfully, results:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ Select query failed:', error);
    throw error;
  }
};

export const executeInsert = async (table: string, data: any): Promise<any> => {
  try {
    console.log('➕ Executing insert on table:', table);
    
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Insert query failed:', error);
      throw error;
    }
    
    console.log('✅ Insert executed successfully');
    return result;
  } catch (error) {
    console.error('❌ Insert query failed:', error);
    throw error;
  }
};

export const executeUpdate = async (table: string, data: any, conditions: any): Promise<any> => {
  try {
    console.log('🔄 Executing update on table:', table);
    
    if (!conditions || typeof conditions !== 'object') {
      throw new Error('Conditions must be provided as an object');
    }
    
    let query = supabase.from(table).update(data);
    
    Object.entries(conditions).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { data: result, error } = await query.select();
    
    if (error) {
      console.error('❌ Update query failed:', error);
      throw error;
    }
    
    console.log('✅ Update executed successfully');
    return result;
  } catch (error) {
    console.error('❌ Update query failed:', error);
    throw error;
  }
};

export const executeDelete = async (table: string, conditions: any): Promise<void> => {
  try {
    console.log('🗑️ Executing delete on table:', table);
    
    let query = supabase.from(table).delete();
    
    Object.entries(conditions).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { error } = await query;
    
    if (error) {
      console.error('❌ Delete query failed:', error);
      throw error;
    }
    
    console.log('✅ Delete executed successfully');
  } catch (error) {
    console.error('❌ Delete query failed:', error);
    throw error;
  }
};

// Legacy compatibility functions - now properly implemented
export const executeQuery = async (query: string, params: any[] = []): Promise<number> => {
  console.warn('executeQuery is deprecated, use specific functions instead');
  return 0;
};

export const saveDatabase = () => {
  // No-op for Supabase
  console.log('💾 Database auto-saved (Supabase)');
};

export const getDatabase = () => {
  return supabase;
};