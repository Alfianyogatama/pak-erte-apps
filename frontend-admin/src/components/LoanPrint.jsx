import React, { forwardRef } from "react";

const LoanPrint = forwardRef(({ data }, ref) => {
  return (
    // Tambahkan class flex, flex-col, dan min-h-screen agar memenuhi tinggi kertas
    <div
      ref={ref}
      className="p-8 font-serif text-black flex flex-col"
      style={{ width: "210mm", minHeight: "297mm" }}
    >
      {/* BAGIAN ATAS (Kop & Tabel) */}
      <div className="flex-none">
        <div className="mb-8 w-fit">
          <h2 className="font-bold text-lg uppercase">
            PEDUKUHAN 07 NGUNAN UNAN
          </h2>
          <h2 className="font-bold text-lg uppercase border-b-2 border-black">
            RT 25
          </h2>
        </div>
        <div className="text-center mb-6">
          <h2 className="font-bold text-xl uppercase underline">
            SURAT TANDA PEMINJAMAN BARANG
          </h2>
        </div>
        <p className="mb-4">
          Nama Peminjam:{" "}
          <strong>{data?.borrowerName || "................"}</strong>
        </p>

        <table className="w-full border-collapse border border-black mb-6">
          <thead>
            <tr>
              <th className="border border-black p-2 w-12">NO</th>
              <th className="border border-black p-2">NAMA BARANG</th>
              <th className="border border-black p-2 w-20">JML</th>
              <th className="border border-black p-2 w-32">KET</th>
            </tr>
          </thead>
          <tbody>
            {data?.items?.map((item, i) => (
              <tr key={i} style={{ height: "40px" }}>
                <td className="border border-black p-2 text-center">{i + 1}</td>
                <td className="border border-black p-2">{item.name}</td>
                <td className="border border-black p-2 text-center">
                  {item.qty}
                </td>
                <td className="border border-black p-2">{item.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BAGIAN BAWAH (Pendorong Tanda Tangan) */}
      {/* flex-grow ini akan mengambil semua sisa ruang di bawah */}
      <div className="flex-grow flex flex-col justify-end">
        <div className="flex justify-between mb-16">
          <div className="text-center w-1/3">
            <p>Peminjam,</p>
            <br />
            <br />
            <br />
            <p className="font-bold underline">
              {data?.borrowerName || "..........."}
            </p>
          </div>
          <div className="text-center w-1/3">
            <p>Yang Menyerahkan,</p>
            <br />
            <br />
            <br />
            <p className="font-bold underline">Petugas Inventaris</p>
          </div>
        </div>
        <div className="text-center w-full">
          <p>Mengetahui, Ketua RT 25</p>
          <br />
          <br />
          <br />
          <p className="font-bold underline">Sumardi</p>
        </div>
      </div>
    </div>
  );
});

export default LoanPrint;
