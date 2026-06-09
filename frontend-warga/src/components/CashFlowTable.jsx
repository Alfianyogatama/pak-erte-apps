import React, { useState } from "react";

const CashFlowTable = ({ transactions, summary }) => {
  const [activeTab, setActiveTab] = useState("RT");

  const formatRp = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka || 0);

  // Filter transaksi berdasarkan kategori aktif dan ambil 5 terbaru untuk ringkasan di dashboard
  const filteredTransactions = (transactions || [])
    .filter((t) => t.category === activeTab)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Tab Selector */}
      <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
        {["RT", "Jimpitan", "Inventaris"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
              activeTab === tab
                ? "bg-white text-[#1e4a6e] shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Mini Summary Card - Menampilkan saldo per kategori */}
      <div className="bg-[#1e4a6e] p-4 rounded-2xl text-white shadow-sm shadow-blue-100">
        <p className="text-[9px] uppercase font-bold opacity-70 tracking-wider">
          Saldo Kas {activeTab}
        </p>
        <p className="text-2xl font-black">{formatRp(summary?.[activeTab])}</p>
      </div>

      <table className="w-full text-left">
        <tbody>
          {filteredTransactions.length === 0 ? (
            <tr>
              <td className="py-6 text-center text-xs text-slate-400 italic">
                Belum ada riwayat transaksi {activeTab}
              </td>
            </tr>
          ) : (
            filteredTransactions.map((item) => (
              <tr
                key={item._id}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="py-3 text-[10px] text-slate-400 font-medium">
                  {new Date(item.date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                  })}
                </td>
                <td className="py-3 text-xs font-semibold text-slate-700">
                  {item.description}
                </td>
                <td
                  className={`py-3 text-right text-xs font-bold ${item.type === "Masuk" ? "text-green-600" : "text-red-600"}`}
                >
                  {item.type === "Masuk" ? "+" : "-"}
                  {formatRp(item.amount)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
export default CashFlowTable;
