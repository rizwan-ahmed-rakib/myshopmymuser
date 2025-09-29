// import React, { useState, useEffect } from "react";
// import { useCart } from "../context_or_provider/CartContext";
// import { Link, useNavigate } from "react-router-dom";
// import axiosInstance from "../api/axiosInstance";
//
// const Checkout = () => {
//     const { cart, checkout } = useCart();
//     const navigate = useNavigate();
//
//     const [billingAddress, setBillingAddress] = useState(null);
//     const [shippingInfo, setShippingInfo] = useState({
//         name: "",
//         email: "",
//         phone: "",
//         address: "",
//         city: "",
//         postalCode: "",
//         country: "",
//     });
//     const [paymentMethod, setPaymentMethod] = useState("COD");
//     const [deliveryType, setDeliveryType] = useState("HOME_DELIVERY");
//     const [showConfirm, setShowConfirm] = useState(false);
//
//     // subtotal & total
//     const subtotal = cart.reduce((acc, item) => acc + parseFloat(item.total), 0);
//     const tax = subtotal * 0.05;
//     const total = subtotal + tax;
//
//     useEffect(() => {
//         // fetch billing address & prefill
//         const fetchBilling = async () => {
//             try {
//                 const token = localStorage.getItem("access");
//                 const headers = { headers: { Authorization: `Bearer ${token}` } };
//                 const res = await axiosInstance.get("/api/payment-app/shipping-address/", headers);
//                 if (res.data.length > 0) {
//                     const defaultAddr = res.data[0];
//                     setBillingAddress(defaultAddr);
//                     setShippingInfo({
//                         name: defaultAddr.name || "",
//                         email: defaultAddr.email || "",
//                         phone: defaultAddr.phone || "",
//                         address: defaultAddr.address || "",
//                         city: defaultAddr.city || "",
//                         postalCode: defaultAddr.zipcode || "",
//                         country: defaultAddr.country || "",
//                     });
//                 }
//             } catch (err) {
//                 console.error("Billing fetch error:", err);
//             }
//         };
//         fetchBilling();
//     }, []);
//
//     const handleChange = (e) => {
//         setShippingInfo({...shippingInfo, [e.target.name]: e.target.value});
//     };
//
//     const handlePlaceOrder = () => {
//         // check required fields
//         if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address) {
//             alert("Please fill all required shipping fields");
//             return;
//         }
//         setShowConfirm(true);
//     };
//
//     const confirmOrder = async () => {
//         setShowConfirm(false);
//
//         try {
//             const orderPayload = {
//                 ...shippingInfo,
//                 order_type: paymentMethod,
//                 delivery_type: deliveryType,
//             };
//
//             const order = await checkout(orderPayload);
//
//             if (!order || !order.id) {
//                 alert("Order creation failed");
//                 return;
//             }
//
//             // Online payment redirect
//             if (paymentMethod === "ONLINE") {
//                 const token = localStorage.getItem("access");
//                 const headers = { headers: { Authorization: `Bearer ${token}` } };
//                 const res = await axiosInstance.get(
//                     `/api/payment-app/orders/${order.id}/initiate_payment/`,
//                     headers
//                 );
//                 if (res.data.payment_url) {
//                     window.location.href = res.data.payment_url;
//                 } else {
//                     alert("Payment URL not received");
//                 }
//             } else {
//                 alert("Order placed successfully! Cash on Delivery selected.");
//                 navigate("/order");
//             }
//
//         } catch (err) {
//             console.error("Checkout error:", err.response?.data || err.message);
//             alert("Something went wrong while placing order");
//         }
//     };
//
//     return (
//         <div className="max-w-5xl mx-auto py-10 px-4">
//             <h1 className="text-3xl font-bold mb-6">Checkout</h1>
//             <div className="grid md:grid-cols-2 gap-8">
//                 {/* Shipping Info */}
//                 <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
//                     <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
//                     {["name", "email", "phone", "address", "city", "postalCode", "country"].map((field) => (
//                         <input
//                             key={field}
//                             type={field==="email"?"email":"text"}
//                             name={field}
//                             value={shippingInfo[field]}
//                             onChange={handleChange}
//                             placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
//                             className="w-full border px-3 py-2 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                         />
//                     ))}
//
//                     <h2 className="text-xl font-semibold mt-4 mb-2">Payment Method</h2>
//                     <div className="space-x-4">
//                         <label>
//                             <input type="radio" value="COD" checked={paymentMethod==="COD"} onChange={(e)=>setPaymentMethod(e.target.value)} className="mr-2"/>
//                             Cash on Delivery
//                         </label>
//                         <label>
//                             <input type="radio" value="ONLINE" checked={paymentMethod==="ONLINE"} onChange={(e)=>setPaymentMethod(e.target.value)} className="mr-2"/>
//                             Online Payment
//                         </label>
//                     </div>
//
//                     <h2 className="text-xl font-semibold mt-4 mb-2">Delivery Type</h2>
//                     <div className="space-x-4">
//                         <label>
//                             <input type="radio" value="HOME_DELIVERY" checked={deliveryType==="HOME_DELIVERY"} onChange={(e)=>setDeliveryType(e.target.value)} className="mr-2"/>
//                             Home Delivery
//                         </label>
//                         <label>
//                             <input type="radio" value="STORE_PICKUP" checked={deliveryType==="STORE_PICKUP"} onChange={(e)=>setDeliveryType(e.target.value)} className="mr-2"/>
//                             Store Pickup
//                         </label>
//                     </div>
//                 </div>
//
//                 {/* Order Summary */}
//                 <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
//                     <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//                     <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                         {cart.map(item=>(
//                             <div key={item.id} className="flex justify-between py-2 items-center">
//                                 <span>{item.item_name} x {item.quantity}</span>
//                                 <span>${item.total}</span>
//                             </div>
//                         ))}
//                     </div>
//                     <div className="mt-4 space-y-2">
//                         <div className="flex justify-between"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
//                         <div className="flex justify-between"><span>Tax (5%):</span><span>${tax.toFixed(2)}</span></div>
//                         <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>${total.toFixed(2)}</span></div>
//                     </div>
//                     <button onClick={handlePlaceOrder} className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition">Place Order</button>
//                     <Link to="/cart" className="block mt-4 text-center text-orange-500 hover:underline">Back to Cart</Link>
//                 </div>
//             </div>
//
//             {/* Confirmation Modal */}
//             {showConfirm && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//                     <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//                         <h2 className="text-xl font-semibold mb-4">Confirm Order</h2>
//                         <p className="mb-4">Please confirm your order:</p>
//                         <div className="mb-4">
//                             {cart.map(item=>(
//                                 <div key={item.id} className="flex justify-between">
//                                     <span>{item.item_name} x {item.quantity}</span>
//                                     <span>${item.total}</span>
//                                 </div>
//                             ))}
//                             <div className="flex justify-between font-bold mt-2">
//                                 <span>Total:</span>
//                                 <span>${total.toFixed(2)}</span>
//                             </div>
//                             <p className="mt-2">Payment: {paymentMethod==="COD"?"Cash on Delivery":"Online Payment"}</p>
//                             <p>Delivery: {deliveryType==="HOME_DELIVERY"?"Home Delivery":"Store Pickup"}</p>
//                         </div>
//                         <div className="flex justify-end space-x-4">
//                             <button onClick={()=>setShowConfirm(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
//                             <button onClick={confirmOrder} className="px-4 py-2 bg-orange-500 text-white rounded-lg">Confirm</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default Checkout;


///////////////////////uporer code e payment option select korar ekta sundor code ase //////////////////////////////////////////////////////////////////////


import React, {useState, useEffect} from "react";
import {useCart} from "../context_or_provider/CartContext";
import {Link, useNavigate} from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import BillingAddress from "./BillingAddress";
import ProfileUpdate from "./ProfileUpdate";

const Checkout = () => {
    const {cart, checkout} = useCart();
    const navigate = useNavigate();
    const [showBillingForm, setShowBillingForm] = useState(false);


    const [billingAddress, setBillingAddress] = useState(null);
    const [shippingInfo, setShippingInfo] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [deliveryType, setDeliveryType] = useState("HOME_DELIVERY");
    const [showConfirm, setShowConfirm] = useState(false);

    const subtotal = cart.reduce((acc, item) => acc + parseFloat(item.total), 0);
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;

    // ✅ Fetch regular billing address
    useEffect(() => {
        const fetchBilling = async () => {
            try {
                const token = localStorage.getItem("access");
                const headers = {headers: {Authorization: `Bearer ${token}`}};
                const res = await axiosInstance.get("/api/payment-app/shipping-address/", headers);
                if (res.data.length > 0) {
                    setBillingAddress(res.data[0]);
                }
            } catch (err) {
                console.error("Billing fetch error:", err);
            }
        };
        fetchBilling();
    }, []);

    const handleChange = (e) => {
        setShippingInfo({...shippingInfo, [e.target.name]: e.target.value});
    };

    const useRegularShipping = () => {
        if (!billingAddress) return;
        setShippingInfo({
            name: billingAddress.name || "",
            email: billingAddress.email || "",
            phone: billingAddress.phone || "",
            address: billingAddress.address || "",
            city: billingAddress.city || "",
            postalCode: billingAddress.zipcode || "",
            country: billingAddress.country || "",
        });
    };

    const handlePlaceOrder = () => {
        if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address) {
            alert("Please fill all required shipping fields");
            return;
        }
        setShowConfirm(true);
    };

    // const confirmOrder = async () => {
    //     setShowConfirm(false);
    //     try {
    //         const orderPayload = {
    //             receiver_name: shippingInfo.name,
    //             receiver_email: shippingInfo.email,
    //             receiver_phone_number: shippingInfo.phone,
    //             receiver_address: shippingInfo.address,
    //             receiver_city: shippingInfo.city,
    //             receiver_zip_code: shippingInfo.postalCode,
    //             receiver_country: shippingInfo.country,
    //             order_type: paymentMethod,
    //             delivery_type: deliveryType,
    //         };
    //
    //         const order = await checkout(orderPayload);
    //
    //         if (!order || !order.id) {
    //             alert("Order creation failed");
    //             return;
    //         }
    //
    //         if (paymentMethod === "ONLINE") {
    //             const token = localStorage.getItem("access");
    //             const headers = {headers: {Authorization: `Bearer ${token}`}};
    //             const res = await axiosInstance.get(
    //                 `/api/payment-app/orders/${order.id}/initiate_payment/`,
    //                 headers
    //             );
    //             if (res.data.payment_url) {
    //                 window.location.href = res.data.payment_url;
    //             } else {
    //                 alert("Payment URL not received");
    //             }
    //         } else {
    //             alert("Order placed successfully! Cash on Delivery selected.");
    //             navigate("/order");
    //         }
    //
    //     } catch (err) {
    //         console.error("Checkout error:", err.response?.data || err.message);
    //         alert("Something went wrong while placing order");
    //     }
    // };


    const confirmOrder = async () => {
        setShowConfirm(false);
        try {
            const orderPayload = {
                receiver_name: shippingInfo.name,
                receiver_email: shippingInfo.email,
                receiver_phone_number: shippingInfo.phone,
                receiver_address: shippingInfo.address,
                receiver_city: shippingInfo.city,
                receiver_zip_code: shippingInfo.postalCode,
                receiver_country: shippingInfo.country,
                order_type: paymentMethod,
                delivery_type: deliveryType,
            };

            const order = await checkout(orderPayload);

            if (!order || !order.id) {
                alert("Order creation failed");
                return;
            }

            if (paymentMethod === "ONLINE") {
                const token = localStorage.getItem("access");
                const headers = {headers: {Authorization: `Bearer ${token}`}};
                const res = await axiosInstance.get(
                    `/api/payment-app/orders/${order.id}/initiate_payment/`,
                    headers
                );
                if (res.data.payment_url) {
                    window.location.href = res.data.payment_url;
                } else {
                    alert("Payment URL not received");
                }
            } else {
                alert("Order placed successfully! Cash on Delivery selected.");
                navigate("/order");
            }
        } catch (err) {
            console.error("Checkout error:", err.response?.data || err.message);
            // alert("Something went wrong while placing order");
            alert(err.error);
            alert(err.message);
        }
    };


    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <div className="grid md:grid-cols-2 gap-8">
                {/* Shipping Info */}
                <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                    <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>

                    <button
                        onClick={() => setShowBillingForm(true)}
                        // className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
                        className="mb-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        {billingAddress ? "Edit Regular Shipping Address" : "+ Add Regular Shipping Address"}
                    </button>


                    {showBillingForm && (
                        <div>
                            <BillingAddress
                                existingAddress={billingAddress}
                                onSubmit={(newAddress) => {
                                    setBillingAddress(newAddress);
                                    setShowBillingForm(false);
                                }}
                            />

                            <button
                                onClick={() => setShowBillingForm(false)}
                                className="mt-2 px-4 py-2 bg-red-400 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    )}


                    {billingAddress && (

                        <button
                            onClick={useRegularShipping}
                            className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Use Regular Shipping Address
                        </button>
                    )}


                    {showBillingForm && (
                        <BillingAddress
                            existingAddress={billingAddress}
                            onSubmit={(newAddress) => {
                                setBillingAddress(newAddress);   // update state
                                setShowBillingForm(false);       // form বন্ধ করো
                            }}
                            onCancel={() => setShowBillingForm(false)}
                        />
                    )}


                    {["name", "email", "phone", "address", "city", "postalCode", "country"].map((field) => (
                        <input
                            key={field}
                            type={field === "email" ? "email" : "text"}
                            name={field}
                            value={shippingInfo[field]}
                            onChange={handleChange}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            className="w-full border px-3 py-2 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    ))}

                    {/* Payment & Delivery type */}
                    <div className="mt-4">
                        <label className="block mb-1 font-semibold">Payment Method:</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg mb-2"
                        >
                            <option value="COD">Cash on Delivery</option>
                            <option value="ONLINE">Online Payment</option>
                        </select>

                        <label className="block mb-1 font-semibold mt-2">Delivery Type:</label>
                        <select
                            value={deliveryType}
                            onChange={(e) => setDeliveryType(e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg mb-2"
                        >
                            <option value="HOME_DELIVERY">Home Delivery</option>
                            <option value="STORE_PICKUP">Store Pickup</option>
                        </select>
                    </div>
                </div>


                {/* Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {cart.map((item) => (
                            <div key={item.id} className="flex justify-between py-2 items-center">
                                <img
                                    src={item.product_image || "/default-avatar.png"}
                                    alt={item.item_name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <span>{item.item_name} {item.item_price} x {item.quantity}</span>
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

            {/* Confirmation Modal */
            }
            {
                showConfirm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg max-w-md w-full">
                            <h2 className="text-xl font-semibold mb-4">Confirm Your Order</h2>
                            <div className="mb-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between py-1">
                                        <img
                                            src={item.product_image || "/default-avatar.png"}
                                            alt={item.item_name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <span>{item.item_name} x {item.quantity}</span>
                                        <span>${item.total}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mb-4 font-semibold">
                                <p>Payment Method: {paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}</p>
                                <p>Delivery Type: {deliveryType === "HOME_DELIVERY" ? "Home Delivery" : "Store Pickup"}</p>
                                <p>Total: ${total.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-4 py-2 rounded-lg border border-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmOrder}
                                    className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
        ;
};

export default Checkout;

////////////////////////////////////////uporer code motamoti thik tobe payment howar agei order hoyejay//////////////

