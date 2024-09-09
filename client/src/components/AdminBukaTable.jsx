import { PoundSterling } from "lucide-react";
import { useState } from "react";

// Utility function to calculate totals
const calculateTotals = (orders) => {
  const totalOrders = orders.length;
  const totalSales = orders.reduce((acc, order) => acc + order.order_total, 0);
  const commission = totalSales * 0.1; // Assuming 5% commission

  return { totalOrders, totalSales, commission };
};

const AdminBukaTable = ({ bukaData, orderData }) => {
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Create a mapping of buka ID to their orders
  const bukaOrders = bukaData?.reduce((acc, buka) => {
    acc[buka._id] = [];
    return acc;
  }, {});

  // Map orders to corresponding bukas
  orderData?.forEach((order) => {
    if (bukaOrders[order?.order_buka]) {
      bukaOrders[order?.order_buka].push(order);
    }
  });

  // Calculate the start and end index for pagination
  const totalItems = bukaData?.length || 0;
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBukaData = bukaData?.slice(startIndex, endIndex);

  // Function to handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="border border-gray-300 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          Buka Information
        </h2>
        <div className="overflow-x-auto">
          <div className="border border-gray-200 shadow-md rounded-lg">
            <table
              className="min-w-full divide-y divide-gray-200 border-separate"
              style={{ borderSpacing: "0" }}
            >
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "S/N",
                    "Buka Name",
                    "Address",
                    "Date Joined",
                    "Number of Orders",
                    "Total Sales",
                    "Commission",
                    "Status",
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-b border-gray-300"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBukaData?.map((buka, index) => {
                  const { totalOrders, totalSales, commission } =
                    calculateTotals(bukaOrders[buka._id]);
                  return (
                    <tr key={buka._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-b border-gray-300">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-b border-gray-300">
                        {buka?.buka_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-b border-gray-300">
                        {buka?.address || "No address provided"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-b border-gray-300">
                        {new Date(buka?.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-b border-gray-300">
                        {totalOrders}
                      </td>
                      <td className="px-6 flex gap-1 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-b border-gray-300">
                        <PoundSterling width={15} /> {totalSales?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-b border-gray-300">
                        {commission?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b border-gray-300">
                        <span
                          className={
                            buka?.go_live ? "text-green-500" : "text-red-500"
                          }
                        >
                          {buka?.go_live ? "Active" : "Not Active"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="py-4 flex justify-center items-center">
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
        </div>
      </div>
    </div>
  );
};
export default AdminBukaTable;
