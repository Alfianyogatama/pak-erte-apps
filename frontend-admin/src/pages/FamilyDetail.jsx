// src/pages/FamilyDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import MemberForm from "../components/MemberForm";
import Swal from "sweetalert2";

const FamilyDetail = () => {
  const { familyId } = useParams();
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMembers = async () => {
    const res = await api.get(`/members/${familyId}`);
    setMembers(res.data);
  };

  useEffect(() => {
    fetchMembers();
  }, [familyId]);

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
        await api.delete(`/members/${memberId}`);
        Swal.fire("Terhapus!", "Anggota berhasil dihapus.", "success");
        fetchMembers();
      } catch (error) {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
      }
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={() => {
          setSelectedMember(null);
          setIsModalOpen(true);
        }}
        className="bg-green-600 text-white px-4 py-2 rounded-lg mb-4"
      >
        + Tambah Anggota
      </button>

      <table className="w-full bg-white rounded-xl shadow">
        {members.map((m) => (
          <tr key={m._id} className="border-b">
            <td className="p-4">{m.name}</td>
            <td className="p-4">
              <button
                onClick={() => {
                  setSelectedMember(m);
                  setIsModalOpen(true);
                }}
                className="text-amber-500 mr-4"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(m._id)}
                className="text-red-500"
              >
                Hapus
              </button>
            </td>
          </tr>
        ))}
      </table>

      <MemberForm
        familyId={familyId}
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchMembers}
      />
    </div>
  );
};

export default FamilyDetail;
