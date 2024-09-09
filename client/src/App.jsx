import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Login from "./app/auth/login/Login";
import Register from "./app/auth/register/Register";
import Cuisines from "./components/Cuisine";
import KitchenPage from "./components/KitchenPage";
import UserDetails from "./app/user/UserDetails";
import CartCheckout from "./app/user/CartCheckout";

import UserLayout from "./app/layouts/UserLayout";
import BukaLayout from "./app/layouts/BukaLayout";
import AdminLayout from "./app/layouts/AdminLayout";

import BukaProfile from "./app/buka/BukaProfile";
import BukaOrders from "./app/buka/BukaOrder";
import BukaShop from "./app/buka/BukaShop";
import Overview from "./app/buka/Overview";
import AdminOverview from "./app/admin/AdminOverview";
import AdminUser from "./app/admin/AdminUser";
import AdminBuka from "./app/admin/AdminBuka";
import AdminTransaction from "./app/admin/AdminTransaction";
import Success from "./components/Success";
import Cancel from "./components/Cancel";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const location = useLocation(); // Get the current location

  // Define paths where the Navbar and Footer should be hidden
  const authPaths = ["/login", "/register"];

  // Conditionally render Navbar and Footer based on the current path
  const showNavbarAndFooter = !authPaths.includes(location.pathname);

  return (
    <Routes>
      {/* Routes for user */}
      <Route element={<UserLayout showNavbarAndFooter={showNavbarAndFooter} />}>
        <Route path="/" element={<Home />} />
        <Route path="/cuisine" element={<Cuisines />} />
        <Route path="/kitchen/:id" element={<KitchenPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        {/* Routes for user */}
        <Route
          element={<UserLayout showNavbarAndFooter={showNavbarAndFooter} />}
        >
          <Route path="/user/settings" element={<UserDetails />} />
          <Route path="/user/checkout" element={<CartCheckout />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        {/* Routes for buka */}
        <Route element={<BukaLayout />}>
          <Route path="/buka/dashboard" element={<Overview />} />
          <Route path="/buka/shop" element={<BukaShop />} />
          <Route path="/buka/orders" element={<BukaOrders />} />
          <Route path="/buka/profile" element={<BukaProfile />} />
        </Route>
      </Route>

      {/* Protected route */}
      <Route element={<ProtectedRoute />}>
        {/* Routes for admin */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminOverview />} />
          <Route path="/admin/users" element={<AdminUser />} />
          <Route path="/admin/bukas" element={<AdminBuka />} />
          <Route path="/admin/transaction" element={<AdminTransaction />} />
        </Route>
      </Route>

      {/* Routes for payment */}
      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<Cancel />} />
    </Routes>
  );
};

export default App;
