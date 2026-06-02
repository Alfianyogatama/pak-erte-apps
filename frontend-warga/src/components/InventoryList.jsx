import React from "react";

const InventoryList = ({ inventories, loading }) => {
  if (loading)
    return <p className="text-gray-500 text-sm italic p-6">Memuat...</p>;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-[#1e4a6e]">Inventaris RT</h3>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {inventories.length} Jenis Barang
        </span>
      </div>

      <div className="grid grid-cols-1 ld:grid-cols-2 gap-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
        {inventories.map((item) => (
          <div
            key={item._id}
            className="group p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#1e4a6e]/20 transition-all flex flex-col gap-3"
          >
            <p className="font-bold text-slate-800 text-sm truncate group-hover:text-[#1e4a6e] transition">
              {item.name}
            </p>

            {/* Bagian Informasi Stok */}
            <div className="flex gap-2">
              {/* Tersedia */}
              <div className="flex-1 bg-white p-2 rounded-xl border border-slate-100 text-center">
                <p className="text-[9px] text-slate-400 font-bold uppercase">
                  Tersedia
                </p>
                <p className="font-bold text-[#7ba85a] text-sm">
                  {item.available || 0}
                </p>
              </div>

              {/* Dipinjam */}
              <div className="flex-1 bg-white p-2 rounded-xl border border-slate-100 text-center">
                <p className="text-[9px] text-slate-400 font-bold uppercase">
                  Dipinjam
                </p>
                <p className="font-bold text-orange-500 text-sm">
                  {item.totalBorrowed || 0}
                </p>
              </div>
            </div>

            {/* Informasi Tambahan (Jika ada barang dipinjam) */}
            {item.totalBorrowed > 0 && item.nextReturnDate && (
              <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-2 mt-1">
                Pengembalian tercepat:{" "}
                {new Date(item.nextReturnDate).toLocaleDateString("id-ID")}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryList;
