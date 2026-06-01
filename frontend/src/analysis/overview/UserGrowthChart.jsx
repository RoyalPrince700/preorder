import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import SummaryApi from "../../common";
import { adminChartCard, adminChartTitle } from "../../common/adminUi";

const tooltipStyle = {
  backgroundColor: "#FFFFFF",
  border: "2px solid #0f172a",
  borderRadius: 0,
  color: "#0f172a",
};

const UserGrowthChart = () => {
  const [userGrowthData, setUserGrowthData] = useState([]);

  const fetchUserGrowth = async () => {
    try {
      const response = await fetch(SummaryApi.userGrowth.url, {
        method: SummaryApi.userGrowth.method,
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        setUserGrowthData(result.data);
      } else {
        console.error(result.message);
      }
    } catch (err) {
      console.error("Error fetching user growth data:", err);
    }
  };

  useEffect(() => {
    fetchUserGrowth();
  }, []);

  return (
    <div className={adminChartCard}>
      <h2 className={adminChartTitle}>User Growth (Last Week)</h2>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10, fontWeight: 700 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 10, fontWeight: 700 }} />
            <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#0f172a" }} />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#0f172a"
              strokeWidth={2}
              dot={{ fill: "#ea580c", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserGrowthChart;
