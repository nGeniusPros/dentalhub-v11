import React, { useState } from 'react';
import { useDatabaseMCP, callDatabaseMCP } from '../../hooks/useDatabaseMCP';

interface Record {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

/**
 * Example component demonstrating the use of the database MCP server
 */
export default function DatabaseExample() {
  const [tableName, setTableName] = useState('examples');
  const [recordId, setRecordId] = useState('');
  const [recordData, setRecordData] = useState<Partial<Record>>({ name: '', description: '' });
  const [queryParams, setQueryParams] = useState({ page: '1', pageSize: '10' });
  
  // Use the database MCP hook
  const { data, loading, error, execute } = useDatabaseMCP<Record[]>();
  
  // Handle form submission for fetching records
  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    await execute(tableName, 'GET', { query: queryParams });
  };
  
  // Handle form submission for creating a record
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await execute(tableName, 'POST', { body: recordData });
    // Clear form after submission
    setRecordData({ name: '', description: '' });
  };
  
  // Handle form submission for updating a record
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordId) {
      alert('Please enter a record ID');
      return;
    }
    await execute(tableName, 'PUT', { id: recordId, body: recordData });
  };
  
  // Handle form submission for deleting a record
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordId) {
      alert('Please enter a record ID');
      return;
    }
    if (window.confirm(`Are you sure you want to delete record ${recordId}?`)) {
      await execute(tableName, 'DELETE', { id: recordId });
    }
  };
  
  // Handle direct API call example
  const handleDirectCall = async () => {
    const result = await callDatabaseMCP<Record[]>(tableName, 'GET', { query: queryParams });
    console.log('Direct API call result:', result);
    alert(`Direct API call completed. Check console for results.`);
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Database MCP Example</h1>
      
      {/* Table name input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Table Name</label>
        <input
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      {/* Fetch Records Form */}
      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Fetch Records</h2>
        <form onSubmit={handleFetch} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Page</label>
              <input
                type="number"
                value={queryParams.page}
                onChange={(e) => setQueryParams({ ...queryParams, page: e.target.value })}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Page Size</label>
              <input
                type="number"
                value={queryParams.pageSize}
                onChange={(e) => setQueryParams({ ...queryParams, pageSize: e.target.value })}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Fetch Records'}
          </button>
        </form>
      </div>
      
      {/* Create Record Form */}
      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Create Record</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={recordData.name}
              onChange={(e) => setRecordData({ ...recordData, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={recordData.description || ''}
              onChange={(e) => setRecordData({ ...recordData, description: e.target.value })}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Record'}
          </button>
        </form>
      </div>
      
      {/* Update/Delete Record Form */}
      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Update/Delete Record</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Record ID</label>
          <input
            type="text"
            value={recordId}
            onChange={(e) => setRecordId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={recordData.name}
              onChange={(e) => setRecordData({ ...recordData, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={recordData.description || ''}
              onChange={(e) => setRecordData({ ...recordData, description: e.target.value })}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Record'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Record'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Direct API Call Example */}
      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Direct API Call Example</h2>
        <button
          type="button"
          onClick={handleDirectCall}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          disabled={loading}
        >
          Make Direct API Call
        </button>
        <p className="mt-2 text-sm text-gray-600">
          This demonstrates using the callDatabaseMCP function directly without React state.
          Results will be logged to the console.
        </p>
      </div>
      
      {/* Results Display */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Results</h2>
        
        {loading && <p className="text-gray-600">Loading...</p>}
        
        {error && (
          <div className="p-4 bg-red-100 border border-red-300 rounded mb-4">
            <h3 className="font-semibold text-red-800">Error</h3>
            <p className="text-red-700">{error.message}</p>
          </div>
        )}
        
        {data && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Description</th>
                  <th className="px-4 py-2 border">Created At</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((record) => (
                    <tr key={record.id}>
                      <td className="px-4 py-2 border">{record.id}</td>
                      <td className="px-4 py-2 border">{record.name}</td>
                      <td className="px-4 py-2 border">{record.description}</td>
                      <td className="px-4 py-2 border">{record.created_at}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-2 border text-center">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
