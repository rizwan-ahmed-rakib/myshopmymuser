import React from 'react';

const FeatureBanner = () => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Safe Payment Feature */}
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Safe Payment</h3>
            <p className="text-gray-600">Secure encrypted transactions with multiple payment options</p>
          </div>
          
          {/* Green Delivery Feature */}
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Green Delivery</h3>
            <p className="text-gray-600">Eco-friendly packaging and carbon-neutral delivery options</p>
          </div>
          
          {/* 100% Organic Feature */}
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-amber-100 p-4 rounded-full mb-4">
              <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">100% Organic</h3>
            <p className="text-gray-600">Certified organic products with no artificial additives</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default FeatureBanner;