import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const AdminOverview = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-950">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminOverview;
