import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import SummaryApi from "../../common";
import { toast } from "react-toastify";
import { adminChartCard, adminChartTitle, CHART_COLORS } from "../../common/adminUi";

const tooltipStyle = {
  backgroundColor: "#FFFFFF",
  border: "2px solid #0f172a",
  borderRadius: 0,
  color: "#0f172a",
};

const UserActivityHeatmap = () => {
  const [userActivityData, setUserActivityData] = useState([]);

  const fetchUserActivityData = async () => {
    try {
      const response = await fetch(SummaryApi.allUserActivity.url, {
        method: SummaryApi.allUserActivity.method,
        credentials: "include",
      });
      const dataResponse = await response.json();

      if (dataResponse.success) {
        setUserActivityData(dataResponse.data);
      } else {
        toast.error(dataResponse.message);
      }
    } catch (error) {
      console.error("Error fetching user activity data:", error);
      toast.error("Failed to load user activity data.");
    }
  };

  useEffect(() => {
    fetchUserActivityData();
  }, []);

  const barKeys = ["0-4", "4-8", "8-12", "12-16", "16-20", "20-24"];

  return (
    <div className={adminChartCard}>
      <h2 className={adminChartTitle}>User Activity Heatmap</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={userActivityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10, fontWeight: 700 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 10, fontWeight: 700 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            {barKeys.map((key, index) => (
              <Bar key={key} dataKey={key} stackId="a" fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserActivityHeatmap;
