// backend/src/controllers/loan.controller.js
import { Loan, Inventory } from "../models/index.js";
import mongoose from "mongoose";

// GET: Lihat daftar peminjaman
export const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });
    res.status(200).json(loans);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data", error: error.message });
  }
};

// POST: Buat peminjaman baru
// export const createLoan = async (req, res) => {
//   try {
//     // Sekarang kita terima itemName dan quantity secara langsung
//     const {
//       borrowerName,
//       loanDate,
//       returnDate,
//       description,
//       itemName,
//       quantity,
//     } = req.body;

//     // 1. Cari stok item
//     const inv = await Inventory.findOne({ name: itemName });
//     if (!inv || inv.totalQuantity < quantity) {
//       return res.status(400).json({ message: `Stok ${itemName} tidak cukup!` });
//     }

//     // 2. Kurangi stok
//     await Inventory.findOneAndUpdate(
//       { name: itemName },
//       { $inc: { totalQuantity: -quantity } },
//     );

//     // 3. Simpan transaksi (items sekarang dibentuk menjadi array berisi 1 objek)
//     const newLoan = new Loan({
//       borrowerName,
//       loanDate,
//       returnDate,
//       description,
//       itemName: itemName,
//       quantity: quantity,
//       status: "Dipinjam",
//     });

//     await newLoan.save();
//     res.status(201).json(newLoan);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// backend/src/controllers/loan.controller.js
export const createLoan = async (req, res) => {
  const session = await mongoose.startSession(); // Gunakan transaction agar aman
  session.startTransaction();
  try {
    const {
      borrowerName,
      loanDate,
      returnDate,
      description,
      itemName,
      quantity,
    } = req.body;

    // 1. Cari & Validasi stok
    const inv = await Inventory.findOne({ name: itemName }).session(session);
    // Logika: Tersedia = Total Fisik - Barang yang sudah dipinjam
    const available = inv.totalQuantity - inv.borrowedQuantity;

    if (!inv || available < quantity) {
      await session.abortTransaction();
      return res.status(400).json({ message: `Stok ${itemName} tidak cukup!` });
    }

    // 2. Update Inventory (Update borrowedQuantity saja, jangan kurangi totalQuantity)
    await Inventory.findOneAndUpdate(
      { name: itemName },
      { $inc: { borrowedQuantity: quantity } },
      { session },
    );

    // 3. Simpan Loan
    const newLoan = new Loan({ ...req.body, status: "Dipinjam" });
    await newLoan.save({ session });

    await session.commitTransaction();
    res.status(201).json(newLoan);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// PUT: Update status (Misal: dari Dipinjam ke Kembali)
export const updateLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Loan.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Gagal update status", error: error.message });
  }
};

// export const returnLoan = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const loan = await Loan.findById(id);
//     if (!loan || loan.status === "Kembali")
//       return res.status(400).json({ message: "Data tidak valid" });

//     // 1. Cari barang dan kembalikan stoknya
//     const item = await Inventory.findOne({ name: loan.itemName });
//     if (item) {
//       item.totalQuantity += loan.quantity;
//       await item.save();
//     }

//     // 2. Update status pinjam
//     loan.status = "Kembali";
//     await loan.save();

//     res.status(200).json({ message: "Barang berhasil dikembalikan" });
//   } catch (error) {
//     res
//       .status(400)
//       .json({ message: "Gagal mengembalikan barang", error: error.message });
//   }
// };

export const returnLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan || loan.status === "Dikembalikan")
      return res.status(400).json({ message: "Data tidak valid" });

    // Update stok: Kurangi borrowedQuantity
    await Inventory.findOneAndUpdate(
      { name: loan.itemName },
      { $inc: { borrowedQuantity: -loan.quantity } },
    );

    loan.status = "Dikembalikan";
    await loan.save();

    res.json({ message: "Barang berhasil dikembalikan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tambahkan ini di loan.controller.js
export const getLoansByItem = async (req, res) => {
  try {
    const { itemName } = req.params;
    // Cari yang statusnya masih 'Dipinjam'
    const loans = await Loan.find({ itemName, status: "Dipinjam" });
    console.log("Mencari pinjaman untuk barang:", itemName);
    console.log("Hasil pencarian:", loans);
    res.status(200).json(loans);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal ambil data pinjam", error: error.message });
  }
};
