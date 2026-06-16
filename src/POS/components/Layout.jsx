//
//
//
// import React from 'react';
// import Sidebar from './Sidebar';
// import Navbar from './Navbar';
//
// const Layout = ({ children }) => {
//   return (
//     <div className="flex h-screen w-full overflow-hidden bg-gray-50">
//       {/* Sidebar - fixed width, no extra spacing */}
//       <Sidebar />
//
//       {/* Main Content Area - takes remaining space */}
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         {/* Navbar - fixed height, no extra margins */}
//         <Navbar />
//
//         {/* Page Content - scrollable area with minimal padding */}
//         <main className="flex-1 overflow-auto p-1">
//           <div className="w-full h-full">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };
//
// export default Layout;


import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  // মোবাইল স্ক্রিনে সাইডবার ওপেন/ক্লোজ করার জন্য স্টেট
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Sidebar - স্টেট এবং সেট-স্টেট প্রপ্স হিসেবে পাস করা হয়েছে */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area - takes remaining space */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar - বাটনে ক্লিক করলে যেন সাইডবার ওপেন হয় তার অ্যাকশন পাস করা হয়েছে */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

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