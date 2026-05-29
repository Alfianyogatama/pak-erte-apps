import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../utils/api";
import { useReactToPrint } from "react-to-print";
import LoanPrint from "../components/LoanPrint";
import UndanganPrint from "../components/UndanganPrint";

const PrintSurat = () => {
  const [jenisSurat, setJenisSurat] = useState("peminjaman");
  const [inventories, setInventories] = useState([]);
  const [cart, setCart] = useState([]);
  const [header, setHeader] = useState({
    borrowerName: "",
    loanDate: new Date().toISOString().split("T")[0],
    returnDate: "",
  });

  const [undanganData, setUndanganData] = useState({
    noSurat: "",
    hariTanggal: "",
    waktu: "",
    tempat: "",
    acara: "",
  });

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef: componentRef });

  useEffect(() => {
    api.get("/inventories").then((res) => setInventories(res.data));
  }, []);

  return (
    <AdminLayout title="Modul Print Surat">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Panel Form */}
        <div className="bg-white p-6 rounded shadow space-y-4">
          <label className="font-bold">Pilih Jenis Surat:</label>
          <select
            className="w-full p-2 border rounded mb-4"
            onChange={(e) => setJenisSurat(e.target.value)}
          >
            <option value="peminjaman">Surat Tanda Peminjaman Barang</option>
            <option value="undangan">Surat Undangan Rapat</option>
          </select>

          {/* Form Peminjaman */}
          {jenisSurat === "peminjaman" && (
            <div className="space-y-4">
              <input
                className="w-full p-2 border rounded"
                placeholder="Nama Peminjam"
                onChange={(e) =>
                  setHeader({ ...header, borrowerName: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  className="p-2 border rounded"
                  onChange={(e) =>
                    setHeader({ ...header, loanDate: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="p-2 border rounded"
                  onChange={(e) =>
                    setHeader({ ...header, returnDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                {cart.map((c, i) => (
                  <div
                    key={i}
                    className="flex gap-2 items-center bg-gray-50 p-2 rounded"
                  >
                    <select
                      className="w-1/3 p-1 border text-sm"
                      value={c.name}
                      onChange={(e) => {
                        const nc = [...cart];
                        nc[i].name = e.target.value;
                        setCart(nc);
                      }}
                    >
                      <option value="">Pilih Barang</option>
                      {inventories.map((inv) => (
                        <option key={inv._id} value={inv.name}>
                          {inv.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      className="w-16 p-1 border text-sm"
                      placeholder="Jml"
                      value={c.qty}
                      onChange={(e) => {
                        const nc = [...cart];
                        nc[i].qty = e.target.value;
                        setCart(nc);
                      }}
                    />
                    <input
                      className="flex-1 p-1 border text-sm"
                      placeholder="Ket"
                      value={c.desc}
                      onChange={(e) => {
                        const nc = [...cart];
                        nc[i].desc = e.target.value;
                        setCart(nc);
                      }}
                    />
                    <button
                      onClick={() =>
                        setCart(cart.filter((_, idx) => idx !== i))
                      }
                      className="text-red-500 font-bold"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  setCart([...cart, { name: "", qty: 1, desc: "" }])
                }
                className="w-full bg-green-600 text-white py-1 rounded text-sm"
              >
                + Tambah Item Barang
              </button>
              <button
                onClick={handlePrint}
                className="w-full bg-purple-600 text-white py-2 rounded"
              >
                Cetak Peminjaman
              </button>
            </div>
          )}

          {/* Form Undangan */}
          {jenisSurat === "undangan" && (
            <div className="space-y-3">
              <input
                className="w-full p-2 border rounded"
                placeholder="Nomor Surat"
                onChange={(e) =>
                  setUndanganData({ ...undanganData, noSurat: e.target.value })
                }
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Hari / Tanggal"
                onChange={(e) =>
                  setUndanganData({
                    ...undanganData,
                    hariTanggal: e.target.value,
                  })
                }
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Waktu"
                onChange={(e) =>
                  setUndanganData({ ...undanganData, waktu: e.target.value })
                }
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Tempat"
                onChange={(e) =>
                  setUndanganData({ ...undanganData, tempat: e.target.value })
                }
              />
              <textarea
                className="w-full p-2 border rounded"
                placeholder="Acara"
                onChange={(e) =>
                  setUndanganData({ ...undanganData, acara: e.target.value })
                }
              />
              <button
                onClick={handlePrint}
                className="w-full bg-purple-600 text-white py-2 rounded"
              >
                Cetak Undangan
              </button>
            </div>
          )}
        </div>

        {/* Preview Container */}
        <div className="bg-gray-200 p-4 rounded overflow-auto h-[600px] flex justify-center">
          <div
            className="bg-white shadow-lg p-2 origin-top"
            style={{
              transform:
                jenisSurat === "peminjaman" ? "scale(0.6)" : "scale(0.8)",
              width: jenisSurat === "peminjaman" ? "210mm" : "148mm", // A4 untuk Pinjam, A5 untuk Undangan
            }}
          >
            {jenisSurat === "peminjaman" ? (
              <LoanPrint ref={componentRef} data={{ ...header, items: cart }} />
            ) : (
              <UndanganPrint ref={componentRef} data={undanganData} />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default PrintSurat;
