import { useEffect, useState, useCallback } from 'react';
import { subscribeToTable } from '../mcp/config/database'; // unsubscribeFromTable is no longer needed here
import { RealtimePostgresChangesPayload, RealtimeChannel } from '@supabase/supabase-js';

// Allow id to be string or number
export const useRealtime = <T extends { id: string | number }>(table: string, initialQuery: () => Promise<T[]>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      // Assuming initialQuery directly returns T[] or throws an error
      const initialData = await initialQuery();
      setData(initialData); // Set directly
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch initial data'));
    } finally {
      setLoading(false);
    }
  }, [initialQuery]);

  const handleRealtimeUpdate = useCallback((payload: RealtimePostgresChangesPayload<T>) => {
    if (!payload) return;

    // Use a more specific type for oldData in DELETE case
    const { new: newData, old: oldDataRaw } = payload;
    
    // Handle different types of changes
    switch (payload.eventType) {
      case 'INSERT':
        // Ensure newData is treated as T
        setData(prev => [...prev, newData as T]);
        break;
      case 'UPDATE':
        // Ensure newData is treated as T and id is accessed safely
        setData(prev => prev.map(item =>
          item.id === (newData as T).id ? (newData as T) : item
        ));
        break;
      case 'DELETE': { // Add opening brace
        // Safely access id from potentially partial oldData
        const oldId = (oldDataRaw as { id: string | number }).id;
        setData(prev => prev.filter(item => item.id !== oldId));
        break;
      } // Add closing brace
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Fetch initial data
    fetchInitialData().then(() => {
      if (mounted && !channel) {
        // Subscribe to real-time updates
        const newChannel = subscribeToTable(table, handleRealtimeUpdate);
        setChannel(newChannel);
      }
    });

    return () => {
      mounted = false;
      // Unsubscribe directly from the channel object
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [table, handleRealtimeUpdate, channel, fetchInitialData]);

  return {
    data,
    loading,
    error,
    refresh: fetchInitialData
  };
};
