import React, { useEffect, useState } from "react";
import { useAuth } from "../context_or_provider/AuthContext";
import axiosInstance from "../api/axiosInstance";

const ProfileUpdate = () => {
  const { profile, setProfile, loadingProfile } = useAuth();
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
  const [loading, setLoading] = useState(false);

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
        profile_picture: null,
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_picture") {
      setFormData({ ...formData, profile_picture: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      for (let key in formData) {
        if (formData[key] !== null) data.append(key, formData[key]);
      }

      const res = await axiosInstance.patch(
        `/api/user/profiles/${profile.id}/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile(res.data); // Context update
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Profile update failed!");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) return <p>Loading profile...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="mb-2 p-2 border w-full"
        />
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          className="mb-2 p-2 border w-full"
        />
        <input
          type="text"
          name="address_1"
          placeholder="Address"
          value={formData.address_1}
          onChange={handleChange}
          className="mb-2 p-2 border w-full"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="mb-2 p-2 border w-full"
        />
        <input
          type="text"
          name="zipcode"
          placeholder="Zipcode"
          value={formData.zipcode}
          onChange={handleChange}
          className="mb-2 p-2 border w-full"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          className="mb-2 p-2 border w-full"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="mb-2 p-2 border w-full"
        />
        <input
          type="file"
          name="profile_picture"
          onChange={handleChange}
          className="mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
