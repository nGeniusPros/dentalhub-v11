import React from 'react';

const EmailDashboard: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Email Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Create Email Campaign
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
              Templates
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
              Analytics
            </button>
          </div>
          <div className="relative">
            <select className="appearance-none bg-gray-100 text-gray-700 px-4 py-2 pr-8 rounded-lg hover:bg-gray-200 focus:outline-none">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Last 6 Months</option>
              <option>Last Year</option>
              <option>All Time</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">Total Sent</h3>
            <p className="text-3xl font-bold">24,568</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">Open Rate</h3>
            <p className="text-3xl font-bold">32.4%</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h3 className="font-semibold text-yellow-800 mb-2">Click Rate</h3>
            <p className="text-3xl font-bold">8.7%</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2">Conversion Rate</h3>
            <p className="text-3xl font-bold">3.2%</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Performance Trends</h2>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Email performance chart will be displayed here</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Campaigns</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-4 text-left">Campaign Name</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Sent</th>
                  <th className="py-3 px-4 text-left">Open Rate</th>
                  <th className="py-3 px-4 text-left">Click Rate</th>
                  <th className="py-3 px-4 text-left">Sent Date</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Sample data rows */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Spring Cleaning Special</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Completed</span>
                  </td>
                  <td className="py-3 px-4">2,500</td>
                  <td className="py-3 px-4">34.2%</td>
                  <td className="py-3 px-4">12.5%</td>
                  <td className="py-3 px-4">Mar 15, 2023</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">View Report</button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Monthly Newsletter</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Completed</span>
                  </td>
                  <td className="py-3 px-4">3,245</td>
                  <td className="py-3 px-4">41.8%</td>
                  <td className="py-3 px-4">15.3%</td>
                  <td className="py-3 px-4">Apr 1, 2023</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">View Report</button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">New Service Announcement</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Completed</span>
                  </td>
                  <td className="py-3 px-4">1,876</td>
                  <td className="py-3 px-4">28.6%</td>
                  <td className="py-3 px-4">9.2%</td>
                  <td className="py-3 px-4">Apr 12, 2023</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">View Report</button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Summer Special</td>
                  <td className="py-3 px-4">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Scheduled</span>
                  </td>
                  <td className="py-3 px-4">0 / 3,500</td>
                  <td className="py-3 px-4">-</td>
                  <td className="py-3 px-4">-</td>
                  <td className="py-3 px-4">May 1, 2023</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Cancel</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Top Performing Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Template Preview</p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Appointment Reminder</h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Open Rate: 68.5%</span>
                  <span>Click Rate: 42.3%</span>
                </div>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Template Preview</p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Monthly Newsletter</h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Open Rate: 45.2%</span>
                  <span>Click Rate: 18.7%</span>
                </div>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Template Preview</p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Special Promotion</h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Open Rate: 38.9%</span>
                  <span>Click Rate: 15.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDashboard;
