// import React, { useState } from "react";
// import { IoMdLogOut } from "react-icons/io";
// import { useAuth } from "../context_or_provider/AuthContext";
// import { useCart } from "../context_or_provider/CartContext";
//
// const Profile = () => {
//   const [activeTab, setActiveTab] = useState("profile");
//   const { logout, profile, loadingProfile } = useAuth();
//   const { orders, cart } = useCart();
//
//   if (loadingProfile) return <p className="text-center py-10">Loading...</p>;
//
//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
//         My Profile
//       </h1>
//
//       {/* Tabs */}
//       <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
//         <nav className="flex space-x-6">
//           {["profile", "orders", "carts"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`py-3 px-2 border-b-2 font-medium text-sm capitalize ${
//                 activeTab === tab
//                   ? "border-orange-500 text-orange-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
//               }`}
//             >
//               {tab === "profile"
//                 ? "Personal Info"
//                 : tab === "orders"
//                 ? "Order History"
//                 : "Cart History"}
//             </button>
//           ))}
//
//           <button
//             onClick={logout}
//             className="ml-auto flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
//           >
//             <IoMdLogOut className="mr-1 text-lg" /> Logout
//           </button>
//         </nav>
//       </div>
//
//       {/* Profile Info */}
//       {activeTab === "profile" && profile && (
//         <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
//           <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
//             Personal Information
//           </h2>
//           <div className="space-y-4">
//             <p>
//               <span className="font-medium">Name:</span>{" "}
//               {profile.full_name || "N/A"}
//             </p>
//             <p>
//               <span className="font-medium">Username:</span>{" "}
//               {profile.username || "N/A"}
//             </p>
//             <p>
//               <span className="font-medium">Phone:</span>{" "}
//               {profile.phone || "N/A"}
//             </p>
//             <p>
//               <span className="font-medium">Address:</span>{" "}
//               {profile.address_1}, {profile.city}, {profile.country}
//             </p>
//             <p>
//               <span className="font-medium">Member Since:</span>{" "}
//               {new Date(profile.date_joined).toLocaleDateString()}
//             </p>
//           </div>
//         </div>
//       )}
//
//       {/* Order History */}
//       {activeTab === "orders" && (
//         <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
//           <h2 className="text-xl font-semibold text-gray-800 dark:text-white p-6 border-b">
//             Order History
//           </h2>
//           {orders.length > 0 ? (
//             <div className="divide-y divide-gray-200 dark:divide-gray-700">
//               {orders.map((order) => (
//                 <div
//                   key={order.id}
//                   className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
//                 >
//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                     <div>
//                       <p className="font-medium">Order #{order.id}</p>
//                       <p className="text-sm text-gray-500">
//                         Placed on{" "}
//                         {new Date(order.created_at).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <div className="flex space-x-6 mt-3 md:mt-0">
//                       <p>Items: {order.orderitems?.length || 0}</p>
//                       <p>Total: Tk {order.total || order.get_totals}</p>
//                       <p>Status: {order.status || "Pending"}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="p-6 text-gray-500">No orders yet.</p>
//           )}
//         </div>
//       )}
//
//       {/* Cart History */}
//       {activeTab === "carts" && (
//         <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
//           <h2 className="text-xl font-semibold text-gray-800 dark:text-white p-6 border-b">
//             Cart History
//           </h2>
//           {cart.length > 0 ? (
//             <div className="divide-y divide-gray-200 dark:divide-gray-700">
//               {cart.map((item) => (
//                 <div
//                   key={item.id}
//                   className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
//                 >
//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                     <div>
//                       <p className="font-medium">
//                         {item.item_name} x {item.quantity}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         Added: {new Date(item.added_on).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <div className="flex space-x-6 mt-3 md:mt-0">
//                       <p>Total: Tk {item.total}</p>
//                       <p>Status: {item.purchased ? "Purchased" : "In Cart"}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="p-6 text-gray-500">No cart history.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default Profile;

////////////////////////////////////////////////

// import React, {useState, useEffect} from "react";
// import {IoMdLogOut} from "react-icons/io";
// import {useAuth} from "../context_or_provider/AuthContext";
// import {useCart} from "../context_or_provider/CartContext";
// import axiosInstance from "../api/axiosInstance";
//
// const Profile = () => {
//     const [activeTab, setActiveTab] = useState("profile");
//     const {logout, profile, loadingProfile, setProfile} = useAuth();
//     const {orders, cart} = useCart();
//
//     const [isEditing, setIsEditing] = useState(false);
//     const [formData, setFormData] = useState(profile || {});
//
//     // Sync formData when profile changes
//     useEffect(() => {
//         setFormData(profile || {});
//     }, [profile]);
//
//     if (loadingProfile) return <p className="text-center py-10">Loading...</p>;
//
//     const handleChange = (e) => {
//         const {name, value, files} = e.target;
//         if (files) {
//             setFormData({...formData, [name]: files[0]});
//         } else {
//             setFormData({...formData, [name]: value});
//         }
//     };
//
//
//
//     const handleSave = async () => {
//         try {
//             const formDataToSend = new FormData();
//
//             // Append text fields - ensure we're only sending changed fields
//             const fields = ["full_name", "username", "phone", "address_1", "city", "country"];
//             fields.forEach((field) => {
//                 if (formData[field] !== undefined && formData[field] !== null && formData[field] !== profile[field]) {
//                     formDataToSend.append(field, formData[field]);
//                 }
//             });
//
//             // Append image if exists and is different from current
//             if (formData.profile_picture instanceof File) {
//                 formDataToSend.append("profile_picture", formData.profile_picture);
//             }
//
//             // Debug: Log what we're sending
//             for (let pair of formDataToSend.entries()) {
//                 console.log(pair[0] + ', ' + pair[1]);
//             }
//
//             const res = await axiosInstance.patch(
//                 `/api/user/profiles/${profile.id}/`,
//                 formDataToSend,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("access")}`,
//                         // Let browser set Content-Type with boundary for multipart
//                     },
//                 }
//             );
//
//             setProfile(res.data);
//             setIsEditing(false);
//             alert("Profile updated successfully!");
//         } catch (err) {
//             console.error("Update profile error:", err.response?.data || err);
//             alert("Profile update failed. Check console for details.");
//         }
//     };
//
//     return (
//         <div className="max-w-6xl mx-auto px-4 py-8">
//             <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
//                 My Profile
//             </h1>
//
//             {/* Tabs */}
//             <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
//                 <nav className="flex space-x-6">
//                     {["profile", "orders", "carts"].map((tab) => (
//                         <button
//                             key={tab}
//                             onClick={() => setActiveTab(tab)}
//                             className={`py-3 px-2 border-b-2 font-medium text-sm capitalize ${
//                                 activeTab === tab
//                                     ? "border-orange-500 text-orange-600"
//                                     : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
//                             }`}
//                         >
//                             {tab === "profile"
//                                 ? "Personal Info"
//                                 : tab === "orders"
//                                     ? "Order History"
//                                     : "Cart History"}
//                         </button>
//                     ))}
//
//                     <button
//                         onClick={logout}
//                         className="ml-auto flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
//                     >
//                         <IoMdLogOut className="mr-1 text-lg"/> Logout
//                     </button>
//                 </nav>
//             </div>
//
//             {/* Profile Tab */}
//             {activeTab === "profile" && profile && (
//                 <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
//                     <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
//                         Personal Information
//                     </h2>
//
//                     {/* Profile Picture */}
//                     <div className="flex items-center space-x-6 mb-6">
//                         <img
//                             src={
//                                 formData.profile_picture instanceof File
//                                     ? URL.createObjectURL(formData.profile_picture)
//                                     : profile.profile_picture || "/default-avatar.png"
//                             }
//                             alt="Profile"
//                             className="w-24 h-24 rounded-full object-cover border"
//                         />
//                         {!isEditing && (
//                             <div>
//                                 <p className="text-lg font-medium">{profile.full_name || "N/A"}</p>
//                                 <p className="text-sm text-gray-500">@{profile.username}</p>
//                             </div>
//                         )}
//                     </div>
//
//                     {!isEditing ? (
//                         <div className="space-y-4">
//                             <p>
//                                 <span className="font-medium">Phone:</span> {profile.phone || "N/A"}
//                             </p>
//                             <p>
//                                 <span className="font-medium">Address:</span>{" "}
//                                 {profile.address_1}, {profile.city}, {profile.country}
//                             </p>
//                             <p>
//                                 <span className="font-medium">Member Since:</span>{" "}
//                                 {new Date(profile.date_joined).toLocaleDateString()}
//                             </p>
//                             <button
//                                 onClick={() => setIsEditing(true)}
//                                 className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
//                             >
//                                 Edit Profile
//                             </button>
//                         </div>
//                     ) : (
//                         <div className="space-y-4">
//                             <input
//                                 type="text"
//                                 name="full_name"
//                                 value={formData.full_name || ""}
//                                 onChange={handleChange}
//                                 placeholder="Full Name"
//                                 className="w-full border rounded px-3 py-2"
//                             />
//                             <input
//                                 type="text"
//                                 name="username"
//                                 value={formData.username || ""}
//                                 onChange={handleChange}
//                                 placeholder="Username"
//                                 className="w-full border rounded px-3 py-2"
//                             />
//                             <input
//                                 type="text"
//                                 name="phone"
//                                 value={formData.phone || ""}
//                                 onChange={handleChange}
//                                 placeholder="Phone"
//                                 className="w-full border rounded px-3 py-2"
//                             />
//                             <input
//                                 type="text"
//                                 name="address_1"
//                                 value={formData.address_1 || ""}
//                                 onChange={handleChange}
//                                 placeholder="Address"
//                                 className="w-full border rounded px-3 py-2"
//                             />
//                             <input
//                                 type="text"
//                                 name="city"
//                                 value={formData.city || ""}
//                                 onChange={handleChange}
//                                 placeholder="City"
//                                 className="w-full border rounded px-3 py-2"
//                             />
//                             <input
//                                 type="text"
//                                 name="country"
//                                 value={formData.country || ""}
//                                 onChange={handleChange}
//                                 placeholder="Country"
//                                 className="w-full border rounded px-3 py-2"
//                             />
//                             <input
//                                 type="file"
//                                 name="profile_picture"
//                                 accept="image/*"
//                                 onChange={handleChange}
//                                 className="w-full border rounded px-3 py-2"
//                             />
//
//                             <div className="flex space-x-4">
//                                 <button
//                                     onClick={handleSave}
//                                     className="px-4 py-2 bg-green-600 text-white rounded-lg"
//                                 >
//                                     Save
//                                 </button>
//                                 <button
//                                     onClick={() => setIsEditing(false)}
//                                     className="px-4 py-2 bg-gray-400 text-white rounded-lg"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             )}
//
//             {/* Orders Tab */}
//             {activeTab === "orders" && (
//                 <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
//                     <h2 className="text-xl font-semibold text-gray-800 dark:text-white p-6 border-b">
//                         Order History
//                     </h2>
//                     {orders.length > 0 ? (
//                         <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                             {orders.map((order) => (
//                                 <div
//                                     key={order.id}
//                                     className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
//                                 >
//                                     <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                                         <div>
//                                             <p className="font-medium">Order #{order.id}</p>
//                                             <p className="text-sm text-gray-500">
//                                                 Placed on {new Date(order.created_at).toLocaleDateString()}
//                                             </p>
//                                         </div>
//                                         <div className="flex space-x-6 mt-3 md:mt-0">
//                                             <p>Items: {order.orderitems?.length || 0}</p>
//                                             <p>Total: Tk {order.total || order.get_totals}</p>
//                                             <p>Status: {order.status || "Pending"}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <p className="p-6 text-gray-500">No orders yet.</p>
//                     )}
//                 </div>
//             )}
//
//             {/* Cart Tab */}
//             {activeTab === "carts" && (
//                 <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
//                     <h2 className="text-xl font-semibold text-gray-800 dark:text-white p-6 border-b">
//                         Cart History
//                     </h2>
//                     {cart.length > 0 ? (
//                         <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                             {cart.map((item) => (
//                                 <div
//                                     key={item.id}
//                                     className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
//                                 >
//                                     <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                                         <div>
//                                             <p className="font-medium">
//                                                 {item.item_name} x {item.quantity}
//                                             </p>
//                                             <p className="text-sm text-gray-500">
//                                                 Added: {new Date(item.added_on).toLocaleDateString()}
//                                             </p>
//                                         </div>
//                                         <div className="flex space-x-6 mt-3 md:mt-0">
//                                             <p>Total: Tk {item.total}</p>
//                                             <p>Status: {item.purchased ? "Purchased" : "In Cart"}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <p className="p-6 text-gray-500">No cart history.</p>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default Profile;

/////////////////////////////////////////
/////////////////////////////////////
// import React, {useState, useEffect} from "react";
// import {IoMdLogOut} from "react-icons/io";
// import {useAuth} from "../context_or_provider/AuthContext";
// import {useCart} from "../context_or_provider/CartContext";
// import axiosInstance from "../api/axiosInstance";
//
// const Profile = () => {
//     const [activeTab, setActiveTab] = useState("profile");
//     const {logout, profile, loadingProfile, setProfile} = useAuth();
//     const {orders, cart} = useCart();
//
//     const [isEditing, setIsEditing] = useState(false);
//     const [formData, setFormData] = useState(profile || {});
//
//     // Sync formData whenever profile updates
//     useEffect(() => {
//         setFormData(profile || {});
//     }, [profile]);
//
//     if (loadingProfile) return <p className="text-center py-10">Loading...</p>;
//
//     const handleChange = (e) => {
//         const {name, value, files} = e.target;
//         if (files && files[0]) {
//             setFormData({...formData, [name]: files[0]});
//         } else {
//             setFormData({...formData, [name]: value});
//         }
//     };
//
//     // const handleSave = async () => {
//     //   try {
//     //     const formDataToSend = new FormData();
//     //
//     //     // Append text fields
//     //     ["full_name", "username", "phone", "address_1", "city", "country"].forEach(
//     //       (field) => {
//     //         if (formData[field] !== undefined && formData[field] !== null) {
//     //           formDataToSend.append(field, formData[field]);
//     //         }
//     //       }
//     //     );
//     //
//     //     // Append profile image if a new file is selected
//     //     if (formData.profile_picture instanceof File) {
//     //       formDataToSend.append("profile_picture", formData.profile_picture);
//     //     }
//     //
//     //     const res = await axiosInstance.patch(
//     //       `/api/user/profiles/${profile.id}/`,
//     //       formDataToSend,
//     //       {
//     //         headers: {
//     //           Authorization: `Bearer ${localStorage.getItem("access")}`,
//     //           // Don't manually set Content-Type; browser sets multipart boundary
//     //         },
//     //       }
//     //     );
//     //
//     //     setProfile(res.data);
//     //     setIsEditing(false);
//     //     alert("Profile updated successfully!");
//     //   } catch (err) {
//     //     console.error("Update profile error:", err.response?.data || err);
//     //     alert("Profile update failed. Check console for details.");
//     //   }
//     // };
//
//     const handleSave = async () => {
//         try {
//             const formDataToSend = new FormData();
//
//             // Append text fields
//             ["full_name", "username", "phone", "address_1", "city", "country"].forEach(
//                 (key) => {
//                     if (formData[key] !== undefined && formData[key] !== null) {
//                         formDataToSend.append(key, formData[key]);
//                     }
//                 }
//             );
//
//             // Append image if it's a File
//             if (formData.profile_picture instanceof File) {
//                 formDataToSend.append("profile_picture", formData.profile_picture);
//             }
//
//             const res = await axiosInstance.put(
//                 `/api/user/profiles/${profile.id}/`,
//                 formDataToSend,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("access")}`,
//
//                         // ❌ DO NOT set Content-Type manually!
//                     },
//                 }
//             );
//
//             setProfile(res.data);
//             setIsEditing(false);
//             alert("Profile updated successfully!");
//         } catch (err) {
//             console.error("Update profile error:", err.response?.data || err);
//             alert("Profile update failed. Check console for details.");
//         }
//     };
//
//
//     return (
//         <div className="max-w-6xl mx-auto px-4 py-8">
//             <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
//                 My Profile
//             </h1>
//
//             {/* Tabs */}
//             <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
//                 <nav className="flex space-x-6">
//                     {["profile", "orders", "carts"].map((tab) => (
//                         <button
//                             key={tab}
//                             onClick={() => setActiveTab(tab)}
//                             className={`py-3 px-2 border-b-2 font-medium text-sm capitalize ${
//                                 activeTab === tab
//                                     ? "border-orange-500 text-orange-600"
//                                     : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
//                             }`}
//                         >
//                             {tab === "profile"
//                                 ? "Personal Info"
//                                 : tab === "orders"
//                                     ? "Order History"
//                                     : "Cart History"}
//                         </button>
//                     ))}
//
//                     <button
//                         onClick={logout}
//                         className="ml-auto flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
//                     >
//                         <IoMdLogOut className="mr-1 text-lg"/> Logout
//                     </button>
//                 </nav>
//             </div>
//
//             {/* Profile Tab */}
//             {activeTab === "profile" && profile && (
//                 <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
//                     <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
//                         Personal Information
//                     </h2>
//
//                     {/* Profile Picture */}
//                     <div className="flex items-center space-x-6 mb-6">
//                         <img
//                             src={
//                                 formData.profile_picture instanceof File
//                                     ? URL.createObjectURL(formData.profile_picture)
//                                     : profile.profile_picture || "/default-avatar.png"
//                             }
//                             alt="Profile"
//                             className="w-24 h-24 rounded-full object-cover border"
//                         />
//                         {!isEditing && (
//                             <div>
//                                 <p className="text-lg font-medium">{profile.full_name || "N/A"}</p>
//                                 <p className="text-sm text-gray-500">@{profile.username}</p>
//                             </div>
//                         )}
//                     </div>
//
//                     {!isEditing ? (
//                         <div className="space-y-4">
//                             <p>
//                                 <span className="font-medium">Phone:</span> {profile.phone || "N/A"}
//                             </p>
//                             <p>
//                                 <span className="font-medium">Address:</span>{" "}
//                                 {profile.address_1}, {profile.city}, {profile.country}
//                             </p>
//                             <p>
//                                 <span className="font-medium">Member Since:</span>{" "}
//                                 {new Date(profile.date_joined).toLocaleDateString()}
//                             </p>
//                             <button
//                                 onClick={() => setIsEditing(true)}
//                                 className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
//                             >
//                                 Edit Profile
//                             </button>
//                         </div>
//                     ) : (
//                         <div className="space-y-4">
//                             <input
//                                 type="text"
//                                 name="full_name"
//                                 value={formData.full_name || ""}
//                                 onChange={handleChange}
//                                 placeholder="Full Name"
//                                 className="w-full border rounded px-3 py-2"
//                             />
//                             <input
//                                 type="text"
//                                 name="username"
//                                 value={formData.username || ""}
//                                 onChange={handleChange}
//                                 placeholder="Username"
//                                 className="w-full border rounded px-3 py-2"
//                             />
//                             <input
//                                 type="text"
//                                 name="phone"
//                                 value={formData.phone || ""}
//                                 onChange={handleChange}
//                                 placeholder="Phone"
//                                 className="w-full border rounded px-3 py-2"
//                             />
//                             <input
//                                 type="text"
//                                 name="address_1"
//                                 value={formData.address_1 || ""}
//                                 onChange={handleChange}
//                                 placeholder="Address"
//                                 className="w-full border rounded px-3 py-2"
//                             />
//                             <input
//                                 type="text"
//                                 name="city"
//                                 value={formData.city || ""}
//                                 onChange={handleChange}
//                                 placeholder="City"
//                                 className="w-full border rounded px-3 py-2"
//                             />
//                             <input
//                                 type="text"
//                                 name="country"
//                                 value={formData.country || ""}
//                                 onChange={handleChange}
//                                 placeholder="Country"
//                                 className="w-full border rounded px-3 py-2"
//                             />
//                             <input
//                                 type="file"
//                                 name="profile_picture"
//                                 accept="image/*"
//                                 onChange={handleChange}
//                                 className="w-full border rounded px-3 py-2"
//                             />
//
//                             <div className="flex space-x-4">
//                                 <button
//                                     onClick={handleSave}
//                                     className="px-4 py-2 bg-green-600 text-white rounded-lg"
//                                 >
//                                     Save
//                                 </button>
//                                 <button
//                                     onClick={() => setIsEditing(false)}
//                                     className="px-4 py-2 bg-gray-400 text-white rounded-lg"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             )}
//
//             {/* Orders Tab */}
//             {activeTab === "orders" && (
//                 <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
//                     <h2 className="text-xl font-semibold text-gray-800 dark:text-white p-6 border-b">
//                         Order History
//                     </h2>
//                     {orders.length > 0 ? (
//                         <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                             {orders.map((order) => (
//                                 <div
//                                     key={order.id}
//                                     className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
//                                 >
//                                     <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                                         <div>
//                                             <p className="font-medium">Order #{order.id}</p>
//                                             <p className="text-sm text-gray-500">
//                                                 Placed on {new Date(order.created_at).toLocaleDateString()}
//                                             </p>
//                                         </div>
//                                         <div className="flex space-x-6 mt-3 md:mt-0">
//                                             <p>Items: {order.orderitems?.length || 0}</p>
//                                             <p>Total: Tk {order.total || order.get_totals}</p>
//                                             <p>Status: {order.status || "Pending"}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <p className="p-6 text-gray-500">No orders yet.</p>
//                     )}
//                 </div>
//             )}
//
//             {/* Cart Tab */}
//             {activeTab === "carts" && (
//                 <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
//                     <h2 className="text-xl font-semibold text-gray-800 dark:text-white p-6 border-b">
//                         Cart History
//                     </h2>
//                     {cart.length > 0 ? (
//                         <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                             {cart.map((item) => (
//                                 <div
//                                     key={item.id}
//                                     className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
//                                 >
//                                     <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                                         <div>
//                                             <p className="font-medium">
//                                                 {item.item_name} x {item.quantity}
//                                             </p>
//                                             <p className="text-sm text-gray-500">
//                                                 Added: {new Date(item.added_on).toLocaleDateString()}
//                                             </p>
//                                         </div>
//                                         <div className="flex space-x-6 mt-3 md:mt-0">
//                                             <p>Total: Tk {item.total}</p>
//                                             <p>Status: {item.purchased ? "Purchased" : "In Cart"}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <p className="p-6 text-gray-500">No cart history.</p>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default Profile;


///////////////////////////////////////////////
//////////////////////////////////////////


import React, {useState, useEffect} from "react";
import {IoMdLogOut} from "react-icons/io";
import {useAuth} from "../context_or_provider/AuthContext";
import {useCart} from "../context_or_provider/CartContext";
import axiosInstance from "../api/axiosInstance";

const Profile = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const {logout, profile, loadingProfile, setProfile} = useAuth();
    const {orders, cart} = useCart();

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

    // const handleSave = async () => {
    //     try {
    //         const data = new FormData();
    //
    //         // Append text fields
    //         [
    //             "username",
    //             "full_name",
    //             "address_1",
    //             "city",
    //             "zipcode",
    //             "country",
    //             "phone",
    //         ].forEach((key) => {
    //             if (formData[key] !== undefined && formData[key] !== null) {
    //                 data.append(key, formData[key]);
    //             }
    //         });
    //
    //         // Append profile picture if selected
    //         if (formData.profile_picture instanceof File) {
    //             data.append("profile_picture", formData.profile_picture);
    //         }
    //
    //         const res = await axiosInstance.patch(
    //             `/api/user/profiles/${profile.id}/`,
    //             data,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem("access")}`,
    //                     // ❌ Let browser set Content-Type for multipart/form-data
    //                 },
    //             }
    //         );
    //
    //         setProfile(res.data); // Update context
    //         setIsEditing(false);
    //         alert("Profile updated successfully!");
    //     } catch (err) {
    //         console.error("Update profile error:", err.response?.data || err);
    //         alert("Profile update failed!");
    //     }
    // };

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
                                    ? "border-orange-500 text-orange-600"
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
                                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
                            >
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="w-full border rounded px-3 py-2"
                            />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Username"
                                className="w-full border rounded px-3 py-2"
                            />
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone"
                                className="w-full border rounded px-3 py-2"
                            />
                            <input
                                type="text"
                                name="address_1"
                                value={formData.address_1}
                                onChange={handleChange}
                                placeholder="Address"
                                className="w-full border rounded px-3 py-2"
                            />
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                                className="w-full border rounded px-3 py-2"
                            />
                            <input
                                type="text"
                                name="zipcode"
                                value={formData.zipcode}
                                onChange={handleChange}
                                placeholder="Zipcode"
                                className="w-full border rounded px-3 py-2"
                            />
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Country"
                                className="w-full border rounded px-3 py-2"
                            />
                            <input
                                type="file"
                                name="profile_picture"
                                accept="image/*"
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />

                            <div className="flex space-x-4">
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

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
                                    <p className="font-medium">
                                        Order #{order.id} -{" "}
                                        {new Date(order.created).toLocaleString()}
                                    </p>
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
                                                <p>Status: {order.status || "Pending"}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="p-6 text-gray-500">No orders yet.</p>
                    )}
                </div>
            )}

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
    );
};

export default Profile;

