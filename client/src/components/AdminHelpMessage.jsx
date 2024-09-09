import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const AdminHelpMessage = () => {
  const token = Cookies.get("user");
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [hasMore, setHasMore] = useState(false);

  const endpoint = `https://buka-street.vercel.app/api/help_center/admin/messages`;

  const getMessages = async () => {
    try {
      const response = await axios.get(endpoint, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      setHasMore(response.data.length > 5);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  const loadMore = () => {
    setVisibleCount((prev) => {
      const newCount = prev + 5;
      setHasMore(data.length > newCount);
      return newCount;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="border border-gray-300 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          Customer Help Line
        </h2>
        {data?.length > 0 ? (
          data?.slice(0, visibleCount).map((item) => (
            <div key={item._id} className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={item?.user.image}
                    alt={`${item?.user?.first_name} ${item?.user?.last_name}`}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {`${item?.user?.first_name} ${item?.user?.last_name}`}
                    </h3>
                    <p className="text-sm text-gray-600">{item?.user?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-md font-semibold text-gray-700 mb-2">
                  Subject: {item.subject || "No subject provided"}
                </h4>
                <p className="text-gray-600">
                  {item.message || "No message provided"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No messages found</p>
        )}
        {hasMore && (
          <div className="text-center mt-6">
            <button
              onClick={loadMore}
              className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHelpMessage;
