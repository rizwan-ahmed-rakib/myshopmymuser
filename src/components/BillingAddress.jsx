import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
const BillingAddress = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipcode: "",
    country: "",
  });

  const [loading, setLoading] = useState(true);
  const [addressId, setAddressId] = useState(null);

  // Fetch existing billing address
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const token = localStorage.getItem("access"); // JWT token
        const res = await axios.get(`${BASE_URL}/api/payment-app/shipping-address/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && res.data.length > 0) {
          const addr = res.data[0];
          setFormData(addr);
          setAddressId(addr.id);
        }
      } catch (err) {
        console.error("Error fetching billing address:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access");
      if (!token) {
        alert("Please login first");
        return;
      }

      if (addressId) {
        // Update existing address
        await axios.put(
          `${BASE_URL}/api/payment-app/shipping-address/${addressId}/`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Billing address updated successfully!");
      } else {
        // Create new address
        await axios.post(
          `${BASE_URL}/api/payment-app/shipping-address/`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Billing address created successfully!");
      }
    } catch (err) {
      console.error("Error saving billing address:", err);
      alert("Something went wrong!");
    }
  };

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Regular Billing Address</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Street Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="text"
            name="zipcode"
            placeholder="Zip Code"
            value={formData.zipcode}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg"
        >
          {addressId ? "Update Address" : "Save Address"}
        </button>
      </form>
    </div>

  );
};

export default BillingAddress;
