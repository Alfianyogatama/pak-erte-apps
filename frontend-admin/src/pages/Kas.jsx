// frontend-admin/src/pages/Kas.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../utils/api";
import Swal from "sweetalert2"; // 1. Import SweetAlert2

const Kas = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalMasuk: 0,
    totalKeluar: 0,
    saldoAkhir: 0,
  });

  const [formData, setFormData] = useState({
    type: "Masuk",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const formatRp = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka || 0);
  };

  const fetchData = async () => {
    try {
      const [transRes, sumRes] = await Promise.all([
        api.get("/transactions"),
        api.get("/transactions/summary"),
      ]);
      setTransactions(transRes.data);
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
        await api.put(`/transactions/${editId}`, formData);
        Swal.fire("Berhasil!", "Transaksi telah diperbarui.", "success");
      } else {
        await api.post("/transactions", formData);
        Swal.fire("Berhasil!", "Transaksi baru telah dicatat.", "success");
      }

      setFormData({
        type: "Masuk",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      setEditId(null);
      fetchData();
    } catch (error) {
      Swal.fire(
        "Gagal!",
        "Terjadi kesalahan saat menyimpan transaksi.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setFormData({
      type: item.type,
      amount: item.amount,
      description: item.description,
      date: new Date(item.date).toISOString().split("T")[0],
    });
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setFormData({
      type: "Masuk",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setEditId(null);
  };

  // 2. Fungsi Hapus dengan SweetAlert2
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Transaksi?",
      text: "Data transaksi ini akan dihapus dan saldo akan dihitung ulang secara otomatis.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/transactions/${id}`);
        Swal.fire("Terhapus!", "Transaksi berhasil dihapus.", "success");
        fetchData();
      } catch (error) {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
      }
    }
  };

  return (
    <AdminLayout title="Manajemen Kas RT">
      {/* KARTU RINGKASAN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-semibold uppercase">
            Total Pemasukan
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {formatRp(summary.totalMasuk)}
          </p>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-red-500">
          <h3 className="text-gray-500 text-sm font-semibold uppercase">
            Total Pengeluaran
          </h3>
          <p className="text-2xl font-bold text-red-600">
            {formatRp(summary.totalKeluar)}
          </p>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-semibold uppercase">
            Saldo Kas Saat Ini
          </h3>
          <p className="text-3xl font-black text-blue-700">
            {formatRp(summary.saldoAkhir)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* FORM TAMBAH/EDIT */}
        <div className="bg-white p-6 rounded shadow h-fit border-t-4 border-blue-500">
          <h2 className="text-lg font-bold mb-4">
            {editId ? "Edit Transaksi" : "Catat Transaksi Baru"}
          </h2>

          {!editId && transactions.length === 0 && (
            <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded mb-4">
              <strong>Tips:</strong> Isi saldo awal dengan jenis "Uang Masuk".
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Jenis Transaksi
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="mt-1 w-full p-2 border rounded bg-white"
              >
                <option value="Masuk">Uang Masuk (Iuran/Donasi)</option>
                <option value="Keluar">Uang Keluar (Operasional)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nominal (Rp)
              </label>
              <input
                type="number"
                min="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="mt-1 w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tanggal
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="mt-1 w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sumber / Keperluan
              </label>
              <textarea
                rows="2"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Misal: Iuran Warga Blok A..."
                className="mt-1 w-full p-2 border rounded"
                required
              ></textarea>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                {isLoading
                  ? "Menyimpan..."
                  : editId
                    ? "Update Transaksi"
                    : "Simpan Transaksi"}
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

        {/* TABEL RIWAYAT */}
        <div className="xl:col-span-2 bg-white p-6 rounded shadow overflow-x-auto">
          <h2 className="text-lg font-bold mb-4">Buku Besar (Riwayat Kas)</h2>
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3">Tanggal</th>
                <th className="p-3">Deskripsi</th>
                <th className="p-3 text-right">Nominal</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    Belum ada riwayat transaksi.
                  </td>
                </tr>
              ) : (
                transactions.map((item) => (
                  <tr
                    key={item._id}
                    className={`border-b hover:bg-gray-50 ${editId === item._id ? "bg-blue-50" : ""}`}
                  >
                    <td className="p-3 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-gray-800">
                        {item.description}
                      </p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.type === "Masuk" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {item.type.toUpperCase()}
                      </span>
                    </td>
                    <td
                      className={`p-3 text-right font-bold ${item.type === "Masuk" ? "text-green-600" : "text-red-600"}`}
                    >
                      {item.type === "Masuk" ? "+" : "-"}
                      {formatRp(item.amount)}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-yellow-600 hover:text-yellow-800 font-medium text-sm transition"
                        >
                          Edit
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm transition"
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

export default Kas;
