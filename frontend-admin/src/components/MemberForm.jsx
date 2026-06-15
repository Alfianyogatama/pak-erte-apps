import React, { useState, useEffect } from "react";
import api from "../utils/api";
import Swal from "sweetalert2";

const MemberForm = ({ familyId, member, isOpen, onClose, onSave }) => {
  const initialData = {
    name: "",
    status: "Anak", // Default status
    nik: "",
    birthPlace: "",
    birthDate: "",
    occupation: "",
    fatherName: "",
    motherName: "",
    bpjsNumber: "",
    note: "",
  };

  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (member) {
      setFormData({
        ...member,
        // Format tanggal agar masuk ke input type="date"
        birthDate: member.birthDate ? member.birthDate.split("T")[0] : "",
      });
    } else {
      setFormData(initialData);
    }
  }, [member]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (member) await api.put(`/family-members/${member._id}`, formData);
      else await api.post(`/family-members/${familyId}`, formData);
      Swal.fire("Berhasil", "Data anggota berhasil disimpan", "success");
      onSave();
      onClose();
    } catch (err) {
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan", "error");
    }
  };

  if (!isOpen) return null;

  // return (
  //   <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
  //     <form
  //       onSubmit={handleSubmit}
  //       className="bg-white p-6 rounded-2xl w-full max-w-lg space-y-3"
  //     >
  //       <h2 className="font-bold text-xl">
  //         {member ? "Edit Anggota" : "Tambah Anggota"}
  //       </h2>

  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
  //         <input
  //           className="p-2 border rounded-lg"
  //           placeholder="Nama Lengkap"
  //           required
  //           value={formData.name}
  //           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  //         />
  //         <select
  //           className="p-2 border rounded-lg"
  //           value={formData.status}
  //           onChange={(e) =>
  //             setFormData({ ...formData, status: e.target.value })
  //           }
  //         >
  //           {[
  //             "Kepala Keluarga",
  //             "Suami",
  //             "Istri",
  //             "Anak",
  //             "Menantu",
  //             "Cucu",
  //             "Orangtua",
  //             "Mertua",
  //             "Famili Lain",
  //           ].map((s) => (
  //             <option key={s} value={s}>
  //               {s}
  //             </option>
  //           ))}
  //         </select>
  //         <input
  //           className="w-full p-2 border rounded-lg"
  //           placeholder="NIK (16 Digit)"
  //           value={formData.nik}
  //           maxLength={16} // Membatasi input di browser agar tidak bisa lebih dari 16
  //           onChange={(e) => {
  //             // Memastikan hanya angka yang boleh diketik
  //             const onlyNums = e.target.value.replace(/[^0-9]/g, "");
  //             setFormData({ ...formData, nik: onlyNums });
  //           }}
  //         />
  //         <div>
  //           <label className="text-xs font-semibold text-gray-500">
  //             Pekerjaan
  //           </label>
  //           <select
  //             className="w-full p-2 border rounded-lg bg-white"
  //             value={formData.occupation}
  //             onChange={(e) =>
  //               setFormData({ ...formData, occupation: e.target.value })
  //             }
  //           >
  //             <option value="">-- Pilih Pekerjaan --</option>
  //             {[
  //               "Belum/Tidak Bekerja",
  //               "Mengurus Rumah Tangga",
  //               "Pelajar/Mahasiswa",
  //               "Pensiunan",
  //               "PNS",
  //               "TNI",
  //               "POLRI",
  //               "Perdagangan",
  //               "Petani/Pekebun",
  //               "Peternak",
  //               "Nelayan/Perikanan",
  //               "Industri",
  //               "Konstruksi",
  //               "Transportasi",
  //               "Karyawan Swasta",
  //               "Karyawan BUMN/BUMD",
  //               "Karyawan Honorer",
  //               "Buruh Harian Lepas",
  //               "Wiraswasta",
  //               "Dokter/Tenaga Kesehatan",
  //               "Guru/Dosen",
  //             ].map((job) => (
  //               <option key={job} value={job}>
  //                 {job}
  //               </option>
  //             ))}
  //           </select>
  //         </div>
  //         <input
  //           className="p-2 border rounded-lg"
  //           placeholder="Tempat Lahir"
  //           value={formData.birthPlace}
  //           onChange={(e) =>
  //             setFormData({ ...formData, birthPlace: e.target.value })
  //           }
  //         />
  //         <input
  //           type="date"
  //           className="p-2 border rounded-lg"
  //           value={formData.birthDate}
  //           onChange={(e) =>
  //             setFormData({ ...formData, birthDate: e.target.value })
  //           }
  //         />
  //         <input
  //           className="p-2 border rounded-lg"
  //           placeholder="Nama Ayah"
  //           value={formData.fatherName}
  //           onChange={(e) =>
  //             setFormData({ ...formData, fatherName: e.target.value })
  //           }
  //         />
  //         <input
  //           className="p-2 border rounded-lg"
  //           placeholder="Nama Ibu"
  //           value={formData.motherName}
  //           onChange={(e) =>
  //             setFormData({ ...formData, motherName: e.target.value })
  //           }
  //         />
  //         <input
  //           className="p-2 border rounded-lg col-span-2"
  //           placeholder="No. BPJS"
  //           value={formData.bpjsNumber}
  //           onChange={(e) =>
  //             setFormData({ ...formData, bpjsNumber: e.target.value })
  //           }
  //         />
  //         <textarea
  //           className="p-2 border rounded-lg col-span-2"
  //           placeholder="Catatan"
  //           value={formData.note}
  //           onChange={(e) => setFormData({ ...formData, note: e.target.value })}
  //         />
  //       </div>

  //       <div className="flex gap-2 pt-2">
  //         <button
  //           type="button"
  //           onClick={onClose}
  //           className="flex-1 bg-gray-200 py-2 rounded-lg"
  //         >
  //           Batal
  //         </button>
  //         <button
  //           type="submit"
  //           className="flex-1 bg-[#1e4a6e] text-white py-2 rounded-lg"
  //         >
  //           Simpan
  //         </button>
  //       </div>
  //     </form>
  //   </div>
  // );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-xl my-auto"
      >
        <h2 className="font-bold text-xl mb-4">
          {member ? "Edit Anggota" : "Tambah Anggota"}
        </h2>

        {/* Grid container: 1 kolom di mobile, 2 kolom di desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nama Lengkap */}
          <input
            className="p-2 border rounded-lg w-full"
            placeholder="Nama Lengkap"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          {/* Status */}
          <select
            className="p-2 border rounded-lg w-full bg-white"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            {[
              "Kepala Keluarga",
              "Suami",
              "Istri",
              "Anak",
              "Menantu",
              "Cucu",
              "Orangtua",
              "Mertua",
              "Famili Lain",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* NIK */}
          <input
            className="p-2 border rounded-lg w-full"
            placeholder="NIK (16 Digit)"
            value={formData.nik}
            maxLength={16}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/[^0-9]/g, "");
              setFormData({ ...formData, nik: onlyNums });
            }}
          />

          {/* Pekerjaan */}
          <select
            className="p-2 border rounded-lg w-full bg-white"
            value={formData.occupation}
            onChange={(e) =>
              setFormData({ ...formData, occupation: e.target.value })
            }
          >
            <option value="">-- Pilih Pekerjaan --</option>
            {[
              "Belum/Tidak Bekerja",
              "Mengurus Rumah Tangga",
              "Pelajar/Mahasiswa",
              "Pensiunan",
              "PNS",
              "TNI",
              "POLRI",
              "Perdagangan",
              "Petani/Pekebun",
              "Peternak",
              "Nelayan/Perikanan",
              "Industri",
              "Konstruksi",
              "Transportasi",
              "Karyawan Swasta",
              "Karyawan BUMN/BUMD",
              "Karyawan Honorer",
              "Buruh Harian Lepas",
              "Wiraswasta",
              "Dokter/Tenaga Kesehatan",
              "Guru/Dosen",
            ].map((job) => (
              <option key={job} value={job}>
                {job}
              </option>
            ))}
          </select>

          {/* Tempat & Tanggal Lahir */}
          <input
            className="p-2 border rounded-lg w-full"
            placeholder="Tempat Lahir"
            value={formData.birthPlace}
            onChange={(e) =>
              setFormData({ ...formData, birthPlace: e.target.value })
            }
          />
          <input
            type="date"
            className="p-2 border rounded-lg w-full"
            value={formData.birthDate}
            onChange={(e) =>
              setFormData({ ...formData, birthDate: e.target.value })
            }
          />

          {/* Nama Orangtua */}
          <input
            className="p-2 border rounded-lg w-full"
            placeholder="Nama Ayah"
            value={formData.fatherName}
            onChange={(e) =>
              setFormData({ ...formData, fatherName: e.target.value })
            }
          />
          <input
            className="p-2 border rounded-lg w-full"
            placeholder="Nama Ibu"
            value={formData.motherName}
            onChange={(e) =>
              setFormData({ ...formData, motherName: e.target.value })
            }
          />

          {/* BPJS (Full width pada desktop agar rapi) */}
          <input
            className="p-2 border rounded-lg w-full md:col-span-2"
            placeholder="No. BPJS"
            value={formData.bpjsNumber}
            onChange={(e) =>
              setFormData({ ...formData, bpjsNumber: e.target.value })
            }
          />

          {/* Catatan (Full width) */}
          <textarea
            className="p-2 border rounded-lg w-full md:col-span-2"
            placeholder="Catatan"
            rows="2"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 py-2 rounded-lg font-bold"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#1e4a6e] text-white py-2 rounded-lg font-bold"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;
