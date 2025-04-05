import React, { useState } from 'react';

const AIFeedback: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feedback');

  // Sample feedback data
  const feedbackItems = [
    {
      id: 1,
      date: 'Apr 15, 2023',
      source: 'Patient Interaction',
      category: 'Communication',
      feedback: 'Consider using more simplified language when explaining treatment options to patients.',
      status: 'New',
      priority: 'Medium'
    },
    {
      id: 2,
      date: 'Apr 12, 2023',
      source: 'Appointment Flow',
      category: 'Efficiency',
      feedback: 'The average wait time has increased by 12 minutes over the past month. Consider reviewing scheduling practices.',
      status: 'In Progress',
      priority: 'High'
    },
    {
      id: 3,
      date: 'Apr 10, 2023',
      source: 'Patient Survey',
      category: 'Patient Experience',
      feedback: 'Patients have expressed appreciation for the new digital check-in process.',
      status: 'Acknowledged',
      priority: 'Low'
    },
    {
      id: 4,
      date: 'Apr 5, 2023',
      source: 'Staff Meeting',
      category: 'Workflow',
      feedback: 'The new sterilization protocol has improved efficiency by 15%.',
      status: 'Implemented',
      priority: 'Medium'
    },
    {
      id: 5,
      date: 'Apr 1, 2023',
      source: 'Financial Analysis',
      category: 'Revenue',
      feedback: 'Insurance claim processing time has decreased by 22% after implementing the new verification system.',
      status: 'Implemented',
      priority: 'High'
    },
  ];

  // Sample insights data
  const insights = [
    {
      id: 1,
      title: 'Patient Communication',
      description: 'Analysis of patient interactions shows a 15% increase in patient satisfaction when dental procedures are explained using visual aids.',
      impact: 'High',
      date: 'Apr 15, 2023',
      category: 'Patient Experience'
    },
    {
      id: 2,
      title: 'Appointment Scheduling',
      description: 'Patients who book appointments online are 28% less likely to cancel compared to phone bookings.',
      impact: 'Medium',
      date: 'Apr 10, 2023',
      category: 'Operations'
    },
    {
      id: 3,
      title: 'Treatment Acceptance',
      description: 'Presenting treatment plans with phased payment options increases acceptance rates by 22%.',
      impact: 'High',
      date: 'Apr 5, 2023',
      category: 'Revenue'
    },
    {
      id: 4,
      title: 'Staff Efficiency',
      description: 'Morning huddles that include reviewing the day\'s schedule reduce unexpected delays by 18%.',
      impact: 'Medium',
      date: 'Apr 1, 2023',
      category: 'Operations'
    },
  ];

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">AI Feedback</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'feedback'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('feedback')}
            >
              Feedback
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
                activeTab === 'settings'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'feedback' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">AI-Generated Feedback</h2>
                <div className="flex space-x-2">
                  <div className="relative">
                    <select className="appearance-none bg-gray-100 text-gray-700 px-3 py-2 pr-8 rounded-lg hover:bg-gray-200 focus:outline-none">
                      <option>All Categories</option>
                      <option>Communication</option>
                      <option>Efficiency</option>
                      <option>Patient Experience</option>
                      <option>Workflow</option>
                      <option>Revenue</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  <div className="relative">
                    <select className="appearance-none bg-gray-100 text-gray-700 px-3 py-2 pr-8 rounded-lg hover:bg-gray-200 focus:outline-none">
                      <option>All Statuses</option>
                      <option>New</option>
                      <option>In Progress</option>
                      <option>Acknowledged</option>
                      <option>Implemented</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Source</th>
                      <th className="py-3 px-4 text-left">Category</th>
                      <th className="py-3 px-4 text-left">Feedback</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Priority</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbackItems.map(item => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{item.date}</td>
                        <td className="py-3 px-4">{item.source}</td>
                        <td className="py-3 px-4">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">{item.feedback}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === 'New' ? 'bg-yellow-100 text-yellow-800' :
                            item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            item.status === 'Acknowledged' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.priority === 'High' ? 'bg-red-100 text-red-800' :
                            item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-800 mr-2">View</button>
                          <button className="text-gray-600 hover:text-gray-800">Update</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">AI-Generated Insights</h2>
                <div className="relative">
                  <select className="appearance-none bg-gray-100 text-gray-700 px-3 py-2 pr-8 rounded-lg hover:bg-gray-200 focus:outline-none">
                    <option>All Categories</option>
                    <option>Patient Experience</option>
                    <option>Operations</option>
                    <option>Revenue</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insights.map(insight => (
                  <div key={insight.id} className="bg-white border rounded-lg overflow-hidden">
                    <div className="p-4">
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
                        <button className="text-blue-600 hover:text-blue-800">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">AI Feedback Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Feedback Sources</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="source-patient" className="mr-2" defaultChecked />
                      <label htmlFor="source-patient">Patient Interactions</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="source-appointment" className="mr-2" defaultChecked />
                      <label htmlFor="source-appointment">Appointment Flow</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="source-survey" className="mr-2" defaultChecked />
                      <label htmlFor="source-survey">Patient Surveys</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="source-staff" className="mr-2" defaultChecked />
                      <label htmlFor="source-staff">Staff Meetings</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="source-financial" className="mr-2" defaultChecked />
                      <label htmlFor="source-financial">Financial Analysis</label>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Feedback Categories</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="cat-communication" className="mr-2" defaultChecked />
                      <label htmlFor="cat-communication">Communication</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="cat-efficiency" className="mr-2" defaultChecked />
                      <label htmlFor="cat-efficiency">Efficiency</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="cat-patient" className="mr-2" defaultChecked />
                      <label htmlFor="cat-patient">Patient Experience</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="cat-workflow" className="mr-2" defaultChecked />
                      <label htmlFor="cat-workflow">Workflow</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="cat-revenue" className="mr-2" defaultChecked />
                      <label htmlFor="cat-revenue">Revenue</label>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Notification Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Feedback Frequency
                      </label>
                      <select className="w-full border rounded-md px-3 py-2">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                        <option>Real-time</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Priority
                      </label>
                      <select className="w-full border rounded-md px-3 py-2">
                        <option>All</option>
                        <option>Medium and above</option>
                        <option>High only</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="notify-email" className="mr-2" defaultChecked />
                      <label htmlFor="notify-email">Email Notifications</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="notify-app" className="mr-2" defaultChecked />
                      <label htmlFor="notify-app">In-App Notifications</label>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">AI Model Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        AI Model Sensitivity
                      </label>
                      <select className="w-full border rounded-md px-3 py-2">
                        <option>High (More Feedback)</option>
                        <option>Medium (Balanced)</option>
                        <option>Low (Only Significant Feedback)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data Sources
                      </label>
                      <select className="w-full border rounded-md px-3 py-2">
                        <option>All Available Data</option>
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>Last Year</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="ai-learning" className="mr-2" defaultChecked />
                      <label htmlFor="ai-learning">Enable Continuous Learning</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 mr-2">
                  Reset to Defaults
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIFeedback;
