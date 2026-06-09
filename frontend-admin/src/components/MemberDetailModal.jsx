import React, { useState, useEffect } from "react";
import api from "../utils/api";
import Swal from "sweetalert2"; // Import SweetAlert2

const MemberDetailModal = ({ familyId, isOpen, onClose, onEdit }) => {
  const [members, setMembers] = useState([]);

  const fetchMembers = async () => {
    try {
      const res = await api.get(`/family-members/${familyId}`);
      setMembers(res.data);
    } catch (error) {
      console.error("Gagal mengambil anggota keluarga:", error);
      Swal.fire("Error", "Gagal memuat data anggota keluarga.", "error");
    }
  };

  useEffect(() => {
    if (isOpen && familyId) {
      fetchMembers();
    }
  }, [isOpen, familyId]);

  const handleDelete = async (memberId) => {
    const result = await Swal.fire({
      title: "Hapus Anggota?",
      text: "Data anggota keluarga ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/family-members/${memberId}`); // Mengarah ke route DELETE /members/:memberId
        Swal.fire("Terhapus!", "Anggota berhasil dihapus.", "success");
        fetchMembers(); // Refresh daftar anggota setelah penghapusan
      } catch (error) {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="font-bold text-xl mb-4">Daftar Anggota Keluarga</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Nama</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">NIK</th>
              <th className="text-left p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m._id} className="border-b">
                <td className="p-2">{m.name}</td>
                <td className="p-2">{m.status}</td>
                <td className="p-2">{m.nik}</td>
                <td className="p-2">
                  <button
                    onClick={() => onEdit(m)}
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    Edit
                  </button>
                  <span className="text-gray-300 mx-1">|</span>
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="text-red-600 hover:text-red-800 underline font-medium"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-200 py-2 rounded-lg"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default MemberDetailModal;
