import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const endpoint = `https://buka-street.vercel.app/api/review`;

const GetReviews = () => {
  const token = Cookies.get("user");
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(endpoint, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews?.reviews?.map((review) => (
          <div key={review._id} className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <img
                src={review.user.image}
                alt={review.user.first_name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h2 className="text-lg font-semibold">
                  {review.user.first_name} {review.user.last_name}
                </h2>
                <p className="text-gray-600">{review.user.email}</p>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium">
                Buka: {review.buka.buka_name}
              </h3>
            </div>
            <p className="text-gray-700 mb-4">{review.comment}</p>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetReviews;
