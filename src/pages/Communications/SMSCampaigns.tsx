import React from 'react';

const SMSCampaigns: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">SMS Campaigns</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Create SMS Campaign
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
              Templates
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search SMS campaigns..."
              className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="w-5 h-5 absolute right-3 top-2.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">Active SMS Campaigns</h3>
            <p className="text-3xl font-bold">8</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">Messages Sent (MTD)</h3>
            <p className="text-3xl font-bold">12,456</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h3 className="font-semibold text-yellow-800 mb-2">Delivery Rate</h3>
            <p className="text-3xl font-bold">98.7%</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2">Response Rate</h3>
            <p className="text-3xl font-bold">42.3%</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-4 text-left">Campaign Name</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Audience</th>
                <th className="py-3 px-4 text-left">Sent/Total</th>
                <th className="py-3 px-4 text-left">Delivery Rate</th>
                <th className="py-3 px-4 text-left">Response Rate</th>
                <th className="py-3 px-4 text-left">Created</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample data rows */}
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">Appointment Reminder</td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
                </td>
                <td className="py-3 px-4">Upcoming Appointments</td>
                <td className="py-3 px-4">568 / 568</td>
                <td className="py-3 px-4">99.8%</td>
                <td className="py-3 px-4">45.2%</td>
                <td className="py-3 px-4">Jan 15, 2023</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                  <button className="text-gray-600 hover:text-gray-800">View</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">Cleaning Special</td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
                </td>
                <td className="py-3 px-4">Patients Due for Cleaning</td>
                <td className="py-3 px-4">1,245 / 1,500</td>
                <td className="py-3 px-4">98.2%</td>
                <td className="py-3 px-4">32.7%</td>
                <td className="py-3 px-4">Feb 3, 2023</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                  <button className="text-gray-600 hover:text-gray-800">View</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">Reactivation Campaign</td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
                </td>
                <td className="py-3 px-4">Inactive Patients</td>
                <td className="py-3 px-4">876 / 1,200</td>
                <td className="py-3 px-4">97.5%</td>
                <td className="py-3 px-4">18.3%</td>
                <td className="py-3 px-4">Mar 12, 2023</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                  <button className="text-gray-600 hover:text-gray-800">View</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">Birthday Wishes</td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
                </td>
                <td className="py-3 px-4">All Patients</td>
                <td className="py-3 px-4">342 / 3,500</td>
                <td className="py-3 px-4">99.1%</td>
                <td className="py-3 px-4">52.6%</td>
                <td className="py-3 px-4">Jan 1, 2023</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                  <button className="text-gray-600 hover:text-gray-800">View</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">Summer Special</td>
                <td className="py-3 px-4">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Draft</span>
                </td>
                <td className="py-3 px-4">All Patients</td>
                <td className="py-3 px-4">0 / 3,500</td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">Apr 5, 2023</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                  <button className="text-gray-600 hover:text-gray-800">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SMSCampaigns;
