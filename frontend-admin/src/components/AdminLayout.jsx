import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

const AdminLayout = ({ children, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* 1. SIDEBAR CONTAINER */}
      {/* Di desktop (lg): selalu muncul (static). Di mobile: fixed overlay */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 lg:static lg:shadow-none ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header Mobile Only */}
          <div className="flex justify-between items-center p-4 lg:hidden">
            <span className="font-bold">Menu</span>
            <button onClick={() => setIsOpen(false)}>
              <X />
            </button>
          </div>

          {/* Scrollable Sidebar Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* 2. OVERLAY MOBILE */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* 3. KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="bg-white p-4 shadow-sm flex items-center gap-4 flex-none z-30">
          <button className="lg:hidden" onClick={() => setIsOpen(true)}>
            <Menu />
          </button>
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        </header>

        {/* Area konten yang bisa di-scroll secara independen */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
