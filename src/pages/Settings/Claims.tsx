import React, { useState } from 'react';

const Claims: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample claims data
  const pendingClaims = [
    {
      id: 'CLM-1234',
      patient: 'John Smith',
      provider: 'Delta Dental',
      service: 'Root Canal',
      amount: 850.00,
      submitted: 'Apr 10, 2023',
      status: 'Pending',
      days: 5
    },
    {
      id: 'CLM-1235',
      patient: 'Sarah Johnson',
      provider: 'Aetna',
      service: 'Crown',
      amount: 1200.00,
      submitted: 'Apr 8, 2023',
      status: 'Pending',
      days: 7
    },
    {
      id: 'CLM-1236',
      patient: 'Michael Brown',
      provider: 'Cigna',
      service: 'Extraction',
      amount: 350.00,
      submitted: 'Apr 12, 2023',
      status: 'Pending',
      days: 3
    },
    {
      id: 'CLM-1237',
      patient: 'Emily Davis',
      provider: 'MetLife',
      service: 'Cleaning',
      amount: 120.00,
      submitted: 'Apr 5, 2023',
      status: 'Pending',
      days: 10
    },
    {
      id: 'CLM-1238',
      patient: 'Robert Wilson',
      provider: 'Guardian',
      service: 'Filling',
      amount: 250.00,
      submitted: 'Apr 11, 2023',
      status: 'Pending',
      days: 4
    },
  ];
  
  const approvedClaims = [
    {
      id: 'CLM-1224',
      patient: 'Jennifer Lee',
      provider: 'Delta Dental',
      service: 'Cleaning',
      amount: 120.00,
      submitted: 'Mar 28, 2023',
      approved: 'Apr 5, 2023',
      payment: 96.00,
      status: 'Approved'
    },
    {
      id: 'CLM-1225',
      patient: 'David Martinez',
      provider: 'Aetna',
      service: 'Filling',
      amount: 250.00,
      submitted: 'Mar 25, 2023',
      approved: 'Apr 2, 2023',
      payment: 200.00,
      status: 'Approved'
    },
    {
      id: 'CLM-1226',
      patient: 'Lisa Thompson',
      provider: 'Cigna',
      service: 'X-Ray',
      amount: 180.00,
      submitted: 'Mar 30, 2023',
      approved: 'Apr 8, 2023',
      payment: 144.00,
      status: 'Approved'
    },
  ];
  
  const deniedClaims = [
    {
      id: 'CLM-1214',
      patient: 'Thomas Anderson',
      provider: 'MetLife',
      service: 'Orthodontics',
      amount: 3500.00,
      submitted: 'Mar 15, 2023',
      denied: 'Mar 28, 2023',
      reason: 'Service not covered under plan',
      status: 'Denied'
    },
    {
      id: 'CLM-1215',
      patient: 'Amanda Clark',
      provider: 'Guardian',
      service: 'Whitening',
      amount: 350.00,
      submitted: 'Mar 20, 2023',
      denied: 'Apr 1, 2023',
      reason: 'Cosmetic procedure not covered',
      status: 'Denied'
    },
  ];
  
  // Sample insurance providers data
  const insuranceProviders = [
    { id: 1, name: 'Delta Dental', claims: 42, avgProcessing: 8 },
    { id: 2, name: 'Aetna', claims: 36, avgProcessing: 10 },
    { id: 3, name: 'Cigna', claims: 28, avgProcessing: 7 },
    { id: 4, name: 'MetLife', claims: 24, avgProcessing: 12 },
    { id: 5, name: 'Guardian', claims: 18, avgProcessing: 9 },
  ];
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Claims Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-2">Total Claims</h3>
          <p className="text-3xl font-bold">148</p>
          <p className="text-sm text-green-600 mt-1">+12 this month</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <h3 className="font-semibold text-yellow-800 mb-2">Pending Claims</h3>
          <p className="text-3xl font-bold">24</p>
          <p className="text-sm text-yellow-600 mt-1">Avg. 7 days pending</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="font-semibold text-green-800 mb-2">Approved Claims</h3>
          <p className="text-3xl font-bold">112</p>
          <p className="text-sm text-green-600 mt-1">85% approval rate</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 className="font-semibold text-red-800 mb-2">Denied Claims</h3>
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm text-red-600 mt-1">9% denial rate</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'pending'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Claims
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'approved'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('approved')}
            >
              Approved Claims
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'denied'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('denied')}
            >
              Denied Claims
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'analytics'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                New Claim
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                Batch Actions
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search claims..."
                className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
          
          {activeTab === 'pending' && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-3 px-4 text-left">Claim ID</th>
                    <th className="py-3 px-4 text-left">Patient</th>
                    <th className="py-3 px-4 text-left">Insurance</th>
                    <th className="py-3 px-4 text-left">Service</th>
                    <th className="py-3 px-4 text-left">Amount</th>
                    <th className="py-3 px-4 text-left">Submitted</th>
                    <th className="py-3 px-4 text-left">Days Pending</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingClaims.map(claim => (
                    <tr key={claim.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{claim.id}</td>
                      <td className="py-3 px-4">{claim.patient}</td>
                      <td className="py-3 px-4">{claim.provider}</td>
                      <td className="py-3 px-4">{claim.service}</td>
                      <td className="py-3 px-4">${claim.amount.toFixed(2)}</td>
                      <td className="py-3 px-4">{claim.submitted}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          claim.days > 7 ? 'bg-red-100 text-red-800' :
                          claim.days > 3 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {claim.days} days
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                          {claim.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">Follow Up</button>
                        <button className="text-gray-600 hover:text-gray-800">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'approved' && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-3 px-4 text-left">Claim ID</th>
                    <th className="py-3 px-4 text-left">Patient</th>
                    <th className="py-3 px-4 text-left">Insurance</th>
                    <th className="py-3 px-4 text-left">Service</th>
                    <th className="py-3 px-4 text-left">Billed Amount</th>
                    <th className="py-3 px-4 text-left">Approved Amount</th>
                    <th className="py-3 px-4 text-left">Submitted</th>
                    <th className="py-3 px-4 text-left">Approved</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedClaims.map(claim => (
                    <tr key={claim.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{claim.id}</td>
                      <td className="py-3 px-4">{claim.patient}</td>
                      <td className="py-3 px-4">{claim.provider}</td>
                      <td className="py-3 px-4">{claim.service}</td>
                      <td className="py-3 px-4">${claim.amount.toFixed(2)}</td>
                      <td className="py-3 px-4">${claim.payment.toFixed(2)}</td>
                      <td className="py-3 px-4">{claim.submitted}</td>
                      <td className="py-3 px-4">{claim.approved}</td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">Receipt</button>
                        <button className="text-gray-600 hover:text-gray-800">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'denied' && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-3 px-4 text-left">Claim ID</th>
                    <th className="py-3 px-4 text-left">Patient</th>
                    <th className="py-3 px-4 text-left">Insurance</th>
                    <th className="py-3 px-4 text-left">Service</th>
                    <th className="py-3 px-4 text-left">Amount</th>
                    <th className="py-3 px-4 text-left">Submitted</th>
                    <th className="py-3 px-4 text-left">Denied</th>
                    <th className="py-3 px-4 text-left">Reason</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deniedClaims.map(claim => (
                    <tr key={claim.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{claim.id}</td>
                      <td className="py-3 px-4">{claim.patient}</td>
                      <td className="py-3 px-4">{claim.provider}</td>
                      <td className="py-3 px-4">{claim.service}</td>
                      <td className="py-3 px-4">${claim.amount.toFixed(2)}</td>
                      <td className="py-3 px-4">{claim.submitted}</td>
                      <td className="py-3 px-4">{claim.denied}</td>
                      <td className="py-3 px-4">{claim.reason}</td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">Appeal</button>
                        <button className="text-gray-600 hover:text-gray-800">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Claims by Status</h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Claims status chart will be displayed here</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Claims by Insurance Provider</h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Insurance provider chart will be displayed here</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Insurance Provider Performance</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="py-3 px-4 text-left">Insurance Provider</th>
                      <th className="py-3 px-4 text-left">Total Claims</th>
                      <th className="py-3 px-4 text-left">Avg. Processing Time (days)</th>
                      <th className="py-3 px-4 text-left">Approval Rate</th>
                      <th className="py-3 px-4 text-left">Reimbursement Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insuranceProviders.map(provider => (
                      <tr key={provider.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{provider.name}</td>
                        <td className="py-3 px-4">{provider.claims}</td>
                        <td className="py-3 px-4">{provider.avgProcessing}</td>
                        <td className="py-3 px-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${85 - provider.id * 3}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-600">{85 - provider.id * 3}%</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${80 - provider.id * 2}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-600">{80 - provider.id * 2}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
            <h3 className="font-semibold text-blue-800 mb-1">Claims Processing Tips</h3>
            <p className="text-sm text-gray-600">
              For faster claims processing, ensure all patient information is accurate and complete before submission.
              Follow up on pending claims after 7 days. For denied claims, review the reason carefully before submitting an appeal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Claims;
