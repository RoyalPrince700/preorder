import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import ROLE from "../common/role";
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

const INITIAL_FORM = {
  fullName: "",
  email: "",
  phone: "",
  role: ROLE.GENERAL,
};

const AddUserModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    if (!fullName) {
      toast.error("Name is required");
      return;
    }

    if (!email && !phone) {
      toast.error("Enter an email or phone number");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(SummaryApi.createUser.url, {
        method: SummaryApi.createUser.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email: email || undefined,
          phone: phone || undefined,
          role: form.role,
        }),
      });
      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        onClose();
        onCreated?.();
      } else {
        toast.error(result.message || "Failed to create user");
      }
    } catch {
      toast.error("Failed to create user");
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
              Add user
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

        <form onSubmit={handleSubmit}>
          <div className={adminModalBody}>
            <div>
              <label htmlFor="fullName" className={adminLabel}>
                Name *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className={adminInput}
                value={form.fullName}
                onChange={handleChange}
                disabled={saving}
                placeholder="Customer name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className={adminLabel}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={adminInput}
                value={form.email}
                onChange={handleChange}
                disabled={saving}
                placeholder="user@example.com"
              />
              <p className="mt-1 text-[10px] text-slate-400">
                A welcome email is sent when an email is provided.
              </p>
            </div>

            <div>
              <label htmlFor="phone" className={adminLabel}>
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={adminInput}
                value={form.phone}
                onChange={handleChange}
                disabled={saving}
                placeholder="08123456789"
              />
              <p className="mt-1 text-[10px] text-slate-400">
                For WhatsApp customers — no message is sent for phone-only users.
              </p>
            </div>

            <div>
              <label htmlFor="role" className={adminLabel}>
                Role
              </label>
              <select
                id="role"
                name="role"
                className={adminInput}
                value={form.role}
                onChange={handleChange}
                disabled={saving}
              >
                <option value={ROLE.GENERAL}>General</option>
                <option value={ROLE.ADMIN}>Admin</option>
              </select>
            </div>
          </div>

          <div className={adminModalFooter}>
            <button
              type="submit"
              disabled={saving}
              className={`${adminBtnPrimary} flex-1 py-3 ${adminBtnDisabled}`}
            >
              {saving ? "Creating…" : "Add user"}
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
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
