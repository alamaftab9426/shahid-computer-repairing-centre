import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { FaLaptop, FaShoppingCart, FaUsers, FaMoneyBillWave } from "react-icons/fa";
import axiosInstance from "../../api/axiosInstance";

const BASE_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    payments: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesChart, setSalesChart] = useState({ categories: [], data: [] });
  const [profitChart, setProfitChart] = useState({ categories: [], series: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // ORDERS
        const orderRes = await axiosInstance.get(`${BASE_URL}/api/order/allorders`);
        const orders = Array.isArray(orderRes.data.orders) ? orderRes.data.orders : orderRes.data;
        const ordered = orders.slice().reverse();
        setRecentOrders(ordered.slice(0, 10));
        const totalOrderAmount = ordered.reduce((acc, o) => acc + (o.amount || 0), 0);

        // PRODUCTS
        const prodRes = await axiosInstance.get(`${BASE_URL}/api/laptop`);
        const products = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.products || [];
        const productsCount = products.length;

        // CUSTOMERS
        const userRes = await axiosInstance.get(`${BASE_URL}/api/admin/customers`);
        const users = Array.isArray(userRes.data) ? userRes.data : userRes.data.users || [];
        const customersCount = users.length;

        // PAYMENTS
        const paymentsTotal = totalOrderAmount;

        // UPDATE STATS
        setStats({
          products: productsCount,
          orders: ordered.length,
          customers: customersCount,
          payments: paymentsTotal,
        });

        // SALES CHART
        const monthly = {};
        ordered.forEach((o) => {
          const d = o.createdAt ? new Date(o.createdAt) : new Date();
          const mon = d.toLocaleString("default", { month: "short" });
          monthly[mon] = (monthly[mon] || 0) + (o.amount || 0);
        });
        const months = Object.keys(monthly);
        const values = Object.values(monthly);

        setSalesChart({ categories: months, data: values });
        setProfitChart({
          categories: months,
          series: [
            { name: "Revenue", data: values },
            { name: "Profit", data: values.map((v) => Math.round(v * 0.8)) },
          ],
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-600">
        Loading dashboard...
      </div>
    );

  const salesData = {
    options: {
      chart: { id: "sales" },
      xaxis: { categories: salesChart.categories },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
    },
    series: [{ name: "Sales", data: salesChart.data }],
  };

  const profitData = {
    options: {
      chart: { type: "bar" },
      xaxis: { categories: profitChart.categories },
      dataLabels: { enabled: false },
    },
    series: profitChart.series,
  };

  const cards = [
    { name: "Products", value: stats.products, icon: <FaLaptop size={28} />, color: "bg-blue-600", textColor: "text-blue-600" },
    { name: "Orders", value: stats.orders, icon: <FaShoppingCart size={28} />, color: "bg-yellow-600", textColor: "text-yellow-600" },
    { name: "Customers", value: stats.customers, icon: <FaUsers size={28} />, color: "bg-pink-600", textColor: "text-pink-600" },
    { name: "Payments", value: `₹${stats.payments.toLocaleString()}`, icon: <FaMoneyBillWave size={28} />, color: "bg-green-600", textColor: "text-green-600" },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

   {/* ===== Stats Cards ===== */}
{/* ===== Stats Cards ===== */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {cards.map((c, i) => (
    <div
      key={i}
      className="p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center bg-white"
    >
      {/* Icon inside colored circle */}
      <div className={`mb-4 p-5 rounded-full flex items-center justify-center ${c.color}`}>
        {React.cloneElement(c.icon, { color: 'white', size: 32 })}
      </div>

      {/* Name */}
      <div className="text-lg font-semibold text-gray-600 mb-2 text-center">
        {c.name}
      </div>

      {/* Value */}
      <div className="text-3xl font-bold text-gray-800 text-center">
        {c.value}
      </div>
    </div>
  ))}
</div>


      {/* ===== Charts ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Sales Overview</h2>
          <Chart options={salesData.options} series={salesData.series} type="line" height={320} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Profit Overview</h2>
          <Chart options={profitData.options} series={profitData.series} type="bar" height={320} />
        </div>
      </div>

      {/* ===== Recent Orders ===== */}
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Order ID", "Customer", "Status", "Amount", "Date"].map((th, i) => (
                  <th
                    key={i}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-gray-700 font-medium">{o._id?.slice(-6)}</td>
                    <td className="px-6 py-3 text-gray-600">{o.customerName || o.name || "N/A"}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          o.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {o.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-700">₹{(o.amount || 0).toLocaleString()}</td>
                    <td className="px-6 py-3 text-gray-500">{o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "-"}</td>
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

export default Dashboard;
