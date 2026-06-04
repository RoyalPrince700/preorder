import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import ORDER_STATUS from "../common/orderStatus";
import { useSocket } from "../context/SocketContext";
import {
  adminModalOverlay,
  adminModalPanel,
  adminModalHeader,
  adminModalCloseBtn,
  adminModalBody,
  adminModalFooter,
  adminInput,
  adminLabel,
  adminBtnPrimary,
  adminBtnSecondary,
  adminBtnDisabled,
} from "../common/adminUi";

const ChangeOrderStatus = ({ orderId, currentStatus, onClose, callFunc }) => {
  const [orderStatus, setOrderStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const { socket } = useSocket();

  const handleStatusChange = (e) => {
    setOrderStatus(e.target.value);
  };

  const updateOrderStatus = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const response = await fetch(SummaryApi.updateOrder.url, {
        method: SummaryApi.updateOrder.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status: orderStatus }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success(responseData.message);

        if (socket) {
          socket.emit("order-status-updated", {
            orderId,
            newStatus: orderStatus,
            message: `Order #${orderId} status changed to ${orderStatus}`,
          });
        }

        onClose();
        callFunc();
      } else {
        toast.error(responseData.message);
      }
    } catch {
      toast.error("Failed to update order status.");
    } finally {
      setSaving(false);
    }
  };

  const shortOrderId = orderId ? orderId.slice(-12).toUpperCase() : "—";

  return (
    <div className={adminModalOverlay}>
      <div className={adminModalPanel}>
        <div className={adminModalHeader}>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">
              Order management
            </p>
            <h2 className="mt-1 text-sm font-black uppercase tracking-widest">
              Change status
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className={`${adminModalCloseBtn} ${adminBtnDisabled}`}
            aria-label="Close"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>

        <div className={adminModalBody}>
          <div>
            <p className={adminLabel}>Order ID</p>
            <p className="font-mono text-xs font-bold text-slate-950">
              #{shortOrderId}
            </p>
          </div>
          <div>
            <label htmlFor="order-status" className={adminLabel}>
              Status
            </label>
            <select
              id="order-status"
              className={adminInput}
              value={orderStatus}
              onChange={handleStatusChange}
              disabled={saving}
            >
              {Object.values(ORDER_STATUS).map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={adminModalFooter}>
          <button
            type="button"
            disabled={saving}
            className={`${adminBtnPrimary} flex-1 py-3 ${adminBtnDisabled}`}
            onClick={updateOrderStatus}
          >
            {saving ? "Updating…" : "Change status"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className={`${adminBtnSecondary} px-6 py-3 ${adminBtnDisabled}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeOrderStatus;
