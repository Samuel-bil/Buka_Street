import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const BukaInformation = ({ details, onUpdate }) => {
  const [isGoLive, setIsGoLive] = useState(details?.go_live);
  const [isPreOrder, setIsPreOrder] = useState(details?.pre_order);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);

  // Editable fields
  const [editMode, setEditMode] = useState({
    buka_name: false,
    address: false,
    postcode: false,
  });
  const [editableFields, setEditableFields] = useState({
    buka_name: details?.buka_name || "",
    address: details?.address || "",
    postcode: details?.postcode || "",
  });

  useEffect(() => {
    if (details) {
      setToken(Cookies.get("user"));
      setIsGoLive(details?.go_live);
      setIsPreOrder(details?.pre_order);
      setEditableFields({
        buka_name: details?.buka_name || "",
        address: details?.address || "",
        postcode: details?.postcode || "",
      });
    }
  }, [details]);

  // Filter and map opening hours
  const openingHours = details?.opening_hours?.filter(
    ({ openingTime, closingTime }) => openingTime && closingTime
  );

  // Handle toggle for go_live and pre_order
  const handleToggle = async (field) => {
    setError("");

    // Update the state before sending the request
    const updatedGoLive = field === "go_live" ? !isGoLive : isGoLive;
    const updatedPreOrder = field === "pre_order" ? !isPreOrder : isPreOrder;
    const formData = {
      go_live: updatedGoLive,
      pre_order: updatedPreOrder,
    };
    console.log(formData, "formData");

    try {
      const response = await axios.put(
        `https://buka-street.vercel.app/api/bukas/${details?._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("Response:", response.data);

      if (response.status === 200) {
        onUpdate(response.data); // Update the store with the new data
        toast.success("Buka updated successfully");

        setToken(response.data.token); // Update the token state
        setIsGoLive(formData.go_live);
        setIsPreOrder(formData.pre_order);
      }
    } catch (err) {
      console.log("Failed to update status:", err);
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  // Handle field edit
  const handleEditClick = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: true }));
  };

  // Handle cancel edit
  const handleCancelEdit = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: false }));
    // Reset the field value
    setEditableFields({
      buka_name: details?.buka_name,
      address: details?.address,
      postcode: details?.postcode,
    });
  };

  // Handle save edit
  const handleSaveEdit = async (field) => {
    setError("");

    const formData = {
      [field]: editableFields[field],
    };

    try {
      const response = await axios.put(
        `https://buka-street.vercel.app/api/bukas/${details?._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (response.status === 200) {
        onUpdate(response.data); // Update the store with the new data
        toast.success(`${field.replace("_", " ")} updated successfully`);
        setEditMode((prev) => ({ ...prev, [field]: false }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update");
    }
  };

  return (
    <div className="w-full h-[200px] relative mb-5">
      <div className="absolute w-full flex justify-center m-auto left-0">
        <div className="w-full mx-3 md:w-[550px] shadow-md h-auto flex flex-col rounded-2xl bg-gray-100 py-2 px-3">
          <h2 className="text-[1.5rem] text-[#000] font-medium mb-4">
            Buka Information
          </h2>

          <div className="flex flex-col">
            {[
              {
                label: "Buka Name",
                field: "buka_name",
                value: editableFields.buka_name,
              },
              {
                label: "Address",
                field: "address",
                value: editableFields.address,
              },
              {
                label: "PostCode",
                field: "postcode",
                value: editableFields.postcode,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-300 py-2 px-4"
              >
                <div className="flex-1 flex gap-3">
                  <p className="text-[#000] font-medium">{item.label}:</p>
                  {editMode[item.field] ? (
                    <input
                      type="text"
                      value={editableFields[item.field]}
                      onChange={(e) =>
                        setEditableFields((prev) => ({
                          ...prev,
                          [item.field]: e.target.value,
                        }))
                      }
                      className="text-[#000] border p-1 rounded"
                    />
                  ) : (
                    <p className="text-[#000]">{item.value}</p>
                  )}
                </div>
                {editMode[item.field] ? (
                  <div className="flex gap-2">
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => handleSaveEdit(item.field)}
                    >
                      <CheckIcon className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleCancelEdit(item.field)}
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    className="ml-4 text-blue-500 hover:text-blue-700"
                    onClick={() => handleEditClick(item.field)}
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Opening Hours */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Opening Hours</h3>
            {openingHours?.length > 0 ? (
              <div className="flex flex-col">
                {openingHours.map(({ day, openingTime, closingTime }) => (
                  <div
                    key={day}
                    className="flex justify-between items-center border-b border-gray-300 py-2 px-4"
                  >
                    <p className="text-[#000] font-medium">{day}:</p>
                    <p className="text-[#000]">
                      {openingTime} - {closingTime}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hours available</p>
            )}
          </div>

          <div className="flex justify-between">
            {/* Go Live Toggle */}
            <div className="flex items-center mt-4">
              <p className="text-[#000] font-medium mr-2">Go Live:</p>
              <div className="relative w-24 h-8 flex justify-between items-center border rounded-full cursor-pointer transition-all duration-300 bg-gray-300">
                <span
                  className={`w-1/2 text-center py-1 rounded-l-full ${
                    isGoLive
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() => handleToggle("go_live")}
                >
                  Yes
                </span>
                <span
                  className={`w-1/2 text-center py-1 rounded-r-full ${
                    !isGoLive
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() => handleToggle("go_live")}
                >
                  No
                </span>
              </div>
            </div>

            {/* Pre-Order Toggle */}
            <div className="flex items-center mt-4">
              <p className="text-[#000] font-medium mr-2">Pre-Order option:</p>
              <div className="relative w-24 h-8 flex justify-between items-center border rounded-full cursor-pointer transition-all duration-300 bg-gray-300">
                <span
                  className={`w-1/2 text-center py-1 rounded-l-full ${
                    isPreOrder
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() => handleToggle("pre_order")}
                >
                  Yes
                </span>
                <span
                  className={`w-1/2 text-center py-1 rounded-r-full ${
                    !isPreOrder
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() => handleToggle("pre_order")}
                >
                  No
                </span>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default BukaInformation;
