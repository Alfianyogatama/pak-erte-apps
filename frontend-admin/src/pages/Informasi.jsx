// frontend-admin/src/pages/Informasi.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../utils/api";
import imageCompression from "browser-image-compression";
import Swal from "sweetalert2"; // Import SweetAlert2

const Informasi = () => {
  const [informations, setInformations] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Pengumuman",
  });
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  // STATE BARU: Untuk fitur Edit
  const [editId, setEditId] = useState(null);

  const fetchInformations = async () => {
    try {
      const response = await api.get("/informations");
      setInformations(response.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchInformations();
  }, []);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("category", formData.category);

    if (files.length > 0) {
      if (files.length > 5) {
        Swal.fire("Oops!", "Maksimal 5 foto per postingan!", "warning");
        setIsLoading(false);
        return;
      }

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
      };

      try {
        for (let i = 0; i < files.length; i++) {
          setUploadProgress(`Mengompresi foto ${i + 1}/${files.length}...`);
          const compressedFile = await imageCompression(files[i], options);
          submitData.append("images", compressedFile);
        }
      } catch (error) {
        Swal.fire("Error", "Gagal memproses gambar.", "error");
        setIsLoading(false);
        setUploadProgress("");
        return;
      }
    }

    try {
      setUploadProgress("Menyimpan ke server...");

      if (editId) {
        await api.put(`/informations/${editId}`, submitData);
        Swal.fire("Berhasil!", "Postingan berhasil diperbarui.", "success");
      } else {
        await api.post("/informations", submitData);
        Swal.fire("Berhasil!", "Informasi baru berhasil diposting.", "success");
      }

      handleCancelEdit(); // Reset form & state
      fetchInformations();
    } catch (error) {
      Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan data.", "error");
    } finally {
      setIsLoading(false);
      setUploadProgress("");
    }
  };

  // FUNGSI EDIT
  const handleEditClick = (item) => {
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
    });
    setEditId(item._id);
    setFiles([]); // Kosongkan file pilihan sebelumnya
    if (document.getElementById("fileInput")) {
      document.getElementById("fileInput").value = "";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setFormData({ title: "", description: "", category: "Pengumuman" });
    setEditId(null);
    setFiles([]);
    if (document.getElementById("fileInput")) {
      document.getElementById("fileInput").value = "";
    }
  };

  // FUNGSI HAPUS DENGAN SWEETALERT
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data dan foto yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/informations/${id}`);
        Swal.fire("Terhapus!", "Postingan berhasil dihapus.", "success");
        fetchInformations();
      } catch (error) {
        Swal.fire("Gagal!", "Postingan gagal dihapus.", "error");
      }
    }
  };

  return (
    <AdminLayout title="Papan Informasi & Dokumentasi">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* FORM */}
        <div className="bg-white p-6 rounded shadow h-fit border-t-4 border-blue-500">
          <h2 className="text-lg font-bold mb-4">
            {editId ? "Edit Postingan" : "Buat Postingan Baru"}
          </h2>

          {editId && (
            <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded mb-4 border border-yellow-200">
              <strong>Mode Edit:</strong> Membiarkan kolom foto kosong akan
              mempertahankan foto lama. Mengupload foto baru akan{" "}
              <b>mengganti semua</b> foto lama.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="mt-1 w-full p-2 border rounded bg-white"
              >
                <option value="Pengumuman">
                  Pengumuman (Misal: Jadwal Ronda)
                </option>
                <option value="Kegiatan">
                  Dokumentasi Kegiatan (Misal: Kerja Bakti)
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Judul
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="mt-1 w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Isi / Deskripsi
              </label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mt-1 w-full p-2 border rounded"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Foto{" "}
                <span className="text-gray-400 font-normal">
                  (Opsional, Maks 5)
                </span>
              </label>
              <input
                id="fileInput"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 w-full p-2 border rounded bg-gray-50 text-sm"
              />
              {files.length > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  {files.length} foto siap diunggah
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-medium disabled:bg-blue-400"
              >
                {isLoading
                  ? uploadProgress
                  : editId
                    ? "Update Postingan"
                    : "Posting Informasi"}
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

        {/* RIWAYAT */}
        <div className="xl:col-span-2 bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Riwayat Postingan</h2>
          {informations.length === 0 ? (
            <div className="text-center p-8 text-gray-500 bg-gray-50 rounded border border-dashed">
              Belum ada informasi.
            </div>
          ) : (
            <div className="space-y-6">
              {informations.map((item) => (
                <div
                  key={item._id}
                  className={`border rounded-lg p-4 flex flex-col transition ${editId === item._id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${item.category === "Pengumuman" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}
                    >
                      {item.category.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">
                    {item.description}
                  </p>

                  {item.imageUrls && item.imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                      {item.imageUrls.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Dokumentasi ${idx}`}
                          className="w-full h-32 object-cover rounded shadow-sm border"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 border-t pt-3">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="text-yellow-600 hover:text-yellow-800 text-sm font-medium transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                    >
                      🗑 Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Informasi;
