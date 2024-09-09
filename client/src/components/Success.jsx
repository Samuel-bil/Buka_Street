import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center bg-white shadow-lg rounded-lg p-6">
        <svg
          className="mx-auto h-12 w-12 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7M5 13l4 4L19 7M5 13l4 4L19 7"
          />
        </svg>
        <h1 className="text-2xl font-bold text-green-600 mt-4">
          Payment Successful
        </h1>
        <p className="text-gray-700 mt-2">
          Thank you for your purchase! Your order has been successfully
          processed.
        </p>
        <Link
          to="/cuisine"
          className="mt-6 inline-block bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Success;
