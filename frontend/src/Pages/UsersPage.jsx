import React, { useEffect, useState } from "react";
import { FaUserCheck, FaUserPlus, FaUsers, FaUserTimes } from "react-icons/fa";
import Header from "../common/Header";
import StatCard from "../common/StatCard";
import UsersTable from "../analysis/overview/UserTable";
import UserGrowthChart from "../analysis/overview/UserGrowthChart";
import UserActivityHeatmap from "../analysis/overview/UserActivityHeatmap";
import SummaryApi from "../common";
import moment from "moment";

const UsersPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    verifiedUsers: 0,
    nonVerifiedUsers: 0,
  });

  const fetchAllUsers = async () => {
    const fetchData = await fetch(SummaryApi.allUser.url, {
      method: SummaryApi.allUser.method,
      credentials: "include",
    });

    const dataResponse = await fetchData.json();

    if (dataResponse.success) {
      const users = dataResponse.data;
      const today = moment().startOf("day");
      const newUsersToday = users.filter((user) =>
        moment(user.createdAt).isSame(today, "day")
      ).length;
      const verifiedUsers = users.filter((user) => user.isVerified).length;
      const nonVerifiedUsers = users.length - verifiedUsers;

      setStats({
        totalUsers: users.length,
        newUsersToday,
        verifiedUsers,
        nonVerifiedUsers,
      });
    } else if (dataResponse.error) {
      console.error(dataResponse.message);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="flex-1 overflow-auto">
      <Header title="Users" subtitle="Accounts, roles, and verification" />
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard name="Total Users" icon={FaUsers} value={stats.totalUsers.toLocaleString()} />
          <StatCard name="New Users Today" icon={FaUserPlus} value={stats.newUsersToday} />
          <StatCard name="Verified Users" icon={FaUserCheck} value={stats.verifiedUsers.toLocaleString()} />
          <StatCard name="Non-Verified Users" icon={FaUserTimes} value={stats.nonVerifiedUsers.toLocaleString()} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UserGrowthChart />
          <UserActivityHeatmap />
        </div>

        <UsersTable />
      </main>
    </div>
  );
};

export default UsersPage;
