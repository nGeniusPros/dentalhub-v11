import React from 'react';

const Pipeline: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pipeline Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">
          View and manage your entire patient acquisition pipeline in one place.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">New Leads</h3>
            <p className="text-3xl font-bold">24</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2">In Progress</h3>
            <p className="text-3xl font-bold">18</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">Converted</h3>
            <p className="text-3xl font-bold">12</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-4 text-left">Name</th>
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
                <td className="py-3 px-4">Website Form</td>
                <td className="py-3 px-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">New Lead</span></td>
                <td className="py-3 px-4">2 days ago</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Contact</button>
                  <button className="text-gray-600 hover:text-gray-800">Details</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">Sarah Johnson</td>
                <td className="py-3 px-4">Phone Call</td>
                <td className="py-3 px-4"><span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">In Progress</span></td>
                <td className="py-3 px-4">Yesterday</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Contact</button>
                  <button className="text-gray-600 hover:text-gray-800">Details</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">Michael Brown</td>
                <td className="py-3 px-4">Email Campaign</td>
                <td className="py-3 px-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Converted</span></td>
                <td className="py-3 px-4">3 days ago</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Contact</button>
                  <button className="text-gray-600 hover:text-gray-800">Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
