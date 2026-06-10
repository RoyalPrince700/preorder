import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import SummaryApi from "../../common";
import { aggregateBrandSales } from "../../helpers/brandSales";
import displayNARCurrency from "../../helpers/displayCurrency";
import {
  adminChartCard,
  adminChartTitle,
  adminLoading,
  CHART_COLORS,
} from "../../common/adminUi";

const COLORS = CHART_COLORS;

const tooltipStyle = {
  backgroundColor: "#FFFFFF",
  border: "2px solid #0f172a",
  borderRadius: 0,
  color: "#0f172a",
  fontSize: "11px",
  fontWeight: 700,
};

const BrandDistributionCharts = () => {
  const [volumeData, setVolumeData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(SummaryApi.allOrders.url, {
          method: SummaryApi.allOrders.method,
          credentials: "include",
        });
        const result = await response.json();

        if (result.success) {
          const aggregated = aggregateBrandSales(result.data);
          setVolumeData(aggregated.volumeData);
          setRevenueData(aggregated.revenueData);
        }
      } catch (err) {
        console.error("Error fetching brand sales data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={adminLoading}>Loading brand data...</div>
        <div className={adminLoading}>Loading brand data...</div>
      </div>
    );
  }

  const topVolume = volumeData.slice(0, 8);
  const topRevenue = revenueData.slice(0, 8);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className={adminChartCard}>
        <h2 className={adminChartTitle}>Brand sales volume</h2>
        <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Units sold by brand (confirmed & delivered orders)
        </p>
        {!topVolume.length ? (
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            No brand sales data yet
          </p>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topVolume}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name.length > 12 ? `${name.slice(0, 12)}…` : name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {topVolume.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, name) => [`${value} units`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className={adminChartCard}>
        <h2 className={adminChartTitle}>Brand revenue</h2>
        <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Money received by brand (includes discounted amounts)
        </p>
        {!topRevenue.length ? (
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            No brand revenue data yet
          </p>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topRevenue}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  stroke="#64748b"
                  tick={{ fontSize: 10, fontWeight: 700 }}
                  tickFormatter={(v) =>
                    v >= 1000 ? `₦${(v / 1000).toFixed(0)}k` : `₦${v}`
                  }
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  stroke="#64748b"
                  tick={{ fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, name) => [
                    displayNARCurrency(Number(value).toFixed(2)),
                    name,
                  ]}
                />
                <Bar dataKey="value" fill="#ea580c" radius={[0, 0, 0, 0]}>
                  {topRevenue.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandDistributionCharts;
