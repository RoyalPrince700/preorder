import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SummaryApi from "../../common";
import { adminChartCard, adminChartTitle } from "../../common/adminUi";

const tooltipStyle = {
  backgroundColor: "#FFFFFF",
  border: "2px solid #0f172a",
  borderRadius: 0,
  color: "#0f172a",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
};


const SalesOverviewChart = () => {
  const [weeklySalesData, setWeeklySalesData] = useState([
    { name: "Sunday", sales: 0 },
    { name: "Monday", sales: 0 },
    { name: "Tuesday", sales: 0 },
    { name: "Wednesday", sales: 0 },
    { name: "Thursday", sales: 0 },
    { name: "Friday", sales: 0 },
    { name: "Saturday", sales: 0 },
  ]);

  const fetchWeeklySales = async () => {
    try {
      const response = await fetch(SummaryApi.allOrders.url, {
        method: SummaryApi.allOrders.method,
        credentials: "include",
      });
      const dataResponse = await response.json();

      if (dataResponse.success) {
        const orders = dataResponse.data;
        const updatedSalesData = [...weeklySalesData];

        // Process orders to calculate sales per day
        orders.forEach((order) => {
          if (order.status === "Delivered" || order.adminConfirmed === true) {
            const orderDate = new Date(order.createdAt);
            const dayOfWeek = orderDate.getDay(); // 0 (Sunday) to 6 (Saturday)

            updatedSalesData[dayOfWeek].sales += order.totalPrice;
          }
        });

        setWeeklySalesData(updatedSalesData);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchWeeklySales();
  }, []);

  return (
    <div className={adminChartCard}>
      <h2 className={adminChartTitle}>Sales Overview</h2>

      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <LineChart data={weeklySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey={"name"} stroke="#64748b" tick={{ fontSize: 10, fontWeight: 700 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 10, fontWeight: 700 }} />
            <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#0f172a" }} />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#ea580c"
              strokeWidth={3}
              dot={{ fill: "#ea580c", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesOverviewChart;
