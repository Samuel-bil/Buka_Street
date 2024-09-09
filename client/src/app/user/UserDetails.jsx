import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";
import { toast } from "sonner";
import { LogOut, Settings } from "lucide-react";
import { useUserStore } from "@/store/UserStore";

const endpoint = "https://buka-store.vercel.app/api/users/updateuser";

function UserDetails() {
  const { details, updateUser } = useUserStore();
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (details) {
      setToken(Cookies.get("user"));
    }
  }, [details]);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = details || {};

  useEffect(() => {
    if (user) {
      setFirstName(user?.first_name);
      setLastName(user?.last_name);
      setPhone(user?.phone);
      setEmail(user?.email);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImage(null);
      setImagePreview("");
    }
  };

  const updateUserHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    if (image) {
      formData.append("image", image);
    }
    formData.append("phone", phone);
    formData.append("email", email);

    try {
      const response = await axios.put(endpoint, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      });
      if (response.status === 200) {
        setLoading(false);
        toast.success("User updated successfully");
        setSuccess("Data updated successfully");

        // Update the user cookie with the updated user data
        const updatedUser = response.data.user;
        updateUser(updatedUser);

        // Update the token in local state or cookies
        setToken(updatedUser.token); // Update the token state

        // Optionally update the state if needed
        setFirstName(updatedUser.first_name);
        setLastName(updatedUser.last_name);
        setPhone(updatedUser.phone);
        setImagePreview(updatedUser.image);
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleLogout = () => {
    Cookies.remove("user");
    navigate("/");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#f1f1f1] text-black h-screen p-4">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <ul className="space-y-4">
          <li className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <button
              onClick={() => navigate("/user/settings")}
              className="hover:text-gray-400"
            >
              Settings
            </button>
          </li>
          <li className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            <button onClick={handleLogout} className="hover:text-gray-400">
              Logout
            </button>
          </li>
        </ul>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-lg font-semibold md:text-2xl mb-4">
          Profile Information
        </h1>
        <form className="rounded-lg border border-dashed shadow-sm bg-white p-4">
          <div className="grid gap-3">
            {/* Image preview */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={imagePreview || user.image || "/default-avatar.png"}
                alt="Profile"
                className="w-16 h-16 object-cover"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer text-green-500"
              >
                Change Image
              </label>
            </div>

            {/* Flex container for first and last name */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm font-semibold">First Name</label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-semibold">Last Name</label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            {/* Flex container for phone number and email */}
            <div className="flex gap-3 mt-4">
              <div className="flex-1">
                <label className="text-sm font-semibold">Phone Number</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-semibold">Email</label>
                <Input value={email} disabled />
              </div>
            </div>

            <div className="mt-5 flex justify-center">
              <Button onClick={updateUserHandler} className="w-full md:w-40">
                {loading ? <PuffLoader size={20} /> : "Save Changes"}
              </Button>
            </div>
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </form>
      </main>
    </div>
  );
}

export default UserDetails;
