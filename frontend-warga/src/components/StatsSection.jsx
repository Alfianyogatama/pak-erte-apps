import React from "react";

const StatsSection = ({ summary, wargaSummary, loading, onShowWarga }) => {
  const formatRp = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka || 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Saldo Kas RT */}
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500 flex flex-col justify-between">
        <div>
          <h2 className="text-gray-500 font-semibold uppercase text-xs mb-1">
            Saldo Kas RT
          </h2>
          <p className="text-3xl font-black text-blue-700">
            {loading ? "..." : formatRp(summary.saldoAkhir)}
          </p>
        </div>
        <p className="text-xs text-gray-400 mt-4 border-t pt-2">
          Diperbarui secara real-time
        </p>
      </div>

      {/* Statistik Warga */}
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500 flex flex-col justify-between md:col-span-2">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-gray-500 font-semibold uppercase text-xs mb-2">
              Informasi Demografi RT 25
            </h2>
            <div className="flex gap-8">
              <div>
                <p className="text-xs text-gray-400">Total Keluarga</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loading ? "..." : `${wargaSummary.totalKK} KK`}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Jiwa</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loading ? "..." : `${wargaSummary.totalWarga} Orang`}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onShowWarga}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-3 rounded transition shadow-sm disabled:opacity-50"
          >
            Lihat Daftar KK
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-4 border-t pt-2">
          Data resmi di bawah pengelolaan pengurus RT
        </p>
      </div>
    </div>
  );
};

export default StatsSection;
