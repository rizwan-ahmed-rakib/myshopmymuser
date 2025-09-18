import React from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";

const Return = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">পণ্য ফেরত নীতিমালা</h1>
            <p className="text-lg text-gray-600">ঘরেরবাজার এর পণ্য ফেরত সংক্রান্ত নীতিমালা</p>
          </div>

          {/* Main Content */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            {/* General Information */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">সাধারণ তথ্য</h2>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <span className="text-blue-600 font-bold">!</span>
                  </div>
                  <p className="ml-3">ডেলিভারির সময় পণ্য যদি ক্ষতিগ্রস্ত, ত্রুটিপূর্ণ, ভুল বা অসম্পূর্ণ হয়, তাহলে রিটার্ন বা রিফান্ডের জন্য আমাদের কাস্টমার সার্ভিসের সাথে যোগাযোগ করুন।</p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <span className="text-blue-600 font-bold">!</span>
                  </div>
                  <p className="ml-3">পন্য গ্রহনের ৭ দিনের মধ্যেই পন্য রিটার্ন করে ব্যাংক পেমেন্ট, বিকাশ অথবা ভাউচার এর মাধ্যমে বুঝে নিন রিফান্ড। রির্টান পলিসি সম্পর্কে আরও তথ্যের জন্য, দয়া করে আমাদের পন্য ফেরত নীতিমালা দেখুন।</p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <span className="text-blue-600 font-bold">!</span>
                  </div>
                  <p className="ml-3">নির্বাচিত কিছু পন্যে আপনার সিধান্ত পরিবর্তনকে অগ্রাধিকার দেয়া হয়। বিস্তারিত তথ্যের জন্য অনুগ্রহ করে রিটার্ন পলিসির নিচের অংশ দেখুন।</p>
                </div>
              </div>
            </div>

            {/* Valid Reasons for Return */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">পণ্য ফেরত দেওয়ার বৈধ কারণ</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mr-2">
                      <span className="text-red-600 font-bold">✕</span>
                    </div>
                    <h3 className="font-medium text-red-800">পণ্য ক্ষতিগ্রস্ত হলে</h3>
                  </div>
                  <p className="text-gray-700 text-sm">(ফাটা/ভাঙা)/ত্রুটিপূর্ণ</p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                      <span className="text-yellow-600 font-bold">!</span>
                    </div>
                    <h3 className="font-medium text-yellow-800">পণ্য অসম্পূর্ণ থাকলে</h3>
                  </div>
                  <p className="text-gray-700 text-sm">(যদি কোন পন্য পরিমানে কম থাকে)</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <span className="text-blue-600 font-bold">↺</span>
                    </div>
                    <h3 className="font-medium text-blue-800">ভুল পণ্য ডেলিভারি</h3>
                  </div>
                  <p className="text-gray-700 text-sm">(ভুল পণ্য/আকার/রঙ, অথবা মেয়াদ উত্তীর্ণ)</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                      <span className="text-purple-600 font-bold">🔍</span>
                    </div>
                    <h3 className="font-medium text-purple-800">বিজ্ঞাপনের সাথে অমিল</h3>
                  </div>
                  <p className="text-gray-700 text-sm">(ডেলিভার করা পণ্যটি যদি পণ্যের বিবরণ বা ছবির সাথে না মেলে)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Process Info */}
          <div className="mt-8 bg-green-50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4">রিটার্ন প্রক্রিয়া</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <h3 className="font-medium text-green-800">যোগাযোগ করুন</h3>
                <p className="text-sm text-gray-700 mt-1">৭ দিনের মধ্যে আমাদের সাথে যোগাযোগ করুন</p>
              </div>

              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-medium text-green-800">পণ্য ফেরত দিন</h3>
                <p className="text-sm text-gray-700 mt-1">পণ্য এবং সকল আনুষঙ্গিক জিনিস ফেরত দিন</p>
              </div>

              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h3 className="font-medium text-green-800">রিফান্ড পান</h3>
                <p className="text-sm text-gray-700 mt-1">বিকাশ, ব্যাংক বা ভাউচার এর মাধ্যমে রিফান্ড পান</p>
              </div>
            </div>
          </div>

          {/* Support Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">রিটার্ন সম্পর্কিত কোন প্রশ্ন আছে?</p>
            <button className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              সহায়তা কেন্দ্রে যোগাযোগ করুন
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Return;