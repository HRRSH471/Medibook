import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import PatientRegister from "./pages/PatientRegister";
import DoctorRegister from "./pages/DoctorRegister";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/patient/register"
            element={<PatientRegister />}
          />

          <Route
            path="/doctor/register"
            element={<DoctorRegister />}
          />

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}