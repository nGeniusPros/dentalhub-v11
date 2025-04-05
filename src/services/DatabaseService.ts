import { supabase } from '../mcp/config/database';
import { Database } from '../types/database.types';

/**
 * DatabaseService provides a clean interface for interacting with the Supabase database
 */
export class DatabaseService {
  /**
   * Get all records from a table
   * @param table The table name
   * @param options Query options
   * @returns The records
   */
  static async getAll<T extends keyof Database['public']['Tables']>(
    table: T,
    options?: {
      limit?: number;
      offset?: number;
      orderBy?: { column: string; ascending?: boolean };
      filters?: Record<string, any>;
    }
  ): Promise<Database['public']['Tables'][T]['Row'][]> {
    let query = supabase.from(table).select('*');

    // Apply filters
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    // Apply ordering
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true,
      });
    }

    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching data from ${table}:`, error);
      throw error;
    }

    return data as Database['public']['Tables'][T]['Row'][];
  }

  /**
   * Get a record by ID
   * @param table The table name
   * @param id The record ID
   * @returns The record
   */
  static async getById<T extends keyof Database['public']['Tables']>(
    table: T,
    id: string
  ): Promise<Database['public']['Tables'][T]['Row'] | null> {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      console.error(`Error fetching record from ${table}:`, error);
      throw error;
    }

    return data as Database['public']['Tables'][T]['Row'];
  }

  /**
   * Create a new record
   * @param table The table name
   * @param record The record to create
   * @returns The created record
   */
  static async create<T extends keyof Database['public']['Tables']>(
    table: T,
    record: Database['public']['Tables'][T]['Insert']
  ): Promise<Database['public']['Tables'][T]['Row']> {
    const { data, error } = await supabase
      .from(table)
      .insert(record)
      .select()
      .single();

    if (error) {
      console.error(`Error creating record in ${table}:`, error);
      throw error;
    }

    return data as Database['public']['Tables'][T]['Row'];
  }

  /**
   * Update a record
   * @param table The table name
   * @param id The record ID
   * @param record The record updates
   * @returns The updated record
   */
  static async update<T extends keyof Database['public']['Tables']>(
    table: T,
    id: string,
    record: Database['public']['Tables'][T]['Update']
  ): Promise<Database['public']['Tables'][T]['Row']> {
    const { data, error } = await supabase
      .from(table)
      .update(record)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating record in ${table}:`, error);
      throw error;
    }

    return data as Database['public']['Tables'][T]['Row'];
  }

  /**
   * Delete a record
   * @param table The table name
   * @param id The record ID
   * @returns Success status
   */
  static async delete<T extends keyof Database['public']['Tables']>(
    table: T,
    id: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting record from ${table}:`, error);
      throw error;
    }

    return true;
  }

  /**
   * Execute a custom query
   * @param query The query function
   * @returns The query result
   */
  static async query<T>(
    queryFn: (supabase: typeof supabase) => Promise<{ data: T | null; error: any }>
  ): Promise<T | null> {
    const { data, error } = await queryFn(supabase);

    if (error) {
      console.error('Error executing custom query:', error);
      throw error;
    }

    return data;
  }
}
