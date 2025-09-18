import React from "react";
import Home from "./pages/Home";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Routes, Route} from "react-router-dom";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Refund from "./components/Refund";
import Return from "./components/Return";
// import Products from "./pages/Products";
import Product from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";
import RootProvider from "./context_or_provider/RootProvider";
import {AuthProvider} from "./context_or_provider/AuthContext";
import Profile from "./pages/Profile";
import Login from "./pages/LoginPage";
import ProtectedRoute from "./context_or_provider/ProtectedRoute";
import Checkout from "./components/checkout";
import CheckoutPage from "./pages/CheckoutPage";
import Orderpage from "./pages/Orderpage";
import About from "./components/About";
import CustomerService from "./components/CustomerService";
import Register from "./pages/Register";
import ProfileUpdate from "./components/ProfileUpdate";

// import {CartProvider} from "./context_or_provider/CartContext";

function App() {
    return (
        <h1 className="">
            <AuthProvider>
                <RootProvider>


                    <Routes>
                        <Route path="/login" element={<Login/>}/>

                        {/* Example routes */}
                        <Route path="/" element={<Home/>}/>
                        {/*<Route*/}
                        {/*    path="/"*/}
                        {/*    element={*/}
                        {/*        <ProtectedRoute>*/}
                        {/*            <Home/>*/}
                        {/*        </ProtectedRoute>*/}
                        {/*    }*/}
                        {/*/>*/}
                        <Route path="/products" element={<Product/>}/>
                        <Route path="/products/:id" element={<ProductDetail/>}/>

                        <Route path="/products?category=fish&subcategory=sea" element={<Product/>}/>
                        <Route path="//products?category=fish&subcategory=river" element={<Product/>}/>
                        <Route path="/products?category=mangsho&subcategory=goru" element={<Product/>}/>
                        <Route path="/products?category=mangsho&subcategory=chagol" element={<Product/>}/>
                        <Route path="/products?category=mangsho&subcategory=murgi" element={<Product/>}/>

                        <Route path="/products?category=electronics&subcategory=blender" element={<Product/>}/>
                        <Route path="/products?category=electronics&subcategory=rice-cooker" element={<Product/>}/>
                        <Route path="/products?category=electronics&subcategory=fridge" element={<Product/>}/>
                        <Route path="/products?category=electronics&subcategory=glider" element={<Product/>}/>


                        <Route path="/about" element={<About/>}/>
                        <Route path="/return-policy" element={<Return/>}/>
                        <Route path="/refund-policy" element={<Refund/>}/>
                        <Route path="/customer-service" element={<CustomerService/>}/>
                        <Route path="/contact" element={<Contact/>}/>
                        <Route path="/register" element={<Register/>}/>


                        {/*<div className="flex-grow">*/}
                        {/*    <Routes>*/}
                        {/*        <Route path="/profile" element={<div>Profile Page</div>}/>*/}
                        {/*        <Route path="/cart" element={<Cart/>}/>*/}
                        {/*    </Routes>*/}
                        {/*</div>*/}

                        {/*<Route path="/profile" element={<Profile/>}/>*/}
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Profile/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/profileupdate" element={
                            <ProtectedRoute>
                                <ProfileUpdate/>
                            </ProtectedRoute>
                        }/>


                        {/*<Route path="/cart" element={<Cart/>}/>*/}

                        <Route path="/cart" element={
                            <ProtectedRoute>
                                <Cart/>
                            </ProtectedRoute>
                        }/>

                        <Route path="/checkout" element={
                            <ProtectedRoute>
                                <CheckoutPage/>
                            </ProtectedRoute>
                        }/>

                        <Route path="/order" element={
                            <ProtectedRoute>
                                <Orderpage/>
                            </ProtectedRoute>
                        }/>

                    </Routes>
                </RootProvider>
            </AuthProvider>
        </h1>
    );
}

export default App;
