import React from 'react'
import Navbar from '../myshopcomponents/Navbar'
import Header from '../myshopcomponents/Header'
import Footer from '../myshopcomponents/Footer'
import ProductDetails from './ProductDetails'
import PopularProducts from "../myshopcomponents/PopularProducts";

const ProductDetail = () => {
    return (
        <div>
            <Header/>
            <Navbar/>
            <ProductDetails/>
            <PopularProducts/>
            <Footer/>
        </div>
    )
}

export default ProductDetail
