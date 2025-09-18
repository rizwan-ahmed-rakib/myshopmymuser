import React from 'react'

const Topbar = () => {
  return (
    <div className="bg-orange-400 max-w-7xl mx-auto">
      <p className="max-w-7xl mx-auto text-center text-white px-2 py-2 
        text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium">
        আমাদের যে কোন পণ্য অর্ডার করতে কল বা WhatsApp করুন: 
        <span className="block sm:inline"> +880123456789</span> | 
        <span className="block sm:inline"> হট লাইন: 0123456789</span>
      </p>
    </div>
  )
}

export default Topbar
