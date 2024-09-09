import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { PoundSterling } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import AdminOrderTable from "@/components/AdminOrderTable";
import Cookies from "js-cookie";
import { useUserStore } from "@/store/UserStore";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminTransaction = () => {
  const token = Cookies.get("user");
  const { details } = useUserStore();
  const [currentDate, setCurrentDate] = useState("");
  const [data, setData] = useState(null);

  const endpoint = `https://buka-street.vercel.app/api/admin/dashboard`;

  const getAdminStats = async () => {
    try {
      const response = await axios.get(endpoint, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAdminStats();
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

  // Chart data and configuration
  const chartData = {
    labels: ["Order", "Transactions", "Sales", "Commission"],
    datasets: [
      {
        label: "Statistics",
        data: data
          ? [
              data.data.numberOfOrders,
              data.data.numberOfTransactions,
              data.data.totalSalesMade,
              data.data.totalCommission,
            ]
          : [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-2">
        Hey, {details?.first_name} {details?.last_name}
      </h1>
      <p className="text-lg text-gray-600 mb-6">{currentDate}</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg rounded-lg">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Number of Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-center">
              {data?.data?.numberOfTransactions}
            </div>
            <p className="text-xs text-gray-700">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-lg">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Commission Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-center ">
              <PoundSterling />
              {data?.data?.totalCommission.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-lg">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Total amount of sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-center ">
              <PoundSterling />
              {data?.data?.totalSalesMade.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart data loading here */}
      <div className="mt-8">
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Order Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <p>Loading chart...</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order details here */}
      <AdminOrderTable />
    </div>
  );
};

export default AdminTransaction;
