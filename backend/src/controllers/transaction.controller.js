// backend/src/controllers/transaction.controller.js
import { Transaction } from "../models/index.js";

// 1. Dapatkan Ringkasan Saldo (Warga & Admin)
export const getTransactionSummary = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $group: {
          _id: "$category",
          balance: {
            $sum: {
              $cond: [
                { $eq: ["$type", "Masuk"] },
                "$amount",
                { $multiply: ["$amount", -1] },
              ],
            },
          },
        },
      },
    ]);

    const summary = {
      RT: 0,
      Jimpitan: 0,
      Inventaris: 0,
      saldoAkhir: 0,
    };

    result.forEach((item) => {
      if (summary.hasOwnProperty(item._id)) {
        summary[item._id] = item.balance;
        summary.saldoAkhir += item.balance;
      }
    });

    res.status(200).json(summary);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menghitung saldo", error: error.message });
  }
};

// 2. Dapatkan Semua Riwayat Transaksi (Warga & Admin)
export const getTransactions = async (req, res) => {
  try {
    // Urutkan dari yang terbaru
    const transactions = await Transaction.find().sort({
      date: -1,
      createdAt: -1,
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data transaksi",
      error: error.message,
    });
  }
};

// 3. Tambah Transaksi Baru (Hanya Admin)
export const createTransaction = async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({ message: "Data tidak valid", error: error.message });
  }
};

// 4. Update Transaksi (Hanya Admin - Jika ada salah ketik)
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Transaction.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    res.status(200).json(updated);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Gagal mengupdate transaksi", error: error.message });
  }
};

// 5. Hapus Transaksi (Hanya Admin)
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Transaction.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    res.status(200).json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menghapus transaksi", error: error.message });
  }
};
