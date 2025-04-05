import React from 'react';

const Conversations: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Conversations</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              New Message
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
              Filter
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
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

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-4 text-left">Patient</th>
                <th className="py-3 px-4 text-left">Channel</th>
                <th className="py-3 px-4 text-left">Last Message</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample data rows */}
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 mr-3">JS</div>
                  <span>John Smith</span>
                </td>
                <td className="py-3 px-4">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    SMS
                  </span>
                </td>
                <td className="py-3 px-4">I'd like to reschedule my appointment...</td>
                <td className="py-3 px-4">Today, 10:23 AM</td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Reply</button>
                  <button className="text-gray-600 hover:text-gray-800">View</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 mr-3">SJ</div>
                  <span>Sarah Johnson</span>
                </td>
                <td className="py-3 px-4">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </span>
                </td>
                <td className="py-3 px-4">Thank you for the reminder about my upcoming...</td>
                <td className="py-3 px-4">Yesterday, 3:45 PM</td>
                <td className="py-3 px-4">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pending</span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Reply</button>
                  <button className="text-gray-600 hover:text-gray-800">View</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center text-red-700 mr-3">MB</div>
                  <span>Michael Brown</span>
                </td>
                <td className="py-3 px-4">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Voice
                  </span>
                </td>
                <td className="py-3 px-4">Voicemail: "Hi, I'm calling to confirm my..."</td>
                <td className="py-3 px-4">2 days ago</td>
                <td className="py-3 px-4">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Closed</span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Reply</button>
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

export default Conversations;
