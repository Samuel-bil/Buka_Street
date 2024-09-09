import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/UserStore";
import { useEffect } from "react";

const BukaNavbar = () => {
  const { details, validateToken } = useUserStore();
  useEffect(() => {
    // Validate the token when the component mounts
    validateToken();
  }, [validateToken]);

  const navigate = useNavigate();

  const logout = () => {
    Cookies.remove("user");
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center px-3 bg-white border-b">
      {/* Left side */}
      <div className="flex items-center">
        <div className="ml-4">
          <div className="text-lg font-semibold">{details?.buka_name}</div>
          <div
            className={`text-sm ${
              details?.go_live ? "text-green-500 " : "text-red-500"
            }`}
          >
            {details?.go_live ? "Active" : "Not Active"}
          </div>
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

export default BukaNavbar;
