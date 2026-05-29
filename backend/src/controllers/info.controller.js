// backend/src/controllers/info.controller.js
import { Information } from "../models/index.js";
import ImageKit from "imagekit";
import dotenv from "dotenv";
dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const getInformations = async (req, res) => {
  try {
    const infos = await Information.find().sort({ createdAt: -1 });
    res.status(200).json(infos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data", error: error.message });
  }
};

export const createInformation = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    let imageUrls = [];
    let imageFileIds = [];

    // Jika ada BANYAK file gambar yang dikirim (req.files)
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResponse = await imagekit.upload({
          file: file.buffer,
          fileName: `RT25-${Date.now()}-${file.originalname}`,
          folder: "/rt25-dokumentasi",
        });
        imageUrls.push(uploadResponse.url);
        imageFileIds.push(uploadResponse.fileId);
      }
    }

    const newInfo = new Information({
      title,
      description,
      category,
      imageUrls,
      imageFileIds,
    });
    const savedInfo = await newInfo.save();
    res.status(201).json(savedInfo);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Gagal menyimpan informasi", error: error.message });
  }
};

export const deleteInformation = async (req, res) => {
  try {
    const { id } = req.params;
    const info = await Information.findById(id);

    if (!info) return res.status(404).json({ message: "Data tidak ditemukan" });

    // Hapus semua file gambar dari ImageKit jika ada
    if (info.imageFileIds && info.imageFileIds.length > 0) {
      for (const fileId of info.imageFileIds) {
        await imagekit.deleteFile(fileId);
      }
    }

    await Information.findByIdAndDelete(id);
    res.status(200).json({ message: "Informasi dan foto berhasil dihapus" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menghapus data", error: error.message });
  }
};

// UPDATE: Edit Informasi & Ganti Foto (Jika ada)
export const updateInformation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    const info = await Information.findById(id);
    if (!info) return res.status(404).json({ message: "Data tidak ditemukan" });

    let imageUrls = info.imageUrls; // Default: simpan foto lama
    let imageFileIds = info.imageFileIds;

    // JIKA ADA file gambar baru yang diunggah
    if (req.files && req.files.length > 0) {
      // 1. Hapus semua foto LAMA dari ImageKit terlebih dahulu
      if (info.imageFileIds && info.imageFileIds.length > 0) {
        for (const fileId of info.imageFileIds) {
          try {
            await imagekit.deleteFile(fileId);
          } catch (err) {
            console.error("Gagal hapus foto lama:", err);
          }
        }
      }

      // 2. Upload foto BARU ke ImageKit
      imageUrls = [];
      imageFileIds = [];
      for (const file of req.files) {
        const uploadResponse = await imagekit.upload({
          file: file.buffer,
          fileName: `RT25-${Date.now()}-${file.originalname}`,
          folder: "/rt25-dokumentasi",
        });
        imageUrls.push(uploadResponse.url);
        imageFileIds.push(uploadResponse.fileId);
      }
    }

    // Update data di database
    const updatedInfo = await Information.findByIdAndUpdate(
      id,
      { title, description, category, imageUrls, imageFileIds },
      { new: true },
    );

    res.status(200).json(updatedInfo);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Gagal mengupdate informasi", error: error.message });
  }
};
