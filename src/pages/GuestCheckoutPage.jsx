import React from 'react'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GuestCheckout from "../components/GuestCheckout";
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
