import React, { useState } from "react";
import ROLE from "../common/role";
import { IoMdClose } from "react-icons/io";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import {
  adminModalOverlay,
  adminModalPanel,
  adminModalHeader,
  adminModalCloseBtn,
  adminModalBody,
  adminModalFooter,
  adminInput,
  adminLabel,
} from "./adminUi";

const ChangeUserRole = ({
  name,
  email,
  role,
  userId,
  onClose,
  callFunc,
}) => {
  const [userRole, setUserRole] = useState(role);
  const [saving, setSaving] = useState(false);

  const handleOnChangeSelect = (e) => {
    setUserRole(e.target.value);
  };

  const updateUserRole = async () => {
    setSaving(true);
    try {
      const fetchResponse = await fetch(SummaryApi.updateUser.url, {
        method: SummaryApi.updateUser.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          role: userRole,
        }),
      });
      const responseData = await fetchResponse.json();

      if (responseData.success) {
        toast.success(responseData.message);
        onClose();
        callFunc();
      } else {
        toast.error(responseData.message);
      }
    } catch {
      toast.error("Failed to update user role.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={adminModalOverlay}>
      <div className={adminModalPanel}>
        <div className={adminModalHeader}>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">
              User management
            </p>
            <h2 className="mt-1 text-sm font-black uppercase tracking-widest">
              Change role
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={adminModalCloseBtn}
            aria-label="Close"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>

        <div className={adminModalBody}>
          <div>
            <p className={adminLabel}>Name</p>
            <p className="text-xs font-bold text-slate-950">{name}</p>
          </div>
          <div>
            <p className={adminLabel}>Email</p>
            <p className="text-xs font-bold text-slate-950 break-all">{email}</p>
          </div>
          <div>
            <label htmlFor="role" className={adminLabel}>
              Role
            </label>
            <select
              id="role"
              className={adminInput}
              value={userRole}
              onChange={handleOnChangeSelect}
            >
              {Object.values(ROLE).map((el) => (
                <option value={el} key={el}>
                  {el}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={adminModalFooter}>
          <button
            type="button"
            disabled={saving}
            className="flex-1 bg-slate-950 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-orange-600 disabled:opacity-60"
            onClick={updateUserRole}
          >
            {saving ? "Saving…" : "Change role"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="border-2 border-slate-900 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeUserRole;
