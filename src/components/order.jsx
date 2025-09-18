import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) return;

      const res = await axiosInstance.get("/api/order-app/orders/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Orders fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading your orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 dark:text-gray-300">No orders found</p>
        <Link
          to="/products"
          className="text-orange-500 font-semibold hover:underline"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Order #{order.id} —{" "}
                <span className="text-sm text-gray-500">
                  {new Date(order.created).toLocaleString()}
                </span>
              </h2>
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  order.ordered
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.ordered ? "Completed" : "Pending"}
              </span>
            </div>

            {/* Order items */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {order.orderitems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-2 text-sm"
                >
                  <span>
                    {item.item_name} × {item.quantity}
                  </span>
                  <span>${item.total}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total:</span>
              <span>${order.total}</span>
            </div>

            {/* Payment Button (optional) */}
            {!order.paymentId && (
              <button
                onClick={() =>
                  alert("এখানে initiate_payment API কল করতে হবে 🚀")
                }
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
              >
                Pay Now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
