import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/UserStore";
import { ShoppingBasket } from "lucide-react";
import { useCartStore } from "@/store/CartStore";

const UserNavbar = () => {
  const [preOrder, setPreOrder] = useState(false);
  const { details, validateToken } = useUserStore();

  const { cart } = useCartStore();

  useEffect(() => {
    // Validate the token when the component mounts
    validateToken();
  }, [validateToken]);

  const router = useNavigate();
  const handleToggle = () => {
    setPreOrder(!preOrder);
  };

  const logout = () => {
    Cookies.remove("user");
    router("/login");
  };

  // Calculate the total number of items in the cart
  const totalItemsInCart = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="flex justify-between items-center px-10 py-2 ">
      <Link to="/">
        <div>
          <img src="/buka-logo.png" width="120" />
        </div>
      </Link>

      <div className="flex items-center gap-3  ">
        <div
          className="relative w-36 h-10 rounded-full cursor-pointer transition-all duration-300 bg-gray-300 flex justify-between"
          onClick={handleToggle}
        >
          <span
            className={`flex-1 text-center text-[0.8rem] rounded-full py-2 transition-colors duration-300 ${
              preOrder ? "bg-green-600 text-white" : "bg-gray-300 text-black"
            }`}
          >
            Pre-Order
          </span>
          <span
            className={`flex-1 text-center text-[0.8rem] rounded-full py-2 transition-colors duration-300 ${
              preOrder ? "bg-gray-300 text-black" : "bg-green-600 text-white"
            }`}
          >
            Order Now
          </span>
        </div>

        <Link
          to="/user/checkout"
          className=" flex justify-center items-center rounded md text-[1.2rem] text-black relative"
        >
          <ShoppingBasket />
          {totalItemsInCart > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totalItemsInCart}
            </span>
          )}
        </Link>
        <Link
          to="/cuisine"
          className=" flex justify-center items-center rounded md text-[1.2rem] text-black  "
        >
          Catering
        </Link>
        {details ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-1">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <img src={details?.image} className="h-5 w-5 rounded-full" />
                </Button>
                <span className="hidden md:block text-sm font-medium">
                  {details?.first_name}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                {" "}
                <Link
                  to={details?.first_name ? "/user/settings" : "/buka/settings"}
                >
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 hover:text-red-600"
                onClick={logout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-2">
            <Link
              to="/login"
              className="bg-green-500 w-[100px] h-[30px] flex justify-center items-center rounded md text-sm text-black   "
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNavbar;
