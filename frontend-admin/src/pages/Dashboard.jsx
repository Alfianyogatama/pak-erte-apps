import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../utils/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInventory: 0,
    totalKas: 0,
    totalKK: 0,
  });
  const [ageStats, setAgeStats] = useState(null);

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const [invRes, kasRes, wargaRes, ageRes] = await Promise.all([
          api.get("/inventories"),
          api.get("/transactions/summary"),
          api.get("/families/summary"),
          api.get("/families/stats"),
        ]);

        setStats({
          totalInventory: invRes.data.length,
          totalKas: kasRes.data.saldoAkhir,
          totalKK: wargaRes.data.totalKK,
        });
        setAgeStats(ageRes.data);
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

        {/* Demografi Usia Section */}
        {ageStats && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              📊 Demografi Usia Warga
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Balita (0-5th)",
                  val: ageStats.balita,
                  color: "bg-pink-50 text-pink-700",
                },
                {
                  label: "Anak (5-11th)",
                  val: ageStats.anak,
                  color: "bg-orange-50 text-orange-700",
                },
                {
                  label: "Remaja (10-18th)",
                  val: ageStats.remaja,
                  color: "bg-blue-50 text-blue-700",
                },
                {
                  label: "Dewasa (18-59th)",
                  val: ageStats.dewasa,
                  color: "bg-green-50 text-green-700",
                },
                {
                  label: "Pra-Lansia (45-59th)",
                  val: ageStats.praLansia,
                  color: "bg-teal-50 text-teal-700",
                },
                {
                  label: "Lansia Muda (60-69th)",
                  val: ageStats.lansiaMuda,
                  color: "bg-purple-50 text-purple-700",
                },
                {
                  label: "Lansia Lanjut (70-79th)",
                  val: ageStats.lansiaLanjut,
                  color: "bg-red-50 text-red-700",
                },
                {
                  label: "Lansia Akhir (≥80th)",
                  val: ageStats.lansiaAkhir,
                  color: "bg-slate-100 text-slate-700",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`${item.color} p-4 rounded-2xl border border-white/50 shadow-sm`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                    {item.label}
                  </p>
                  <p className="text-2xl font-black mt-1">
                    {item.val} <span className="text-xs font-normal">Jiwa</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
