// frontend-admin/src/pages/Inventory.jsx
import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../utils/api";
import Swal from "sweetalert2";
import {
  Plus,
  Package,
  Trash2,
  Edit2,
  CornerDownRight,
  RotateCcw,
} from "lucide-react";

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
    brokenQuantity: 0,
    availabilityStatus: "Tersedia",
    description: "",
    conditionNote: "",
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
      Swal.fire(
        "Gagal!",
        error.response?.data?.message || "Terjadi kesalahan.",
        "error",
      );
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
      text: "Data barang ini akan dihapus secara permanen dari daftar inventaris.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/inventories/${id}`);
        Swal.fire("Terhapus!", "Barang berhasil dihapus.", "success");
        fetchInventories();
      } catch (error) {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
      }
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

  // Ubah fungsi buka modal edit
  const handleOpenEditModal = async (id) => {
    try {
      // 1. Fetch data terbaru dari server berdasarkan ID
      const response = await api.get(`/inventories/${id}`);

      // 2. Set formData dengan data dari hasil fetch
      // Kita pastikan semua field (termasuk description) terisi
      setFormData({
        name: response.data.name,
        category: response.data.category,
        totalQuantity: response.data.totalQuantity,
        brokenQuantity: response.data.brokenQuantity || 0,
        description: response.data.description || "", // Handle jika description kosong
        conditionNote: response.data.conditionNote || "",
        // Tambahkan field lain jika ada (misal status)
      });

      // 3. Set editId agar form tahu ini mode "Edit"
      setEditId(id);

      // 4. Buka modalnya
      setShowEditModal(true);
    } catch (error) {
      Swal.fire("Gagal", "Gagal mengambil data barang", "error");
    }
  };

  // Tambahkan fungsi ini di dalam komponen Inventory
  const handleOpenModal = (item) => {
    setLoanData({
      itemName: item.name,
      availableStock: item.available,
      borrowerName: "",
      quantity: 0,
      loanDate: new Date().toISOString().split("T")[0],
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {editId ? "Edit Barang" : "Tambah Barang"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Nama Barang
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1e4a6e] outline-none transition-all"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Kategori
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1e4a6e] outline-none transition-all"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Total Stok
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1e4a6e] outline-none transition-all"
                    value={formData.totalQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalQuantity: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Jumlah Rusak
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                    value={formData.brokenQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        brokenQuantity: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {Number(formData.brokenQuantity) > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Catatan Kerusakan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-20 resize-none focus:ring-2 focus:ring-[#1e4a6e] outline-none"
                    placeholder="Alasan mengapa barang rusak..."
                    value={formData.conditionNote}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        conditionNote: e.target.value,
                      })
                    }
                    required={Number(formData.brokenQuantity) > 0}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Deskripsi
                </label>
                <textarea
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-20 resize-none focus:ring-2 focus:ring-[#1e4a6e] outline-none"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#1e4a6e] text-white rounded-xl font-bold hover:bg-[#163853] shadow-lg shadow-blue-200 transition"
                >
                  Simpan Data
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

      {/* TABEL RESPONSIVE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Tabel Desktop */}
        <div className="hidden md:grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b font-semibold text-sm text-gray-600">
          <div className="col-span-2">Barang</div>
          <div className="text-center">Kondisi</div>
          <div className="text-center">Stok (Tersedia)</div>
          <div className="text-center">Status</div>
          <div className="text-right pr-4">Aksi</div>
        </div>

        {/* List Data */}
        <div className="divide-y">
          {inventories.length === 0 ? (
            <div className="p-8 text-center text-gray-500 italic">
              Belum ada data barang.
            </div>
          ) : (
            inventories.map((item) => (
              <React.Fragment key={item._id}>
                {/* Mobile View: Card, Desktop View: Grid Row */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 items-center hover:bg-gray-50 transition">
                  {/* Info Barang */}
                  <div className="col-span-2">
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>

                  {/* Kondisi */}
                  <div className="flex md:justify-center items-center gap-2">
                    <span className="md:hidden text-xs text-gray-500">
                      Kondisi:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        item.conditionStatus === "Baik"
                          ? "bg-green-100 text-green-700"
                          : item.conditionStatus === "Rusak Total"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {item.conditionStatus}
                    </span>
                  </div>

                  {/* Stok */}
                  <div className="flex md:justify-center items-center gap-2">
                    <span className="md:hidden text-xs text-gray-500">
                      Stok:
                    </span>
                    <span className="font-mono font-bold text-gray-700">
                      {item.available}{" "}
                      <span className="text-gray-400 font-normal">
                        / {item.totalQuantity}
                      </span>
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex md:justify-center items-center gap-2">
                    <span className="md:hidden text-xs text-gray-500">
                      Status:
                    </span>
                    <span
                      className={`text-[10px] font-bold ${item.available > 0 ? "text-green-600" : "text-orange-600"}`}
                    >
                      ● {item.available > 0 ? "Tersedia" : "Dipinjam"}
                    </span>
                  </div>

                  {/* Aksi */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      disabled={item.available <= 0}
                      title="Pinjam Barang"
                      className="p-2 text-[#1e4a6e] hover:bg-blue-50 rounded-lg disabled:opacity-30"
                    >
                      <Package size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(item._id)}
                      title="Edit Barang"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => toggleExpand(item)}
                      title="Detail Pinjaman"
                      className={`p-2 rounded-lg transition ${expandedId === item._id ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:bg-gray-100"}`}
                    >
                      <CornerDownRight size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      title="Hapus Barang"
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Detail Pinjaman (Expanded) */}
                {expandedId === item._id && (
                  <div className="bg-blue-50/50 p-4 border-t animate-in slide-in-from-top-2 duration-200">
                    <h4 className="text-[10px] font-black uppercase text-blue-400 mb-3 tracking-widest">
                      Daftar Peminjaman Aktif
                    </h4>
                    {loanDetails.length === 0 ? (
                      <p className="text-xs italic text-gray-400">
                        Tidak ada peminjaman saat ini.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {loanDetails.map((loan) => (
                          <div
                            key={loan._id}
                            className="flex justify-between items-center bg-white p-3 rounded-xl border border-blue-100 shadow-sm"
                          >
                            <div>
                              <p className="text-sm font-bold text-gray-800">
                                {loan.borrowerName}
                              </p>
                              <p className="text-[10px] text-gray-500">
                                {loan.quantity} unit • Pinjam:{" "}
                                {new Date(loan.loanDate).toLocaleDateString(
                                  "id-ID",
                                )}
                              </p>
                            </div>
                            <button
                              onClick={() => handleReturn(loan._id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95"
                            >
                              KEMBALIKAN
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
export default Inventory;
