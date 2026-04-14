import React from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />

      <div className="flex-1 bg-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-8">
            {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">ঘরেরবাজার সম্পর্কে</h1> */}
            <p className="text-gray-600">আমাদের গল্প এবং লক্ষ্য</p>
          </div>

          {/* Main Content */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">আমরা কারা?</h2>
            <p className="text-gray-700 mb-4">
              মাইশপ  হল একটি বিশ্বস্ত অনলাইন মার্কেটপ্লেস যেখানে আপনি পেতে পারেন তাজা মাছ, মাংস,
               এবং আমরা প্রতিদিন গ্রাহকের সেবা করছি।
            </p>
            <p className="text-gray-700">
              আমাদের লক্ষ্য হলো আপনার দোরগোড়ায় পৌঁছে দেয়া সহজে এবং দ্রুত।
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🚚 দ্রুত ডেলিভারি</h3>
              <p className="text-sm text-gray-700">অর্ডার দেয়ার 3 ঘন্টার মধ্যে হোম ডেলিভারি</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🎯 তাজা পণ্য</h3>
              <p className="text-sm text-gray-700">সরাসরি উৎস থেকে তাজা পণ্য সংগ্রহ</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">💳 সহজ পেমেন্ট</h3>
              <p className="text-sm text-gray-700">বিকাশ, নগদ, কার্ড সহ পেমেন্ট </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">📞 ২৪/৭ support</h3>
              <p className="text-sm text-gray-700">যেকোনো সমস্যায় যোগাযোগ করুন</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-4">আমাদের সাথে যোগাযোগ</h2>
            <p className="text-gray-700 mb-2">📧 ইমেইল: myshop.com</p>
            <p className="text-gray-700 mb-2">📞 ফোন: ১৬২৯৭</p>
            <p className="text-gray-700">📍 ঠিকানা: ময়মনসিংহ, বাংলাদেশ</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;