// import React, {useState} from "react";
// import axios from "axios";
// import {useNavigate} from "react-router-dom";
// import BASE_URL from "../config";
// import {useAuth} from "../context_or_provider/AuthContext";
//
// const Login = () => {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const navigate = useNavigate();
//     const {setIsAuthenticated} = useAuth(); // 🔥 এটাকে নিয়ে এসো
//
//
//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await axios.post(`${BASE_URL}/api/token/`, {
//                 username,
//                 password,
//             });
//
//             localStorage.setItem("access", res.data.access);
//             localStorage.setItem("refresh", res.data.refresh);
//
//             setIsAuthenticated(true); // ✅ এখানে user কে authenticated করে দাও
//
//
//             navigate("/"); // Login successful, go to Home
//         } catch (err) {
//             alert("Login failed!");
//         }
//     };
//
//     return (
//         <div className="p-10">
//             <h2 className="text-2xl mb-4">Login</h2>
//             <form onSubmit={handleLogin}>
//                 <input
//                     type="text"
//                     placeholder="Username"
//                     className="block mb-2 p-2 border"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     className="block mb-4 p-2 border"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
//                     Login
//                 </button>
//             </form>
//         </div>
//     );
// };
//
// export default Login;


import React, {useState} from "react";
import axios from "axios";
import {Navigate, useNavigate,Link} from "react-router-dom";
import BASE_URL from "../config";
import {useAuth} from "../context_or_provider/AuthContext";

const Login = () => {
    // const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const {setIsAuthenticated} = useAuth(); // 🔥 এটাকে নিয়ে এসো


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${BASE_URL}/api/token/`, {
                phone,
                password,
            });

            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);

            setIsAuthenticated(true); // ✅ এখানে user কে authenticated করে দাও


            navigate("/"); // Login successful, go to Home
        } catch (err) {
            alert("Login failed!");
        }
    };

    return (
        <div className="p-10">
            <h2 className="text-2xl mb-4">Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="PhoneNumber"
                    className="block mb-2 p-2 border"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="block mb-4 p-2 border"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
                    Login
                </button>


                {/*<button onClick={() => navigate("/")}>Home</button>*/}

                <Link to="/"><button>Home</button></Link>

                <br/>
                <Link to="/register"><button>Create New Account</button></Link>


                {/*/!*<Navigate to="/"/>*!/    direct kono page e niye jawar ability rakhe*/}
            </form>
        </div>
    );
};

export default Login;

