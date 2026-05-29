// backend/src/seed.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "./models/index.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Cek apakah admin sudah ada
    const adminExists = await User.findOne({ username: "ketuart" });
    if (adminExists) {
      console.log("⚠️ Akun Ketua RT sudah ada di database.");
      process.exit();
    }

    // Hash password "rahasia123"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("rahasia123", salt);

    // Buat akun baru
    const admin = new User({
      username: "ketuart",
      password: hashedPassword,
      role: "Ketua RT",
    });

    await admin.save();
    console.log(
      "✅ Akun Ketua RT berhasil dibuat! (Username: ketuart | Password: rahasia123)",
    );
    process.exit();
  } catch (error) {
    console.error("❌ Gagal membuat akun:", error);
    process.exit(1);
  }
};

seedAdmin();
