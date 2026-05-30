import { Inventory, Loan } from "../models/index.js";

export const getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory)
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    console.log("Data inventaris ditemukan:", inventory);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Error server" });
  }
};
// GET: Ambil semua data (Bisa diakses publik/warga)
export const getInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find().sort({ createdAt: -1 });
    res.status(200).json(inventories);
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
      conditionStatus: "Baik",
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
    console.log(req.body);
    const updated = await Inventory.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }

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
      const totalBorrowed = activeLoans.reduce((sum, l) => sum + l.quantity, 0);

      // 2. Hitung sisa yang tersedia di gudang
      const available = item.totalQuantity - totalBorrowed;

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
        available: available, // Ini angka yang Anda butuhkan
        totalBorrowed: totalBorrowed, // Ini angka yang Anda butuhkan
        nextReturnDate: nextReturnDate, // Ini tanggal untuk dipinjam
        conditionStatus: item.conditionStatus,
      };
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
