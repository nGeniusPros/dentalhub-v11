import React from 'react';

const SocialMedia: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Social Media</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Create Post
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
              Content Calendar
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
              Analytics
            </button>
          </div>
          <div className="relative">
            <select className="appearance-none bg-gray-100 text-gray-700 px-4 py-2 pr-8 rounded-lg hover:bg-gray-200 focus:outline-none">
              <option>All Platforms</option>
              <option>Facebook</option>
              <option>Instagram</option>
              <option>Twitter</option>
              <option>LinkedIn</option>
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
            <h3 className="font-semibold text-blue-800 mb-2">Total Followers</h3>
            <p className="text-3xl font-bold">12,456</p>
            <p className="text-sm text-green-600 mt-1">+5.2% this month</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">Engagement Rate</h3>
            <p className="text-3xl font-bold">4.8%</p>
            <p className="text-sm text-green-600 mt-1">+0.3% this month</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h3 className="font-semibold text-yellow-800 mb-2">Posts This Month</h3>
            <p className="text-3xl font-bold">24</p>
            <p className="text-sm text-green-600 mt-1">+4 vs last month</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2">Website Referrals</h3>
            <p className="text-3xl font-bold">342</p>
            <p className="text-sm text-green-600 mt-1">+12.5% this month</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Platform Performance</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-4 text-left">Platform</th>
                  <th className="py-3 px-4 text-left">Followers</th>
                  <th className="py-3 px-4 text-left">Posts</th>
                  <th className="py-3 px-4 text-left">Engagement</th>
                  <th className="py-3 px-4 text-left">Referrals</th>
                  <th className="py-3 px-4 text-left">Growth</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </div>
                      <span>Facebook</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">5,248</td>
                  <td className="py-3 px-4">12</td>
                  <td className="py-3 px-4">3.8%</td>
                  <td className="py-3 px-4">156</td>
                  <td className="py-3 px-4">
                    <span className="text-green-600">+2.4%</span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white mr-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </div>
                      <span>Instagram</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">4,125</td>
                  <td className="py-3 px-4">18</td>
                  <td className="py-3 px-4">5.2%</td>
                  <td className="py-3 px-4">98</td>
                  <td className="py-3 px-4">
                    <span className="text-green-600">+4.8%</span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white mr-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </div>
                      <span>Twitter</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">2,583</td>
                  <td className="py-3 px-4">24</td>
                  <td className="py-3 px-4">2.9%</td>
                  <td className="py-3 px-4">45</td>
                  <td className="py-3 px-4">
                    <span className="text-green-600">+1.2%</span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white mr-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </div>
                      <span>LinkedIn</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">1,500</td>
                  <td className="py-3 px-4">8</td>
                  <td className="py-3 px-4">4.1%</td>
                  <td className="py-3 px-4">43</td>
                  <td className="py-3 px-4">
                    <span className="text-green-600">+3.5%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Upcoming Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Post Preview</p>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">Scheduled for Apr 25, 2023</span>
                </div>
                <h3 className="font-semibold mb-2">Spring Cleaning Special</h3>
                <p className="text-sm text-gray-600 mb-2">Get your smile ready for spring with our special cleaning offer!</p>
                <button className="text-blue-600 hover:text-blue-800 text-sm">Edit Post</button>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Post Preview</p>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white mr-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">Scheduled for Apr 27, 2023</span>
                </div>
                <h3 className="font-semibold mb-2">Meet Our New Hygienist</h3>
                <p className="text-sm text-gray-600 mb-2">We\'re excited to welcome Sarah to our dental team!</p>
                <button className="text-blue-600 hover:text-blue-800 text-sm">Edit Post</button>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Post Preview</p>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center text-white mr-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">Scheduled for May 1, 2023</span>
                </div>
                <h3 className="font-semibold mb-2">Dental Tips for Professionals</h3>
                <p className="text-sm text-gray-600 mb-2">5 ways to maintain your oral health during busy workdays.</p>
                <button className="text-blue-600 hover:text-blue-800 text-sm">Edit Post</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;
