import React, {useState, useEffect} from "react";
import {IoMdLogOut} from "react-icons/io";
import {useAuth} from "../context_or_provider/AuthContext";
import {useCart} from "../context_or_provider/CartContext";
import axiosInstance from "../api/axiosInstance";
import ProfileUpdate from "../components/ProfileUpdate";
import Topbar from "../components/Topbar";
import Header from "../components/test";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Profile = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const {logout, profile, loadingProfile, setProfile} = useAuth();
    const {orders, cart} = useCart();
    const [selectedOrder, setSelectedOrder] = useState(null);


    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        full_name: "",
        address_1: "",
        city: "",
        zipcode: "",
        country: "",
        phone: "",
        profile_picture: null,
    });

    // Sync formData whenever profile updates
    useEffect(() => {
        if (profile) {
            setFormData({
                username: profile.username || "",
                full_name: profile.full_name || "",
                address_1: profile.address_1 || "",
                city: profile.city || "",
                zipcode: profile.zipcode || "",
                country: profile.country || "",
                phone: profile.phone || "",
                profile_picture: profile.profile_picture || null, // Backend URL
            });
        }
    }, [profile]);

    if (loadingProfile) return <p className="text-center py-10">Loading...</p>;

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        if (name === "profile_picture" && files && files[0]) {
            setFormData({...formData, profile_picture: files[0]});
        } else {
            setFormData({...formData, [name]: value});
        }
    };


    const handleSave = async () => {
        try {
            const data = new FormData();

            ["username", "full_name", "address_1", "city", "zipcode", "country", "phone"].forEach(
                (key) => {
                    if (formData[key] !== undefined && formData[key] !== null) {
                        data.append(key, formData[key]);
                    }
                }
            );

            // Append image only if it's a new File
            if (formData.profile_picture instanceof File) {
                data.append("profile_picture", formData.profile_picture);
            }

            const res = await axiosInstance.patch(
                `/api/user/profiles/${profile.id}/`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                        // DO NOT manually set Content-Type; browser sets boundary
                    },
                }
            );

            setProfile(res.data);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Update profile error:", err.response?.data || err);
            alert("Profile update failed!");
        }
    };


    return (

        <div>
            <Topbar></Topbar>
            <Header></Header>
            <Navbar></Navbar>


            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
                    My Profile
                </h1>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-6 flex items-center">
                    <nav className="flex space-x-6">
                        {["profile", "orders", "carts"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-3 px-2 border-b-2 font-medium text-sm capitalize ${
                                    activeTab === tab
                                        // ? "border-orange-500 text-orange-600"
                                        ? "border-green-500 text-green-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                                }`}
                            >
                                {tab === "profile"
                                    ? "Personal Info"
                                    : tab === "orders"
                                        ? "Order History"
                                        : "Cart History"}
                            </button>
                        ))}
                    </nav>

                    <button
                        onClick={logout}
                        className="ml-auto flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
                    >
                        <IoMdLogOut className="mr-1 text-lg"/> Logout
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && profile && (
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <div className="flex items-center space-x-6 mb-6">
                            <img
                                src={
                                    formData.profile_picture instanceof File
                                        ? URL.createObjectURL(formData.profile_picture)
                                        : profile.profile_picture || "/default-avatar.png"
                                }
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border"
                            />
                            {!isEditing && (
                                <div>
                                    <p className="text-lg font-medium">
                                        {profile.full_name || "N/A"}
                                    </p>
                                    <p className="text-sm text-gray-500">@{profile.username}</p>
                                </div>
                            )}
                        </div>

                        {!isEditing ? (
                            <div className="space-y-4">
                                <p>
                                    <span className="font-medium">Phone:</span>{" "}
                                    {profile.phone || "N/A"}
                                </p>
                                <p>
                                    <span className="font-medium">Address:</span>{" "}
                                    {profile.address_1}, {profile.city}, {profile.country}
                                </p>
                                <p>
                                    <span className="font-medium">Member Since:</span>{" "}
                                    {new Date(profile.date_joined).toLocaleDateString()}
                                </p>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    // className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
                                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <ProfileUpdate></ProfileUpdate>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Orders Tab */}
                <>
                    {/* Orders Tab */}
                    {activeTab === "orders" && (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white p-6 border-b">
                                Order History
                            </h2>
                            {orders.length > 0 ? (
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {orders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                        >
                                            <div className="flex justify-between items-center">
                                                <p className="font-medium">
                                                    Order #{order.id} -{" "}
                                                    {new Date(order.created).toLocaleString()}
                                                </p>
                                                <span
                                                    className={`px-3 py-1 text-sm rounded-full
                      ${
                                                        order.status === "PENDING"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : order.status === "PROCESSING"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : order.status === "ONGOING"
                                                                    ? "bg-indigo-100 text-indigo-700"
                                                                    : order.status === "COMPLETED"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : order.status === "CANCELLED"
                                                                            ? "bg-red-100 text-red-700"
                                                                            : "bg-gray-100 text-gray-700"
                                                    }`}
                                                >
                      {order.status}
                    </span>
                                            </div>

                                            {order.orderitems?.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center space-x-4 mt-2"
                                                >
                                                    <img
                                                        src={item.product_image || "/default-avatar.png"}
                                                        alt={item.item_name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{item.item_name}</p>
                                                        <p>Qty: {item.quantity}</p>
                                                        <p>Total: Tk {item.total}</p>
                                                    </div>

                                                </div>

                                            ))}

                                            {/* Total */}
                                            <div className="flex justify-between font-bold text-lg mt-4">
                                                <span>Total:</span>
                                                <span>${order.total}</span>
                                            </div>

                                            {/* Details Button */}
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                // className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                                                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="p-6 text-gray-500">No orders yet.</p>
                            )}
                        </div>
                    )}

                    {/* Modal Popup */}
                    {selectedOrder && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
                                <h2 className="text-xl font-bold mb-4">
                                    Order #{selectedOrder.id} Details
                                </h2>

                                <p><strong>Status:</strong> {selectedOrder.status}</p>
                                <p><strong>Payment Method:</strong> {selectedOrder.order_type}</p>
                                <p><strong>Delivery Type:</strong> {selectedOrder.delivery_type}</p>
                                <p><strong>Receiver:</strong> {selectedOrder.receiver_name}</p>
                                <p><strong>Phone:</strong> {selectedOrder.receiver_phone_number}</p>
                                <p><strong>Address:</strong> {selectedOrder.receiver_address}</p>

                                <h3 className="text-lg font-semibold mt-4 mb-2">Items:</h3>
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {selectedOrder.orderitems?.map((item) => (
                                        <div key={item.id} className="flex justify-between py-2 text-sm">
                                            <img
                                                src={item.product_image || "/default-avatar.png"}
                                                alt={item.item_name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <span>{item.item_name} {item.item_price} × {item.quantity}</span>
                                            <span>Tk {item.total}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between font-bold text-lg mt-4">
                                    <span>Total:</span>
                                    <span>Tk {selectedOrder.total}</span>
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}
                </>

                {/* Cart Tab */}
                {activeTab === "carts" && (
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white p-6 border-b">
                            Cart History
                        </h2>
                        {cart.length > 0 ? (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center space-x-4 p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                    >
                                        <img
                                            src={item.product_image || "/default-avatar.png"}
                                            alt={item.item_name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div>
                                            <p className="font-medium">{item.item_name}</p>
                                            <p>Qty: {item.quantity}</p>
                                            <p>Total: Tk {item.total}</p>
                                            <p>Status: {item.purchased ? "Purchased" : "In Cart"}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="p-6 text-gray-500">No cart history.</p>
                        )}
                    </div>
                )}

            </div>
            <Footer></Footer>
        </div>
    )
        ;
};

export default Profile;

