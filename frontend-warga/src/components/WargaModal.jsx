// src/components/WargaModal.jsx
import React from "react";
import { X, MessageCircle } from "lucide-react";

const WargaModal = ({ onClose, publicFamilies }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
      {/* Header Modal */}
      <div className="bg-[#1e4a6e] p-6 text-white flex justify-between items-center">
        <h3 className="font-bold text-lg">Daftar KK RT 25</h3>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded-full transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* List Warga */}
      <div className="p-2 overflow-y-auto max-h-[60vh]">
        {publicFamilies?.length > 0 ? (
          publicFamilies.map((warga, index) => (
            <div
              key={warga._id || index}
              className="px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition border-b last:border-0 border-slate-100"
            >
              <div>
                <p className="font-bold text-slate-800 text-sm">
                  {warga.headOfFamily}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  KEPALA KELUARGA
                </p>
              </div>

              {warga.whatsappNumber && (
                <a
                  href={`https://wa.me/${warga.whatsappNumber.replace(/^[0]/, "62")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#7ba85a]/10 hover:bg-[#7ba85a]/20 text-[#7ba85a] px-3 py-1.5 rounded-lg text-[10px] font-bold transition"
                >
                  <MessageCircle size={12} /> CHAT WA
                </a>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-400 text-sm">
            Data warga belum tersedia.
          </div>
        )}
      </div>
    </div>
  </div>
);

export default WargaModal;
