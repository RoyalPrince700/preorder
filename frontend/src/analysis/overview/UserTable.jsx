import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import ChangeUserRole from "../../common/ChangeUserRole";
import AdminUserMeasurements from "../../components/AdminUserMeasurements";
import SummaryApi from "../../common";
import {
  adminChartCard,
  adminChartTitle,
  adminTableHead,
  adminTh,
  adminBtnSecondary,
} from "../../common/adminUi";

const getRoleColor = (role) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "bg-slate-950 text-white border-slate-950";
    case "moderator":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "user":
      return "bg-slate-100 text-slate-800 border-slate-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const UsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [openMeasurements, setOpenMeasurements] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState({
    email: "",
    name: "",
    role: "",
    _id: "",
  });
  const [measurementUser, setMeasurementUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(SummaryApi.allUser.url, {
        method: SummaryApi.allUser.method,
        credentials: "include",
      });
      const result = await response.json();

      if (result.success) {
        setUserData(result.data);
        setFilteredUsers(result.data);
      } else {
        console.error(result.message);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = userData.filter(
      (user) =>
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term) ||
        (user.isVerified ? "verified" : "not verified").includes(term)
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={adminChartCard}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className={adminChartTitle}>All Users</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full rounded-none border-2 border-slate-100 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-bold uppercase tracking-widest text-slate-950 outline-none transition-colors focus:border-orange-500 sm:w-64"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3 top-3 text-slate-400" size={14} />
        </div>
      </div>

      <div className="overflow-x-auto border-2 border-slate-900">
        <table className="min-w-full">
          <thead>
            <tr className={adminTableHead}>
              <th className={adminTh}>Sr.</th>
              <th className={adminTh}>Email</th>
              <th className={adminTh}>Role</th>
              <th className={adminTh}>Verified</th>
              <th className={adminTh}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user._id}
                className="border-b border-slate-100 transition-colors hover:bg-orange-50/30"
              >
                <td className="px-4 py-4 text-xs font-bold text-slate-600">
                  {index + 1}
                </td>
                <td className="px-4 py-4 text-xs font-bold text-slate-700">
                  {user.email}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`border px-2 py-1 text-[10px] font-black uppercase tracking-widest ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`border px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
                      user.isVerified
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {user.isVerified ? "Verified" : "Not Verified"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={adminBtnSecondary}
                      onClick={() => {
                        setUpdateUserDetails(user);
                        setOpenUpdateRole(true);
                      }}
                    >
                      Role
                    </button>
                    <button
                      type="button"
                      className={adminBtnSecondary}
                      onClick={() => {
                        setMeasurementUser(user);
                        setOpenMeasurements(true);
                      }}
                    >
                      Measurements
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <p className="py-12 text-center text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            No users found
          </p>
        )}
      </div>

      {openUpdateRole && (
        <ChangeUserRole
          onClose={() => setOpenUpdateRole(false)}
          name={updateUserDetails.name}
          email={updateUserDetails.email}
          role={updateUserDetails.role}
          userId={updateUserDetails._id}
          callFunc={fetchUsers}
        />
      )}

      {openMeasurements && measurementUser && (
        <AdminUserMeasurements
          user={measurementUser}
          onClose={() => {
            setOpenMeasurements(false);
            setMeasurementUser(null);
          }}
          onSaved={fetchUsers}
        />
      )}
    </div>
  );
};

export default UsersTable;
