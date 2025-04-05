import { Adapter } from '../types';
import { MCPRequest, MCPResponse } from '../protocol/types';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Adapter for database operations
 * Provides a unified interface for interacting with the Supabase database
 */
export class DatabaseAdapter implements Adapter {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    if (!supabase) {
      throw new Error("DatabaseAdapter: Supabase client is required.");
    }
    this.supabase = supabase;
  }

  /**
   * Process MCP requests for database operations
   * @param request The MCP request
   * @returns Response with database operation results
   */
  async processRequest(request: MCPRequest): Promise<unknown> {
    const client = this.supabase;
    console.log(`DatabaseAdapter processing request for path: ${request.path} with method: ${request.method}`);

    try {
      // Extract table name from path
      // Format: /api/database/{tableName} or /api/database/{tableName}/{id}
      const pathParts = request.path.split('/');
      if (pathParts.length < 3) {
        throw new Error(`DatabaseAdapter: Invalid path format: ${request.path}`);
      }

      const tableName = pathParts[3]; // /api/database/{tableName}
      const recordId = pathParts.length > 4 ? pathParts[4] : undefined;

      if (!tableName) {
        throw new Error(`DatabaseAdapter: Table name is required`);
      }

      // Process request based on HTTP method
      switch (request.method.toUpperCase()) {
        case 'GET':
          return await this.handleGet(tableName, recordId, request);

        case 'POST':
          return await this.handlePost(tableName, request);

        case 'PUT':
          if (!recordId) {
            throw new Error('PUT requests require a record ID');
          }
          return await this.handlePut(tableName, recordId, request);

        case 'DELETE':
          if (!recordId) {
            throw new Error('DELETE requests require a record ID');
          }
          return await this.handleDelete(tableName, recordId);

        default:
          throw new Error(`Unsupported method: ${request.method}`);
      }
    } catch (error) {
      console.error('DatabaseAdapter error:', error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: null,
        error: {
          code: 'DATABASE_ERROR',
          message: error instanceof Error ? error.message : String(error),
          details: error instanceof Error ? error.stack : undefined
        }
      };
    }
  }

  /**
   * Handle GET requests to fetch records
   * @param tableName The table to query
   * @param recordId Optional ID for single record retrieval
   * @param request The original MCP request
   * @returns Response with fetched data
   */
  private async handleGet(tableName: string, recordId?: string, request?: MCPRequest): Promise<MCPResponse> {
    const query = request?.query || {};

    try {
      // If ID is provided, get a single record
      if (recordId) {
        const { data, error } = await this.supabase
          .from(tableName)
          .select('*')
          .eq('id', recordId)
          .single();

        if (error) {
          console.error(`Supabase error fetching from ${tableName}:`, error);
          return {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
            body: null,
            error: {
              code: 'DATABASE_QUERY_ERROR',
              message: `Error querying ${tableName}: ${error.message}`,
              details: error
            }
          };
        }

        return {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: { data },
          error: null
        };
      } else {
        // Handle collection query with pagination, sorting, and filtering
        let queryBuilder = this.supabase.from(tableName).select('*', { count: 'exact' });

        // Apply filters from query parameters
        if (query) {
          // Handle pagination
          if (query.page && query.pageSize) {
            const page = parseInt(query.page);
            const pageSize = parseInt(query.pageSize);
            const start = (page - 1) * pageSize;
            const end = start + pageSize - 1;
            queryBuilder = queryBuilder.range(start, end);
          }

          // Handle sorting
          if (query.sortBy) {
            const direction = query.sortDirection === 'desc' ? true : false;
            queryBuilder = queryBuilder.order(query.sortBy, { ascending: !direction });
          }

          // Handle filtering (basic implementation)
          Object.entries(query).forEach(([key, value]) => {
            // Skip pagination and sorting params
            if (!['page', 'pageSize', 'sortBy', 'sortDirection'].includes(key)) {
              queryBuilder = queryBuilder.eq(key, value);
            }
          });
        }

        // Execute the query
        const { data, error, count } = await queryBuilder;

        if (error) {
          console.error(`Supabase error fetching from ${tableName}:`, error);
          return {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
            body: null,
            error: {
              code: 'DATABASE_QUERY_ERROR',
              message: `Error querying ${tableName}: ${error.message}`,
              details: error
            }
          };
        }

        return {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: {
            data,
            count,
            pagination: query.page ? {
              page: parseInt(query.page),
              pageSize: parseInt(query.pageSize),
              totalCount: count
            } : undefined
          },
          error: null
        };
      }
    } catch (error) {
      console.error(`Error in handleGet for ${tableName}:`, error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: null,
        error: {
          code: 'DATABASE_GET_ERROR',
          message: `Error retrieving data from ${tableName}`,
          details: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }

  /**
   * Handle POST requests to create new records
   * @param tableName The table to insert into
   * @param request The original MCP request
   * @returns Response with created data
   */
  private async handlePost(tableName: string, request: MCPRequest): Promise<MCPResponse> {
    try {
      if (!request.body || typeof request.body !== 'object') {
        return {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
          body: null,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Invalid request body for creating record',
            details: null
          }
        };
      }

      // Handle array of records or single record
      const isArray = Array.isArray(request.body);
      const recordsToInsert = isArray ? request.body : [request.body];

      // Insert the record(s)
      const { data, error } = await this.supabase
        .from(tableName)
        .insert(recordsToInsert)
        .select();

      if (error) {
        console.error(`Supabase error inserting into ${tableName}:`, error);
        return {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
          body: null,
          error: {
            code: 'DATABASE_INSERT_ERROR',
            message: `Error creating record in ${tableName}: ${error.message}`,
            details: error
          }
        };
      }

      return {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: isArray ? data : data[0],
        error: null
      };
    } catch (error) {
      console.error(`Error in handlePost for ${tableName}:`, error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: null,
        error: {
          code: 'DATABASE_POST_ERROR',
          message: `Error creating record in ${tableName}`,
          details: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }

  /**
   * Handle PUT requests to update existing records
   * @param tableName The table to update
   * @param recordId ID of the record to update
   * @param request The original MCP request
   * @returns Response with updated data
   */
  private async handlePut(tableName: string, recordId: string, request: MCPRequest): Promise<MCPResponse> {
    try {
      if (!request.body || typeof request.body !== 'object') {
        return {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
          body: null,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Invalid request body for updating record',
            details: null
          }
        };
      }

      // Update the record
      const { data, error } = await this.supabase
        .from(tableName)
        .update(request.body)
        .eq('id', recordId)
        .select()
        .single();

      if (error) {
        console.error(`Supabase error updating ${tableName}:`, error);
        return {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
          body: null,
          error: {
            code: 'DATABASE_UPDATE_ERROR',
            message: `Error updating record in ${tableName}: ${error.message}`,
            details: error
          }
        };
      }

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: data,
        error: null
      };
    } catch (error) {
      console.error(`Error in handlePut for ${tableName}:`, error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: null,
        error: {
          code: 'DATABASE_PUT_ERROR',
          message: `Error updating record in ${tableName}`,
          details: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }

  /**
   * Handle DELETE requests to remove records
   * @param tableName The table to delete from
   * @param recordId ID of the record to delete
   * @returns Response with deletion status
   */
  private async handleDelete(tableName: string, recordId: string): Promise<MCPResponse> {
    try {
      // Delete the record
      const { error } = await this.supabase
        .from(tableName)
        .delete()
        .eq('id', recordId);

      if (error) {
        console.error(`Supabase error deleting from ${tableName}:`, error);
        return {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
          body: null,
          error: {
            code: 'DATABASE_DELETE_ERROR',
            message: `Error deleting record from ${tableName}: ${error.message}`,
            details: error
          }
        };
      }

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { success: true, id: recordId },
        error: null
      };
    } catch (error) {
      console.error(`Error in handleDelete for ${tableName}:`, error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: null,
        error: {
          code: 'DATABASE_DELETE_ERROR',
          message: `Error deleting record from ${tableName}`,
          details: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }
}
