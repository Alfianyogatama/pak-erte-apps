// frontend-admin/src/components/AdminLayout.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminLayout = ({ children, title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-200 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 bg-gray-900 text-center font-bold text-xl border-b border-gray-700">
          NgN RT 25 Admin
        </div>

        {/* Navigasi Menu - Pastikan hanya ada satu blok ini */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/"
            className="block py-2 px-4 hover:bg-gray-700 rounded transition"
          >
            Dashboard
          </Link>
          <Link
            to="/inventory"
            className="block py-2 px-4 hover:bg-gray-700 rounded transition"
          >
            Manajemen Inventaris
          </Link>
          <Link
            to="/kas"
            className="block py-2 px-4 hover:bg-gray-700 rounded transition"
          >
            Manajemen Kas
          </Link>
          {/* LINK BARU UNTUK DATA WARGA */}
          <Link
            to="/warga"
            className="block py-2 px-4 hover:bg-gray-700 rounded transition"
          >
            Data Warga
          </Link>
          <Link
            to="/informasi"
            className="block py-2 px-4 hover:bg-gray-700 rounded transition"
          >
            Papan Informasi
          </Link>

          <Link
            to="/print-surat"
            className="block py-2 px-4 hover:bg-gray-700 rounded transition"
          >
            Print Surat Peminjaman
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded font-semibold transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded shadow">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Ketua RT</span>
          </div>
        </header>

        {/* Konten spesifik halaman akan di-render di sini */}
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
