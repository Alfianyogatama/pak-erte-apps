// backend/src/models/index.js
import mongoose from "mongoose";

// 1. Model User (Ketua RT / Admin)
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "Ketua RT" },
  },
  { timestamps: true },
);

// 2. Model Inventaris
const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    totalQuantity: { type: Number, required: true, min: 0 },
    borrowedQuantity: { type: Number, default: 0 },
    availabilityStatus: {
      type: String,
      enum: ["Tersedia", "Dipinjam"],
      default: "Tersedia",
    },
    conditionStatus: { type: String, enum: ["Baik", "Rusak"], default: "Baik" },
    description: { type: String },
  },
  { timestamps: true },
);

// 3. Model Kas RT (Transaksi iuran/operasional)
const transactionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["RT", "Jimpitan", "Inventaris"],
      required: true,
      default: "RT",
    },
    type: { type: String, enum: ["Masuk", "Keluar"], required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    contributor: { type: String }, // Nama Petugas Jimpitan (Khusus Jimpitan)
    itemName: { type: String }, // Nama Barang (Khusus Inventaris)
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// 4. Model Pengurus RT & Kontak
const committeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    whatsappNumber: { type: String, required: true }, // Format: 628xxx
  },
  { timestamps: true },
);

// 5. Model Kepala Keluarga (KK)
// HANYA BAGIAN SKEMA KEPALA KELUARGA (Nomor 5) DI backend/src/models/index.js

// 5. Model Kepala Keluarga (KK) - UPDATED
const familySchema = new mongoose.Schema(
  {
    headOfFamily: { type: String, required: true }, // Nama Lengkap (Mandatory)
    ktpNumber: { type: String }, // Nomor KTP (Opsional)
    kkNumber: { type: String }, // Nomor KK (Opsional)
    whatsappNumber: { type: String }, // No WA (Opsional)
    familyMembersCount: { type: Number, default: 0 }, // Dihitung otomatis dari FamilyMember
    keterangan: { type: String }, // Keterangan / Ancer-ancer Rumah (Opsional)
    domicileStatus: {
      type: String,
      enum: ["Tetap", "Kontrak"],
      default: "Tetap",
    },
  },
  { timestamps: true },
);

// 6. Model Rapat & Notulensi
const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ["Upcoming", "Selesai"],
      default: "Upcoming",
    },
    minutes: { type: String },
  },
  { timestamps: true },
);

// 6. Model Informasi & Dokumentasi
const informationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Pengumuman", "Kegiatan"],
      required: true,
    },
    imageUrls: [{ type: String }], // Diubah menjadi Array
    imageFileIds: [{ type: String }], // Diubah menjadi Array
  },
  { timestamps: true },
);

const loanSchema = new mongoose.Schema(
  {
    borrowerName: { type: String, required: true },
    loanDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    description: { type: String },
    itemName: { type: String, required: true }, // Nama barang yang dipinjam
    quantity: { type: Number, required: true, min: 1 }, // Jumlah barang yang dipinjam
    status: { type: String, default: "Dipinjam" },
  },
  { timestamps: true },
);

// 9. Model Anggota Keluarga (Sub-Modul Data Warga per KK)
const familyMemberSchema = new mongoose.Schema(
  {
    familyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Family",
      required: true,
    },
    noUrut: { type: Number }, // Menambahkan field noUrut untuk sinkronisasi dengan controller
    status: {
      type: String,
      enum: [
        "Kepala Keluarga",
        "Suami",
        "Istri",
        "Anak",
        "Menantu",
        "Cucu",
        "Orangtua",
        "Mertua",
        "Famili Lain",
      ],
    }, // No urut NIK dalam KK
    nik: { type: String }, // NIK (Opsional)
    name: { type: String, required: true }, // Nama Lengkap
    birthPlace: { type: String }, // Tempat Lahir
    birthDate: { type: Date }, // Tanggal Lahir
    occupation: { type: String }, // Pekerjaan
    fatherName: { type: String }, // Nama Ayah Kandung
    motherName: { type: String }, // Nama Ibu Kandung
    bpjsNumber: { type: String }, // No BPJS / Jamkes
    note: { type: String }, // Catatan tambahan
  },
  { timestamps: true },
);

export default mongoose.model("Loan", loanSchema);

export const Loan = mongoose.model("Loan", loanSchema);
export const Information = mongoose.model("Information", informationSchema);
export const User = mongoose.model("User", userSchema);
export const Inventory = mongoose.model("Inventory", inventorySchema);
export const Transaction = mongoose.model("Transaction", transactionSchema);
export const Committee = mongoose.model("Committee", committeeSchema);
export const Family = mongoose.model("Family", familySchema);
export const FamilyMember = mongoose.model("FamilyMember", familyMemberSchema);
export const Meeting = mongoose.model("Meeting", meetingSchema);
