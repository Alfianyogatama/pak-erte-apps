import React from "react";
import Sidebar from "./Sidebar"; // Pastikan path import ini benar

const AdminLayout = ({ title, children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Menempel di kiri */}
      <div className="w-64 flex-none sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header/Top Bar (Optional: jika Anda punya topbar di kode lama) */}
        <header className="bg-white p-6 border-b border-slate-100 shadow-sm flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          <div className="text-sm text-slate-500">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
