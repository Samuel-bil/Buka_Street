import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

import { useEffect, useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";
import { toast } from "sonner";
import { useUserStore } from "@/store/UserStore";
import Cookies from "js-cookie";
import OpeningHoursInput from "./OpeningHoursInput";

const endpoint = "https://buka-store.vercel.app/api/bukas/";

const BukaProfile = () => {
  const { details, updateUser } = useUserStore();
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (details) {
      setToken(Cookies.get("user"));
    }
  }, [details]);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [bukaName, setBukaName] = useState("");
  const [bukaAddress, setBukaAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [openingHours, setOpeningHours] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const buka = details || {};

  useEffect(() => {
    if (buka) {
      setBukaName(buka?.buka_name);
      setBukaAddress(buka?.address);
      setPostcode(buka?.postcode);
      setPhone(buka?.phone);
      setEmail(buka?.email);
      setImagePreview(buka?.image);
      setOpeningHours(buka?.opening_hours || []);
    }
  }, []);
  const handleOpeningHoursChange = (index, key, value) => {
    const updatedHours = [...openingHours];
    updatedHours[index][key] = value;
    setOpeningHours(updatedHours);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // Cleanup
      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    } else {
      setImage(null);
      setImagePreview("");
    }
  };
  const updateBukaHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("buka_name", bukaName);
    formData.append("address", bukaAddress);
    formData.append("postcode", postcode);
    if (image) {
      formData.append("image", image);
    }
    formData.append("phone", phone);
    formData.append("email", email);
    // Append the opening_hours array without stringifying it
    openingHours.forEach((item, index) => {
      formData.append(`opening_hours[${index}][day]`, item.day);
      formData.append(`opening_hours[${index}][openingTime]`, item.openingTime);
      formData.append(`opening_hours[${index}][closingTime]`, item.closingTime);
    });

    try {
      const response = await axios.put(`${endpoint}${details?._id}`, formData, {
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
        const updatedBuka = response.data.buka;
        updateUser(updatedBuka); // Update the user in global state

        // Update the token in local state or cookies
        setToken(updatedBuka.token); // Update the token state

        // Optionally update the state if needed
        setBukaName(updatedBuka.buka_name);
        setBukaAddress(updatedBuka.address);
        setPostcode(updatedBuka.postcode);
        setPhone(updatedBuka.phone);
        setImagePreview(updatedBuka.image);
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to update buka");
    }
  };

  return (
    <main className="flex-1 p-6 bg-gray-100">
      <h1 className="text-lg font-semibold md:text-2xl mb-4">
        Profile Information
      </h1>
      <div className="rounded-lg border border-dashed shadow-sm bg-white p-4">
        <div className="grid md:grid-cols-2 gap-3">
          {/* Image preview */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={imagePreview || details?.image || "/default-avatar.png"}
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
          <div>
            <label className="text-sm font-semibold">Buka Name</label>
            <Input
              placeholder="Buka Name"
              value={bukaName}
              onChange={(e) => setBukaName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Buka Address</label>
            <Input
              placeholder="Buka address"
              value={bukaAddress}
              onChange={(e) => setBukaAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Phone Number</label>
            <Input
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold">postcode Number</label>
            <Input
              placeholder="Enter postcode number"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Email</label>
            <Input
              value={email}
              placeholder="Email"
              disabled // Disable email field
            />
          </div>
          <div>
            {openingHours.map((day, index) => (
              <OpeningHoursInput
                key={index}
                day={day.day}
                index={index}
                value={day}
                onChange={handleOpeningHoursChange}
              />
            ))}
          </div>
        </div>

        <div className="mt-5 flex justify-center">
          <Button onClick={updateBukaHandler} className="w-full md:w-40">
            {loading ? <PuffLoader size={20} /> : "Save Changes"}
          </Button>
        </div>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </main>
  );
};

export default BukaProfile;
