import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../../../../components/ui/Icons';
import { Button } from '../../../../components/ui/button';
import { useVoiceCampaign } from '../context/VoiceCampaignContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const VoiceAnalytics: React.FC = () => {
  const { analyticsData, refreshAnalytics, analyticsLoading, analyticsError } = useVoiceCampaign();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Voice Campaign Analytics</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAnalytics}
            disabled={analyticsLoading}
          >
            {analyticsLoading ? (
              <Icons.Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Icons.RefreshCw className="w-4 h-4" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Performance metrics for your voice campaigns.
        </p>
      </div>

      <div className="p-6">
        {analyticsError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            <div className="flex">
              <Icons.AlertCircle className="w-5 h-5 mr-2" />
              <span>{analyticsError}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Call Volume Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 p-4 rounded-xl"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Call Volume Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analyticsData.callVolume}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#0088FE"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="answered" stroke="#00C49F" />
                  <Line type="monotone" dataKey="failed" stroke="#FF8042" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Call Outcomes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 p-4 rounded-xl"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Call Outcomes</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.callOutcomes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.callOutcomes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Time of Day Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 p-4 rounded-xl"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Time of Day Performance</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.timeOfDay}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="calls" fill="#8884d8" name="Total Calls" />
                  <Bar dataKey="success" fill="#82ca9d" name="Successful Calls" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Campaign Performance Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 p-4 rounded-xl"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Type Performance</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.campaignPerformance}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="success" fill="#82ca9d" name="Success" />
                  <Bar dataKey="failure" fill="#ff8042" name="Failure" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAnalytics;
