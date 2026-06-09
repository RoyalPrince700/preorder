import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaUsers, FaBoxOpen } from "react-icons/fa";
import { TbCurrencyNaira } from "react-icons/tb";
import StatCard from "../common/StatCard";
import { adminError, adminLoading, adminTableWrap, adminTableHead, adminTh } from "../common/adminUi";
import SummaryApi from "../common";

const formatCurrency = (value) => {
  return `₦${new Intl.NumberFormat("en-NG").format(value.toFixed(2))}`;
};

const CartAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCartAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.cartAnalytics.url, {
        method: SummaryApi.cartAnalytics.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
        setError(null);
      } else {
        setError(data.message || "Failed to fetch cart analytics");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartAnalytics();
  }, []);

  if (loading) {
    return <div className={adminLoading}>Loading cart analytics...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className={adminError}>{error}</div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const { overview, products } = analytics;

  const overviewCards = [
    { name: "Total Cart Value", icon: TbCurrencyNaira, value: formatCurrency(overview.totalCartValue) },
    { name: "Total Items in Carts", icon: FaShoppingCart, value: overview.totalItemsInCarts.toLocaleString() },
    { name: "Products in Carts", icon: FaBoxOpen, value: overview.uniqueProductsInCarts },
    { name: "Users with Carts", icon: FaUsers, value: overview.totalUsersWithCarts },
  ];

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-full">
      <div>
        <h1 className="text-2xl font-black tracking-tighter text-slate-950">Cart Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Insights into products added to user carts</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map((card, index) => (
          <StatCard key={index} name={card.name} icon={card.icon} value={card.value} />
        ))}
      </div>

      {/* Products Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Products by Popularity</h2>
          <p className="text-xs text-slate-400">Sorted by quantity added to cart</p>
        </div>

        <div className={adminTableWrap}>
          <table className="w-full text-sm">
            <thead className={adminTableHead}>
              <tr>
                <th className={adminTh}>Product</th>
                <th className={adminTh}>Brand</th>
                <th className={adminTh}>Category</th>
                <th className={`${adminTh} text-right`}>Selling Price</th>
                <th className={`${adminTh} text-right`}>Qty Added</th>
                <th className={`${adminTh} text-right`}>Unique Users</th>
                <th className={`${adminTh} text-right`}>Times Added</th>
                <th className={`${adminTh} text-right`}>Worth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center text-xs font-black uppercase tracking-widest text-slate-400">
                    No products in carts yet
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-950">
                      <div className="flex items-center gap-3">
                        {product.productImage && (
                          <img 
                            src={product.productImage} 
                            alt={product.productName} 
                            className="w-10 h-10 object-cover border border-slate-200" 
                          />
                        )}
                        <span className="line-clamp-2">{product.productName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{product.brandName}</td>
                    <td className="px-4 py-3 text-slate-600 capitalize">{product.category}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">{formatCurrency(product.sellingPrice)}</td>
                    <td className="px-4 py-3 text-right font-black text-orange-600">{product.totalQuantity}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{product.uniqueUsers}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{product.cartCount}</td>
                    <td className="px-4 py-3 text-right font-black text-green-700">{formatCurrency(product.worth)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CartAnalytics;
