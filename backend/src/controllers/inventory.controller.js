import { Inventory, Loan } from "../models/index.js";

export const getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory)
      return res.status(404).json({ message: "Barang tidak ditemukan" });

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Error server" });
  }
};
// GET: Ambil semua data (Bisa diakses publik/warga)
export const getInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find().sort({ createdAt: -1 });
    // Tambahkan kalkulasi stok untuk mempermudah frontend (Admin)
    const data = inventories.map((item) => ({
      ...item.toObject(),
      brokenQuantity: item.brokenQuantity || 0,
      available:
        (item.totalQuantity || 0) -
        (item.borrowedQuantity || 0) -
        (item.brokenQuantity || 0),
      totalBorrowed: item.borrowedQuantity || 0,
      // Status dinamis agar UI dot dan teks di admin konsisten
      conditionStatus:
        (item.brokenQuantity || 0) === 0
          ? "Baik"
          : (item.brokenQuantity || 0) >= (item.totalQuantity || 0)
            ? "Rusak Total"
            : "Sebagian Rusak",
    }));
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data", error: error.message });
  }
};

// POST: Tambah data baru (Hanya Ketua RT)
export const createInventory = async (req, res) => {
  try {
    const { name, category, totalQuantity, description } = req.body;

    // 1. Validasi: Cek apakah barang dengan nama yang sama sudah ada
    const existingItem = await Inventory.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // Mencari nama yang sama (case-insensitive)
    });

    if (existingItem) {
      return res.status(400).json({
        message: `Barang dengan nama "${name}" sudah terdaftar!`,
      });
    }

    // 2. Jika tidak ada, buat data baru
    const newInventory = new Inventory({
      name,
      category,
      totalQuantity,
      description,
      availabilityStatus: "Tersedia",
    });

    const savedInventory = await newInventory.save();
    res.status(201).json(savedInventory);
  } catch (error) {
    res.status(400).json({ message: "Data tidak valid", error: error.message });
  }
};

// DELETE: Hapus data berdasarkan ID (Hanya Ketua RT) -> FITUR BARU
export const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Inventory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }

    res
      .status(200)
      .json({ message: "Barang berhasil dihapus dari inventaris" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menghapus data", error: error.message });
  }
};

// PUT: Update data berdasarkan ID (Hanya Ketua RT)
export const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { totalQuantity, brokenQuantity, conditionNote } = req.body;

    const inventory = await Inventory.findById(id);
    if (!inventory) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }

    // 1. Validasi Input: quantity tidak boleh negatif
    if (totalQuantity !== undefined && Number(totalQuantity) < 0) {
      return res
        .status(400)
        .json({ message: "Jumlah total tidak boleh negatif" });
    }
    const newTotal =
      totalQuantity !== undefined
        ? Number(totalQuantity)
        : inventory.totalQuantity;
    const newBroken =
      brokenQuantity !== undefined
        ? Number(brokenQuantity)
        : inventory.brokenQuantity;

    // 1. Validasi Input: Tidak boleh negatif
    if (newTotal < 0 || newBroken < 0) {
      return res.status(400).json({ message: "Jumlah tidak boleh negatif" });
    }

    // 2. Validasi Kapasitas Stok
    // Total harus >= (Dipinjam + Rusak)
    if (newTotal < inventory.borrowedQuantity + newBroken) {
      return res.status(400).json({
        message: `Total stok (${newTotal}) tidak cukup untuk menampung barang dipinjam (${inventory.borrowedQuantity}) dan rusak (${newBroken})`,
      });
    }

    // 3. Audit Trail: Jika ada penambahan jumlah rusak, wajib isi note
    if (newBroken > inventory.brokenQuantity) {
      if (!conditionNote || conditionNote.trim() === "") {
        return res.status(400).json({
          message:
            "Wajib mengisi catatan kerusakan saat menambah jumlah barang rusak",
        });
      }
    }

    const updated = await Inventory.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    res.status(200).json(updated);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Gagal mengupdate data", error: error.message });
  }
};

export const getInventoryForCitizens = async (req, res) => {
  try {
    const inventories = await Inventory.find();
    // Ambil semua data peminjaman yang statusnya sedang berjalan/dipinjam
    const loans = await Loan.find({ status: "Dipinjam" });

    const data = inventories.map((item) => {
      // 1. Hitung total yang sedang dipinjam untuk barang dengan nama yang sama
      const activeLoans = loans.filter((l) => l.itemName === item.name);
      const totalBorrowed = item.borrowedQuantity || 0;
      const broken = item.brokenQuantity || 0;

      // 2. Hitung sisa yang tersedia (Total - Dipinjam - Rusak)
      const available = (item.totalQuantity || 0) - totalBorrowed - broken;

      // 3. Ambil tanggal pengembalian terdekat dari barang yang dipinjam
      const nextReturnDate =
        activeLoans.length > 0
          ? new Date(
              Math.min(...activeLoans.map((l) => new Date(l.returnDate))),
            )
          : null;

      return {
        _id: item._id,
        name: item.name,
        totalQuantity: item.totalQuantity,
        brokenQuantity: broken,
        available: available, // Ini angka yang Anda butuhkan
        totalBorrowed: totalBorrowed, // Ini angka yang Anda butuhkan
        nextReturnDate: nextReturnDate, // Ini tanggal untuk dipinjam
        // Status dinamis untuk warga
        conditionStatus:
          broken === 0
            ? "Baik"
            : broken >= item.totalQuantity
              ? "Rusak Total"
              : "Sebagian Rusak",
        description: item.description,
      };
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
