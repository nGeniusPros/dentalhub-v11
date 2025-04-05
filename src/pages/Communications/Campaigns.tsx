import React from 'react';

const Campaigns: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Campaigns</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Create Campaign
            </button>
            <div className="relative">
              <select className="appearance-none bg-gray-100 text-gray-700 px-4 py-2 pr-8 rounded-lg hover:bg-gray-200 focus:outline-none">
                <option>All Channels</option>
                <option>Email</option>
                <option>SMS</option>
                <option>Voice</option>
                <option>Social Media</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search campaigns..."
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
            <h3 className="font-semibold text-blue-800 mb-2">Active Campaigns</h3>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">Total Sent</h3>
            <p className="text-3xl font-bold">24,568</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h3 className="font-semibold text-yellow-800 mb-2">Avg. Open Rate</h3>
            <p className="text-3xl font-bold">32.4%</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2">Conversion Rate</h3>
            <p className="text-3xl font-bold">5.8%</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-4 text-left">Campaign Name</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Audience</th>
                <th className="py-3 px-4 text-left">Sent/Total</th>
                <th className="py-3 px-4 text-left">Open Rate</th>
                <th className="py-3 px-4 text-left">Conversion</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample data rows */}
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">Spring Cleaning Special</td>
                <td className="py-3 px-4">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
                </td>
                <td className="py-3 px-4">All Patients</td>
                <td className="py-3 px-4">1,245 / 2,500</td>
                <td className="py-3 px-4">34.2%</td>
                <td className="py-3 px-4">6.8%</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                  <button className="text-gray-600 hover:text-gray-800">View</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">Appointment Reminder</td>
                <td className="py-3 px-4">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    SMS
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
                </td>
                <td className="py-3 px-4">Upcoming Appointments</td>
                <td className="py-3 px-4">568 / 568</td>
                <td className="py-3 px-4">98.4%</td>
                <td className="py-3 px-4">92.1%</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                  <button className="text-gray-600 hover:text-gray-800">View</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">New Patient Welcome</td>
                <td className="py-3 px-4">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Voice
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
                </td>
                <td className="py-3 px-4">New Patients</td>
                <td className="py-3 px-4">42 / 50</td>
                <td className="py-3 px-4">78.6%</td>
                <td className="py-3 px-4">45.2%</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                  <button className="text-gray-600 hover:text-gray-800">View</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">Holiday Special</td>
                <td className="py-3 px-4">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Social
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Draft</span>
                </td>
                <td className="py-3 px-4">All Contacts</td>
                <td className="py-3 px-4">0 / 3,500</td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">-</td>
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

export default Campaigns;
