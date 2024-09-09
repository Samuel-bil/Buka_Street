import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStore } from "@/store/UserStore";
import axios from "axios";
import Cookies from "js-cookie";
import { PoundSterling } from "lucide-react";
import { useEffect, useState } from "react";

const BukaOrders = () => {
  const { details } = useUserStore();
  const token = Cookies.get("user");

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [displayedOrders, setDisplayedOrders] = useState(10);

  const bukaId = details?._id;

  const endpoint = `https://buka-street.vercel.app/api/orders`;

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
        (order) => order?.order_buka._id === bukaId
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
  }, []);

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
            <div className="text-2xl flex items-center justify-center font-bold text-center ">
              <PoundSterling />
              {totalIncome.toLocaleString()}
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
              <th className="px-4 py-2 text-left border-r flex gap-1">
                Amount (<PoundSterling width={15} />)
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
                  {order?.is_paid === true ? "Card" : "Not Paid"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayedOrders < filteredOrders.length && (
          <div className="mt-4 text-center">
            <button
              onClick={handleLoadMore}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BukaOrders;
