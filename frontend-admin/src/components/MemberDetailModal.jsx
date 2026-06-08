import React, { useState, useEffect } from "react";
import api from "../utils/api";

const MemberDetailModal = ({ familyId, isOpen, onClose, onEdit }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (isOpen && familyId) {
      api
        .get(`/family-members/${familyId}`)
        .then((res) => setMembers(res.data));
    }
  }, [isOpen, familyId]);

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
