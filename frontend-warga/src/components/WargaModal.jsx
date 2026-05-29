import React from "react";

const WargaModal = ({ onClose, publicFamilies }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
      <div className="bg-gray-800 p-4 text-white flex justify-between rounded-t-xl">
        <h3 className="font-bold">Daftar KK RT 25</h3>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="p-4 overflow-y-auto">
        {publicFamilies.map((warga, index) => (
          <div key={index} className="py-2 flex justify-between border-b">
            <p className="font-bold">{warga.headOfFamily}</p>
            <a
              href={`https://wa.me/${warga.whatsappNumber.replace(/^[0]/, "62")}`}
              className="text-green-600 text-xs"
            >
              Chat WA
            </a>
          </div>
        ))}
      </div>
    </div>
  </div>
);
export default WargaModal;
