import React from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";

const CustomerService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">আমাদের সাথে যোগাযোগ করুন</h1>
            <p className="text-lg text-gray-600">যেকোনো প্রয়োজনে আমরা আপনার পাশে আছি</p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Phone */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-semibold mb-2">ফোন করুন</h3>
              <p className="text-lg text-blue-600 font-bold">১৬২৯৭</p>
              <p className="text-sm text-gray-600 mt-2">সকাল ৯টা - রাত ১০টা</p>
            </div>

            {/* Email */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">✉️</div>
              <h3 className="text-xl font-semibold mb-2">ইমেইল করুন</h3>
              <p className="text-lg text-blue-600 font-bold">myshop.com</p>
              <p className="text-sm text-gray-600 mt-2">২৪ ঘন্টার মধ্যে জবাব</p>
            </div>

            {/* Live Chat */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">লাইভ চ্যাট</h3>
              <p className="text-lg text-blue-600 font-bold">সরাসরি কথা বলুন</p>
              <p className="text-sm text-gray-600 mt-2">সকাল ৯টা - রাত ১০টা</p>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-blue-50 p-6 rounded-lg text-center mb-12">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">জরুরী প্রয়োজন?</h2>
            <p className="text-lg text-blue-700 mb-2">সরাসরি কল করুন</p>
            <p className="text-2xl font-bold text-blue-800">১৬২৯৭</p>
            <p className="text-sm text-blue-600 mt-2">২৪/৭ available</p>
          </div>

          {/* Visit Office */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-semibold mb-2">আমাদের অফিসে আসুন</h3>
            <p className="text-lg text-gray-800">ময়মনসিংহ, বাংলাদেশ</p>
            <p className="text-sm text-gray-600 mt-2">সকাল ৯টা - সন্ধ্যা ৬টা</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerService;