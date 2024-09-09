import { useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";
import axios from "axios";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useUserStore } from "@/store/UserStore";

const endpoint = "https://buka-street.vercel.app/api/cuisines";

const AddItemForm = ({ isOpen, onClose, onAddItem }) => {
  const token = Cookies.get("user");
  const { details } = useUserStore();

  const [cuisineName, setCuisineName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [cuisineCategory, setCuisineCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [readyTimeUnit, setReadyTimeUnit] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setCuisineName("");
    setDescription("");
    setImage(null);
    setImagePreview("");
    setPrice("");
    setCuisineType("");
    setCuisineCategory("");
    setOtherCategory("");
    setReadyTimeUnit("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImage(null);
      setImagePreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("cuisine_name", cuisineName);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("price", price);
    formData.append("cuisine_type", cuisineType);
    formData.append("cuisine_category", cuisineCategory);
    if (cuisineCategory === "Others") {
      formData.append("other_category", otherCategory);
    }
    formData.append("ready_time_unit", readyTimeUnit);
    formData.append("cuisine_owner", details?._id);

    try {
      const response = await axios.post(endpoint, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      });
      if (response.status === 201) {
        setLoading(false);
        toast.success("Cuisine added successfully");
        setSuccess("Cuisine added successfully");
        resetForm();
        onAddItem(response.data);
        onClose();
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to add cuisine");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-lg mx-auto p-6 rounded-md shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold mb-4">Add New Cuisine</h2>
              <button
                onClick={onClose}
                className="text-green-500 hover:underline text-lg"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <input
                value={cuisineName}
                onChange={(e) => setCuisineName(e.target.value)}
                placeholder="Cuisine Name"
                className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                rows="4"
                className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {imagePreview && (
                <div className="mb-1">
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="w-full h-auto border rounded-md"
                  />
                </div>
              )}
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                placeholder="Cuisine Type"
                className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={cuisineCategory}
                onChange={(e) => setCuisineCategory(e.target.value)}
                className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="Appetizer">Appetizer</option>
                <option value="Main Dish">Main Dish</option>
                <option value="Side Dish">Side Dish</option>
                <option value="Dessert">Dessert</option>
                <option value="Beverages">Beverages</option>
                <option value="Others">Others</option>
              </select>
              {cuisineCategory === "Others" && (
                <input
                  value={otherCategory}
                  onChange={(e) => setOtherCategory(e.target.value)}
                  placeholder="Other Category"
                  className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              <input
                value={readyTimeUnit}
                onChange={(e) => setReadyTimeUnit(e.target.value)}
                placeholder="Ready Time Unit"
                className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Button
                disabled={loading}
                className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                {loading ? (
                  <PuffLoader size={25} color={"#fff"} />
                ) : (
                  "Add Cuisine"
                )}
              </Button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default AddItemForm;
