// import React, { useState } from "react";
// import axios from "axios";
// import BASE_URL from "../config";
// import { useNavigate } from "react-router-dom";
//
// const Register = () => {
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${BASE_URL}/api/user/register/`, {
//         phone,
//         email,
//         password,
//       });
//       alert("Registration successful! Please login.");
//       navigate("/login");
//     } catch (err) {
//       alert("Registration failed!");
//     }
//   };
//
//   return (
//     <div className="p-10">
//       <h2 className="text-2xl mb-4">Register</h2>
//       <form onSubmit={handleRegister}>
//         <input
//           type="text"
//           placeholder="Phone Number"
//           className="block mb-2 p-2 border"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           required
//         />
//         <input
//           type="email"
//           // placeholder="Email (optional)"
//           placeholder="Email)"
//           className="block mb-2 p-2 border"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="block mb-4 p-2 border"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button
//           className="bg-green-500 text-white px-4 py-2 rounded"
//           type="submit"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };
//
// export default Register;



import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/user/register/`, {
        phone,
        email,
        password,
      });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed!");
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 border rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
          type="submit"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
