import React from "react";

const InventoryList = ({ inventories, loading }) => {
  if (loading) return <p className="text-gray-500 text-sm italic">Memuat...</p>;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-[#1e4a6e]">Inventaris RT</h3>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {inventories.length} Barang
        </span>
      </div>

      {/* Grid yang lebih ringkas, max-height agar tidak terlalu panjang */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
        {inventories.map((item) => (
          <div
            key={item._id}
            className="group flex flex-col justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#1e4a6e]/20 transition-all"
          >
            <p className="font-bold text-slate-800 text-sm mb-3 group-hover:text-[#1e4a6e] transition">
              {item.name}
            </p>

            <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                Tersedia
              </span>
              <span className="font-bold text-[#7ba85a] text-sm">
                {item.available || 0}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryList;
