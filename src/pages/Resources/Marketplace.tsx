import React, { useState } from 'react';

const Marketplace: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Sample product categories
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'equipment', name: 'Equipment' },
    { id: 'supplies', name: 'Supplies' },
    { id: 'software', name: 'Software' },
    { id: 'education', name: 'Education' },
    { id: 'services', name: 'Services' },
  ];
  
  // Sample products
  const products = [
    {
      id: 1,
      name: 'Digital Intraoral Scanner',
      category: 'equipment',
      price: 15999.99,
      rating: 4.8,
      reviews: 24,
      image: 'scanner.jpg',
      featured: true,
      description: 'High-precision digital scanner for accurate intraoral impressions.'
    },
    {
      id: 2,
      name: 'Patient Management Software',
      category: 'software',
      price: 149.99,
      subscriptionPeriod: 'month',
      rating: 4.6,
      reviews: 56,
      image: 'software.jpg',
      featured: true,
      description: 'Comprehensive patient management solution with scheduling, billing, and records.'
    },
    {
      id: 3,
      name: 'Composite Filling Kit',
      category: 'supplies',
      price: 299.99,
      rating: 4.5,
      reviews: 38,
      image: 'composite.jpg',
      featured: false,
      description: 'Complete kit with various shades for natural-looking restorations.'
    },
    {
      id: 4,
      name: 'Advanced Endodontics Course',
      category: 'education',
      price: 799.99,
      rating: 4.9,
      reviews: 15,
      image: 'course.jpg',
      featured: false,
      description: 'Comprehensive online course covering the latest endodontic techniques.'
    },
    {
      id: 5,
      name: 'Dental Marketing Services',
      category: 'services',
      price: 499.99,
      subscriptionPeriod: 'month',
      rating: 4.7,
      reviews: 29,
      image: 'marketing.jpg',
      featured: false,
      description: 'Full-service marketing solutions specifically for dental practices.'
    },
    {
      id: 6,
      name: 'Dental Chair',
      category: 'equipment',
      price: 4999.99,
      rating: 4.4,
      reviews: 42,
      image: 'chair.jpg',
      featured: false,
      description: 'Ergonomic dental chair with advanced positioning capabilities.'
    },
  ];
  
  // Filter products based on active category
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);
  
  // Featured products
  const featuredProducts = products.filter(product => product.featured);
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Marketplace</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Dental Products & Services</h2>
            <p className="text-gray-600 mb-4">
              Browse our curated marketplace for the best dental equipment, supplies, software, and services.
              All products are vetted for quality and come with exclusive discounts for DentalHub members.
            </p>
            <div className="flex space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Browse Products
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                View Deals
              </button>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center">
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">DentalHub Advantage</h3>
              <p className="text-sm text-gray-600 mb-2">Members save an average of 15% on all marketplace purchases</p>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Product Image</p>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{product.name}</h3>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Featured</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 mb-2">{product.description}</p>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">({product.reviews} reviews)</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold">${product.price.toLocaleString()}</span>
                    {product.subscriptionPeriod && (
                      <span className="text-sm text-gray-500">/{product.subscriptionPeriod}</span>
                    )}
                  </div>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Products</h2>
          <div className="relative">
            <select className="appearance-none bg-gray-100 text-gray-700 px-3 py-1 pr-8 rounded-lg hover:bg-gray-200 focus:outline-none text-sm">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Highest Rated</option>
              <option>Newest</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex mb-4 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Product Image</p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1 mb-2">{product.description}</p>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">({product.reviews} reviews)</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold">${product.price.toLocaleString()}</span>
                    {product.subscriptionPeriod && (
                      <span className="text-sm text-gray-500">/{product.subscriptionPeriod}</span>
                    )}
                  </div>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-center">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
            Load More Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
