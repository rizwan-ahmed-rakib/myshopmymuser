import React from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";

const Refund = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">রিফান্ড পলিসি</h1>
            <p className="text-lg text-gray-600">মাইশপ এর রিফান্ড সংক্রান্ত নীতিমালা</p>
          </div>

          {/* Main Content */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            {/* General Information */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">সাধারণ তথ্য</h2>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <p className="ml-3">আপনার রিফান্ড প্রসেসিংয়ের সময় নির্ভর করে রিফান্ডের ধরন এবং আপনি যে পেমেন্ট পদ্ধতি ব্যবহার করেছেন তার উপর।</p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <p className="ml-3">মাইশপ যখন আপনার রিফান্ডের ধরন অনুযায়ী আপনার রিফান্ড প্রক্রিয়া করে তখন থেকে রিফান্ডের সময়/প্রক্রিয়া শুরু হয়।</p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <p className="ml-3">রিফান্ডের পরিমাণ আপনার ফেরত পণ্যের জন্য পণ্যের মূল্য এবং শিপিং ফি কভার করে।</p>
                </div>
              </div>
            </div>

            {/* Refund Types */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">রিফান্ডের ধরণ</h2>
              <p className="text-gray-700 mb-4">মাইশপ নিম্নলিখিত রিফান্ডের ধরন অনুযায়ী আপনার রিফান্ড প্রক্রিয়া করবে।</p>

              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">রিটার্ন থেকে রিফান্ড</h3>
                  <p className="text-gray-700">আপনার আইটেমটি গুদামে ফেরত দেওয়া এবং কিউসি সম্পন্ন হওয়ার পরে রিফান্ড প্রক্রিয়া করা হয়। কীভাবে কোনও জিনিস ফেরত দিতে হয় তা জানতে, আমাদের রিটার্ন পলিসি পড়ুন।</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">বাতিলকৃত অর্ডার থেকে অর্থ ফেরত</h3>
                  <p className="text-gray-700">বাতিলকরণ সফলভাবে প্রক্রিয়া করা হলে স্বয়ংক্রিয়ভাবে অর্থ ফেরত শুরু হয়।</p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-800 mb-2">ব্যর্থ ডেলিভারি থেকে রিফান্ড</h3>
                  <p className="text-gray-700">আইটেমটি বিক্রেতার কাছে পৌঁছে গেলে রিফান্ড প্রক্রিয়া শুরু হয়। দয়া করে মনে রাখবেন যে আপনার শিপিং ঠিকানার এলাকার উপর নির্ভর করে এতে আরও সময় লাগতে পারে।</p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">গুরুত্বপূর্ণ নির্দেশিকা</h2>

              <div className="bg-gray-50 p-5 rounded-lg mb-6">
                <h3 className="font-medium text-gray-800 mb-3">পণ্য ফেরতের শর্তাবলী:</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>পণ্যটি অবশ্যই অব্যবহৃত, অপরিষ্কার, অপরিষ্কার এবং কোনও ত্রুটিবিহীন হতে হবে।</li>
                  <li>পণ্যটিতে অবশ্যই মূল ট্যাগ, ব্যবহারকারীর ম্যানুয়াল, ওয়ারেন্টি কার্ড, বিনামূল্যে উপহার, চালান এবং আনুষঙ্গিক অন্তর্ভুক্ত থাকতে হবে।</li>
                  <li>পণ্যটি অবশ্যই আসল এবং অক্ষত প্রস্তুতকারকের প্যাকেজিং/বাক্সে ফেরত দিতে হবে।</li>
                  <li>যদি পণ্যটি মাইশপ এর প্যাকেজিং/বাক্সে সরবরাহ করা হয়, তবে একই প্যাকেজিং/বাক্সটি ফেরত দিতে হবে।</li>
                  <li>সরাসরি প্রস্তুতকারকের প্যাকেজিং/বাক্সে টেপ বা স্টিকার রাখবেন না।</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-5 rounded-lg">
                <h3 className="font-medium text-orange-800 mb-3">মনে রাখবেন:</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>আপনার রিটার্ন প্যাকেজে অর্ডার নম্বর এবং রিটার্ন ট্র্যাকিং নম্বর উল্লেখ করা গুরুত্বপূর্ণ যাতে আপনার রিটার্ন প্রক্রিয়ায় কোনও অসুবিধা/বিলম্ব এড়ানো যায়।</li>
                  <li>আপনার প্যাকেজটি ড্রপ-অফ স্টেশন/পিকআপ এজেন্টের কাছে হস্তান্তর করার সময়, দয়া করে মাইশপের রিটার্ন স্বীকৃতি পত্রটি সংগ্রহ করুন এবং ভবিষ্যতের রেফারেন্সের জন্য সংরক্ষণ করুন।</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Support Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">আরও সাহায্যের প্রয়োজন?</p>
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

export default Refund;