import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/UserStore";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const { details, validateToken } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Validate the token when the component mounts
    validateToken();
  }, [validateToken]);

  const logout = () => {
    Cookies.remove("user");
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center px-3 bg-white border-b">
      {/* Left side */}
      <div className="flex items-center">
        <div className="ml-4">
          <div className="text-lg font-semibold">
            {details?.first_name} {details?.last_name}
          </div>
          <div className={`text-sm`}>Admin</div>
        </div>
      </div>

      {/* Center image */}
      <div className="flex-1 text-center">
        <img
          src="/buka-logo.png"
          alt="Kitchen"
          className="mx-auto"
          width={200}
          height={200}
        />
      </div>

      {/* Right side */}
      <div>
        <Button onClick={logout}>Logout</Button>
      </div>
    </div>
  );
};

export default AdminNavbar;
