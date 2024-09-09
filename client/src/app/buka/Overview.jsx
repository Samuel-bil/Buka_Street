import GetReviews from "@/components/GetReviews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useUserStore } from "@/store/UserStore";
import axios from "axios";
import Cookies from "js-cookie";
import { PoundSterling } from "lucide-react";
import { useEffect, useState } from "react";

const Overview = () => {
  const token = Cookies.get("user");
  const { details } = useUserStore();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [mostSoldItem, setMostSoldItem] = useState(null);
  const [displayedOrders, setDisplayedOrders] = useState(10);

  const bukaId = details?._id;

  const endpoint = `https://buka-store.vercel.app/api/orders`;

  const fetchOrders = async () => {
    try {
      const response = await axios.get(endpoint, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (err) {
      setError("Failed to fetch orders");
      console.error(err);
    }
  };

  useEffect(() => {
    if (orders.length > 0 && bukaId) {
      const filtered = orders.filter(
        (order) => order.order_buka._id === bukaId
      );
      setFilteredOrders(filtered);
    }
  }, [orders, bukaId]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Get the current date and format it
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);

    // Find the most sold item
    // Step 1: Flatten all order_items
    const allItems = filteredOrders.flatMap((order) => order.order_items);

    // Step 2: Group by cuisine_id and sum quantities
    const itemQuantities = allItems.reduce((acc, item) => {
      const cuisineId = item?.cuisine_id?._id;
      if (!acc[cuisineId]) {
        acc[cuisineId] = { ...item?.cuisine_id, totalQuantity: 0 };
      }
      acc[cuisineId].totalQuantity += item.quantity;
      return acc;
    }, {});

    const mostSoldItem = Object.values(itemQuantities).reduce(
      (maxItem, currentItem) => {
        return currentItem.totalQuantity > maxItem.totalQuantity
          ? currentItem
          : maxItem;
      },
      { totalQuantity: 0 }
    );
    setMostSoldItem(mostSoldItem);
  }, [filteredOrders]);

  const handleLoadMore = () => {
    setDisplayedOrders((prev) => prev + 5);
  };

  const successfulSales = filteredOrders.filter(
    (order) => order.is_paid
  ).length;
  const totalIncome = filteredOrders.reduce(
    (sum, order) => (order.is_paid ? sum + order.order_total : sum),
    0
  );
  const totalItems = filteredOrders.reduce(
    (sum, order) => sum + order.order_items.length,
    0
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-2">Orders Overview</h1>
      <p className="text-lg text-gray-600 mb-6">{currentDate}</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-[#396effb6] text-white shadow-lg rounded-lg">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center justify-center text-center ">
              <PoundSterling width={20} />
              {totalIncome?.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0090308b] text-white shadow-lg rounded-lg">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Number of Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-center">
              {successfulSales}
            </div>
            <p className="text-xs text-gray-200">+19% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-[#f97316] text-white shadow-lg rounded-lg">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-center">{totalItems}</div>
            <p className="text-xs text-gray-200">+180.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Most Sold Item</h2>
        {mostSoldItem && mostSoldItem._id ? (
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem
                key={mostSoldItem._id}
                className="basis-1/1 md:basis-1/3 lg:basis-1/4"
              >
                <div className="p-4">
                  <Card>
                    <img
                      src={mostSoldItem?.image}
                      alt={mostSoldItem?.cuisine_name}
                      width={300}
                      height={300}
                      className="aspect-square object-cover rounded-md"
                    />
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg text-center">
                        {mostSoldItem?.cuisine_name}
                      </h3>
                      <p className="font-semibold text-sm text-center mb-6">
                        {mostSoldItem?.cuisine_type}
                      </p>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-base">
                          {mostSoldItem?.ready_time_unit} mins
                        </h3>
                        <div className="text-primary font-semibold flex ">
                          <PoundSterling width={15} />
                          {mostSoldItem?.price}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        ) : (
          <p>No recent items available</p>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Order History</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 border-b">
              <th className="px-4 py-2 text-left border-r">S/N</th>
              <th className="px-4 py-2 text-left border-r">Order Date</th>
              <th className="px-4 py-2 text-left border-r">Order Time</th>
              <th className="px-4 py-2 text-left border-r">
                Order Description
              </th>
              <th className="px-4 py-2 text-left border-r flex">
                Amount (<PoundSterling width={15} />){" "}
              </th>
              <th className="px-4 py-2 text-left border-r">Order Status</th>
              <th className="px-4 py-2 text-left">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.slice(0, displayedOrders).map((order, index) => (
              <tr key={order._id} className="border-b">
                <td className="px-4 py-2 border-r">{index + 1}</td>
                <td className="px-4 py-2 border-r">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-r">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </td>
                <td className="px-4 py-2 border-r">
                  <div className="flex flex-col">
                    {order.order_items.map((item) => (
                      <div key={item._id} className="flex justify-between py-1">
                        <span>{item.cuisine_id?.cuisine_name}</span>
                        <span>{item?.quantity}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2 border-r">
                  {order.order_total.toFixed(2)}
                </td>
                <td className="px-4 py-2 border-r">{order?.order_status}</td>
                <td className="px-4 py-2">
                  {order?.is_paid ? "Card" : "Not Paid"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayedOrders < filteredOrders.length && (
          <div className="mt-4 text-center">
            <button
              onClick={handleLoadMore}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      <div>
        <GetReviews />
      </div>
    </div>
  );
};

export default Overview;
