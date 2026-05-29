import React, { forwardRef } from "react";

const UndanganPrint = forwardRef(({ data }, ref) => {
  return (
    <>
      {/* CSS khusus untuk memaksa cetakan menjadi A5 */}
      <style type="text/css" media="print">
        {`
          @page {
            size: A5;
            margin: 10mm;
          }
        `}
      </style>

      <div
        ref={ref}
        className="p-6 font-serif text-black flex flex-col"
        style={{ width: "148mm", minHeight: "210mm" }}
      >
        {/* KOP SURAT */}
        <div className="text-center mb-6 border-b-4 border-double border-black pb-2">
          <h2 className="font-bold text-lg uppercase leading-tight">
            Pengurus RT 25
          </h2>
          <h2 className="font-bold text-lg uppercase leading-tight">
            Pedukuhan 07 Ngunan Unan
          </h2>
        </div>

        {/* NOMOR & PERIHAL */}
        <div className="mb-6 text-sm">
          <p>
            No &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :{" "}
            {data?.noSurat || "..................."}
          </p>
          <p>Perihal : Undangan</p>
        </div>

        {/* TUJUAN */}
        <div className="mb-6 text-sm">
          <p>Kepada Yth :</p>
          <p className="font-bold">Bpk / Ibu / Sdr</p>
          <p>Di tempat</p>
        </div>

        {/* ISI SURAT */}
        <div className="text-sm space-y-3 mb-6">
          <p className="italic font-bold">Assalamu’alaikum Wr. Wb.</p>
          <p>
            Dengan hormat, mengharap kehadiran Bpk/Ibu/Sdr pada pertemuan yang
            akan dilaksanakan pada:
          </p>

          <div className="ml-4 space-y-1">
            <p>
              Hari / Tanggal :{" "}
              <span className="font-bold">
                {data?.hariTanggal || "..................."}
              </span>
            </p>
            <p>
              Waktu &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
              <span className="font-bold">
                {data?.waktu || "..................."}
              </span>
            </p>
            <p>
              Tempat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
              <span className="font-bold">
                {data?.tempat || "..................."}
              </span>
            </p>
            <p>
              Acara
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
              <span className="font-bold">
                {data?.acara || "..................."}
              </span>
            </p>
          </div>

          <p>
            Demikian undangan ini kami buat, atas perhatian dan kehadiran
            Bpk/Ibu/Sdr kami ucapkan terima kasih.
          </p>
          <p className="italic font-bold">Wassalamu’alaikum Wr. Wb.</p>
        </div>

        {/* TANDA TANGAN (Selalu di bawah karena flex-grow) */}
        <div className="flex-grow flex flex-col justify-end">
          <div className="flex justify-end">
            <div className="text-center text-sm">
              <p>Ketua RT 25</p>
              <br />
              <br />
              <br />
              <br />
              <p className="font-bold underline">Sumardi</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default UndanganPrint;
