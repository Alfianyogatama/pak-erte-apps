// backend/src/controllers/family.controller.js
import { Family } from "../models/index.js";

// 1. Dapatkan Statistik Warga (Bisa diakses publik/Landing Page)
// backend/src/controllers/family.controller.js -> Cek fungsi nomor 1

export const getFamilySummary = async (req, res) => {
  try {
    const totalKK = await Family.countDocuments();

    const families = await Family.find();
    // Gunakan (fam.familyMembersCount || 1) sebagai fallback jika data kosong/0
    const totalWarga = families.reduce(
      (sum, fam) => sum + (fam.familyMembersCount || 1),
      0,
    );

    res.status(200).json({ totalKK, totalWarga });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menghitung statistik", error: error.message });
  }
};

// 2. Dapatkan Detail Semua KK (Hanya Ketua RT)
export const getFamilies = async (req, res) => {
  try {
    // Mengurutkan data berdasarkan Nama Kepala Keluarga secara alfabetis
    const families = await Family.find().sort({ headOfFamily: 1 });
    res.status(200).json(families);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data warga", error: error.message });
  }
};

// 3. Tambah KK Baru (Hanya Ketua RT)
export const createFamily = async (req, res) => {
  try {
    const newFamily = new Family(req.body);
    const savedFamily = await newFamily.save();
    res.status(201).json(savedFamily);
  } catch (error) {
    res.status(400).json({ message: "Data tidak valid", error: error.message });
  }
};

// 4. Update Data KK (Hanya Ketua RT)
export const updateFamily = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Family.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated)
      return res.status(404).json({ message: "Data warga tidak ditemukan" });
    res.status(200).json(updated);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Gagal mengupdate data", error: error.message });
  }
};

// 5. Hapus Data KK (Hanya Ketua RT)
export const deleteFamily = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Family.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Data warga tidak ditemukan" });
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menghapus data", error: error.message });
  }
};

// 6. Dapatkan Data Warga Versi Publik (Hanya Nama & WA untuk Halaman Warga)
export const getPublicFamilies = async (req, res) => {
  try {
    // .select() memastikan data seperti ktpNumber, kkNumber, dan houseNumber TIDAK ikut dikirim ke internet
    const publicList = await Family.find()
      .select("headOfFamily whatsappNumber -_id")
      .sort({ headOfFamily: 1 });

    res.status(200).json(publicList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data warga", error: error.message });
  }
};
