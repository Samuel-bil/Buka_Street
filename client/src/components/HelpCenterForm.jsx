import { useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";
import axios from "axios";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Cookies from "js-cookie";

const endpoint = "https://buka-street.vercel.app/api/help_center/send";

const HelpCenterForm = ({ isOpen, onClose }) => {
  const token = Cookies.get("user");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormValid = () => subject.trim() !== "" && message.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!isFormValid()) {
      setError("Both subject and message are required.");
      return;
    }

    try {
      const response = await axios.post(
        endpoint,
        { subject, message },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 201) {
        setLoading(false);
        toast.success("Complaint sent successfully");
        setSuccess("Complaint sent successfully");
        setSubject("");
        setMessage("");
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send complaint");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-lg mx-auto p-6 rounded-md shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold mb-4">Leave a Complaint</h2>
              <button
                onClick={onClose}
                className="text-green-500 hover:underline text-lg"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Leave your complaint here"
                rows="4"
                className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                disabled={loading}
                className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                {loading ? (
                  <PuffLoader size={25} color={"#fff"} />
                ) : (
                  "Submit Complaint"
                )}
              </Button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default HelpCenterForm;
