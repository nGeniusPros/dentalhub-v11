import React, { useState } from 'react';

const ContactManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample contacts data
  const contacts = [
    {
      id: 1,
      name: 'John Smith',
      type: 'Patient',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      lastContact: '2 days ago',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      type: 'Patient',
      email: 'sarah.j@example.com',
      phone: '(555) 987-6543',
      lastContact: 'Yesterday',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Michael Brown',
      type: 'Prospect',
      email: 'mbrown@example.com',
      phone: '(555) 456-7890',
      lastContact: '3 days ago',
      status: 'New Lead'
    },
    {
      id: 4,
      name: 'Emily Davis',
      type: 'Patient',
      email: 'emily.d@example.com',
      phone: '(555) 234-5678',
      lastContact: '1 week ago',
      status: 'Inactive'
    },
    {
      id: 5,
      name: 'Robert Wilson',
      type: 'Vendor',
      email: 'rwilson@dentalequip.com',
      phone: '(555) 876-5432',
      lastContact: '2 weeks ago',
      status: 'Active'
    },
    {
      id: 6,
      name: 'Jennifer Lee',
      type: 'Staff',
      email: 'jennifer.lee@example.com',
      phone: '(555) 345-6789',
      lastContact: 'Today',
      status: 'Active'
    },
    {
      id: 7,
      name: 'David Martinez',
      type: 'Insurance',
      email: 'dmartinez@dentalinsure.com',
      phone: '(555) 654-3210',
      lastContact: '5 days ago',
      status: 'Active'
    },
  ];

  // Sample groups data
  const groups = [
    { id: 1, name: 'All Patients', count: 1250 },
    { id: 2, name: 'Active Patients', count: 876 },
    { id: 3, name: 'Inactive Patients', count: 374 },
    { id: 4, name: 'New Leads', count: 42 },
    { id: 5, name: 'Staff Members', count: 18 },
    { id: 6, name: 'Vendors', count: 24 },
    { id: 7, name: 'Insurance Providers', count: 15 },
  ];

  // Sample tags data
  const tags = [
    { id: 1, name: 'VIP', count: 48 },
    { id: 2, name: 'Needs Follow-up', count: 36 },
    { id: 3, name: 'Referral Source', count: 29 },
    { id: 4, name: 'Payment Plan', count: 52 },
    { id: 5, name: 'New Patient', count: 67 },
    { id: 6, name: 'Recall Due', count: 124 },
  ];

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Contact Manager</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'contacts'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('contacts')}
            >
              Contacts
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'groups'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('groups')}
            >
              Groups
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'import'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('import')}
            >
              Import/Export
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'contacts' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Add Contact
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                    Bulk Actions
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search contacts..."
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">Filter By</h3>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Contact Type</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="type-all" className="mr-2" defaultChecked />
                          <label htmlFor="type-all">All</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="type-patient" className="mr-2" />
                          <label htmlFor="type-patient">Patients</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="type-prospect" className="mr-2" />
                          <label htmlFor="type-prospect">Prospects</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="type-staff" className="mr-2" />
                          <label htmlFor="type-staff">Staff</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="type-vendor" className="mr-2" />
                          <label htmlFor="type-vendor">Vendors</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="type-insurance" className="mr-2" />
                          <label htmlFor="type-insurance">Insurance</label>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="status-all" className="mr-2" defaultChecked />
                          <label htmlFor="status-all">All</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="status-active" className="mr-2" />
                          <label htmlFor="status-active">Active</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="status-inactive" className="mr-2" />
                          <label htmlFor="status-inactive">Inactive</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="status-lead" className="mr-2" />
                          <label htmlFor="status-lead">New Lead</label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <span key={tag.id} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm flex items-center">
                            {tag.name}
                            <span className="ml-1 text-xs text-gray-500">({tag.count})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3">
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="py-3 px-4 text-left">
                            <input type="checkbox" />
                          </th>
                          <th className="py-3 px-4 text-left">Name</th>
                          <th className="py-3 px-4 text-left">Type</th>
                          <th className="py-3 px-4 text-left">Email</th>
                          <th className="py-3 px-4 text-left">Phone</th>
                          <th className="py-3 px-4 text-left">Last Contact</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map(contact => (
                          <tr key={contact.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <input type="checkbox" />
                            </td>
                            <td className="py-3 px-4 font-medium">{contact.name}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                contact.type === 'Patient' ? 'bg-blue-100 text-blue-800' :
                                contact.type === 'Prospect' ? 'bg-purple-100 text-purple-800' :
                                contact.type === 'Staff' ? 'bg-green-100 text-green-800' :
                                contact.type === 'Vendor' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {contact.type}
                              </span>
                            </td>
                            <td className="py-3 px-4">{contact.email}</td>
                            <td className="py-3 px-4">{contact.phone}</td>
                            <td className="py-3 px-4">{contact.lastContact}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                contact.status === 'Active' ? 'bg-green-100 text-green-800' :
                                contact.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {contact.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                              <button className="text-gray-600 hover:text-gray-800">View</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-gray-600 text-sm">
                      Showing 1-7 of 1,374 contacts
                    </div>
                    <div className="flex space-x-1">
                      <button className="px-3 py-1 border rounded hover:bg-gray-100">Previous</button>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
                      <button className="px-3 py-1 border rounded hover:bg-gray-100">2</button>
                      <button className="px-3 py-1 border rounded hover:bg-gray-100">3</button>
                      <button className="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'groups' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Create Group
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                    Manage Tags
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search groups..."
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {groups.map(group => (
                  <div key={group.id} className="bg-white border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{group.name}</h3>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {group.count} contacts
                      </span>
                    </div>
                    <div className="flex justify-between mt-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                        <button className="text-gray-600 hover:text-gray-800 text-sm">Edit</button>
                      </div>
                      <button className="text-gray-600 hover:text-gray-800 text-sm">Export</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Smart Groups</h3>
                <p className="text-gray-600 mb-4">
                  Smart groups automatically update based on defined criteria. Create a smart group to automatically categorize contacts.
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Create Smart Group
                </button>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-3">Import Contacts</h3>
                  <p className="text-gray-600 mb-4">
                    Import contacts from a CSV file. Make sure your file has the required columns: Name, Email, Phone, Type, and Status.
                  </p>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select File
                    </label>
                    <input
                      type="file"
                      className="w-full border rounded-md px-3 py-2"
                      accept=".csv"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Import Options
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="update-existing" className="mr-2" defaultChecked />
                        <label htmlFor="update-existing">Update existing contacts</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="skip-duplicates" className="mr-2" />
                        <label htmlFor="skip-duplicates">Skip duplicates</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="send-welcome" className="mr-2" />
                        <label htmlFor="send-welcome">Send welcome email to new contacts</label>
                      </div>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Import Contacts
                  </button>
                </div>

                <div className="bg-white border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-3">Export Contacts</h3>
                  <p className="text-gray-600 mb-4">
                    Export your contacts to a CSV file. You can choose which contacts to export and what information to include.
                  </p>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Contacts
                    </label>
                    <select className="w-full border rounded-md px-3 py-2">
                      <option>All Contacts</option>
                      <option>Active Patients</option>
                      <option>Inactive Patients</option>
                      <option>New Leads</option>
                      <option>Staff Members</option>
                      <option>Vendors</option>
                      <option>Insurance Providers</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Export Options
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="export-basic" className="mr-2" defaultChecked />
                        <label htmlFor="export-basic">Basic Information (Name, Email, Phone)</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="export-address" className="mr-2" defaultChecked />
                        <label htmlFor="export-address">Address Information</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="export-custom" className="mr-2" defaultChecked />
                        <label htmlFor="export-custom">Custom Fields</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="export-notes" className="mr-2" />
                        <label htmlFor="export-notes">Notes and Communication History</label>
                      </div>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Export Contacts
                  </button>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">Import/Export Tips</h3>
                    <p className="text-sm text-gray-600">
                      For best results, download our CSV template before importing contacts. Make sure all required fields are filled out correctly.
                      When exporting sensitive patient information, ensure you\'re complying with HIPAA regulations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactManager;
