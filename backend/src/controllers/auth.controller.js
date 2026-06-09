// backend/src/controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Cari user di database
    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).json({ message: "Username tidak ditemukan" });

    // 2. Cocokkan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah" });

    // 3. Buat JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }, // Token berlaku 1 hari
    );

    res.status(200).json({
      message: "Login berhasil",
      token,
      user: { username: user.username, role: user.role },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// Middleware autentikasi di Backend
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // Mengambil token dari string "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token kadaluarsa" });
    }
    req.user = decoded;
    next();
  });
};
