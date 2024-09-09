import useCuisine from "@/components/hooks/useCuisine";
import { Card, CardContent } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Edit2Icon, PoundSterling, Trash2Icon } from "lucide-react";
import AddItemForm from "./AddItemForm";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import EditItemForm from "./EditItemForm";
import Cookies from "js-cookie";

const AllProduct = () => {
  const { data } = useCuisine();
  const token = Cookies.get("user");
  const [localData, setLocalData] = useState(data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleAddPopup = () => {
    setIsModalOpen(true);
  };

  const handleAddItem = (newItem) => {
    setLocalData((prevData) => [...prevData, newItem]);
    setIsModalOpen(false);
    toast.success("Cuisine added successfully");
  };

  const handleEditItem = (updatedItem) => {
    setLocalData((prevData) =>
      prevData.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      )
    );
    setIsEditModalOpen(false);
    toast.success("Cuisine updated successfully");
    console.log("updatedItem", updatedItem);
  };

  const handleEditPopup = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const categories = {};

  localData?.forEach((item) => {
    const category = item.cuisine_category;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(item);
  });

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!isConfirmed) return; // Exit if not confirmed

    try {
      await axios.delete(`https://buka-store.vercel.app/api/cuisines/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setLocalData((prevData) => prevData?.filter((item) => item._id !== id));
      toast.success("Cuisine deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete cuisine");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 px-4 py-1 mt-56 border border-zinc-100">
        <h2 className="text-2xl font-semibold mb-4 border-r-4 px-2">
          All Items
        </h2>
        <h2 className="text-2xl mb-4 px-1">
          <button
            onClick={handleAddPopup}
            className="hover:text-gray-400 bg-transparent border-none"
          >
            Add Item
          </button>
        </h2>
      </div>
      {categories && Object.keys(categories).length === 0 && (
        <p className="text-center mt-6">No items available</p>
      )}
      <div className="px-4 mt-6">
        {Object.keys(categories).map((category) => (
          <div key={category}>
            <h2 className="text-lg font-bold pl-4">{category}</h2>
            <Carousel className="w-full">
              <CarouselContent>
                {categories[category].map((item) => (
                  <CarouselItem
                    key={item?._id}
                    className="basis-1/1 md:basis-1/3 lg:basis-1/4"
                  >
                    <div className="p-4">
                      <Card>
                        <img
                          src={item?.image}
                          alt={item.cuisine_name}
                          width={300}
                          height={300}
                          className="aspect-square object-cover rounded-md"
                        />
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-[1.2rem] text-center">
                            {item?.cuisine_owner?.buka_name}
                          </h3>
                          <p className="font-semibold text-[0.85rem] text-center mb-4">
                            {item?.cuisine_type}
                          </p>
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-[1rem]">
                              {item?.cuisine_name}
                            </h3>
                            <div className="text-primary font-semibold flex">
                              <PoundSterling width={15} />
                              {item?.price}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-[1rem]">
                              {item?.ready_time_unit}
                            </h3>
                            <div className=" font-semibold flex gap-2 items-center">
                              <Trash2Icon
                                className="text-red-600 cursor-pointer"
                                onClick={() => handleDelete(item._id)}
                              />
                              <Edit2Icon
                                className="text-green-600 cursor-pointer"
                                onClick={() => handleEditPopup(item)}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        ))}
      </div>
      {/* Modal Component */}
      {isModalOpen && (
        <AddItemForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddItem={handleAddItem}
        />
      )}
      {/* Modal Component */}
      {isEditModalOpen && (
        <EditItemForm
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateItem={handleEditItem}
          item={selectedItem}
        />
      )}
      {/* Confirmation Modal Component */}
    </>
  );
};

export default AllProduct;
