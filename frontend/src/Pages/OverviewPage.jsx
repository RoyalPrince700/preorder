import { useState, useEffect } from "react";
import { MdOutlineBarChart } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { TbCurrencyNaira } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { FaUserCheck, FaUser } from "react-icons/fa";
import Header from "../common/Header";
import StatCard from "../common/StatCard";
import SummaryApi from "../common";
import { adminError, adminLoading } from "../common/adminUi";
import SalesOverviewChart from "../analysis/overview/SalesOverViewChart";
import CategoryDistributionChart from "../analysis/overview/CategoryDistributionChart";
import { isSignedInOrder, isGuestOrder } from "../helpers/orderFinance";

const OverviewPage = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        pendingOrdersCount: 0,
        pendingSalesWorth: 0,
        totalUsers: 0,
        totalProducts: 0,
        conversionRate: "0%",
        // Signed-in vs Guest
        signedInSales: 0,
        guestSales: 0,
        signedInPendingWorth: 0,
        guestPendingWorth: 0,
        signedInPendingCount: 0,
        guestPendingCount: 0,
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

                // Signed-in vs Guest (hoisted so they are available for the final setStats)
                let signedInSales = 0;
                let guestSales = 0;
                let signedInPendingWorth = 0;
                let guestPendingWorth = 0;
                let signedInPendingCount = 0;
                let guestPendingCount = 0;

                if (allOrdersData.success) {
                    const allOrders = allOrdersData.data;

                    const deliveredOrders = allOrders.filter(order => order.status === "Delivered" || order.adminConfirmed === true);
                    totalSales = deliveredOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
                    
                    const pendingOrders = allOrders.filter(order => order.status === "Pending" && !order.adminConfirmed);
                    pendingOrdersCount = pendingOrders.length;
                    pendingSalesWorth = pendingOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

                    // Signed-in vs Guest splits (userId present = signed-in / logged-in at time of order)
                    const signedInAll = allOrders.filter(isSignedInOrder);
                    const guestAll = allOrders.filter(isGuestOrder);

                    const signedInDelivered = signedInAll.filter(order => order.status === "Delivered" || order.adminConfirmed === true);
                    const guestDelivered = guestAll.filter(order => order.status === "Delivered" || order.adminConfirmed === true);

                    signedInSales = signedInDelivered.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
                    guestSales = guestDelivered.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

                    const signedInPending = signedInAll.filter(order => order.status === "Pending" && !order.adminConfirmed);
                    const guestPending = guestAll.filter(order => order.status === "Pending" && !order.adminConfirmed);

                    signedInPendingCount = signedInPending.length;
                    guestPendingCount = guestPending.length;

                    signedInPendingWorth = signedInPending.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
                    guestPendingWorth = guestPending.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
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
                    signedInSales,
                    guestSales,
                    signedInPendingWorth,
                    guestPendingWorth,
                    signedInPendingCount,
                    guestPendingCount,
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

                {/* Signed-in vs Guest breakdown on Overview */}
                <div>
                    <div className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                        Sales & Pending by Customer Type
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            name="Signed-in Sales"
                            icon={FaUserCheck}
                            value={`₦${(stats.signedInSales || 0).toFixed(2)}`}
                        />
                        <StatCard
                            name="Guest Sales"
                            icon={FaUser}
                            value={`₦${(stats.guestSales || 0).toFixed(2)}`}
                        />
                        <StatCard
                            name="Signed-in Pending Worth"
                            icon={TbCurrencyNaira}
                            value={`₦${(stats.signedInPendingWorth || 0).toFixed(2)}`}
                        />
                        <StatCard
                            name="Guest Pending Worth"
                            icon={TbCurrencyNaira}
                            value={`₦${(stats.guestPendingWorth || 0).toFixed(2)}`}
                        />
                    </div>
                    <p className="mt-1 text-[10px] text-slate-400">
                        Signed-in orders come from logged-in accounts. Guest orders come from users who checked out without signing in.
                    </p>
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
