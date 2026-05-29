// frontend-admin/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Inventory from "./pages/Inventory.jsx";
import Kas from "./pages/Kas.jsx"; // 1. Pastikan sudah di-import
import Warga from "./pages/Warga.jsx";
import Informasi from "./pages/Informasi.jsx";
import PrintSurat from "./pages/PrintSurat";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      {/* 2. Semua Route HARUS berada di dalam tag <Routes> ini */}
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />

        {/* 3. Route Kas dimasukkan ke sini, SEBELUM penutup </Routes> */}
        <Route
          path="/kas"
          element={
            <ProtectedRoute>
              <Kas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warga"
          element={
            <ProtectedRoute>
              <Warga />
            </ProtectedRoute>
          }
        />
        <Route
          path="/informasi"
          element={
            <ProtectedRoute>
              <Informasi />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Routes>
        <Route
          path="/print-surat"
          element={
            <ProtectedRoute>
              <PrintSurat />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
