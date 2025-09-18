import React, {useState} from "react";
import {useCart} from "../context_or_provider/CartContext";
import {Link, useNavigate} from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const Checkout = () => {
    const {cart, checkout} = useCart(); // ✅ checkout ফাংশন use করবো
    const navigate = useNavigate();

    const [shippingInfo, setShippingInfo] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
    });

    const handleChange = (e) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value,
        });
    };

    const subtotal = cart.reduce(
        (acc, item) => acc + parseFloat(item.total),
        0
    );
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;

    // const handlePlaceOrder = async () => {
    //   if (
    //     !shippingInfo.name ||
    //     !shippingInfo.email ||
    //     !shippingInfo.address
    //   ) {
    //     alert("Please fill all required fields");
    //     return;
    //   }
    //
    //   try {
    //     // ✅ Backend এ order create হবে
    //     const order = await checkout();
    //     console.log("Order created:", order);
    //
    //     alert("Order placed successfully!");
    //     navigate("/order"); // তোমার Orders পেজে redirect করতে পারো
    //   } catch (err) {
    //     console.error("Order error:", err);
    //     alert("Order failed!");
    //   }
    // };


    const handlePlaceOrder = async () => {
        try {
            // 1) order create
            const order = await checkout();
            if (!order || !order.id) {
                alert("Order creation failed");
                return;
            }

            // 2) initiate payment call
            const token = localStorage.getItem("access");
            const headers = {headers: {Authorization: `Bearer ${token}`}};

            const res = await axiosInstance.get(
                `/api/payment-app/orders/${order.id}/initiate_payment/`,
                headers
            );
            console.log(res.data);


            // 3) redirect user to sslcommerz gateway
            const paymentUrl = res.data.payment_url;
            if (paymentUrl) {
                window.location.href = paymentUrl;
            } else {
                alert("Payment URL not received");
            }
        } catch (err) {
            console.error("Payment initiation error:", err.response?.data || err.message);
            alert("Something went wrong in payment process");
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Shipping Info */}
                <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            value={shippingInfo.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <input
                            type="email"
                            name="email"
                            value={shippingInfo.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <input
                            type="text"
                            name="address"
                            value={shippingInfo.address}
                            onChange={handleChange}
                            placeholder="Address"
                            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <input
                            type="text"
                            name="city"
                            value={shippingInfo.city}
                            onChange={handleChange}
                            placeholder="City"
                            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <input
                            type="text"
                            name="postalCode"
                            value={shippingInfo.postalCode}
                            onChange={handleChange}
                            placeholder="Postal Code"
                            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <input
                            type="text"
                            name="country"
                            value={shippingInfo.country}
                            onChange={handleChange}
                            placeholder="Country"
                            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between py-2 items-center"
                            >
                                <span>{item.item_name} x {item.quantity}</span>
                                <span>${item.total}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax (5%):</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
                    >
                        Place Order
                    </button>
                    <Link
                        to="/cart"
                        className="block mt-4 text-center text-orange-500 hover:underline"
                    >
                        Back to Cart
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
