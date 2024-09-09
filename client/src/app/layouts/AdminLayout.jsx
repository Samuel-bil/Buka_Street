import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import AdminFooter from "../../components/AdminFooter";
import AdminDashboard from "../admin/AdminDashbaord";

const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <div className="flex min-h-[90vh]">
        {/* Sidebar */}
        <AdminDashboard />
        {/* Main content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
      <AdminFooter />
    </>
  );
};

export default AdminLayout;
