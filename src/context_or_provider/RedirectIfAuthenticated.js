// RedirectIfAuthenticated.js
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // তোমার AuthContext এর path অনুযায়ী import

const RedirectIfAuthenticated = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // যদি logged-in হয়, তাহলে "/" এ পাঠিয়ে দাও
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  else

  // নাহলে children (মানে Login Page) দেখাও
  return children;
};

export default RedirectIfAuthenticated;
