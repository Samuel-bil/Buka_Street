import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MinusCircle, PinIcon, PlusCircle, PoundSterling } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import useCuisine from "./hooks/useCuisine";
import { useParams } from "react-router-dom";
import { useCartStore } from "@/store/CartStore";
import axios from "axios";
import Cookies from "js-cookie";
import ReviewForm from "./ReviewForm";

const endpoint = "https://buka-store.vercel.app/api/users/getuser";

function KitchenPage() {
  const token = Cookies.get("user");
  const navigate = useNavigate();

  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [userData, setUserData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Function to reorder categories
  const reorderCategories = (clickedCategory) => {
    setSelectedCategory(clickedCategory);
  };
  const { cart, addToCart, incrementItem, decrementItem } = useCartStore();

  const total = cart?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const { data } = useCuisine();

  // Filter cuisines based on the kitchen ID
  const filteredCuisines = data?.filter((x) => x?.cuisine_owner?._id === id);

  // Extract owner information from the first cuisine item
  const owner =
    filteredCuisines.length > 0 ? filteredCuisines[0].cuisine_owner : {};

  // Group cuisines by category
  const categories = {};
  filteredCuisines.forEach((item) => {
    const category = item.cuisine_category;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(item);
  });

  const getUser = async () => {
    try {
      const response = await axios.get(endpoint, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleCheckout = () => {
    if (userData) {
      navigate("/user/checkout");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <div className="w-full h-[400px] relative">
        <img src="/food-buka.png" className="w-full h-[400px] object-cover " />
        <div className="absolute w-full flex text-center justify-center m-auto -bottom-16 left-0">
          <div className="w-full mx-3 md:w-[400px] shadow-md h-[200px] flex flex-col items-center justify-center rounded-md bg-white">
            <ReviewForm
              bukaId={owner?._id}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
            {!isModalOpen && (
              <div className="mb-3">
                <h2 className="text-[1.1rem]">{owner?.buka_name}</h2>
                <span className="text-[0.8rem] py-3 flex items-center">
                  <PinIcon />
                  {owner?.address}
                </span>
                <div className="flex gap-5 text-center">
                  <div>
                    <h2 className="underline text-[0.7rem]">Opening Time</h2>
                    <span className="text-sm font-semibold">
                      {owner?.opening_time || "8am - 10pm"}
                    </span>
                  </div>
                  <div>
                    <h2 className="underline text-[0.7rem]">Delivery Time</h2>
                    <span className="text-sm font-semibold">
                      {owner?.delivery_time || "10 - 45 mins"}
                    </span>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="mt-1">
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex my-14 px-8 gap-3">
        {/* Left Section (Available Categories) */}
        <div className="flex-none border rounded-md p-3 w-1/4 h-[100%]">
          <h1 className="text-xl font-bold">Available Categories</h1>
          <div className="flex flex-col gap-2 mt-3">
            {Object.keys(categories).map((category) => (
              <div
                key={category}
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => reorderCategories(category)}
              >
                <h2 className="text-lg font-bold">{category}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Section (Category Listings) */}
        <div className="flex-1 border rounded-md p-3 h-[100%] mt-12">
          <div className="space-y-4">
            {Object.keys(categories)
              .sort((a, b) =>
                a === selectedCategory ? -1 : b === selectedCategory ? 1 : 0
              )
              .map((category) => (
                <div key={category}>
                  <h2 className="text-lg font-bold mb-4">{category}</h2>
                  {categories[category].map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between gap-4 p-4 border rounded-md cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => {
                        setOpen(true);
                        setSelected(item);
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.cuisine_name}
                          width={70}
                          height={50}
                          className="rounded-md object-cover"
                          style={{ aspectRatio: "64/64", objectFit: "cover" }}
                        />
                        <div>
                          <h3 className="text-[0.7rem] font-bold">
                            {item.cuisine_name}
                          </h3>
                          <h4 className="text-[0.7rem] font-bold">
                            {item.description.length > 50
                              ? item.description.substring(0, 50) + "..."
                              : item.description}
                          </h4>
                          <p className="font-medium flex">
                            <PoundSterling width={15} />
                            {item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Button
                        className="bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpen(true);
                          setSelected(item);
                        }}
                      >
                        <PlusCircle className="text-green-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              ))}
          </div>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent
              className="text-center"
              aria-describedby="dialog-description"
              style={{ padding: "0" }}
            >
              <img src={selected?.image} alt={selected?.cuisine_name} />
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[1rem] font-bold text-center">
                  {selected?.cuisine_name}
                </AlertDialogTitle>
              </AlertDialogHeader>
              <h3 className="text-[1rem] font-bold flex items-center justify-center text-center ">
                <PoundSterling width={20} />
                {selected?.price}
              </h3>
              <div>
                <div className="flex items-center justify-center gap-3">
                  <button
                    disabled={quantity <= 0}
                    onClick={() => {
                      if (quantity > 0) {
                        setQuantity((pre) => pre - 1);
                      }
                    }}
                  >
                    <MinusCircle size={"20"} />
                  </button>
                  <h3 className="text-[1rem] font-bold text-primary">
                    {quantity}
                  </h3>
                  <button onClick={() => setQuantity((pre) => pre + 1)}>
                    <PlusCircle size={"20"} />
                  </button>
                </div>
              </div>
              <AlertDialogFooter className="flex items-center justify-center text-center gap-2 mb-2 sm:justify-center">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  onClick={() => {
                    addToCart({ ...selected, quantity });
                    setOpen(false);
                  }}
                >
                  Add to Cart
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Right Section (Your Cart) */}
        <div className="flex-none border rounded-md p-3 w-1/4 h-[100%]">
          <div className="space-y-6">
            <h1 className="text-xl font-bold">Your Cart</h1>
            <div className="space-y-4">
              {cart?.length === 0 ? (
                <div className="h-[150px] flex flex-col items-center justify-center">
                  <h2 className="text-lg font-bold text-primary">
                    Your Cart is Empty
                  </h2>
                </div>
              ) : (
                cart?.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.cuisine_name}
                        width={56}
                        height={56}
                        className="rounded-md object-cover"
                        style={{ aspectRatio: "64/64", objectFit: "cover" }}
                      />
                      <div>
                        <h3 className="font-medium text-[0.7rem]">
                          {item.cuisine_name}
                        </h3>
                        <p className="text-muted-foreground flex">
                          <PoundSterling width={15} />
                          {item?.price} x {item?.quantity}
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            disabled={item?.quantity <= 0}
                            onClick={() => decrementItem(item?._id)}
                          >
                            <MinusCircle size={"20"} />
                          </button>
                          <h3 className="text-[1rem] font-bold text-primary">
                            {item?.quantity}
                          </h3>
                          <button onClick={() => incrementItem(item._id)}>
                            <PlusCircle size={"20"} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      <PoundSterling width={15} />
                      {(item?.price * item?.quantity).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart?.length > 0 && (
              <div className="space-y-6">
                <div className="flex justify-between">
                  <h3 className="font-medium">Subtotal:</h3>
                  <h3 className="font-medium flex">
                    <PoundSterling width={15} />
                    {total?.toFixed(2)}
                  </h3>
                </div>
                <div className="flex items-center justify-center">
                  <Button onClick={handleCheckout} className="w-full">
                    {userData ? "Checkout" : "Login"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default KitchenPage;
