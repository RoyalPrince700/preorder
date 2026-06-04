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
  adminBtnPrimary,
  adminBtnSecondary,
  adminBtnDisabled,
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
    if (saving) return;
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
            disabled={saving}
            className={`${adminModalCloseBtn} ${adminBtnDisabled}`}
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
              disabled={saving}
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
            className={`${adminBtnPrimary} flex-1 py-3 ${adminBtnDisabled}`}
            onClick={updateUserRole}
          >
            {saving ? "Updating…" : "Change role"}
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

export default ChangeUserRole;
