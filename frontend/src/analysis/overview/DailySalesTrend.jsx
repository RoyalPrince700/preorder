import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import SummaryApi from "../../common";
import { toast } from "react-toastify";
import { adminChartCard, adminChartTitle } from "../../common/adminUi";

const tooltipStyle = {
	backgroundColor: "#FFFFFF",
	border: "2px solid #0f172a",
	borderRadius: 0,
	color: "#0f172a",
};

const DailySalesTrend = () => {
	const [dailySalesData, setDailySalesData] = useState([]);

	const fetchDailySalesData = async () => {
		try {
			const response = await fetch(SummaryApi.dailySales.url, {
				method: SummaryApi.dailySales.method,
				credentials: "include",
			});
			const dataResponse = await response.json();

			if (dataResponse.success) {
				setDailySalesData(dataResponse.data);
			} else {
				toast.error(dataResponse.message || "Failed to fetch daily sales data.");
			}
		} catch (error) {
			console.error("Error fetching daily sales data:", error);
			toast.error("An error occurred while fetching daily sales data.");
		}
	};

	useEffect(() => {
		fetchDailySalesData();
	}, []);

	return (
		<div className={adminChartCard}>
			<h2 className={adminChartTitle}>Daily Sales Trend</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<BarChart data={dailySalesData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#e2e8f0' />
						<XAxis dataKey='name' stroke='#64748b' tick={{ fontSize: 10, fontWeight: 700 }} />
						<YAxis stroke='#64748b' tick={{ fontSize: 10, fontWeight: 700 }} />
						<Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#0f172a" }} />
						<Bar dataKey='sales' fill='#ea580c' />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default DailySalesTrend;
