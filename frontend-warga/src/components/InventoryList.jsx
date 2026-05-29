import React from "react";

const InventoryList = ({ inventories, loading }) => {
  if (loading) return <p className="text-gray-500 text-sm italic">Memuat...</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Inventaris RT</h2>
      <div className="grid grid-cols-1 gap-4">
        {inventories.map((item) => (
          <div
            key={item._id}
            className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <h3 className="font-bold text-gray-900 text-lg mb-4">
              {item.name}
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Jumlah Tersedia:</span>
                <span className="font-bold text-green-600">
                  {item.available} Unit
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Jumlah Dipinjam:</span>
                <span className="font-bold text-orange-600">
                  {item.totalBorrowed} Unit
                </span>
              </div>
              {item.nextReturnDate && (
                <div className="flex justify-between text-sm pt-2 border-t border-gray-50">
                  <span className="text-gray-500">Tanggal Kembali:</span>
                  <span className="font-bold text-gray-800">
                    {new Date(item.nextReturnDate).toLocaleDateString("id-ID")}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryList;
