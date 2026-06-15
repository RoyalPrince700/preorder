import { useEffect, useState } from "react";
import { TbCurrencyNaira } from "react-icons/tb";
import { FaShoppingCart, FaChartLine, FaArrowUp, FaUserCheck, FaUser } from "react-icons/fa";
import Header from "../common/Header";
import StatCard from "../common/StatCard";
import { adminError, adminLoading } from "../common/adminUi";
import SalesOverviewChart from "../analysis/overview/SalesOverViewChart";
import CategoryDistributionChart from "../analysis/overview/CategoryDistributionChart";
import BrandDistributionCharts from "../analysis/overview/BrandDistributionCharts";
import DailySalesTrend from "../analysis/overview/DailySalesTrend";
import SummaryApi from "../common";
import {
    getAmountPaid,
    isOrderCounted,
    isSignedInOrder,
    isGuestOrder,
    sumAmountPaid,
    sumDiscountForfeited,
    sumWebsiteTotal,
} from "../helpers/orderFinance";

const SalesPage = () => {
    const [salesStats, setSalesStats] = useState({
        totalRevenue: "₦0.00",
        websiteListedValue: "₦0.00",
        discountForfeited: "₦0.00",
        totalProfit: "₦0.00",
        totalCost: "₦0.00",
        averageOrderValue: "₦0.00",
        conversionRate: "0%",
        salesGrowth: "0%",
        pendingOrdersCount: "0",
        pendingSalesWorth: "₦0.00",
        // Signed-in vs Guest
        signedInOrders: "0",
        signedInRevenue: "₦0.00",
        guestOrders: "0",
        guestRevenue: "₦0.00",
        guestPendingOrders: "0",
        guestPendingWorth: "₦0.00",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatCurrency = (value) => {
        return `₦${new Intl.NumberFormat("en-NG").format(value.toFixed(2))}`;
    };

    const calculateSalesGrowth = (salesYesterday, salesTwoDaysAgo) => {
        if (salesTwoDaysAgo === 0) return "N/A";
        const growth = ((salesYesterday - salesTwoDaysAgo) / salesTwoDaysAgo) * 100;
        return `${growth.toFixed(2)}%`;
    };

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await fetch(SummaryApi.allOrders.url, {
                    method: SummaryApi.allOrders.method,
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
                const data = await response.json();
        
                if (data.success) {
                    const allOrders = data.data;
                    const deliveredOrders = allOrders.filter(isOrderCounted);
                    const pendingOrders = allOrders.filter(order => order.status === "Pending" && !order.adminConfirmed);
                    const totalRevenue = sumAmountPaid(deliveredOrders);
                    const websiteListedValue = sumWebsiteTotal(deliveredOrders);
                    const discountForfeited = sumDiscountForfeited(deliveredOrders);
                    const totalProfit = deliveredOrders.reduce((sum, order) => sum + (order.profit || 0), 0);
                    const totalCost = totalRevenue - totalProfit;
                    const averageOrderValue = deliveredOrders.length
                        ? totalRevenue / deliveredOrders.length
                        : 0;
                    const conversionRate = deliveredOrders.length
                        ? (pendingOrders.length / deliveredOrders.length) * 100
                        : 0;
                    const salesYesterday = deliveredOrders
                        .filter(order => new Date(order.createdAt).toDateString() === new Date().toDateString())
                        .reduce((sum, order) => sum + getAmountPaid(order), 0);
                    const salesTwoDaysAgo = deliveredOrders
                        .filter(order =>
                            new Date(order.createdAt).toDateString() ===
                            new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()
                        )
                        .reduce((sum, order) => sum + getAmountPaid(order), 0);
                    const salesGrowth = calculateSalesGrowth(salesYesterday, salesTwoDaysAgo);
                    const pendingOrdersCount = pendingOrders.length;
                    const pendingSalesWorth = pendingOrders.reduce((sum, order) => sum + getAmountPaid(order), 0);

                    // Signed-in vs Guest breakdowns
                    const signedInAll = allOrders.filter(isSignedInOrder);
                    const guestAll = allOrders.filter(isGuestOrder);

                    const signedInDelivered = signedInAll.filter(isOrderCounted);
                    const guestDelivered = guestAll.filter(isOrderCounted);

                    const signedInRevenue = sumAmountPaid(signedInDelivered);
                    const guestRevenue = sumAmountPaid(guestDelivered);

                    const guestPending = guestAll.filter(order => order.status === "Pending" && !order.adminConfirmed);
                    const guestPendingOrdersCount = guestPending.length;
                    const guestPendingWorth = guestPending.reduce((sum, order) => sum + getAmountPaid(order), 0);

                    setSalesStats({
                        totalRevenue: formatCurrency(totalRevenue),
                        websiteListedValue: formatCurrency(websiteListedValue),
                        discountForfeited: formatCurrency(discountForfeited),
                        totalProfit: formatCurrency(totalProfit),
                        totalCost: formatCurrency(totalCost),
                        averageOrderValue: formatCurrency(averageOrderValue),
                        conversionRate: `${conversionRate.toFixed(2)}%`,
                        salesGrowth,
                        pendingOrdersCount: pendingOrdersCount.toString(),
                        pendingSalesWorth: formatCurrency(pendingSalesWorth),
                        signedInOrders: signedInAll.length.toString(),
                        signedInRevenue: formatCurrency(signedInRevenue),
                        guestOrders: guestAll.length.toString(),
                        guestRevenue: formatCurrency(guestRevenue),
                        guestPendingOrders: guestPendingOrdersCount.toString(),
                        guestPendingWorth: formatCurrency(guestPendingWorth),
                    });
                } else {
                    setError(data.message || "Failed to fetch sales data.");
                }
            } catch (err) {
                console.error("Error fetching sales data:", err);
                setError("Failed to fetch sales data.");
            } finally {
                setLoading(false);
            }
        };

        fetchSalesData();
    }, []);

    if (loading) {
        return (
            <div>
                <Header title="Sales" subtitle="Revenue and growth metrics" />
                <div className={adminLoading}>Loading sales data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Header title="Sales" />
                <div className="mx-auto max-w-7xl px-4 py-8">
                    <p className={adminError}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto">
            <Header title="Sales" subtitle="Revenue and growth metrics" />
            <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard name="Money Received" icon={TbCurrencyNaira} value={salesStats.totalRevenue} />
                    <StatCard name="Website Listed Value" icon={TbCurrencyNaira} value={salesStats.websiteListedValue} />
                    <StatCard name="Discount Forfeited" icon={TbCurrencyNaira} value={salesStats.discountForfeited} />
                    <StatCard name="Total Cost" icon={TbCurrencyNaira} value={salesStats.totalCost} />
                    <StatCard name="Total Profit" icon={TbCurrencyNaira} value={salesStats.totalProfit} />
                    <StatCard name="Pending Orders" icon={FaShoppingCart} value={salesStats.pendingOrdersCount} />
                    <StatCard name="Pending Orders Worth" icon={TbCurrencyNaira} value={salesStats.pendingSalesWorth} />
                    <StatCard name="Avg. Order Value" icon={TbCurrencyNaira} value={salesStats.averageOrderValue} />
                    <StatCard name="Conversion Rate" icon={FaChartLine} value={salesStats.conversionRate} />
                    <StatCard name="Sales Growth" icon={FaArrowUp} value={salesStats.salesGrowth} />
                </div>

                {/* Signed-in vs Guest breakdown for sales */}
                <div>
                    <div className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                        Revenue & Orders by Customer Type — Signed-in vs Guest
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard name="Signed-in Orders" icon={FaUserCheck} value={salesStats.signedInOrders} />
                        <StatCard name="Signed-in Revenue" icon={TbCurrencyNaira} value={salesStats.signedInRevenue} />
                        <StatCard name="Guest Orders" icon={FaUser} value={salesStats.guestOrders} />
                        <StatCard name="Guest Revenue" icon={TbCurrencyNaira} value={salesStats.guestRevenue} />
                        <StatCard name="Guest Pending Orders" icon={FaShoppingCart} value={salesStats.guestPendingOrders} />
                        <StatCard name="Guest Pending Worth" icon={TbCurrencyNaira} value={salesStats.guestPendingWorth} />
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400">
                        Signed-in = logged-in users at checkout. Guest = unsigned users (WhatsApp/direct checkout without account).
                    </p>
                </div>

                <SalesOverviewChart />

                <BrandDistributionCharts />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <CategoryDistributionChart />
                    <DailySalesTrend />
                </div>
            </main>
        </div>
    );
};

export default SalesPage;
