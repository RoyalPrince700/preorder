import SummaryApi from "../../common";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { adminChartCard, adminChartTitle, adminLoading, CHART_COLORS } from "../../common/adminUi";

const COLORS = CHART_COLORS;

const CategoryDistributionChart = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.categoryProduct.url);

      const { data } = await response.json();
      if (data) {
        const transformedData = data.map((item) => ({
          name: item.category,
          value: item.value || 1, // Ensure value is numeric
        }));
        setCategoryData(transformedData);
      }
    } catch (err) {
      console.error("Error fetching category data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  if (loading) {
    return <div className={adminLoading}>Loading categories...</div>;
  }

  if (!categoryData.length) {
    return (
      <div className={adminChartCard}>
        <h2 className={adminChartTitle}>Category Distribution</h2>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No data available</p>
      </div>
    );
  }

	return (
		<div className={adminChartCard}>
			<h2 className={adminChartTitle}>Category Distribution</h2>
			<div className="h-80">
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<PieChart>
						<Pie
							data={categoryData}
							cx={"50%"}
							cy={"50%"}
							labelLine={false}
							outerRadius={80}
							fill="#8884d8"
							dataKey="value"
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{categoryData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "#FFFFFF",
								borderColor: "#E5E7EB",
								color: "#111827"
							}}
							itemStyle={{ color: "#374151" }}
						/>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default CategoryDistributionChart;
