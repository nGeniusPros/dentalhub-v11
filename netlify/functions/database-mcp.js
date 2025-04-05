// Netlify Function for Database MCP Server
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Handle database operations through MCP
 * @param {Object} event - Netlify function event
 * @returns {Promise<Object>} - Response object
 */
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  try {
    // Parse the request body
    const requestBody = JSON.parse(event.body);
    const { path, method, body, query } = requestBody;

    // Validate required fields
    if (!path || !method) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: path and method' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Extract table name and record ID from path
    // Format: /api/database/{tableName} or /api/database/{tableName}/{id}
    const pathParts = path.split('/');
    if (pathParts.length < 3 || pathParts[1] !== 'api' || pathParts[2] !== 'database') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid path format' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const tableName = pathParts[3];
    const recordId = pathParts.length > 4 ? pathParts[4] : undefined;

    if (!tableName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Table name is required' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Process request based on HTTP method
    let response;
    switch (method.toUpperCase()) {
      case 'GET':
        response = await handleGet(tableName, recordId, query);
        break;
      
      case 'POST':
        response = await handlePost(tableName, body);
        break;
      
      case 'PUT':
        if (!recordId) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Record ID is required for PUT requests' }),
            headers: { 'Content-Type': 'application/json' }
          };
        }
        response = await handlePut(tableName, recordId, body);
        break;
      
      case 'DELETE':
        if (!recordId) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Record ID is required for DELETE requests' }),
            headers: { 'Content-Type': 'application/json' }
          };
        }
        response = await handleDelete(tableName, recordId);
        break;
      
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Unsupported method: ${method}` }),
          headers: { 'Content-Type': 'application/json' }
        };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error('Database MCP error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: null,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'An unexpected error occurred',
          details: error.stack
        }
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};

/**
 * Handle GET requests to fetch records
 * @param {string} tableName - The table to query
 * @param {string} recordId - Optional ID for single record retrieval
 * @param {Object} query - Query parameters
 * @returns {Promise<Object>} - Response with fetched data
 */
async function handleGet(tableName, recordId, query = {}) {
  try {
    let queryBuilder = supabase.from(tableName).select('*');
    
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
    
    // If ID is provided, get a single record
    if (recordId) {
      queryBuilder = queryBuilder.eq('id', recordId).single();
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
  } catch (error) {
    console.error(`Error in handleGet for ${tableName}:`, error);
    return {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: null,
      error: {
        code: 'DATABASE_GET_ERROR',
        message: `Error retrieving data from ${tableName}`,
        details: error.message
      }
    };
  }
}

/**
 * Handle POST requests to create new records
 * @param {string} tableName - The table to insert into
 * @param {Object} body - The record data to insert
 * @returns {Promise<Object>} - Response with created data
 */
async function handlePost(tableName, body) {
  try {
    if (!body || typeof body !== 'object') {
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
    const isArray = Array.isArray(body);
    const recordsToInsert = isArray ? body : [body];
    
    // Insert the record(s)
    const { data, error } = await supabase
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
        details: error.message
      }
    };
  }
}

/**
 * Handle PUT requests to update existing records
 * @param {string} tableName - The table to update
 * @param {string} recordId - ID of the record to update
 * @param {Object} body - The record data to update
 * @returns {Promise<Object>} - Response with updated data
 */
async function handlePut(tableName, recordId, body) {
  try {
    if (!body || typeof body !== 'object') {
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
    const { data, error } = await supabase
      .from(tableName)
      .update(body)
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
        details: error.message
      }
    };
  }
}

/**
 * Handle DELETE requests to remove records
 * @param {string} tableName - The table to delete from
 * @param {string} recordId - ID of the record to delete
 * @returns {Promise<Object>} - Response with deletion status
 */
async function handleDelete(tableName, recordId) {
  try {
    // Delete the record
    const { error } = await supabase
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
        details: error.message
      }
    };
  }
}
