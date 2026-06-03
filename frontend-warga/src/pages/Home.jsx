// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import StatsSection from "../components/StatsSection";
import InfoSection from "../components/InfoSection";
import CashFlowTable from "../components/CashFlowTable";
import InventoryList from "../components/InventoryList";
import WargaModal from "../components/WargaModal";
import api from "../utils/api";
import PrayerTime from "../components/PrayerTime";

const Home = () => {
  const [data, setData] = useState({
    inventories: [],
    summary: { saldoAkhir: 0 },
    transactions: [],
    wargaSummary: { totalKK: 0, totalWarga: 0 },
    publicFamilies: [],
    informations: [],
  });

  const [showWargaDetail, setShowWargaDetail] = useState(false);
  const [loading, setLoading] = useState(true);

  // Ganti dengan URL ImageKit Anda
  const LOGO_URL =
    "https://ik.imagekit.io/bonekie/image%20asset/rt-25-logo.png";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, sumRes, transRes, wargaSumRes, wargaPubRes, infoRes] =
          await Promise.all([
            api.get("/inventories"),
            api.get("/transactions/summary"),
            api.get("/transactions"),
            api.get("/families/summary"),
            api.get("/families/public"),
            api.get("/informations"),
          ]);

        setData({
          inventories: invRes.data,
          summary: sumRes.data,
          transactions: transRes.data.slice(0, 5),
          wargaSummary: wargaSumRes.data,
          publicFamilies: wargaPubRes.data,
          informations: infoRes.data,
        });
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header dengan Logo */}
        <div className="flex items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <img
            src={LOGO_URL}
            alt="Logo RT 25"
            className="w-16 h-16 rounded-full shadow-md"
          />
          <div>
            <h1 className="text-2xl font-bold text-[#1e4a6e]">
              Portal Warga RT 25
            </h1>
            <p className="text-slate-500">
              Ngunan Unan - Lingkungan Guyub Rukun
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto lg:mx-0">
          <PrayerTime />
        </div>

        {/* 1. Stats Section (Kas & Warga) */}
        <StatsSection
          summary={data.summary}
          wargaSummary={data.wargaSummary}
          loading={loading}
          onShowWarga={() => setShowWargaDetail(true)}
        />

        {/* 2. Grid Bawah: Kas & Inventaris */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-4 text-[#1e4a6e]">
              Aktivitas Kas
            </h3>
            <CashFlowTable transactions={data.transactions} />
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-4 text-[#1e4a6e]">
              Inventaris RT
            </h3>
            <InventoryList inventories={data.inventories} loading={loading} />
          </div>
        </div>

        {/* 3. Papan Informasi */}
        <InfoSection informations={data.informations} loading={loading} />
      </div>

      {/* Modal Warga */}
      {showWargaDetail && (
        <WargaModal
          publicFamilies={data.publicFamilies}
          onClose={() => setShowWargaDetail(false)}
        />
      )}
    </div>
  );
};

export default Home;
