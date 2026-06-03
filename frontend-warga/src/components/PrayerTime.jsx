import React, { useState, useEffect } from "react";
import { apiShalat } from "../utils/api";

const PrayerTime = () => {
  const [jadwal, setJadwal] = useState(null);
  const [activePrayer, setActivePrayer] = useState(null);

  useEffect(() => {
    const fetchJadwal = async () => {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      try {
        const response = await apiShalat.post("/shalat", {
          provinsi: "D.I. Yogyakarta",
          kabkota: "Kab. Bantul",
          bulan: month,
          tahun: year,
        });

        // Ambil jadwal hari ini (tanggal sekarang)
        const hariIni = response.data.data.jadwal.find(
          (item) => item.tanggal === now.getDate(),
        );
        setJadwal(hariIni);
      } catch (error) {
        console.error("Gagal ambil jadwal:", error);
      }
    };

    fetchJadwal();
  }, []);

  useEffect(() => {
    if (!jadwal) return;

    const checkPrayerTime = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const prayers = [
        { name: "Subuh", time: jadwal.subuh },
        { name: "Dzuhur", time: jadwal.dzuhur },
        { name: "Ashar", time: jadwal.ashar },
        { name: "Maghrib", time: jadwal.maghrib },
        { name: "Isya", time: jadwal.isya },
      ];

      const parsedPrayers = prayers.map((p) => {
        const [h, m] = p.time.split(":").map(Number);
        return { ...p, minutes: h * 60 + m };
      });

      const current = parsedPrayers.find((p, i) => {
        const next = parsedPrayers[i + 1];
        return (
          currentTime >= p.minutes && (!next || currentTime < next.minutes)
        );
      });

      setActivePrayer(current ? current.name : "Isya");
    };

    checkPrayerTime();
    const interval = setInterval(checkPrayerTime, 60000);
    return () => clearInterval(interval);
  }, [jadwal]);

  if (!jadwal)
    return <div className="animate-pulse bg-slate-200 h-32 rounded-3xl"></div>;

  return (
    <div className="bg-gradient-to-br from-[#1e4a6e] to-[#2d6a9f] p-6 rounded-3xl text-white shadow-lg border border-white/10 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold">Jadwal Shalat</h3>
          <p className="text-blue-200 text-xs">
            {jadwal.hari}, {jadwal.tanggal_lengkap}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {[
          { name: "Subuh", time: jadwal.subuh },
          { name: "Dzuhur", time: jadwal.dzuhur },
          { name: "Ashar", time: jadwal.ashar },
          { name: "Maghrib", time: jadwal.maghrib },
          { name: "Isya", time: jadwal.isya },
        ].map((prayer) => {
          const isActive = activePrayer === prayer.name;
          return (
            <div
              key={prayer.name}
              className={`flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? "bg-yellow-400 text-[#1e4a6e] shadow-lg scale-105" : "bg-white/10 text-white"}`}
            >
              <span className="text-[9px] uppercase font-bold opacity-80">
                {prayer.name}
              </span>
              <span className="text-xs font-bold mt-0.5">{prayer.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrayerTime;
