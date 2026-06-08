import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaClock, FaCheckCircle, FaMoneyBillWave, FaHandHoldingUsd } from "react-icons/fa";
import Header from "../common/Header";
import StatCard from "../common/StatCard";
import { adminError, adminLoading } from "../common/adminUi";
import DailyOrders from "../analysis/overview/DailyOrders";
import OrderDistribution from "../analysis/overview/OrderDistribution";
import OrdersTable from "../analysis/overview/OrdersTable";
import SummaryApi from "../common";

const AdminOrderPage = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [orderStats, setOrderStats] = useState({
        totalOrders: "0",
        pendingOrders: "0",
        completedOrders: "0",
        totalRevenue: "₦0.00",
        totalCost: "₦0.00",
        totalProfit: "₦0.00",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatCurrency = (value) => {
        return `₦${new Intl.NumberFormat("en-NG").format(value.toFixed(2))}`;
    };

    useEffect(() => {
        const fetchOrderStats = async () => {
            try {
                const response = await fetch(SummaryApi.allOrders.url, {
                    method: SummaryApi.allOrders.method,
                    headers: { "Content-Type": "application/json" },
                    credentials: "include"
                });
                const data = await response.json();

                if (data.success) {
                    const orders = data.data;
                    const totalOrders = orders.length;
                    const pendingOrders = orders.filter(order => order.status === "Pending").length;
                    const completedOrders = orders.filter(order => order.status === "Delivered" || order.adminConfirmed === true).length;
                    const totalRevenue = orders
                        .filter(order => order.status === "Delivered" || order.adminConfirmed === true)
                        .reduce((sum, order) => sum + (order.totalPrice || 0), 0);
                    const totalProfit = orders
                        .filter(order => order.status === "Delivered" || order.adminConfirmed === true)
                        .reduce((sum, order) => sum + (order.profit || 0), 0);
                    const totalCost = totalRevenue - totalProfit;

                    setOrderStats({
                        totalOrders: totalOrders.toString(),
                        pendingOrders: pendingOrders.toString(),
                        completedOrders: completedOrders.toString(),
                        totalRevenue: formatCurrency(totalRevenue),
                        totalCost: formatCurrency(totalCost),
                        totalProfit: formatCurrency(totalProfit),
                    });
                } else {
                    setError(data.message || "Failed to fetch order stats.");
                }
            } catch (err) {
                console.error("Error fetching order stats:", err);
                setError("Failed to fetch order stats.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderStats();
    }, [refreshTrigger]);

    if (loading) {
        return (
            <div>
                <Header title="Orders" subtitle="Manage and track customer orders" />
                <div className={adminLoading}>Loading orders...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Header title="Orders" />
                <div className="mx-auto max-w-7xl px-4 py-8">
                    <p className={adminError}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto">
            <Header title="Orders" subtitle="Manage and track customer orders" />

            <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <StatCard name="Total Orders" icon={FaShoppingCart} value={orderStats.totalOrders} />
                    <StatCard name="Pending Orders" icon={FaClock} value={orderStats.pendingOrders} />
                    <StatCard name="Completed Orders" icon={FaCheckCircle} value={orderStats.completedOrders} />
                    <StatCard name="Total Revenue" icon={FaMoneyBillWave} value={orderStats.totalRevenue} />
                    <StatCard name="Total Cost" icon={FaMoneyBillWave} value={orderStats.totalCost} />
                    <StatCard name="Total Profit" icon={FaHandHoldingUsd} value={orderStats.totalProfit} />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <DailyOrders key={`daily-${refreshTrigger}`} />
                    <OrderDistribution key={`dist-${refreshTrigger}`} />
                </div>

                <OrdersTable onOrderDeleted={() => setRefreshTrigger(prev => prev + 1)} />
            </main>
        </div>
    );
};

export default AdminOrderPage;
