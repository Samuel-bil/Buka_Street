import { Outlet } from "react-router-dom";
import BukaNavbar from "../../components/BukaNavbar";
import BukaFooter from "../../components/BukaFooter";
import BukaDashboard from "../buka/BukaDashboard";

const BukaLayout = () => {
  return (
    <>
      <BukaNavbar />
      <div className="flex min-h-[90vh]">
        {/* Sidebar */}
        <BukaDashboard />
        {/* Main content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
      <BukaFooter />
    </>
  );
};

export default BukaLayout;
