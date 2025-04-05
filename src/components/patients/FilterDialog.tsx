import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../ui/Icons';
import { Button } from '../ui/button';

interface FilterOptions {
  status: string[];
  balanceRange: {
    min: number | null;
    max: number | null;
  };
  appointmentRange: {
    start: string | null;
    end: string | null;
  };
  lastVisitRange: {
    start: string | null;
    end: string | null;
  };
}

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    balanceRange: { min: null, max: null },
    appointmentRange: { start: null, end: null },
    lastVisitRange: { start: null, end: null }
  });

  // Initialize filters with current values
  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters, isOpen]);

  if (!isOpen) return null;

  const handleStatusChange = (status: string) => {
    setFilters(prev => {
      const newStatus = prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status];
      
      return {
        ...prev,
        status: newStatus
      };
    });
  };

  const handleBalanceChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    
    setFilters(prev => ({
      ...prev,
      balanceRange: {
        ...prev.balanceRange,
        [field]: numValue
      }
    }));
  };

  const handleDateRangeChange = (
    rangeType: 'appointmentRange' | 'lastVisitRange',
    field: 'start' | 'end',
    value: string
  ) => {
    setFilters(prev => ({
      ...prev,
      [rangeType]: {
        ...prev[rangeType],
        [field]: value || null
      }
    }));
  };

  const handleReset = () => {
    setFilters({
      status: [],
      balanceRange: { min: null, max: null },
      appointmentRange: { start: null, end: null },
      lastVisitRange: { start: null, end: null }
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Filter Patients</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Patient Status</h3>
            <div className="flex flex-wrap gap-2">
              {['active', 'inactive', 'pending'].map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    filters.status.includes(status)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Balance Range Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Balance Range</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min ($)</label>
                <input
                  type="number"
                  value={filters.balanceRange.min ?? ''}
                  onChange={(e) => handleBalanceChange('min', e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max ($)</label>
                <input
                  type="number"
                  value={filters.balanceRange.max ?? ''}
                  onChange={(e) => handleBalanceChange('max', e.target.value)}
                  placeholder="No limit"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Appointment Date Range Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Next Appointment</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={filters.appointmentRange.start || ''}
                  onChange={(e) => handleDateRangeChange('appointmentRange', 'start', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={filters.appointmentRange.end || ''}
                  onChange={(e) => handleDateRangeChange('appointmentRange', 'end', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Last Visit Date Range Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Last Visit</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={filters.lastVisitRange.start || ''}
                  onChange={(e) => handleDateRangeChange('lastVisitRange', 'start', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={filters.lastVisitRange.end || ''}
                  onChange={(e) => handleDateRangeChange('lastVisitRange', 'end', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>
          <div className="space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FilterDialog;
