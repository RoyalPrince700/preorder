import { useEffect, useState } from "react";
import { FaShoppingCart, FaClock, FaCheckCircle, FaMoneyBillWave, FaHandHoldingUsd, FaUserCheck, FaUser } from "react-icons/fa";
import Header from "../common/Header";
import StatCard from "../common/StatCard";
import { adminError, adminLoading } from "../common/adminUi";
import DailyOrders from "../analysis/overview/DailyOrders";
import OrderDistribution from "../analysis/overview/OrderDistribution";
import OrdersTable from "../analysis/overview/OrdersTable";
import SummaryApi from "../common";
import {
    isOrderCounted,
    isSignedInOrder,
    isGuestOrder,
    sumAmountPaid,
    sumDiscountForfeited,
    sumWebsiteTotal,
} from "../helpers/orderFinance";

const AdminOrderPage = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [orderStats, setOrderStats] = useState({
        totalOrders: "0",
        pendingOrders: "0",
        completedOrders: "0",
        totalRevenue: "₦0.00",
        websiteListedValue: "₦0.00",
        discountForfeited: "₦0.00",
        totalCost: "₦0.00",
        totalProfit: "₦0.00",
        // Signed-in vs Guest breakdown
        signedInOrders: "0",
        signedInRevenue: "₦0.00",
        guestOrders: "0",
        guestRevenue: "₦0.00",
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
                    const countedOrders = orders.filter(isOrderCounted);
                    const totalRevenue = sumAmountPaid(countedOrders);
                    const websiteListedValue = sumWebsiteTotal(countedOrders);
                    const discountForfeited = sumDiscountForfeited(countedOrders);
                    const totalProfit = countedOrders.reduce((sum, order) => sum + (order.profit || 0), 0);
                    const totalCost = totalRevenue - totalProfit;

                    // Signed-in vs Guest breakdowns
                    const signedInAll = orders.filter(isSignedInOrder);
                    const guestAll = orders.filter(isGuestOrder);

                    const signedInCounted = signedInAll.filter(isOrderCounted);
                    const guestCounted = guestAll.filter(isOrderCounted);

                    const signedInRevenue = sumAmountPaid(signedInCounted);
                    const guestRevenue = sumAmountPaid(guestCounted);

                    setOrderStats({
                        totalOrders: totalOrders.toString(),
                        pendingOrders: pendingOrders.toString(),
                        completedOrders: completedOrders.toString(),
                        totalRevenue: formatCurrency(totalRevenue),
                        websiteListedValue: formatCurrency(websiteListedValue),
                        discountForfeited: formatCurrency(discountForfeited),
                        totalCost: formatCurrency(totalCost),
                        totalProfit: formatCurrency(totalProfit),
                        signedInOrders: signedInAll.length.toString(),
                        signedInRevenue: formatCurrency(signedInRevenue),
                        guestOrders: guestAll.length.toString(),
                        guestRevenue: formatCurrency(guestRevenue),
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <StatCard name="Total Orders" icon={FaShoppingCart} value={orderStats.totalOrders} />
                    <StatCard name="Pending Orders" icon={FaClock} value={orderStats.pendingOrders} />
                    <StatCard name="Completed Orders" icon={FaCheckCircle} value={orderStats.completedOrders} />
                    <StatCard name="Money Received" icon={FaMoneyBillWave} value={orderStats.totalRevenue} />
                    <StatCard name="Website Listed Value" icon={FaMoneyBillWave} value={orderStats.websiteListedValue} />
                    <StatCard name="Discount Forfeited" icon={FaMoneyBillWave} value={orderStats.discountForfeited} />
                    <StatCard name="Total Cost" icon={FaMoneyBillWave} value={orderStats.totalCost} />
                    <StatCard name="Total Profit" icon={FaHandHoldingUsd} value={orderStats.totalProfit} />
                </div>

                {/* Signed-in vs Guest breakdown */}
                <div>
                    <div className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                        Customer Type Breakdown — Signed-in vs Guest (unsigned)
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard name="Signed-in Orders" icon={FaUserCheck} value={orderStats.signedInOrders} />
                        <StatCard name="Signed-in Revenue" icon={FaMoneyBillWave} value={orderStats.signedInRevenue} />
                        <StatCard name="Guest Orders" icon={FaUser} value={orderStats.guestOrders} />
                        <StatCard name="Guest Revenue" icon={FaMoneyBillWave} value={orderStats.guestRevenue} />
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400">
                        Signed-in = orders placed while logged in. Guest = orders placed without sign-in (e.g. WhatsApp guest checkout).
                    </p>
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
