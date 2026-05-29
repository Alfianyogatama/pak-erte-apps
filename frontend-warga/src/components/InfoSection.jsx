// src/components/InfoSection.jsx
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const InfoSection = ({ informations, loading }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-400">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-bold text-gray-800">
          Papan Informasi & Kegiatan
        </h2>
        <a
          href="/all-activities"
          className="text-blue-600 text-xs font-bold hover:underline"
        >
          Lihat Semua →
        </a>
      </div>

      <div className="space-y-6">
        {loading ? (
          <p className="text-sm text-gray-500">Memuat...</p>
        ) : informations.length === 0 ? (
          <p className="text-sm italic text-gray-500">Belum ada pengumuman.</p>
        ) : (
          informations.slice(0, 3).map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              {/* Area Foto */}
              {item.imageUrls?.length > 0 && (
                <div className="bg-gray-100 h-64 w-full">
                  {item.imageUrls.length === 1 ? (
                    <img
                      src={item.imageUrls[0]}
                      className="w-full h-full object-contain cursor-pointer transition hover:opacity-90"
                      onClick={() => setSelectedImage(item.imageUrls[0])}
                      alt="kegiatan"
                    />
                  ) : (
                    <Swiper
                      modules={[Navigation, Pagination]}
                      navigation
                      pagination={{ clickable: true }}
                      className="h-full"
                    >
                      {item.imageUrls.map((url, i) => (
                        <SwiperSlide key={i}>
                          <img
                            src={url}
                            className="w-full h-full object-contain cursor-pointer transition hover:opacity-90"
                            onClick={() => setSelectedImage(url)}
                            alt={`slide-${i}`}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>
              )}

              {/* Area Konten */}
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {item.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Full-screen Preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-5 right-5 text-white text-3xl font-bold">
            ✕
          </button>
          <img
            src={selectedImage}
            className="max-h-[90vh] max-w-full object-contain animate-in fade-in zoom-in duration-300"
            alt="Preview Lengkap"
          />
        </div>
      )}
    </div>
  );
};

export default InfoSection;
