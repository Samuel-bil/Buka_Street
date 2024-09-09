import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const cookieNames = Object.keys(Cookies.get());
  const userRoles = new Set(["user", "buka", "admin"]);

  const isLoggedIn = cookieNames.some((name) => userRoles.has(name));

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
