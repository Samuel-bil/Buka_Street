import axios from "axios";
import Cookies from "js-cookie";
import { PoundSterling } from "lucide-react";
import { useEffect, useState } from "react";

const AdminOrderTable = () => {
  const token = Cookies.get("user");
  const [orders, setOrders] = useState([]);
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const endpoint = `https://buka-store.vercel.app/api/admin/orders`;

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
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Calculate the start and end index for pagination
  const totalOrder = orders?.length || 0;
  // Calculate total pages
  const totalPages = Math.ceil(totalOrder / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders?.slice(startIndex, endIndex);

  // Function to handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="mx-auto sm:px-6 lg:px-8 py-8">
      <div className="border border-gray-300 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          Order History
        </h2>
      </div>

      {/* map the order in a table here  */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-200 border-b">
            <th className="px-4 py-2 text-left border-r">S/N</th>
            <th className="px-4 py-2 text-left border-r">Order Date</th>
            <th className="px-4 py-2 text-left border-r">Order Time</th>
            <th className="px-4 py-2 text-left border-r">Order Description</th>
            <th className="px-4 py-2 text-left border-r flex ">
              Amount (
              <PoundSterling />)
            </th>
            <th className="px-4 py-2 text-left border-r">Order Status</th>
            <th className="px-4 py-2 text-left">Payment Method</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentOrders?.map((order, index) => (
            <tr key={order?._id} className="border-b">
              <td className="px-4 py-2 border-r"> {startIndex + index + 1}</td>
              <td className="px-4 py-2 border-r">
                {new Date(order?.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border-r">
                {new Date(order?.createdAt).toLocaleTimeString()}
              </td>
              <td className="px-4 py-2 border-r">
                <div className="flex flex-col">
                  {order?.order_items?.map((item) => (
                    <div key={item?._id} className="flex justify-between py-1">
                      <span>{item?.cuisine_id?.cuisine_name}</span>
                      <span>{item?.quantity}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-4 py-2 border-r">
                {order?.order_total?.toLocaleString()}
              </td>
              <td className="px-4 py-2 border-r">{order?.order_status}</td>
              <td className="px-4 py-2">
                {order?.is_paid === true ? "Card" : "Not Paid"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <div className="flex space-x-2">
          {totalPages > 0 &&
            [...Array(totalPages).keys()]?.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page + 1)}
                className={`px-4 py-2 rounded-lg ${
                  page + 1 === currentPage
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {page + 1}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderTable;
