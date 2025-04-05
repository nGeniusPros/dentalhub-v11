import React from 'react';

const Prospects: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Prospects</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Add Prospect
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
              Import List
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
              Export
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search prospects..."
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
            <h3 className="font-semibold text-blue-800 mb-2">Total Prospects</h3>
            <p className="text-3xl font-bold">248</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">New This Month</h3>
            <p className="text-3xl font-bold">42</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h3 className="font-semibold text-yellow-800 mb-2">Conversion Rate</h3>
            <p className="text-3xl font-bold">18.5%</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2">Avg. Response Time</h3>
            <p className="text-3xl font-bold">4.2h</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Source</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Last Contact</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample data rows */}
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">John Smith</td>
                <td className="py-3 px-4">john.smith@example.com</td>
                <td className="py-3 px-4">(555) 123-4567</td>
                <td className="py-3 px-4">Website Form</td>
                <td className="py-3 px-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">New Lead</span>
                </td>
                <td className="py-3 px-4">2 days ago</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Contact</button>
                  <button className="text-gray-600 hover:text-gray-800">Edit</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">Sarah Johnson</td>
                <td className="py-3 px-4">sarah.j@example.com</td>
                <td className="py-3 px-4">(555) 987-6543</td>
                <td className="py-3 px-4">Referral</td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Qualified</span>
                </td>
                <td className="py-3 px-4">Yesterday</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Contact</button>
                  <button className="text-gray-600 hover:text-gray-800">Edit</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">Michael Brown</td>
                <td className="py-3 px-4">mbrown@example.com</td>
                <td className="py-3 px-4">(555) 456-7890</td>
                <td className="py-3 px-4">Google Ads</td>
                <td className="py-3 px-4">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Nurturing</span>
                </td>
                <td className="py-3 px-4">3 days ago</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Contact</button>
                  <button className="text-gray-600 hover:text-gray-800">Edit</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">Emily Davis</td>
                <td className="py-3 px-4">emily.d@example.com</td>
                <td className="py-3 px-4">(555) 234-5678</td>
                <td className="py-3 px-4">Email Campaign</td>
                <td className="py-3 px-4">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Appointment Set</span>
                </td>
                <td className="py-3 px-4">1 week ago</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Contact</button>
                  <button className="text-gray-600 hover:text-gray-800">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Prospects;
