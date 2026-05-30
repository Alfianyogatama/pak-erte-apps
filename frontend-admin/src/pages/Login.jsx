import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Swal from "sweetalert2";
import { Lock, User } from "lucide-react";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Ganti URL ini dengan URL dari dashboard ImageKit Anda
  const LOGO_URL =
    "https://ik.imagekit.io/bonekie/image%20asset/rt-25-logo.png";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", credentials);
      localStorage.setItem("token", res.data.token);
      Swal.fire({
        icon: "success",
        title: "Berhasil Masuk!",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: "Username atau password salah",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-slate-100">
        {/* Logo Section - Load dari URL */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full shadow-md border-2 border-slate-100 bg-slate-50">
            <img
              src={LOGO_URL}
              alt="Logo RT 25"
              className="w-full h-full object-cover"
              onError={(e) => (e.target.style.display = "none")} // Sembunyikan jika gagal load
            />
          </div>
          <h1 className="text-2xl font-bold text-[#1e4a6e]">
            Halo, Ketua RT! 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Masuk ke Dashboard Ketua RT 25
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User
              className="absolute left-3 top-3.5 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1e4a6e] transition-all"
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              required
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-3 top-3.5 text-slate-400"
              size={18}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1e4a6e] transition-all"
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1e4a6e] hover:bg-[#163853] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            {loading ? "Memproses..." : "Masuk Sekarang"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
