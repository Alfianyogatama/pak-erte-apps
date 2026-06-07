// frontend-admin/src/pages/Warga.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../utils/api";
import Swal from "sweetalert2"; // Import SweetAlert2

const Warga = () => {
  const [families, setFamilies] = useState([]);
  const [summary, setSummary] = useState({ totalKK: 0, totalWarga: 0 });

  const initialFormState = {
    headOfFamily: "",
    ktpNumber: "",
    kkNumber: "",
    whatsappNumber: "",
    familyMembersCount: 1,
    domicileStatus: "Tetap",
    keterangan: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      const [listRes, sumRes] = await Promise.all([
        api.get("/families"),
        api.get("/families/summary"),
      ]);
      setFamilies(listRes.data);
      setSummary(sumRes.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editId) {
        await api.put(`/families/${editId}`, formData);
        Swal.fire("Berhasil!", "Data warga telah diperbarui.", "success");
      } else {
        await api.post("/families", formData);
        Swal.fire("Berhasil!", "Data warga baru telah disimpan.", "success");
      }

      setFormData(initialFormState);
      setEditId(null);
      fetchData();
    } catch (error) {
      Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setFormData({
      headOfFamily: item.headOfFamily,
      ktpNumber: item.ktpNumber || "",
      kkNumber: item.kkNumber || "",
      whatsappNumber: item.whatsappNumber,
      familyMembersCount: item.familyMembersCount || 1,
      domicileStatus: item.domicileStatus,
      keterangan: item.keterangan || "",
    });
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setFormData(initialFormState);
    setEditId(null);
  };

  // FUNGSI HAPUS DENGAN SWEETALERT
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Data?",
      text: "Data warga ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/families/${id}`);
        Swal.fire("Terhapus!", "Data warga berhasil dihapus.", "success");
        fetchData();
      } catch (error) {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
      }
    }
  };

  return (
    <AdminLayout title="Manajemen Data Warga (KK)">
      {/* KARTU RINGKASAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-semibold uppercase">
              Total Kepala Keluarga
            </h3>
            <p className="text-3xl font-black text-gray-800">
              {summary.totalKK}{" "}
              <span className="text-lg font-normal text-gray-500">KK</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
            🏠
          </div>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-green-500 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-semibold uppercase">
              Total Jiwa (Warga)
            </h3>
            <p className="text-3xl font-black text-gray-800">
              {summary.totalWarga}{" "}
              <span className="text-lg font-normal text-gray-500">Orang</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl">
            👥
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* FORM TAMBAH/EDIT */}
        <div className="bg-white p-6 rounded shadow h-fit border-t-4 border-blue-500">
          <h2 className="text-lg font-bold mb-4">
            {editId ? "Edit Data Warga" : "Tambah Kepala Keluarga"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form Fields tetap sama */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama Kepala Keluarga <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.headOfFamily}
                onChange={(e) =>
                  setFormData({ ...formData, headOfFamily: e.target.value })
                }
                className="mt-1 w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status Domisili <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.domicileStatus}
                onChange={(e) =>
                  setFormData({ ...formData, domicileStatus: e.target.value })
                }
                className="mt-1 w-full p-2 border rounded bg-white"
              >
                <option value="Tetap">Tetap</option>
                <option value="Kontrak">Kontrak/Kost</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                No. WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Misal: 08123456789"
                value={formData.whatsappNumber}
                onChange={(e) =>
                  setFormData({ ...formData, whatsappNumber: e.target.value })
                }
                className="mt-1 w-full p-2 border rounded"
                required
              />
            </div>

            <hr className="my-2 border-gray-200" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 text-gray-500">
                  No. KTP{" "}
                  <span className="text-xs font-normal">(Opsional)</span>
                </label>
                <input
                  type="text"
                  value={formData.ktpNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, ktpNumber: e.target.value })
                  }
                  className="mt-1 w-full p-2 border rounded bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 text-gray-500">
                  No. KK <span className="text-xs font-normal">(Opsional)</span>
                </label>
                <input
                  type="text"
                  value={formData.kkNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, kkNumber: e.target.value })
                  }
                  className="mt-1 w-full p-2 border rounded bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-gray-500">
                Jumlah Anggota Keluarga{" "}
                <span className="text-xs font-normal">(Opsional)</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.familyMembersCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    familyMembersCount: e.target.value,
                  })
                }
                className="mt-1 w-full p-2 border rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-gray-500">
                Keterangan (Ancer-ancer Rumah){" "}
                <span className="text-xs font-normal">(Opsional)</span>
              </label>
              <textarea
                placeholder="Misal: Dekat pos ronda, pagar hijau"
                value={formData.keterangan || ""}
                onChange={(e) =>
                  setFormData({ ...formData, keterangan: e.target.value })
                }
                className="mt-1 w-full p-2 border rounded bg-gray-50 resize-y"
                rows="3"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-medium"
              >
                {isLoading
                  ? "Menyimpan..."
                  : editId
                    ? "Update Data"
                    : "Simpan Data KK"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* TABEL DATA WARGA */}
        <div className="xl:col-span-2 bg-white p-6 rounded shadow overflow-x-auto">
          <h2 className="text-lg font-bold mb-4">
            Daftar Kepala Keluarga RT 25
          </h2>
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-sm">Nama & Domisili</th>
                <th className="p-3 text-sm">Kontak WA</th>
                <th className="p-3 text-sm">Dokumen (KTP/KK)</th>
                <th className="p-3 text-center text-sm">Jml Jiwa</th>
                <th className="p-3 text-center text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {families.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    Belum ada data warga.
                  </td>
                </tr>
              ) : (
                families.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded border ${item.domicileStatus === "Tetap" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-orange-50 text-orange-700 border-orange-200"}`}
                        >
                          {item.domicileStatus}
                        </span>
                      </div>
                      <p className="font-bold text-gray-800">
                        {item.headOfFamily}
                      </p>
                      {item.keterangan && (
                        <p className="text-xs text-gray-500 italic mt-1">
                          📍 Ancer-ancer: {item.keterangan}
                        </p>
                      )}
                    </td>
                    <td className="p-3">
                      <a
                        href={`https://wa.me/${item.whatsappNumber.replace(/^[0]/, "62")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-600 hover:text-green-800 text-sm font-medium transition"
                      >
                        💬 {item.whatsappNumber}
                      </a>
                    </td>
                    <td className="p-3 text-xs text-gray-600">
                      <p>
                        KTP:{" "}
                        <span className="font-mono text-gray-800">
                          {item.ktpNumber || "-"}
                        </span>
                      </p>
                      <p>
                        KK:{" "}
                        <span className="font-mono text-gray-800">
                          {item.kkNumber || "-"}
                        </span>
                      </p>
                    </td>
                    <td className="p-3 text-center font-bold text-blue-600 text-lg">
                      {item.familyMembersCount || 1}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-yellow-600 hover:text-yellow-800 text-sm font-medium transition"
                        >
                          Edit
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Warga;
