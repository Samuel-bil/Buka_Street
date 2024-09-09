import AdminBukaTable from "@/components/AdminBukaTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStore } from "@/store/UserStore";
import axios from "axios";
import Cookies from "js-cookie";
import { PoundSterling } from "lucide-react";
import { useEffect, useState } from "react";

const AdminBuka = () => {
  const token = Cookies.get("user");
  const { details } = useUserStore();
  const [currentDate, setCurrentDate] = useState("");
  const [data, setData] = useState([]);

  const endpoint = `https://buka-street.vercel.app/api/admin/bukas`;

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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-2">
        Hey, {details?.first_name} {details?.last_name}
      </h1>
      <p className="text-lg text-gray-600 mb-6">{currentDate}</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className=" shadow-lg rounded-lg">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Number of Bukas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-center">
              {data?.totalBukas?.length}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-lg">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-center">
              {data?.activeBukas}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-lg">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Not Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-center">
              {data?.pendingBukas}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-lg">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Dormant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-center">
              {data?.dormantBukas}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-lg">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Number Of Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-center">
              {data?.numberOfOrders?.length || 0}
            </div>
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
              {data?.totalCommission?.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <AdminBukaTable
        bukaData={data?.totalBukas}
        orderData={data?.numberOfOrders}
      />
    </div>
  );
};

export default AdminBuka;
