import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../ui/Icons';
import { Button } from '../ui/button';
import { LineChartComponent } from '../ui/charts/LineChartComponent';
import { BarChartComponent } from '../ui/charts/BarChartComponent';
import { PieChartComponent } from '../ui/charts/PieChartComponent';
import { chartColors } from '../../lib/chartStyles';

export const VoiceAnalytics = () => {
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

  // Sample data - would come from API in production
  const callTrendData = [
    { date: 'Mon', completed: 45, failed: 5, answered: 35 },
    { date: 'Tue', completed: 52, failed: 3, answered: 42 },
    { date: 'Wed', completed: 48, failed: 7, answered: 38 },
    { date: 'Thu', completed: 61, failed: 4, answered: 51 },
    { date: 'Fri', completed: 55, failed: 6, answered: 45 },
    { date: 'Sat', completed: 38, failed: 2, answered: 32 },
    { date: 'Sun', completed: 42, failed: 4, answered: 35 }
  ];

  const callOutcomeData = [
    { name: 'Appointment Scheduled', value: 35, color: '#4BC5BD' },
    { name: 'Call Back Later', value: 25, color: '#6B4C9A' },
    { name: 'Not Interested', value: 15, color: '#C5A572' },
    { name: 'Voicemail', value: 25, color: '#1B2B5B' }
  ];

  const timeOfDayData = [
    { time: '8am', calls: 25 },
    { time: '10am', calls: 45 },
    { time: '12pm', calls: 35 },
    { time: '2pm', calls: 50 },
    { time: '4pm', calls: 40 },
    { time: '6pm', calls: 30 }
  ];

  const campaignPerformanceData = [
    { name: 'Recall', success: 85, response: 65 },
    { name: 'Reactivation', success: 75, response: 55 },
    { name: 'Appointment', success: 90, response: 70 },
    { name: 'Treatment', success: 80, response: 60 },
    { name: 'Event', success: 70, response: 50 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Call Volume Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <LineChartComponent
          title="Call Volume Trends"
          data={callTrendData}
          lines={[
            { key: 'completed', name: 'Completed', color: chartColors.purple.DEFAULT },
            { key: 'answered', name: 'Answered', color: chartColors.blue.DEFAULT },
            { key: 'failed', name: 'Attempted', color: chartColors.green.DEFAULT }
          ]}
          xAxisKey="date"
          height={300}
        />
      </motion.div>

      {/* Call Outcomes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <PieChartComponent
          title="Call Outcomes"
          data={callOutcomeData}
          height={300}
        />
      </motion.div>

      {/* Best Time to Call */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <BarChartComponent
          title="Best Time to Call"
          data={timeOfDayData}
          bars={[
            { key: 'calls', name: 'Call Volume', color: chartColors.navy.DEFAULT }
          ]}
          xAxisKey="time"
          height={300}
        />
      </motion.div>

      {/* Campaign Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <LineChartComponent
          title="Campaign Performance"
          data={campaignPerformanceData}
          lines={[
            { key: 'success', name: 'Success Rate', color: chartColors.turquoise.DEFAULT },
            { key: 'response', name: 'Response Rate', color: chartColors.purple.DEFAULT }
          ]}
          xAxisKey="name"
          height={300}
        />
      </motion.div>

      {/* Dialogs would go here in a real implementation */}
    </div>
  );
};

export default VoiceAnalytics;
