import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import SummaryApi from "../../common";
import { adminChartCard, adminChartTitle, adminError, adminLoading, CHART_COLORS } from "../../common/adminUi";

const OrderDistribution = () => {
	const [orderStatusData, setOrderStatusData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchOrderStatus = async () => {
			try {
				const response = await fetch(SummaryApi.allOrders.url, {
					method: SummaryApi.allOrders.method,
					credentials: "include",
				});
				const data = await response.json();

				if (data.success) {
					const statusCounts = {
						Pending: 0,
						Processing: 0,
						Shipped: 0,
						Delivered: 0,
						Cancelled: 0,
					};

					data.data.forEach((order) => {
						if (statusCounts[order.status] !== undefined) {
							statusCounts[order.status]++;
						}
					});

					const formattedData = Object.entries(statusCounts).map(([name, value]) => ({
						name,
						value,
					}));

					setOrderStatusData(formattedData);
				} else {
					setError(data.message || "Failed to fetch order distribution.");
				}
			} catch (err) {
				console.error("Error fetching order distribution:", err);
				setError("Failed to fetch order distribution.");
			} finally {
				setLoading(false);
			}
		};

		fetchOrderStatus();
	}, []);

	if (loading) return <div className={adminLoading}>Loading distribution...</div>;
	if (error) return <p className={adminError}>{error}</p>;

	return (
		<div className={adminChartCard}>
			<h2 className={adminChartTitle}>Order Status Distribution</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<PieChart>
						<Pie
							data={orderStatusData}
							cx="50%"
							cy="50%"
							outerRadius={80}
							fill="#8884d8"
							dataKey="value"
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{orderStatusData.map((entry, index) => (
								<Cell key={`cell-${entry.name}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "#FFFFFF",
								border: "2px solid #0f172a",
								borderRadius: 0,
							}}
						/>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default OrderDistribution;
