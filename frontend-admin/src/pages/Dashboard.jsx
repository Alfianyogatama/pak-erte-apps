// frontend-admin/src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../utils/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInventory: 0,
    totalKas: 0,
    totalKK: 0,
  });

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        // Mengambil data ringkasan dari ketiga endpoint
        const [invRes, kasRes, wargaRes] = await Promise.all([
          api.get("/inventories"),
          api.get("/transactions/summary"),
          api.get("/families/summary"),
        ]);

        setStats({
          totalInventory: invRes.data.length,
          totalKas: kasRes.data.saldoAkhir,
          totalKK: wargaRes.data.totalKK,
        });
      } catch (error) {
        console.error("Gagal memuat statistik dashboard", error);
      }
    };
    fetchAllStats();
  }, []);

  const formatRp = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka || 0);
  };

  return (
    <AdminLayout title="Dashboard Utama">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kartu Inventaris */}
        <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-semibold uppercase">
            Total Inventaris
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats.totalInventory}{" "}
            <span className="text-lg text-gray-500 font-normal">Barang</span>
          </p>
        </div>

        {/* Kartu Kas */}
        <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-semibold uppercase">
            Saldo Kas RT
          </h3>
          <p className="text-2xl font-bold text-gray-800 truncate">
            {formatRp(stats.totalKas)}
          </p>
        </div>

        {/* Kartu Warga */}
        <div className="bg-white p-6 rounded shadow border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm font-semibold uppercase">
            Total KK Terdaftar
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats.totalKK}{" "}
            <span className="text-lg text-gray-500 font-normal">Keluarga</span>
          </p>
        </div>
      </div>

      {/* Pesan Selamat Datang atau Shortcut */}
      <div className="mt-8 bg-blue-600 p-6 rounded-lg shadow text-white">
        <h2 className="text-xl font-bold">Halo, Ketua RT! 👋</h2>
        <p className="opacity-90">
          Selamat datang kembali. Gunakan menu di samping untuk mengelola
          inventaris, keuangan, data warga, dan pengumuman RT 25.
        </p>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
