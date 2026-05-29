// frontend-warga/src/components/InvitationGenerator.jsx
import React, { useState } from "react";

const InvitationGenerator = () => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    agenda: "",
  });
  const [isCopied, setIsCopied] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsCopied(false);
  };

  const generatedText = `
Assalamu’alaikum Wr. Wb.
Selamat Pagi/Siang/Malam Bapak/Ibu Warga RT 25,

Bersama pesan ini, kami mengundang Bapak/Ibu untuk hadir pada:

Acara   : ${formData.title || "[Nama Acara]"}
Hari/Tgl: ${formData.date || "[Isi Tanggal]"}
Waktu   : ${formData.time || "[Isi Waktu]"} WIB
Tempat  : ${formData.location || "[Isi Tempat]"}
Agenda  : ${formData.agenda || "[Isi Agenda]"}

Kehadiran Bapak/Ibu sangat kami harapkan. 
Terima kasih atas perhatian dan kerjasamanya.

Wassalamu’alaikum Wr. Wb.
Pengurus NgN RT 25
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500 md:flex gap-6">
      <div className="flex-1 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
          Buat Undangan WA
        </h2>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Judul Acara (Rutin Bulanan)"
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-50"
          />
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            name="date"
            placeholder="Tgl (Minggu, 15 Okt)"
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-50"
          />
          <input
            type="text"
            name="time"
            placeholder="Waktu (19:30)"
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-50"
          />
        </div>
        <div>
          <input
            type="text"
            name="location"
            placeholder="Tempat (Balai Warga)"
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-50"
          />
        </div>
        <div>
          <textarea
            name="agenda"
            rows="2"
            placeholder="Agenda (Membahas 17an)"
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-50"
          ></textarea>
        </div>
      </div>
      <div className="flex-1 mt-6 md:mt-0 flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">
          Preview
        </h2>
        <div className="bg-green-50 p-4 rounded border border-green-200 whitespace-pre-wrap text-sm font-mono flex-1 text-gray-800">
          {generatedText}
        </div>
        <button
          onClick={handleCopy}
          className={`mt-4 w-full py-2 px-4 rounded text-white font-bold transition ${isCopied ? "bg-gray-800" : "bg-green-600 hover:bg-green-700"}`}
        >
          {isCopied ? "Tersalin! ✓" : "Copy ke WhatsApp"}
        </button>
      </div>
    </div>
  );
};

export default InvitationGenerator;
