import UserNavbar from "../../components/UserNavbar";
import UserFooter from "../../components/UserFooter";
import { Outlet } from "react-router-dom";

const UserLayout = ({ showNavbarAndFooter }) => {
  return (
    <div>
      {showNavbarAndFooter && <UserNavbar />}
      <main>
        <Outlet />
      </main>
      {showNavbarAndFooter && <UserFooter />}
    </div>
  );
};

export default UserLayout;
