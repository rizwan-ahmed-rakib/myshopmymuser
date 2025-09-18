import React from "react";
import Topbar from "../components/Topbar";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import AllProducts from "./AllProducts";
import Checkout from "../components/checkout";
import Orders from "../components/order";
//import ProductDetails from "./ProductDetails";
const CheckoutPage = () => {
    return (
        <div>
            <Topbar/>
            <Header/>
            <Navbar/>
            <Orders/>
            {/*<Checkout />*/}
            {/*<AllProducts/>*/}
            <Footer/>
            {/* <ProductDetails/> */}
        </div>
    );
};

export default CheckoutPage;
