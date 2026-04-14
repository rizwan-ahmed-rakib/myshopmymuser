import React from "react";
import Topbar from "../myshopcomponents/Topbar";
import Header from "../myshopcomponents/Header";
import Navbar from "../myshopcomponents/Navbar";
import Hero from "../myshopcomponents/Hero";
import Footer from "../myshopcomponents/Footer";
import AllProducts from "./AllProducts";
//import ProductDetails from "./ProductDetails";
const Home = () => {
  return (
    <div>
      <Topbar />
      <Header />
      <Navbar />
      <Hero />
      <AllProducts/>
      <Footer/>
      {/* <ProductDetails/> */}
    </div>
  );
};

export default Home;
