import { useState } from "react";
import { Link } from "react-router-dom";
import { Stethoscope, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "../services/api";

export default function DoctorRegister() {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    hospitalName: "",
    hospitalId: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSuccess("");
    setError("");

    const {
      name,
      specialization,
      hospitalName,
      hospitalId,
      email,
    } = formData;

    if (
      !name.trim() ||
      !specialization.trim() ||
      !hospitalName.trim() ||
      !hospitalId.trim() ||
      !email.trim()
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.registerDoctor({
        name: name.trim(),
        specialization: specialization.trim(),
        hospitalName: hospitalName.trim(),
        hospitalId: hospitalId.trim(),
        email: email.trim().toLowerCase(),
      });

      if (response.success) {
        setSuccess(response.message || "Doctor registered successfully.");

        setFormData({
          name: "",
          specialization: "",
          hospitalName: "",
          hospitalId: "",
          email: "",
        });
      } else {
        setError(response.message || "Doctor registration failed.");
      }
    } catch (err) {
      setError(
        err.message || "Something went wrong while registering the doctor."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-xl px-5 py-20">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">

        <Stethoscope className="text-emerald-400" size={32} />

        <h1 className="mt-5 text-3xl font-bold">
          Doctor registration
        </h1>

        <p className="mt-2 text-slate-400">
          Register a doctor and save the profile to MediBook.
        </p>

        {success && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-emerald-300">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0" />

            <div>
              <p className="font-semibold">Registration successful</p>
              <p className="mt-1 text-sm">
                {success}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-300">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />

            <div>
              <p className="font-semibold">Registration failed</p>
              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>
          </div>
        )}

        <form
          className="mt-8 space-y-4"
          onSubmit={handleSubmit}
        >

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-400"
            placeholder="Doctor name"
            disabled={loading}
          />

          <input
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-400"
            placeholder="Specialization"
            disabled={loading}
          />

          <input
            name="hospitalName"
            value={formData.hospitalName}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-400"
            placeholder="Hospital name"
            disabled={loading}
          />

          <input
            name="hospitalId"
            value={formData.hospitalId}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-400"
            placeholder="Hospital ID"
            disabled={loading}
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-400"
            type="email"
            placeholder="Email"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register as doctor"}
          </button>

        </form>

        <Link
          to="/"
          className="mt-5 block text-center text-sm text-slate-400 hover:text-white"
        >
          Back to home
        </Link>

      </div>
    </section>
  );
}