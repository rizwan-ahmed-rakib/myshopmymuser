import React, {useState, useEffect} from "react";
import axiosInstance from "../api/axiosInstance";
import {useNavigate} from "react-router-dom";

const GuestCheckout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipcode: "",
        country: "",
    });

    // 🔹 localStorage থেকে cart load করো
    useEffect(() => {
        const stored = localStorage.getItem("guest_cart");
        if (stored) setCart(JSON.parse(stored));
    }, []);

    // 🔹 form input handle
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };


    // 🔹 order submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                items: cart.map((item) => ({
                    product: item.id,
                    quantity: item.quantity,
                    price: item.item_price,
                })),
            };

            await axiosInstance.post(`/api/order-app/guest-orders/`, payload);

            // ✅ success হলে cart clear করো
            localStorage.removeItem("guest_cart");
            setCart([]); // UI থেকে cart খালি হবে

            // ✅ form reset করো
            setFormData({
                name: "",
                email: "",
                phone: "",
                address: "",
                city: "",
                zipcode: "",
                country: "",
            });

            // ✅ success alert
            alert("✅ Guest order placed successfully!");
            setOrderSuccess(true);

            // ৩ সেকেন্ড পরে success বার্তা অদৃশ্য হবে এবং পেজ রিফ্রেশ হবে
            setTimeout(() => {
                setOrderSuccess(false);
                window.location.reload(); // ✅ পেজ রিফ্রেশ করবে
            }, 3000);

            // setTimeout(() => setOrderSuccess(false), 3000);
            // window.location.reload(); // ✅ পেজ রিফ্রেশ করবে
            // navigate("/");

        } catch (err) {
            console.error("Guest order error:", err);
            alert("❌ Something went wrong!");
        }
    };


    const total = cart.reduce(
        (sum, item) => sum + item.item_price * item.quantity,
        0
    );

    return (
        <div className="max-w-3xl mx-auto py-10 px-6">
            <h1 className="text-2xl font-semibold mb-6">Guest Checkout</h1>

            {/* Cart Summary */}

            {orderSuccess && (
                <div className="bg-green-100 text-green-800 p-3 rounded mb-3 text-center">
                    ✅ Order placed successfully!
                </div>
            )}

            <div className="bg-gray-100 p-4 rounded-lg mb-6">

                <h2 className="text-lg font-medium mb-2">Your Cart</h2>
                {cart.length === 0 ? (
                    <p>No items in cart.</p>
                ) : (
                    cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <img
                                    src={item.product_image}
                                    alt={item.item_name}
                                    className="w-14 h-14 object-cover rounded"
                                />
                                <div>
                                    <p className="font-medium">{item.item_name}</p>
                                    <p className="text-sm text-gray-600">
                                        {item.quantity} × {item.item_price}৳
                                    </p>
                                </div>
                            </div>
                            <p className="font-semibold">{item.item_price * item.quantity}৳</p>
                        </div>
                    ))
                )}
                <hr className="my-3"/>
                <p className="text-right font-semibold text-lg">Total: {total}৳</p>
            </div>

            {/* Guest Info Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    required
                />
                <textarea
                    name="address"
                    placeholder="Full Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                    <input
                        type="text"
                        name="zipcode"
                        placeholder="ZIP Code"
                        value={formData.zipcode}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>
                <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />

                <button
                    type="submit"
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md"
                >
                    Place Order
                </button>
            </form>
        </div>
    );
};

export default GuestCheckout;


// import React, { useState, useEffect } from "react";
// import axiosInstance from "../api/axiosInstance";
// import { useNavigate } from "react-router-dom";
//
// const GuestCheckout = () => {
//   const navigate = useNavigate();
//   const [cart, setCart] = useState([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     zipcode: "",
//     country: "",
//   });
//
//   // 🔹 localStorage থেকে cart load করো
//   useEffect(() => {
//     const stored = localStorage.getItem("guest_cart");
//     if (stored) setCart(JSON.parse(stored));
//   }, []);
//
//   // 🔹 form input handle
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//
//   // 🔹 order submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         ...formData,
//         items: cart.map((item) => ({
//           product: item.id,
//           quantity: item.quantity,
//           price: item.item_price,
//         })),
//       };
//
//       await axiosInstance.post(`/api/order-app/guest-orders/`, payload);
//
//       // ✅ Clear cart instantly
//       localStorage.removeItem("guest_cart");
//       setCart([]); // UI থেকে cart খালি হবে সঙ্গে সঙ্গে
//
//       // ✅ Reset form
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         address: "",
//         city: "",
//         zipcode: "",
//         country: "",
//       });
//
//       // ✅ Small delay to ensure re-render before alert/redirect
//       setTimeout(() => {
//         alert("✅ Guest order placed successfully!");
//         // window.location.reload(); // ✅ পেজ রিফ্রেশ করবে
//           // navigate("/"); // চাইলে হোমে পাঠাতে পারো
//       }, 150);
//
//     } catch (err) {
//       console.error("Guest order error:", err);
//       alert("❌ Something went wrong!");
//     }
//   };
//
//   const total = cart.reduce(
//     (sum, item) => sum + item.item_price * item.quantity,
//     0
//   );
//
//   return (
//     <div className="max-w-3xl mx-auto py-10 px-6">
//       <h1 className="text-2xl font-semibold mb-6">Guest Checkout</h1>
//
//       {/* Cart Summary */}
//       <div className="bg-gray-100 p-4 rounded-lg mb-6">
//         <h2 className="text-lg font-medium mb-2">Your Cart</h2>
//         {cart.length === 0 ? (
//           <p className="text-gray-500">Your cart is empty.</p>
//         ) : (
//           cart.map((item) => (
//             <div key={item.id} className="flex items-center justify-between mb-2">
//               <div className="flex items-center gap-3">
//                 <img
//                   src={item.product_image}
//                   alt={item.item_name}
//                   className="w-14 h-14 object-cover rounded"
//                 />
//                 <div>
//                   <p className="font-medium">{item.item_name}</p>
//                   <p className="text-sm text-gray-600">
//                     {item.quantity} × {item.item_price}৳
//                   </p>
//                 </div>
//               </div>
//               <p className="font-semibold">{item.item_price * item.quantity}৳</p>
//             </div>
//           ))
//         )}
//         <hr className="my-3" />
//         <p className="text-right font-semibold text-lg">Total: {total}৳</p>
//       </div>
//
//       {/* Guest Info Form */}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input type="text" name="name" placeholder="Full Name"
//           value={formData.name} onChange={handleChange}
//           className="w-full border rounded p-2" required />
//
//         <input type="email" name="email" placeholder="Email Address"
//           value={formData.email} onChange={handleChange}
//           className="w-full border rounded p-2" />
//
//         <input type="text" name="phone" placeholder="Phone Number"
//           value={formData.phone} onChange={handleChange}
//           className="w-full border rounded p-2" required />
//
//         <textarea name="address" placeholder="Full Address"
//           value={formData.address} onChange={handleChange}
//           className="w-full border rounded p-2" required />
//
//         <div className="grid grid-cols-2 gap-4">
//           <input type="text" name="city" placeholder="City"
//             value={formData.city} onChange={handleChange}
//             className="w-full border rounded p-2" />
//           <input type="text" name="zipcode" placeholder="ZIP Code"
//             value={formData.zipcode} onChange={handleChange}
//             className="w-full border rounded p-2" />
//         </div>
//
//         <input type="text" name="country" placeholder="Country"
//           value={formData.country} onChange={handleChange}
//           className="w-full border rounded p-2" />
//
//         <button type="submit"
//           className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md">
//           Place Order
//         </button>
//       </form>
//     </div>
//   );
// };
//
// export default GuestCheckout;
