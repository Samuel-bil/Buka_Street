import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUserStore } from "@/store/UserStore";

// Define your endpoints
const userEndpoint = "https://buka-street.vercel.app/api/users/signin";
const bukaEndpoint = "https://buka-street.vercel.app/api/bukas/login";

export const useLogin = (email, password, setLoading) => {
  const navigate = useNavigate();
  const { validateToken } = useUserStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Fetch user information based on the email to determine their role
      const roleResponse = await axios.post(
        "https://buka-street.vercel.app/api/users/role",
        { email }
      );
      const userRole = roleResponse.data.role;

      // Step 2: Determine the login endpoint based on the role
      let loginEndpoint = userEndpoint;
      if (userRole === "buka") {
        loginEndpoint = bukaEndpoint;
      }

      // Step 3: Proceed with the login process using the appropriate endpoint
      const response = await axios.post(loginEndpoint, { email, password });

      // Step 4: Update the user details in the global state
      await validateToken(response?.data?.user?.token);

      setLoading(false);
      toast.success("Login successfully", {
        action: {
          label: "Close",
          onClick: () => console.log("Undo"),
        },
      });

      // Set cookie based on role
      if (userRole === "user") {
        Cookies.set("user", response?.data?.user?.token);
        navigate("/");
      } else if (userRole === "buka") {
        Cookies.set("user", response?.data?.user?.token);
        navigate("/buka/dashboard");
      } else if (userRole === "admin") {
        Cookies.set("user", response?.data?.user?.token);
        navigate("/admin/dashboard");
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.errors
        ? error.response.data.errors.join(", ")
        : error.response?.data?.message || error.message;

      toast.error(<div>{errorMessage}</div>, {
        action: {
          label: "Close",
          onClick: () => console.log("Undo"),
        },
      });
    }
  };

  return { handleLogin };
};
