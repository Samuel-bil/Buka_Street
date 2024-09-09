"use client";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"

const endpoint = "https://buka-street.vercel.app/api/users/";
const buka_endpoint = "https://buka-street.vercel.app/api/bukas/";

export const useRegister = (
  firstName,
  lastName,
  password,
  email,
  setLoading,
  role,
  bukaName
) => {
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (role === "user") {
        if (!firstName || !lastName || !email || !password) {
          toast.error("All fields are required");
          setLoading(false);
          return;
        }

        const res = await axios.post(
          endpoint + "signup",
          { first_name: firstName, last_name: lastName, email, password, role },
          { withCredentials: true }
        );

        toast.success(res?.data?.message);
        Cookies.set("user", res.data?.user?.token);
        navigate("/login");
      } else {
        if (!bukaName || !email || !password) {
          toast.error("All fields are required");
          setLoading(false);
          return;
        }

        const res = await axios.post(
          buka_endpoint + "register",
          { buka_name: bukaName, email, password, role },
          { withCredentials: true }
        );

        toast.success(res?.data?.message);
        Cookies.set("user", res.data?.user?.token);
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      toast.error(
        <div>
          {err.response?.data?.errors
            ? err.response.data.errors.map((item, index) => (
                <div key={index}>{item}</div>
              ))
            : err.response?.data?.message || "An error occurred"}
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister };
};
