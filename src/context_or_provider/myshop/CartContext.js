// import {createContext, useContext, useState, useEffect} from "react";
// import {useNavigate} from "react-router-dom";
// import axiosInstance from "../api/axiosInstance";
//
// const CartContext = createContext();
//
// export const CartProvider = ({children}) => {
//     const [cart, setCart] = useState([]);
//     const [orders, setOrders] = useState([]); // ✅ order list
//     // const [billingAddress, setBillingAddress] = useState([]); // ✅ billingAddress
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//
//     // ✅ helper function: token সহ axios headers বানাও
//     const getAuthHeaders = () => {
//         const token = localStorage.getItem("access");
//         return token
//             ? {headers: {Authorization: `Bearer ${token}`}}
//             : null;
//     };
//
//     // ✅ Fetch cart data
//     const fetchCart = async () => {
//         try {
//             setLoading(true);
//             const headers = getAuthHeaders();
//             if (!headers) {
//                 setCart([]);
//                 return;
//             }
//             const res = await axiosInstance.get(`/api/order-app/carts/`, headers);
//             setCart(res.data);
//         } catch (error) {
//             console.error("Cart fetch error:", error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // ✅ Fetch orders
//     const fetchOrders = async () => {
//         try {
//             const headers = getAuthHeaders();
//             if (!headers) return;
//
//             const res = await axiosInstance.get(`/api/order-app/orders/`, headers);
//             setOrders(res.data);
//         } catch (error) {
//             console.error("Order fetch error:", error);
//         }
//     };
//
//     useEffect(() => {
//         fetchCart();
//         fetchOrders();
//     }, []);
//
//
//
//
//     // ✅ Add to cart
//
//
//
//
//     const addToCart = async (product) => {
//         const headers = getAuthHeaders();
//         if (!headers) {
//             alert("Please login to add items to cart");
//             navigate("/login");
//             return;
//         }
//
//         try {
//             // Step 1: Check if product already in cart
//             const existingItem = cart.find((c) => c.item === product.id);
//
//             if (existingItem) {
//                 // Step 2: Increase qty
//                 await axiosInstance.patch(
//                     `/api/order-app/carts/${existingItem.id}/`,
//                     {quantity: existingItem.quantity + 1},
//                     headers
//                 );
//             } else {
//                 // Step 3: Add new product
//                 await axiosInstance.post(
//                     `/api/order-app/carts/`,
//                     {item: product.id, quantity: 1},
//                     headers
//                 );
//             }
//
//             // Refresh cart
//             fetchCart();
//         } catch (error) {
//             console.error("Add to cart error:", error.response?.data || error.message);
//         }
//     };
//
//
//
//
//     // ✅ Checkout (create order) এখন shipping info, payment & delivery type handle করবে
// // ✅ Checkout function এখন shipping info সহ ঠিকভাবে backend পাঠাবে
//     const checkout = async (shippingPayload = null) => {
//         const headers = getAuthHeaders();
//         if (!headers) return navigate("/login");
//
//         try {
//             let payload = {};
//             if (shippingPayload) {
//                 payload = shippingPayload;
//             } else {
//                 // default billing address নাও
//                 const billingRes = await axiosInstance.get(`/api/payment-app/shipping-address/`, headers);
//                 const billing = billingRes.data[0]; // প্রথম address
//                 if (!billing) throw new Error("No billing address found");
//
//                 payload = {
//                     receiver_name: billing.name || "",
//                     receiver_email: billing.email || "",
//                     receiver_phone_number: billing.phone || "",
//                     receiver_address: billing.address || "",
//                     receiver_city: billing.city || "",
//                     receiver_zip_code: billing.zipcode || "",
//                     receiver_country: billing.country || "",
//                 };
//             }
//
//             const res = await axiosInstance.post(`/api/order-app/orders/`, payload, headers);
//
//             // cart refresh
//             fetchOrders();
//             fetchCart();
//
//             return res.data;
//         } catch (error) {
//             console.error("Checkout error:", error.response?.data || error.message);
//             throw error;
//         }
//     };
//
//
//     // ✅ Quantity increase
//     const increaseQuantity = async (cartItemId) => {
//         const headers = getAuthHeaders();
//         if (!headers) return navigate("/login");
//
//         try {
//             await axiosInstance.patch(
//                 `/api/order-app/carts/${cartItemId}/`,
//                 {quantity: cart.find((c) => c.id === cartItemId).quantity + 1},
//                 headers
//             );
//             fetchCart();
//         } catch (error) {
//             console.error("Increase qty error:", error);
//         }
//     };
//
//     // ✅ Quantity decrease
//     const decreaseQuantity = async (cartItemId) => {
//         const headers = getAuthHeaders();
//         if (!headers) return navigate("/login");
//
//         try {
//             const current = cart.find((c) => c.id === cartItemId);
//             if (current.quantity > 1) {
//                 await axiosInstance.patch(
//                     `/api/order-app/carts/${cartItemId}/`,
//                     {quantity: current.quantity - 1},
//                     headers
//                 );
//                 fetchCart();
//             }
//         } catch (error) {
//             console.error("Decrease qty error:", error);
//         }
//     };
//
//     // ✅ Remove item
//     const removeFromCart = async (cartItemId) => {
//         const headers = getAuthHeaders();
//         if (!headers) return navigate("/login");
//
//         try {
//             await axiosInstance.delete(`/api/order-app/carts/${cartItemId}/`, headers);
//             fetchCart();
//         } catch (error) {
//             console.error("Remove cart item error:", error);
//         }
//     };
//
//     // ✅ Clear all cart items
//     const clearCart = async () => {
//         const headers = getAuthHeaders();
//         if (!headers) return navigate("/login");
//
//         try {
//             await Promise.all(
//                 cart.map((item) =>
//                     axiosInstance.delete(`/api/order-app/carts/${item.id}/`, headers)
//                 )
//             );
//             setCart([]);
//         } catch (error) {
//             console.error("Clear cart error:", error);
//         }
//     };
//
//     return (
//         <CartContext.Provider
//             value={{
//                 cart,
//                 orders, // ✅ এখন orders ও available
//                 loading,
//                 // fetchBillingAddress,
//                 addToCart,
//                 removeFromCart,
//                 clearCart,
//                 increaseQuantity,
//                 decreaseQuantity,
//                 fetchCart,
//                 fetchOrders,
//                 checkout, // ✅ Checkout function
//             }}
//         >
//             {children}
//         </CartContext.Provider>
//     );
// };
//
// export const useCart = () => useContext(CartContext);




////////////////////////////////////////////////////////////////




// ✅ CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../myshop/api/axiosInstance";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Helper function: token check করো
  const getAuthHeaders = () => {
    const token = localStorage.getItem("access");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : null;
  };

  const isAuthenticated = !!localStorage.getItem("access");

  // ✅ Cart data fetch (শুধু logged-in user এর জন্য)
  const fetchCart = async () => {
    if (!isAuthenticated) {
      // guest cart localStorage থেকে আনো
      const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      setCart(guestCart);
      return;
    }

    try {
      setLoading(true);
      // const res = await axiosInstance.get(`/api/order-app/carts/`, getAuthHeaders());
      const res = await axiosInstance.get(`/api/payment-app/carts/`, getAuthHeaders());
      setCart(res.data);
    } catch (error) {
      console.error("Cart fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Orders fetch (শুধু logged-in user এর জন্য)
  const fetchOrders = async () => {
    if (!isAuthenticated) return;

    try {
      // const res = await axiosInstance.get(`/api/order-app/orders/`, getAuthHeaders());
      const res = await axiosInstance.get(`/api/payment-app/orders/`, getAuthHeaders());
      setOrders(res.data);
    } catch (error) {
      console.error("Order fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchOrders();
  }, []);

  // ✅ Helper: guest cart localStorage-এ save
  const saveGuestCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("guest_cart", JSON.stringify(newCart));
  };

  // ✅ Add to Cart
  const addToCart = async (product) => {
    // 🔹 যদি user authenticated না হয়, তাহলে localStorage এ রাখো
    if (!isAuthenticated) {
      const existing = cart.find((c) => c.id === product.id);
      let updatedCart;
      if (existing) {
        updatedCart = cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // updatedCart = [...cart, { ...product, quantity: 1 }];

                updatedCart = [
        ...cart,
        {
          id: product.id,
          item_name: product.name,
          product_image: product.mainimage || product.thumbnail || "", // image field যেটা available
          item_price: product.price,
          quantity: 1,
        },
      ];
      }
      saveGuestCart(updatedCart);
      return;
    }

    // 🔹 logged-in user হলে backend এ পাঠাও
    try {
      const existingItem = cart.find((c) => c.item === product.id);

      if (existingItem) {
        await axiosInstance.patch(
          // `/api/order-app/carts/${existingItem.id}/`,
          `/api/payment-app/carts/${existingItem.id}/`,
          { quantity: existingItem.quantity + 1 },
          getAuthHeaders()
        );
      } else {
        await axiosInstance.post(
          // `/api/order-app/carts/`,
          `/api/payment-app/carts/`,
          { item: product.id, quantity: 1 },
          getAuthHeaders()
        );
      }

      fetchCart();
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  // ✅ Quantity increase/decrease/remove/clear (guest + user উভয়ের জন্য)
  const increaseQuantity = async (cartItemId) => {
    if (!isAuthenticated) {
      const updated = cart.map((i) =>
        i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
      );
      saveGuestCart(updated);
      return;
    }

    try {
      const current = cart.find((c) => c.id === cartItemId);
      await axiosInstance.patch(
        // `/api/order-app/carts/${cartItemId}/`,
        `/api/payment-app/carts/${cartItemId}/`,
        { quantity: current.quantity + 1 },
        getAuthHeaders()
      );
      fetchCart();
    } catch (error) {
      console.error("Increase qty error:", error);
    }
  };

  const decreaseQuantity = async (cartItemId) => {
    if (!isAuthenticated) {
      const updated = cart
        .map((i) =>
          i.id === cartItemId && i.quantity > 1
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0);
      saveGuestCart(updated);
      return;
    }

    try {
      const current = cart.find((c) => c.id === cartItemId);
      if (current.quantity > 1) {
        await axiosInstance.patch(
          // `/api/order-app/carts/${cartItemId}/`,
          `/api/payment-app/carts/${cartItemId}/`,
          { quantity: current.quantity - 1 },
          getAuthHeaders()
        );
        fetchCart();
      }
    } catch (error) {
      console.error("Decrease qty error:", error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!isAuthenticated) {
      const updated = cart.filter((i) => i.id !== cartItemId);
      saveGuestCart(updated);
      return;
    }

    try {
      // await axiosInstance.delete(`/api/order-app/carts/${cartItemId}/`, getAuthHeaders());
      await axiosInstance.delete(`/api/payment-app/carts/${cartItemId}/`, getAuthHeaders());
      fetchCart();
    } catch (error) {
      console.error("Remove cart item error:", error);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      localStorage.removeItem("guest_cart");
      setCart([]);
      return;
    }

    try {
      await Promise.all(
        cart.map((item) =>
          // axiosInstance.delete(`/api/order-app/carts/${item.id}/`, getAuthHeaders())
          axiosInstance.delete(`/api/payment-app/carts/${item.id}/`, getAuthHeaders())
        )
      );
      setCart([]);
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  };

  // ✅ Checkout (guest + user দুইভাবে কাজ করবে)
  const checkout = async (shippingPayload = null) => {
    try {
      let payload = shippingPayload || {};

      if (isAuthenticated) {
        // 🔹 logged-in user → backend order endpoint
        // const res = await axiosInstance.post(`/api/order-app/orders/`, payload, getAuthHeaders());
        const res = await axiosInstance.post(`/api/payment-app/orders/`, payload, getAuthHeaders());
        fetchOrders();
        fetchCart();
        return res.data;
      } else {
        // 🔹 guest user → আলাদা guest-order endpoint
        const guestPayload = {
          ...payload,
          items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price || item.item_price,
          })),
        };

        const res = await axiosInstance.post(`/api/order-app/guest-orders/`, guestPayload);
        clearCart(); // guest cart clear করো
        alert("✅ Order placed successfully as Guest!");
        return res.data;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        fetchCart,
        fetchOrders,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
