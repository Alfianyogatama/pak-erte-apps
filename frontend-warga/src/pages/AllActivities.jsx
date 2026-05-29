// src/pages/AllActivities.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import api from "../utils/api";

const AllActivities = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/informations");

        setData(res.data);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="text-blue-600 mb-6 inline-block font-bold hover:underline"
        >
          ← Kembali ke Beranda
        </Link>

        <h1 className="text-3xl font-black mb-8 text-gray-800">
          Dokumentasi & Kegiatan RT 25
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Memuat semua kegiatan...</p>
        ) : (
          <div className="space-y-10">
            {data.map((item) => (
              <div
                key={item._id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                  {item.title}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>

                {/* Area Foto - Menggunakan Swiper jika lebih dari 1 foto, Grid jika 1 */}
                {item.imageUrls?.length > 0 && (
                  <div className="bg-gray-100 rounded-lg overflow-hidden h-64">
                    {item.imageUrls.length === 1 ? (
                      <img
                        src={item.imageUrls[0]}
                        className="w-full h-full object-contain"
                        onClick={() => setSelectedImage(item.imageUrls[0])}
                        alt={item.title}
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
                              className="w-full h-full object-contain"
                              onClick={() =>
                                setSelectedImage(item.imageUrls[0])
                              }
                              alt={`slide-${i}`}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Modal untuk menampilkan gambar yang dipilih */}
      {/* Modal Preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            className="max-h-[90vh] max-w-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default AllActivities;
