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
      <div className="p-2">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Halo, Ketua RT! 👋
          </h1>
          <p className="text-slate-500">
            Selamat datang kembali, pantau ringkasan aktivitas RT 25 hari ini.
          </p>
        </div>

        {/* Stats Grid - Desain Lebih Ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Total Inventaris",
              value: stats.totalInventory,
              label: "Barang",
              color: "border-blue-500",
            },
            {
              title: "Saldo Kas RT",
              value: formatRp(stats.totalKas),
              label: "",
              color: "border-emerald-500",
            },
            {
              title: "Total KK Terdaftar",
              value: stats.totalKK,
              label: "Keluarga",
              color: "border-purple-500",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`bg-white p-6 rounded-2xl border-l-4 ${stat.color} shadow-sm hover:shadow-md transition-shadow`}
            >
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                {stat.title}
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <h2 className="text-3xl font-bold text-slate-800">
                  {stat.value}
                </h2>
                {stat.label && (
                  <span className="text-slate-400 text-sm">{stat.label}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Welcome Card - Desain Lebih Modern */}
        <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg shadow-indigo-200 text-white flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Butuh Bantuan?</h2>
            <p className="text-indigo-100 text-sm">
              Gunakan menu di samping untuk mengelola data warga, kas, dan
              inventaris RT 25.
            </p>
          </div>
          <button className="bg-white text-indigo-600 px-5 py-2 rounded-xl font-bold text-sm hover:bg-indigo-50 transition">
            Lihat Panduan
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
