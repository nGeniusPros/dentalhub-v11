import React, { useState } from 'react';

const KnowledgeBase: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample categories and articles
  const categories = [
    { id: 1, name: 'Clinical Procedures', count: 24 },
    { id: 2, name: 'Patient Care', count: 18 },
    { id: 3, name: 'Office Management', count: 15 },
    { id: 4, name: 'Insurance & Billing', count: 12 },
    { id: 5, name: 'Equipment & Supplies', count: 9 },
    { id: 6, name: 'Staff Training', count: 7 },
  ];
  
  const articles = [
    { 
      id: 1, 
      title: 'Complete Guide to Digital Impressions', 
      category: 'Clinical Procedures',
      excerpt: 'Learn how to efficiently take digital impressions and improve patient experience.',
      date: 'Apr 10, 2023',
      views: 245
    },
    { 
      id: 2, 
      title: 'Best Practices for Patient Communication', 
      category: 'Patient Care',
      excerpt: 'Effective communication strategies to improve patient satisfaction and outcomes.',
      date: 'Apr 5, 2023',
      views: 189
    },
    { 
      id: 3, 
      title: 'Insurance Verification Workflow', 
      category: 'Insurance & Billing',
      excerpt: 'Streamline your insurance verification process with this step-by-step guide.',
      date: 'Mar 28, 2023',
      views: 156
    },
    { 
      id: 4, 
      title: 'Sterilization Protocol Updates', 
      category: 'Clinical Procedures',
      excerpt: 'Latest updates to sterilization protocols based on current guidelines.',
      date: 'Mar 22, 2023',
      views: 203
    },
    { 
      id: 5, 
      title: 'Staff Onboarding Checklist', 
      category: 'Staff Training',
      excerpt: 'Comprehensive checklist for onboarding new dental staff members.',
      date: 'Mar 15, 2023',
      views: 132
    },
  ];
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Knowledge Base</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-xl font-semibold mb-2">How can we help you today?</h2>
          <p className="text-gray-600 mb-4">Search our knowledge base for articles, guides, and best practices</p>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for articles, topics, or keywords..."
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
            <svg className="w-10 h-10 mx-auto text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="font-semibold mb-1">Clinical Resources</h3>
            <p className="text-sm text-gray-600">Procedures, protocols, and best practices</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
            <svg className="w-10 h-10 mx-auto text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="font-semibold mb-1">Patient Management</h3>
            <p className="text-sm text-gray-600">Communication, care, and satisfaction</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-center">
            <svg className="w-10 h-10 mx-auto text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h3 className="font-semibold mb-1">Business Operations</h3>
            <p className="text-sm text-gray-600">Billing, insurance, and office management</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-lg mb-3">Categories</h3>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category.id}>
                  <a href="#" className="flex justify-between items-center text-gray-700 hover:text-blue-600">
                    <span>{category.name}</span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{category.count}</span>
                  </a>
                </li>
              ))}
            </ul>
            
            <h3 className="font-semibold text-lg mt-6 mb-3">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">Digital</span>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">Patient Care</span>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">Insurance</span>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">Sterilization</span>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">Training</span>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">Billing</span>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">Equipment</span>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Latest Articles</h3>
              <div className="relative">
                <select className="appearance-none bg-gray-100 text-gray-700 px-3 py-1 pr-8 rounded-lg hover:bg-gray-200 focus:outline-none text-sm">
                  <option>Most Recent</option>
                  <option>Most Viewed</option>
                  <option>Alphabetical</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {articles.map(article => (
                <div key={article.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-blue-600 hover:text-blue-800 mb-1">
                        <a href="#">{article.title}</a>
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">{article.excerpt}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">{article.category}</span>
                        <span className="mr-2">Published: {article.date}</span>
                        <span>{article.views} views</span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                View All Articles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
