import React from 'react'
import Header from '../myshopcomponents/Header'
import Navbar from '../myshopcomponents/Navbar'
import Footer from '../myshopcomponents/Footer'
import GuestCheckout from "../myshopcomponents/GuestCheckout";
// import Products from './Products'
const GuestCheckoutPage = () => {
  return (
    <div>
      <Header/>
      <Navbar/>
      <GuestCheckout/>
      <Footer/>
    </div>
  )
}

export default GuestCheckoutPage
