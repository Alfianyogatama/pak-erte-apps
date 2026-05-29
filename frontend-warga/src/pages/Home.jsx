// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import StatsSection from "../components/StatsSection";
import InfoSection from "../components/InfoSection";
import CashFlowTable from "../components/CashFlowTable";
import InventoryList from "../components/InventoryList";
import WargaModal from "../components/WargaModal";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pastikan endpoint inventories menggunakan /citizens
        const [invRes, sumRes, transRes, wargaSumRes, wargaPubRes, infoRes] =
          await Promise.all([
            axios.get("http://localhost:5001/api/inventories"),
            axios.get("http://localhost:5001/api/transactions/summary"),
            axios.get("http://localhost:5001/api/transactions"),
            axios.get("http://localhost:5001/api/families/summary"),
            axios.get("http://localhost:5001/api/families/public"),
            axios.get("http://localhost:5001/api/informations"),
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <Header />

        {/* 1. Stats Section (Kas & Warga) - Tetap di atas */}
        <StatsSection
          summary={data.summary}
          wargaSummary={data.wargaSummary}
          loading={loading}
          onShowWarga={() => setShowWargaDetail(true)}
        />

        {/* 2. Grid Bawah: Kas & Inventaris - Naik ke tengah */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CashFlowTable transactions={data.transactions} />
          <InventoryList inventories={data.inventories} loading={loading} />
        </div>

        {/* 3. Papan Informasi - Turun ke paling bawah */}
        <InfoSection informations={data.informations} loading={loading} />
      </div>

      {/* Modal Warga */}
      {showWargaDetail && (
        <WargaModal
          onClose={() => setShowWargaDetail(false)}
          publicFamilies={data.publicFamilies}
        />
      )}
    </div>
  );
};

export default Home;
