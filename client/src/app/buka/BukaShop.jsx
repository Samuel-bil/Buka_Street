import { useEffect, useState } from "react";
import AllProduct from "@/components/AllProduct";
import { useUserStore } from "@/store/UserStore";
import BukaInformation from "./BukaInfo";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { CircleLoader } from "react-spinners";

const BukaShop = () => {
  const { details, updateUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (details) {
      setToken(Cookies.get("user"));
    }
  }, [details]);

  // Function to update the details
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://buka-store.vercel.app/api/bukas/${details._id}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 200) {
        updateUser(response.data); // Update the store with the new data
        toast.success("Buka updated successfully");

        setToken(response.data.token); // Update the token state
      }
    } catch (err) {
      console.error("Failed to fetch updated details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <CircleLoader color="#3498db" size={60} />
        </div>
      )}
      <div className="w-full h-[400px] relative mb-3">
        <img
          src={details?.image}
          alt={details?.buka_name}
          className="w-full h-[400px] object-cover"
        />
      </div>
      <BukaInformation details={details} onUpdate={handleUpdate} />
      {/* Cuisine Item */}
      <AllProduct />
    </div>
  );
};

export default BukaShop;
