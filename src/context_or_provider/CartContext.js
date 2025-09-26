
import {createContext, useContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]); // ✅ order list
    // const [billingAddress, setBillingAddress] = useState([]); // ✅ billingAddress
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // ✅ helper function: token সহ axios headers বানাও
    const getAuthHeaders = () => {
        const token = localStorage.getItem("access");
        return token
            ? {headers: {Authorization: `Bearer ${token}`}}
            : null;
    };

    // ✅ Fetch cart data
    const fetchCart = async () => {
        try {
            setLoading(true);
            const headers = getAuthHeaders();
            if (!headers) {
                setCart([]);
                return;
            }
            const res = await axiosInstance.get(`/api/order-app/carts/`, headers);
            setCart(res.data);
        } catch (error) {
            console.error("Cart fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch orders
    const fetchOrders = async () => {
        try {
            const headers = getAuthHeaders();
            if (!headers) return;

            const res = await axiosInstance.get(`/api/order-app/orders/`, headers);
            setOrders(res.data);
        } catch (error) {
            console.error("Order fetch error:", error);
        }
    };

    useEffect(() => {
        fetchCart();
        fetchOrders();
    }, []);

    // const fetchBillingAddress = async () => {
    //     try {
    //         const headers = getAuthHeaders();
    //         if (!headers) return;
    //
    //         const res = await axiosInstance.get(`/api/payment-app/shipping-address/`, headers);
    //         setOrders(res.data);
    //     } catch (error) {
    //         console.error("BillingAdress fetch error:", error);
    //     }
    // };


    // ✅ Add to cart
    const addToCart = async (product) => {
        const headers = getAuthHeaders();
        if (!headers) {
            alert("Please login to add items to cart");
            navigate("/login");
            return;
        }

        try {
            await axiosInstance.post(
                `/api/order-app/carts/`,
                {item: product.id, quantity: 1},
                headers
            );
            fetchCart();
        } catch (error) {
            console.error("Add to cart error:", error.response?.data || error.message);
        }
    };

    // ✅ Checkout (create order)
    // const checkout = async () => {
    //     const headers = getAuthHeaders();
    //     if (!headers) return navigate("/login");
    //
    //     try {
    //         const res = await axiosInstance.post(`/api/order-app/orders/`, {}, headers);
    //         fetchOrders();
    //         fetchCart(); // cart refresh হবে (কারণ purchased=True হয়ে যাবে)
    //         return res.data;
    //     } catch (error) {
    //         console.error("Checkout error:", error.response?.data || error.message);
    //     }
    // };


    // ✅ Checkout (create order) এখন shipping info, payment & delivery type handle করবে
// ✅ Checkout function এখন shipping info সহ ঠিকভাবে backend পাঠাবে
    const checkout = async (shippingPayload = null) => {
        const headers = getAuthHeaders();
        if (!headers) return navigate("/login");

        try {
            let payload = {};
            if (shippingPayload) {
                payload = shippingPayload;
            } else {
                // default billing address নাও
                const billingRes = await axiosInstance.get(`/api/payment-app/shipping-address/`, headers);
                const billing = billingRes.data[0]; // প্রথম address
                if (!billing) throw new Error("No billing address found");

                payload = {
                    receiver_name: billing.name || "",
                    receiver_email: billing.email || "",
                    receiver_phone_number: billing.phone || "",
                    receiver_address: billing.address || "",
                    receiver_city: billing.city || "",
                    receiver_zip_code: billing.zipcode || "",
                    receiver_country: billing.country || "",
                };
            }

            const res = await axiosInstance.post(`/api/order-app/orders/`, payload, headers);

            // cart refresh
            fetchOrders();
            fetchCart();

            return res.data;
        } catch (error) {
            console.error("Checkout error:", error.response?.data || error.message);
            throw error;
        }
    };


    // ✅ Quantity increase
    const increaseQuantity = async (cartItemId) => {
        const headers = getAuthHeaders();
        if (!headers) return navigate("/login");

        try {
            await axiosInstance.patch(
                `/api/order-app/carts/${cartItemId}/`,
                {quantity: cart.find((c) => c.id === cartItemId).quantity + 1},
                headers
            );
            fetchCart();
        } catch (error) {
            console.error("Increase qty error:", error);
        }
    };

    // ✅ Quantity decrease
    const decreaseQuantity = async (cartItemId) => {
        const headers = getAuthHeaders();
        if (!headers) return navigate("/login");

        try {
            const current = cart.find((c) => c.id === cartItemId);
            if (current.quantity > 1) {
                await axiosInstance.patch(
                    `/api/order-app/carts/${cartItemId}/`,
                    {quantity: current.quantity - 1},
                    headers
                );
                fetchCart();
            }
        } catch (error) {
            console.error("Decrease qty error:", error);
        }
    };

    // ✅ Remove item
    const removeFromCart = async (cartItemId) => {
        const headers = getAuthHeaders();
        if (!headers) return navigate("/login");

        try {
            await axiosInstance.delete(`/api/order-app/carts/${cartItemId}/`, headers);
            fetchCart();
        } catch (error) {
            console.error("Remove cart item error:", error);
        }
    };

    // ✅ Clear all cart items
    const clearCart = async () => {
        const headers = getAuthHeaders();
        if (!headers) return navigate("/login");

        try {
            await Promise.all(
                cart.map((item) =>
                    axiosInstance.delete(`/api/order-app/carts/${item.id}/`, headers)
                )
            );
            setCart([]);
        } catch (error) {
            console.error("Clear cart error:", error);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                orders, // ✅ এখন orders ও available
                loading,
                // fetchBillingAddress,
                addToCart,
                removeFromCart,
                clearCart,
                increaseQuantity,
                decreaseQuantity,
                fetchCart,
                fetchOrders,
                checkout, // ✅ Checkout function
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
