// backend/src/controllers/familyMember.controller.js
import { FamilyMember, Family } from "../models/index.js";

// 1. Dapatkan semua anggota keluarga berdasarkan familyId
export const getMembersByFamily = async (req, res) => {
  try {
    const { familyId } = req.params;
    const members = await FamilyMember.find({ familyId }).sort({ noUrut: 1 });
    res.status(200).json(members);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data anggota", error: error.message });
  }
};

// 2. Tambah anggota baru ke dalam KK dan update familyMembersCount
export const createMember = async (req, res) => {
  try {
    const { familyId } = req.params;

    // Pastikan KK induk ada
    const family = await Family.findById(familyId);
    if (!family) {
      return res.status(404).json({ message: "Data KK tidak ditemukan" });
    }

    const newMember = new FamilyMember({ ...req.body, familyId });
    const savedMember = await newMember.save();

    // Sinkronkan familyMembersCount: hitung ulang dari database
    const count = await FamilyMember.countDocuments({ familyId });
    // Sekarang jumlah jiwa sinkron dengan total di koleksi FamilyMember
    await Family.findByIdAndUpdate(familyId, { familyMembersCount: count });

    res.status(201).json(savedMember);
  } catch (error) {
    res.status(400).json({ message: "Data tidak valid", error: error.message });
  }
};

// 3. Update data anggota
export const updateMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const updated = await FamilyMember.findByIdAndUpdate(memberId, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Anggota tidak ditemukan" });
    }
    res.status(200).json(updated);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Gagal mengupdate data", error: error.message });
  }
};

// 4. Hapus anggota dan update familyMembersCount
export const deleteMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const deleted = await FamilyMember.findByIdAndDelete(memberId);
    if (!deleted) {
      return res.status(404).json({ message: "Anggota tidak ditemukan" });
    }

    // Sinkronkan familyMembersCount setelah hapus
    const familyId = deleted.familyId;
    const count = await FamilyMember.countDocuments({ familyId });
    await Family.findByIdAndUpdate(familyId, {
      familyMembersCount: count,
    });

    res.status(200).json({ message: "Anggota berhasil dihapus" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menghapus data", error: error.message });
  }
};
