import React from "react";
import Topbar from "../myshopcomponents/Topbar";
import Header from "../myshopcomponents/Header";
import Navbar from "../myshopcomponents/Navbar";
import Hero from "../myshopcomponents/Hero";
import Footer from "../myshopcomponents/Footer";
import AllProducts from "./AllProducts";
import Checkout from "../myshopcomponents/checkout";
//import ProductDetails from "./ProductDetails";
const CheckoutPage = () => {
  return (
    <div>
      <Topbar />
      <Header />
      <Navbar />
      <Checkout />
      {/*<AllProducts/>*/}
      <Footer/>
      {/* <ProductDetails/> */}
    </div>
  );
};

export default CheckoutPage;
