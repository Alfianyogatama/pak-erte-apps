// frontend-admin/src/pages/Inventory.jsx
import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../utils/api";
import Swal from "sweetalert2";
import { useReactToPrint } from "react-to-print";
import LoanPrint from "../components/LoanPrint";

const Inventory = () => {
  const [inventories, setInventories] = useState([]);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const componentRef = useRef(null);
  const [expandedId, setExpandedId] = useState(null);
  const [loanDetails, setLoanDetails] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    totalQuantity: 1,
    availabilityStatus: "Tersedia",
    conditionStatus: "Baik",
  });

  const [loanData, setLoanData] = useState({
    itemName: "",
    quantity: 1,
    loanDate: new Date().toISOString().split("T")[0],
    returnDate: "",
    description: "",
    borrowerName: "",
  });

  const [editId, setEditId] = useState(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Bukti_Pinjam_${loanData.borrowerName || "Warga"}`,
  });
  const fetchInventories = async () => {
    try {
      const response = await api.get("/inventories");
      setInventories(response.data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/inventories/${editId}`, formData);
      else await api.post("/inventories", formData);
      Swal.fire("Berhasil!", "Data disimpan.", "success");
      setShowEditModal(false);
      fetchInventories();
    } catch (error) {
      Swal.fire("Gagal!", "Terjadi kesalahan.", "error");
    }
  };

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/loans", loanData);
      Swal.fire("Berhasil!", "Peminjaman tercatat, stok berkurang.", "success");
      setShowLoanModal(false);
      fetchInventories(); // <--- TAMBAHKAN INI agar tabel langsung update
    } catch (error) {
      // Tampilkan pesan error dari backend
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Gagal meminjam",
        "error",
      );
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Barang?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
    });
    if (result.isConfirmed) {
      await api.delete(`/inventories/${id}`);
      fetchInventories();
    }
  };

  const toggleExpand = async (item) => {
    if (expandedId === item._id) {
      setExpandedId(null); // Tutup jika diklik lagi
    } else {
      setExpandedId(item._id);
      // Ambil detail peminjaman barang ini
      const res = await api.get(`/loans/item/${encodeURIComponent(item.name)}`);
      setLoanDetails(res.data);
    }
  };

  const handleReturn = async (loanId) => {
    try {
      await api.put(`/loans/return/${loanId}`);
      Swal.fire(
        "Berhasil!",
        "Barang dikembalikan & stok bertambah.",
        "success",
      );
      fetchInventories(); // Refresh stok
      setExpandedId(null); // Tutup detail
    } catch (error) {
      Swal.fire("Gagal", "Gagal mengembalikan", "error");
    }
  };

  // Contoh fungsi pembuka modal
  const handleOpenModal = (item) => {
    setLoanData({
      itemName: item.name, // Ambil dari properti item yang di-map
      availableStock: item.totalQuantity, // Pastikan namanya sesuai field di DB Anda
      borrowerName: "",
      quantity: 0,
      loanDate: "",
      returnDate: "",
      description: "",
    });
    setShowLoanModal(true);
  };
  return (
    <AdminLayout title="Manajemen Inventaris">
      <button
        onClick={() => {
          setEditId(null);
          setShowEditModal(true);
        }}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded shadow"
      >
        + Tambah Barang
      </button>

      {/* MODAL EDIT/TAMBAH */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <h2 className="font-bold text-lg mb-4">
              {editId ? "Edit Barang" : "Tambah Barang"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Nama Barang"
                className="w-full p-2 border rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Kategori"
                className="w-full p-2 border rounded"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Jumlah"
                className="w-full p-2 border rounded"
                value={formData.totalQuantity}
                onChange={(e) =>
                  setFormData({ ...formData, totalQuantity: e.target.value })
                }
              />
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-400 text-white py-2 rounded"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLoanModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Pinjam Barang
              </h2>
              <p className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full inline-block mt-2">
                {loanData.itemName} • Tersedia: {loanData.availableStock} unit
              </p>
            </div>

            <form onSubmit={handleLoanSubmit} className="space-y-4">
              {/* Nama Peminjam */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Nama Peminjam
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Contoh: Budi Santoso"
                  required
                  onChange={(e) =>
                    setLoanData({ ...loanData, borrowerName: e.target.value })
                  }
                />
              </div>

              {/* Jumlah */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Jumlah Unit
                </label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder={`Maksimal ${loanData.availableStock}`}
                  max={loanData.availableStock}
                  required
                  onChange={(e) =>
                    setLoanData({
                      ...loanData,
                      quantity: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              {/* Tanggal Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Tgl Pinjam
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                    required
                    onChange={(e) =>
                      setLoanData({ ...loanData, loanDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Tgl Kembali
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                    required
                    onChange={(e) =>
                      setLoanData({ ...loanData, returnDate: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Keperluan / Deskripsi
                </label>
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-xl h-20 resize-none outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Acara kerja bakti RT"
                  onChange={(e) =>
                    setLoanData({ ...loanData, description: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowLoanModal(false)}
                  className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  Simpan Peminjaman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABEL */}
      <div className="bg-white p-6 rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Barang</th>
              <th className="p-3">Jumlah</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {inventories.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  Belum ada data.
                </td>
              </tr>
            ) : (
              inventories.map((item) => (
                <React.Fragment key={item._id}>
                  {/* BARIS UTAMA */}
                  <tr
                    className={`border-b hover:bg-gray-50 cursor-pointer ${expandedId === item._id ? "bg-blue-50" : ""}`}
                    onClick={() => toggleExpand(item)}
                  >
                    <td className="p-3">
                      <p className="font-medium text-gray-800">
                        {item.name} {expandedId === item._id ? "▼" : "▶"}
                      </p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </td>

                    {/* Kolom Jumlah & Status */}
                    <td className="p-3">
                      <p className="font-bold text-blue-600">
                        {item.totalQuantity} unit
                      </p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.totalQuantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {item.totalQuantity > 0 ? "TERSEDIA" : "HABIS"}
                      </span>
                    </td>

                    {/* Kolom Aksi */}
                    <td
                      className="p-3 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setFormData(item);
                            setEditId(item._id);
                            setShowEditModal(true);
                          }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleOpenModal(item)} // Cukup panggil fungsinya di sini
                          disabled={item.totalQuantity <= 0}
                          className={`px-2 py-1 rounded text-xs transition ${
                            item.totalQuantity <= 0
                              ? "bg-gray-300 cursor-not-allowed text-gray-500"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                        >
                          {item.totalQuantity <= 0 ? "Stok Habis" : "Pinjam"}
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* BARIS DETAIL EXPAND (Jika diklik) */}
                  {expandedId === item._id && (
                    <tr>
                      <td colSpan="3" className="bg-blue-50 p-4 border-b">
                        <h4 className="font-bold text-sm mb-2 text-blue-800">
                          Daftar Peminjaman Aktif:
                        </h4>
                        {loanDetails.length === 0 ? (
                          <p className="text-xs italic text-gray-500">
                            Tidak ada pinjaman aktif untuk barang ini.
                          </p>
                        ) : (
                          <ul className="text-sm space-y-2">
                            {loanDetails.map((loan) => (
                              <li
                                key={loan._id}
                                className="flex justify-between items-center bg-white p-2 rounded border border-blue-100"
                              >
                                <span>
                                  <strong>{loan.borrowerName}</strong> -{" "}
                                  {loan.quantity} unit
                                  <span className="text-[10px] text-gray-400 ml-2">
                                    (
                                    {new Date(
                                      loan.loanDate,
                                    ).toLocaleDateString()}
                                    )
                                  </span>
                                </span>
                                <button
                                  onClick={() => handleReturn(loan._id)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-[10px] uppercase font-bold"
                                >
                                  Kembalikan
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};
export default Inventory;
