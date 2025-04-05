import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { DateRangePicker } from './filters/DateRangePicker';
import { FilterDialog } from './filters/FilterDialog';
import { DetailsDialog } from './filters/DetailsDialog';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCommunication } from '../../../../../contexts/CommunicationContext';

export const VoiceAnalytics = () => {
  const { analyticsData } = useCommunication();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleExport = (chartName: string, data: any[]) => {
    if (!data || data.length === 0) {
      console.warn('No data available to export');
      return;
    }

    const csvContent = [
      // Add headers
      Object.keys(data[0]).join(','),
      // Add data rows
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chartName}-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Call Volume Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Call Volume Trends</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              if (analyticsData.callVolume && analyticsData.callVolume.length > 0) {
                handleExport('call-volume', analyticsData.callVolume);
              } else {
                alert('No call volume data available to export');
              }
            }}
          >
            <Icons.Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData.callVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="completed" stackId="1" stroke="#4BC5BD" fill="#4BC5BD" />
              <Area type="monotone" dataKey="failed" stackId="1" stroke="#C5A572" fill="#C5A572" />
              <Area type="monotone" dataKey="answered" stackId="1" stroke="#6B4C9A" fill="#6B4C9A" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Call Outcomes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Call Outcomes</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilter(true)}
          >
            <Icons.Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analyticsData.callOutcomes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {analyticsData.callOutcomes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Best Time to Call */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Best Time to Call</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDatePicker(true)}
          >
            <Icons.Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.timeOfDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calls" fill="#1B2B5B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Campaign Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Campaign Performance</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDetails(true)}
          >
            <Icons.BarChart2 className="w-4 h-4 mr-2" />
            Details
          </Button>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData.campaignPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="success" stroke="#4BC5BD" strokeWidth={2} />
              <Line type="monotone" dataKey="response" stroke="#6B4C9A" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Dialogs */}
      <DateRangePicker
        open={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={setDateRange}
      />
      
      <FilterDialog
        open={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={setFilters}
      />
      
      <DetailsDialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        data={analyticsData.campaignPerformance}
      />
    </div>
  );
};
