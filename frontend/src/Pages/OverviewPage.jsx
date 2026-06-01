import React, { useState, useEffect } from "react";
import { MdOutlineBarChart } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { TbCurrencyNaira } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import Header from "../common/Header";
import StatCard from "../common/StatCard";
import SummaryApi from "../common";
import { adminError, adminLoading } from "../common/adminUi";
import SalesOverviewChart from "../analysis/overview/SalesOverViewChart";
import CategoryDistributionChart from "../analysis/overview/CategoryDistributionChart";

const OverviewPage = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        pendingOrdersCount: 0,
        pendingSalesWorth: 0,
        totalUsers: 0,
        totalProducts: 0,
        conversionRate: "0%",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allOrdersResponse = await fetch(SummaryApi.allOrders.url, {
                    method: SummaryApi.allOrders.method,
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
                const allOrdersData = await allOrdersResponse.json();

                let totalSales = 0;
                let pendingOrdersCount = 0;
                let pendingSalesWorth = 0;

                if (allOrdersData.success) {
                    const allOrders = allOrdersData.data;

                    totalSales = allOrders
                        .filter(order => order.status === "Delivered" || order.adminConfirmed === true)
                        .reduce((sum, order) => sum + (order.totalPrice || 0), 0);
                    
                    const pendingOrders = allOrders.filter(order => order.status === "Pending" && !order.adminConfirmed);
                    pendingOrdersCount = pendingOrders.length;
                    pendingSalesWorth = pendingOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
                }

                const usersResponse = await fetch(SummaryApi.allUser.url, {
                    method: SummaryApi.allUser.method,
                    credentials: "include",
                });
                const usersData = await usersResponse.json();

                let totalUsers = 0;
                if (usersData.success) {
                    totalUsers = usersData.data.length;
                }

                const productsResponse = await fetch(SummaryApi.allProduct.url, {
                    method: "GET",
                });
                const productsData = await productsResponse.json();

                let totalProducts = 0;
                if (productsData?.data) {
                    totalProducts = productsData.data.length;
                }

                setStats(prev => ({
                    ...prev,
                    totalSales,
                    pendingOrdersCount,
                    pendingSalesWorth,
                    totalUsers,
                    totalProducts,
                }));
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div>
                <Header title="Overview" subtitle="Store performance at a glance" />
                <div className={adminLoading}>Loading dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Header title="Overview" />
                <div className="mx-auto max-w-7xl px-4 py-8">
                    <p className={adminError}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto">
            <Header title="Overview" subtitle="Store performance at a glance" />

            <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        name="Total Sales"
                        icon={TbCurrencyNaira}
                        value={`₦${stats.totalSales.toFixed(2)}`}
                    />
                    <StatCard
                        name="Pending Orders"
                        icon={IoCartOutline}
                        value={stats.pendingOrdersCount}
                    />
                    <StatCard
                        name="Pending Orders Worth"
                        icon={TbCurrencyNaira}
                        value={`₦${stats.pendingSalesWorth.toFixed(2)}`}
                    />
                    <StatCard
                        name="Total Users"
                        icon={CgProfile}
                        value={stats.totalUsers}
                    />
                    <StatCard
                        name="Total Products"
                        icon={IoCartOutline}
                        value={stats.totalProducts}
                    />
                    <StatCard
                        name="Conversion Rate"
                        icon={MdOutlineBarChart}
                        value={stats.conversionRate}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <SalesOverviewChart />
                    <CategoryDistributionChart />
                </div>
            </main>
        </div>
    );
};

export default OverviewPage;
