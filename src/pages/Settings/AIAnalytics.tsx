import React, { useState } from 'react';

const AIAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('30');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample KPI data
  const kpiData = [
    { id: 1, name: 'Revenue', value: '$42,568', change: '+12.5%', trend: 'up' },
    { id: 2, name: 'New Patients', value: '48', change: '+8.2%', trend: 'up' },
    { id: 3, name: 'Treatment Acceptance', value: '72.4%', change: '+5.1%', trend: 'up' },
    { id: 4, name: 'Avg. Production/Hour', value: '$385', change: '+3.8%', trend: 'up' },
    { id: 5, name: 'Appointment Fill Rate', value: '92.7%', change: '+1.5%', trend: 'up' },
    { id: 6, name: 'Patient Satisfaction', value: '4.8/5', change: '+0.2', trend: 'up' },
  ];
  
  // Sample insights data
  const insights = [
    {
      id: 1,
      title: 'Revenue Growth Drivers',
      description: 'Hygiene appointments have increased by 18% this month, contributing to 32% of the overall revenue growth.',
      category: 'Revenue',
      impact: 'High',
      date: 'Apr 15, 2023'
    },
    {
      id: 2,
      title: 'Patient Retention',
      description: 'Patients who receive text message reminders are 35% more likely to schedule their next appointment before leaving.',
      category: 'Patient Management',
      impact: 'Medium',
      date: 'Apr 12, 2023'
    },
    {
      id: 3,
      title: 'Treatment Patterns',
      description: 'Patients are 28% more likely to accept treatment plans when presented with digital visuals compared to verbal explanations alone.',
      category: 'Clinical',
      impact: 'High',
      date: 'Apr 10, 2023'
    },
    {
      id: 4,
      title: 'Scheduling Efficiency',
      description: 'Implementing 10-minute buffer periods between appointments has reduced wait times by 24% and improved on-time performance.',
      category: 'Operations',
      impact: 'Medium',
      date: 'Apr 5, 2023'
    },
  ];
  
  // Sample predictions data
  const predictions = [
    {
      id: 1,
      title: 'Revenue Forecast',
      description: 'Based on current trends, revenue is projected to increase by 15-18% in the next quarter.',
      confidence: 'High',
      category: 'Financial',
      date: 'Next Quarter'
    },
    {
      id: 2,
      title: 'Appointment Demand',
      description: 'Expect a 22% increase in appointment requests during May-June based on seasonal patterns.',
      confidence: 'Medium',
      category: 'Operations',
      date: 'May-June 2023'
    },
    {
      id: 3,
      title: 'Staff Utilization',
      description: 'Current staffing levels will reach capacity by July if patient growth continues at the current rate.',
      confidence: 'Medium',
      category: 'HR',
      date: 'July 2023'
    },
    {
      id: 4,
      title: 'Supply Inventory',
      description: 'Based on usage patterns, composite materials will need to be reordered by May 15 to avoid shortages.',
      confidence: 'High',
      category: 'Inventory',
      date: 'May 15, 2023'
    },
  ];
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">AI Analytics</h1>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">Date Range:</span>
          <div className="relative">
            <select
              className="appearance-none bg-gray-100 text-gray-700 px-4 py-2 pr-8 rounded-lg hover:bg-gray-200 focus:outline-none"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'insights'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('insights')}
            >
              Insights
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'predictions'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('predictions')}
            >
              Predictions
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {kpiData.map(kpi => (
                  <div key={kpi.id} className="bg-white border rounded-lg p-4">
                    <h3 className="text-gray-600 text-sm mb-1">{kpi.name}</h3>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-bold">{kpi.value}</p>
                      <p className={`flex items-center ${
                        kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {kpi.trend === 'up' ? (
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                        {kpi.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Revenue Breakdown</h2>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Revenue breakdown chart will be displayed here</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Patient Demographics</h2>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Patient demographics chart will be displayed here</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Appointment Trends</h2>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Appointment trends chart will be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'insights' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">AI-Generated Insights</h2>
                <div className="relative">
                  <select className="appearance-none bg-gray-100 text-gray-700 px-3 py-2 pr-8 rounded-lg hover:bg-gray-200 focus:outline-none">
                    <option>All Categories</option>
                    <option>Revenue</option>
                    <option>Patient Management</option>
                    <option>Clinical</option>
                    <option>Operations</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {insights.map(insight => (
                  <div key={insight.id} className="bg-white border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{insight.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        insight.impact === 'High' ? 'bg-red-100 text-red-800' :
                        insight.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {insight.impact} Impact
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{insight.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2">
                          {insight.category}
                        </span>
                        <span className="text-gray-500">{insight.date}</span>
                      </div>
                      <div>
                        <button className="text-blue-600 hover:text-blue-800 mr-2">
                          Share
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                  Load More Insights
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'predictions' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">AI-Generated Predictions</h2>
                <div className="relative">
                  <select className="appearance-none bg-gray-100 text-gray-700 px-3 py-2 pr-8 rounded-lg hover:bg-gray-200 focus:outline-none">
                    <option>All Categories</option>
                    <option>Financial</option>
                    <option>Operations</option>
                    <option>HR</option>
                    <option>Inventory</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predictions.map(prediction => (
                  <div key={prediction.id} className="bg-white border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{prediction.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        prediction.confidence === 'High' ? 'bg-green-100 text-green-800' :
                        prediction.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {prediction.confidence} Confidence
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{prediction.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs mr-2">
                          {prediction.category}
                        </span>
                        <span className="text-gray-500">Timeframe: {prediction.date}</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        View Analysis
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Long-Term Projections</h2>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Long-term projections chart will be displayed here</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-800 mb-1">About AI Analytics</h3>
            <p className="text-sm text-gray-600">
              AI Analytics uses advanced machine learning algorithms to analyze your practice data and generate actionable insights and predictions.
              The system continuously learns from your practice patterns to improve accuracy over time.
              All data is processed securely and in compliance with HIPAA regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalytics;
