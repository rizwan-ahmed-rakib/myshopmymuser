// // 2. Layout Component (components/Layout.jsx)
// import React from 'react';
// import Sidebar from './Sidebar';
// import Navbar from './Navbar';
//
// const Layout = ({ children }) => {
//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <Sidebar />
//
//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Navbar */}
//         <Navbar />
//
//         {/* Page Content */}
//         <main className="flex-1 p-6 overflow-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };
//
// export default Layout;



import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Sidebar - fixed width, no extra spacing */}
      <Sidebar />

      {/* Main Content Area - takes remaining space */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar - fixed height, no extra margins */}
        <Navbar />

        {/* Page Content - scrollable area with minimal padding */}
        <main className="flex-1 overflow-auto p-1">
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;