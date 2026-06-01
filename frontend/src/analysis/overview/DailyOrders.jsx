import React, { useState, useEffect } from "react";
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
import { adminChartCard, adminChartTitle, adminError, adminLoading } from "../../common/adminUi";

const tooltipStyle = {
	backgroundColor: "#FFFFFF",
	border: "2px solid #0f172a",
	borderRadius: 0,
	color: "#0f172a",
};

const DailyOrders = () => {
	const [dailyOrdersData, setDailyOrdersData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchDailyOrders = async () => {
			try {
				const response = await fetch(SummaryApi.allOrders.url, {
					method: SummaryApi.allOrders.method,
					credentials: "include",
				});
				const data = await response.json();

				if (data.success) {
					const orders = data.data;
					const dailyCounts = {};

					orders.forEach((order) => {
						const date = new Date(order.createdAt).toLocaleDateString("en-US", {
							month: "2-digit",
							day: "2-digit",
						});
						dailyCounts[date] = (dailyCounts[date] || 0) + 1;
					});

					const formattedData = Object.keys(dailyCounts).map((date) => ({
						date,
						orders: dailyCounts[date],
					}));

					setDailyOrdersData(formattedData);
				} else {
					setError(data.message || "Failed to fetch daily orders.");
				}
			} catch (err) {
				console.error("Error fetching daily orders:", err);
				setError("Failed to fetch daily orders.");
			} finally {
				setLoading(false);
			}
		};

		fetchDailyOrders();
	}, []);

	if (loading) return <div className={adminLoading}>Loading daily orders...</div>;
	if (error) return <p className={adminError}>{error}</p>;

	return (
		<div className={adminChartCard}>
			<h2 className={adminChartTitle}>Daily Orders</h2>

			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<LineChart data={dailyOrdersData}>
						<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
						<XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10, fontWeight: 700 }} />
						<YAxis stroke="#64748b" tick={{ fontSize: 10, fontWeight: 700 }} />
						<Tooltip contentStyle={tooltipStyle} />
						<Line type="monotone" dataKey="orders" stroke="#0f172a" strokeWidth={2} dot={{ fill: "#ea580c", r: 4 }} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default DailyOrders;
