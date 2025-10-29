import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white ">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section */}
        <div>
          {/*<h2 className="text-2xl font-bold text-orange-600">MYSHOP</h2>*/}
          <h2 className="text-2xl font-bold text-green-600">MYSHOP</h2>
          <p className="mt-3 text-sm text-gray-700">
            {/*MyShop is your trusted destination for quality and affordable*/}
            {/*products. We provide fresh groceries, electronics, household items*/}
            {/*and more with a focus on customer satisfaction and convenience.*/}

           মাইশপ হল আপনার বিশ্বস্ত গন্তব্যস্থল, মানসম্পন্ন এবং সাশ্রয়ী মূল্যের পণ্যের জন্য। আমরা গ্রাহক সন্তুষ্টি এবং সুবিধার উপর জোর দিয়ে তাজা মুদি, ইলেকট্রনিক্স, গৃহস্থালীর জিনিসপত্র এবং আরও অনেক কিছু সরবরাহ করি।
          </p>
        </div>

        {/* Company Links */}
        <div>
          {/*<h3 className="text-lg font-semibold text-orange-600 mb-3">COMPANY</h3>*/}
          <h3 className="text-lg font-semibold text-green-600 mb-3">COMPANY</h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              {/*<Link to="/about" className="hover:text-orange-500">*/}
              <Link to="/about" className="hover:text-green-500">
                About Us
              </Link>
            </li>
            <li>
              {/*<Link to="/return-policy" className="hover:text-orange-500">*/}
              <Link to="/return-policy" className="hover:text-green-500">
                রিটার্ন পলিসি
              </Link>
            </li>
            <li>
              {/*<Link to="/refund-policy" className="hover:text-orange-500">*/}
              <Link to="/refund-policy" className="hover:text-green-500">
                রিফান্ড পলিসি
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Help Links */}
        <div>
          {/*<h3 className="text-lg font-semibold text-orange-600 mb-3">QUICK HELP</h3>*/}
          <h3 className="text-lg font-semibold text-green-600 mb-3">QUICK HELP</h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              {/*<Link to="/customer-service" className="hover:text-orange-500">*/}
              <Link to="/customer-service" className="hover:text-green-500">
                গ্রাহক সেবা
              </Link>
            </li>
            <li>
              {/*<Link to="/contact" className="hover:text-orange-500">*/}
              <Link to="/contact" className="hover:text-green-500">
                Contact
              </Link>
            </li>
          </ul>
          <p className="mt-4 text-sm font-medium text-black">
            {/*DBID ID : 123456789*/}
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      {/*<div className= "max-w-7xl mx-auto bg-orange-500 text-white text-center py-3 text-sm">*/}
      <div className= "max-w-7xl mx-auto bg-green-500 text-white text-center py-3 text-sm">
        © MyShop 2025
        <p>developed by <a href={"https://codeshade.agency/"}>codeshade.agency</a></p>
      </div>
    </footer>
  );
};

export default Footer;
