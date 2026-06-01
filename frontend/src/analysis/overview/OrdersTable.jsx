import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import SummaryApi from "../../common";
import displayNARCurrency from "../../helpers/displayCurrency";
import ChangeOrderStatus from "../../components/ChangeOrderStatus";
import { useSocket } from "../../context/SocketContext";
import {
  adminTableWrap,
  adminTableHead,
  adminTh,
  adminBtnSecondary,
  adminBtnConfirm,
  adminChartTitle,
} from "../../common/adminUi";

const statusBadge = (status) => {
  switch (status) {
    case "Delivered":
    case "Paid":
      return "bg-green-100 text-green-800 border-green-200";
    case "Pending":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

const OrdersTable = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [openChangeStatus, setOpenChangeStatus] = useState(false);
  const [currentOrderDetails, setCurrentOrderDetails] = useState({
    orderId: "",
    currentStatus: "",
  });
  const { socket } = useSocket();

  const fetchAllOrders = async () => {
    try {
      const response = await fetch(SummaryApi.allOrders.url, {
        method: SummaryApi.allOrders.method,
        credentials: "include",
      });

      const dataResponse = await response.json();

      if (dataResponse.success) {
        setAllOrders(dataResponse.data);
      } else {
        toast.error(dataResponse.message);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch orders.");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join-admin-room');

    const handleAdminOrderStatusChange = (updateData) => {
      setAllOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updateData.orderId
            ? { ...order, status: updateData.newStatus }
            : order
        )
      );

      toast.info(`Order #${updateData.orderId.slice(-12).toUpperCase()} status updated to ${updateData.newStatus}`, {
        position: "top-right",
        autoClose: 5000,
      });
    };

    socket.on('admin-order-status-changed', handleAdminOrderStatusChange);

    return () => {
      socket.off('admin-order-status-changed', handleAdminOrderStatusChange);
    };
  }, [socket]);

  const updateOrderStatus = async (orderId, newStatus, adminConfirmed = undefined) => {
    try {
      const payload = { orderId, status: newStatus };
      if (adminConfirmed !== undefined) {
        payload.adminConfirmed = adminConfirmed;
      }
      
      const response = await fetch(SummaryApi.updateOrder.url, {
        method: SummaryApi.updateOrder.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const dataResponse = await response.json();

      if (dataResponse.success) {
        toast.success(adminConfirmed ? "Order confirmed successfully." : "Order status updated successfully.");
        fetchAllOrders();
      } else {
        toast.error(dataResponse.message);
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Failed to update order.");
    }
  };

  return (
    <div>
      <h2 className={`${adminChartTitle} mb-4`}>All Orders</h2>
      <div className={adminTableWrap}>
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className={adminTableHead}>
              <th className={adminTh}>#</th>
              <th className={adminTh}>Order ID</th>
              <th className={adminTh}>Status</th>
              <th className={adminTh}>Order Date</th>
              <th className={adminTh}>Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {allOrders.map((order, index) => (
              <React.Fragment key={order._id || index}>
                <tr className="border-b border-slate-100 transition-colors hover:bg-orange-50/30">
                  <td className="px-4 py-3 text-xs font-bold">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="group relative">
                      <span
                        className="inline-block max-w-[8rem] cursor-help truncate font-black uppercase tracking-widest text-slate-950"
                        title={order._id}
                      >
                        {order._id.slice(-12)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`border px-2 py-1 text-[10px] font-black uppercase tracking-widest ${statusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                    {moment(order.createdAt).format("LL")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {!order.adminConfirmed && (
                        <button
                          type="button"
                          className={adminBtnConfirm}
                          onClick={() => updateOrderStatus(order._id, order.status, true)}
                        >
                          Confirm
                        </button>
                      )}
                      <button
                        type="button"
                        className={adminBtnSecondary}
                        onClick={() =>
                          setExpandedOrderId(
                            expandedOrderId === order._id ? null : order._id
                          )
                        }
                      >
                        {expandedOrderId === order._id ? "Hide" : "Details"}
                      </button>
                      <button
                        type="button"
                        className={adminBtnSecondary}
                        onClick={() => {
                          setCurrentOrderDetails({
                            orderId: order._id,
                            currentStatus: order.status,
                          });
                          setOpenChangeStatus(true);
                        }}
                      >
                        Change Status
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedOrderId === order._id && (
                  <tr>
                    <td colSpan={5} className="bg-slate-50 p-6">
                      <div className="grid grid-cols-1 gap-4 border-2 border-slate-100 bg-white p-6 md:grid-cols-2">
                        <div className="space-y-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                          <p><span className="text-slate-950">Customer:</span> {order.name || "Unknown"}</p>
                          <p><span className="text-slate-950">Phone:</span> {order.number || "N/A"}</p>
                          <p><span className="text-slate-950">Address:</span> {order.address || "N/A"}</p>
                        </div>
                        <div className="space-y-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                          <p><span className="text-slate-950">Note:</span> {order.note || "N/A"}</p>
                          <p><span className="text-slate-950">Total:</span> {displayNARCurrency(order.totalPrice.toFixed(2))}</p>
                        </div>
                      </div>
                      
                      <h4 className="mt-6 border-b-2 border-slate-950 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950">
                        Cart Items
                      </h4>
                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {order.cartItems.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 border-2 border-slate-100 bg-white p-3">
                            {item.productId?.productImage?.[0] && (
                              <img
                                src={item.productId.productImage[0]}
                                alt={item.productId.productName}
                                className="h-16 w-16 object-contain"
                              />
                            )}
                            <div>
                              <p className="text-xs font-black uppercase tracking-widest text-slate-950">
                                {item.productId?.productName || "Unknown"}
                              </p>
                              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {allOrders.length === 0 && (
          <p className="py-12 text-center text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            No orders found
          </p>
        )}
      </div>
      {openChangeStatus && (
        <ChangeOrderStatus
          orderId={currentOrderDetails.orderId}
          currentStatus={currentOrderDetails.currentStatus}
          onClose={() => setOpenChangeStatus(false)}
          callFunc={fetchAllOrders}
        />
      )}
    </div>
  );
};

export default OrdersTable;
