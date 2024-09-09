import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center bg-white shadow-lg rounded-lg p-6">
        <svg
          className="mx-auto h-12 w-12 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>

        <h1 className="text-2xl font-bold text-red-600 mt-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-700 mt-2">
          Your payment has been cancelled. Please try again.
        </p>
        <Link
          to="/cuisine"
          className="mt-6 inline-block bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Cancel;
