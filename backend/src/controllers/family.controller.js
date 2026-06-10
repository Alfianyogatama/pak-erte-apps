// backend/src/controllers/family.controller.js
import { Family, FamilyMember } from "../models/index.js";
import redisClient from "../config/redis.js"; // Import Redis client

// 1. Dapatkan Statistik Warga (Bisa diakses publik/Landing Page)
// backend/src/controllers/family.controller.js -> Cek fungsi nomor 1

export const getFamilySummary = async (req, res) => {
  try {
    // Menghitung jumlah Kepala Keluarga (Setiap 1 dokumen Family = 1 Kepala Keluarga)
    const totalKK = await Family.countDocuments();

    // Total Jiwa sekarang diambil dari total data anggota (karena KK sudah termasuk di dalamnya)
    const totalWarga = await FamilyMember.countDocuments();

    res.status(200).json({ totalKK, totalWarga });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menghitung statistik", error: error.message });
  }
};

// 1b. Dapatkan Statistik Berdasarkan Kelompok Usia
export const getFamilyAgeStats = async (req, res) => {
  try {
    const cacheKey = "families:age_stats";

    // Coba ambil dari cache
    const cachedStats = await redisClient.get(cacheKey);
    if (cachedStats) {
      return res.status(200).json(JSON.parse(cachedStats));
    }

    const members = await FamilyMember.find({
      birthDate: { $exists: true, $ne: null },
    });
    const now = new Date();

    const stats = {
      balita: 0, // 0-5 tahun
      anak: 0, // 5-11 tahun
      remaja: 0, // 10-18 tahun
      dewasa: 0, // 18-59 tahun
      praLansia: 0, // 45-59 tahun
      lansiaMuda: 0, // 60-69 tahun
      lansiaLanjut: 0, // 70-79 tahun
      lansiaAkhir: 0, // >= 80 tahun
    };

    members.forEach((member) => {
      const birthDate = new Date(member.birthDate);
      let ageInMonths =
        (now.getFullYear() - birthDate.getFullYear()) * 12 +
        (now.getMonth() - birthDate.getMonth());

      // Penyesuaian jika bulan belum lewat
      if (now.getDate() < birthDate.getDate()) {
        ageInMonths--;
      }

      const ageInYears = ageInMonths / 12;

      // Kategori Bayi dan Balita: 0–5 tahun (0–59 bulan)
      if (ageInMonths >= 0 && ageInMonths <= 59) stats.balita++;

      // Anak-anak: 5–11 tahun
      if (ageInYears >= 5 && ageInYears <= 11) stats.anak++;

      // Remaja: 10–18 tahun
      if (ageInYears >= 10 && ageInYears <= 18) stats.remaja++;

      // Dewasa: 18–59 tahun
      if (ageInYears >= 18 && ageInYears <= 59) stats.dewasa++;

      // Pengelompokan Lansia & Pra-Lansia
      // Pra-Lansia: 45–59 tahun
      if (ageInYears >= 45 && ageInYears <= 59) stats.praLansia++;

      // Lansia Muda: 60–69 tahun
      if (ageInYears >= 60 && ageInYears <= 69) stats.lansiaMuda++;

      // Lansia Lanjut: 70–79 tahun
      if (ageInYears >= 70 && ageInYears <= 79) stats.lansiaLanjut++;

      // Lansia Lanjut Usia Akhir: >= 80 tahun
      if (ageInYears >= 80) stats.lansiaAkhir++;
    });

    // Simpan ke cache selama 1 jam (3600 detik)
    await redisClient.set(cacheKey, JSON.stringify(stats), "EX", 3600);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil statistik usia",
      error: error.message,
    });
  }
};

// 2. Dapatkan Detail Semua KK (Hanya Ketua RT)
export const getFamilies = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      // Cari anggota keluarga yang namanya cocok dengan kata kunci
      const matchingMembers = await FamilyMember.find({
        name: { $regex: search, $options: "i" },
      }).select("familyId");

      const familyIdsFromMembers = matchingMembers.map((m) => m.familyId);

      // Filter Keluarga berdasarkan Kepala Keluarga ATAU ID yang ditemukan dari pencarian anggota
      query = {
        $or: [
          { headOfFamily: { $regex: search, $options: "i" } },
          { _id: { $in: familyIdsFromMembers } },
        ],
      };
    }

    const families = await Family.find(query).sort({ headOfFamily: 1 });
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
    // Invalidate the general families list cache when a new family is created
    await redisClient.del(["families:all", "families:age_stats"]);
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

    // Invalidate the general families list cache after a successful update
    await redisClient.del(["families:all", "families:age_stats"]);
    // For more robust caching, you might also want to invalidate specific search caches,
    // but that requires a more complex key management (e.g., using Redisearch or tags).
    // For simplicity, we only clear the general list for now.
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

    // Invalidate the general families list cache after a successful deletion
    await redisClient.del(["families:all", "families:age_stats"]);
    // Similar to update, more complex invalidation for search caches could be added here.
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
