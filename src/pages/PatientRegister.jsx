import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HeartPulse,
  CalendarCheck,
  Stethoscope,
} from "lucide-react";
import { api } from "../services/api";

export default function PatientRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    // Only allow numbers in phone field
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");

      setForm((prev) => ({
        ...prev,
        phone: numericValue,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setError("");
    setSuccess("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setLoading(true);

      await api.registerPatient({
        name,
        email,
        phone,
      });

      setSuccess("Patient account created successfully.");

      setForm({
        name: "",
        email: "",
        phone: "",
      });
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Unable to create patient account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* ================================= */}
      {/* Background */}
      {/* ================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.03] blur-[100px]" />

      </div>

      {/* ================================= */}
      {/* Main Container */}
      {/* ================================= */}

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 py-10 sm:px-8 lg:px-10">

        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-20">

          {/* ================================= */}
          {/* HERO SIDE */}
          {/* ================================= */}

          <div className="hidden lg:block">

            {/* Logo */}
            <div className="mb-8 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 shadow-lg shadow-emerald-500/10">

                <HeartPulse
                  size={25}
                  className="text-emerald-400"
                />

              </div>

              <div>

                <p className="text-xl font-bold">
                  Medi<span className="text-emerald-400">Book</span>
                </p>

                <p className="text-xs text-slate-500">
                  Smarter healthcare
                </p>

              </div>

            </div>

            {/* Hero Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-sm text-emerald-300">

              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />

              Your healthcare journey starts here

            </div>

            {/* Hero Heading */}
            <div className="max-w-xl">

              <h1 className="text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">

                Healthcare made

                <span className="block text-emerald-400">
                  simple.
                </span>

              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                Create your MediBook patient account and make it easier
                to discover doctors, manage appointments, and stay
                connected with your healthcare.
              </p>

            </div>

            {/* Feature Cards */}
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">

              <Feature
                icon={<Stethoscope size={19} />}
                title="Find Doctors"
                text="Discover specialists"
              />

              <Feature
                icon={<CalendarCheck size={19} />}
                title="Book Easily"
                text="Manage appointments"
              />

              <Feature
                icon={<ShieldCheck size={19} />}
                title="Secure"
                text="Your data matters"
              />

            </div>

            {/* Bottom Information Card */}
            <div className="relative mt-10 max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6">

              <div className="absolute right-[-40px] top-[-40px] h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl" />

              <div className="relative flex items-center gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10">

                  <HeartPulse
                    size={22}
                    className="text-emerald-400"
                  />

                </div>

                <div>

                  <p className="font-semibold">
                    Better care starts with better access.
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    One account for your MediBook healthcare experience.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ================================= */}
          {/* FORM SIDE */}
          {/* ================================= */}

          <div className="mx-auto w-full max-w-lg">

            {/* Mobile Brand */}
            <div className="mb-7 text-center lg:hidden">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 shadow-lg shadow-emerald-500/10">

                <HeartPulse
                  size={27}
                  className="text-emerald-400"
                />

              </div>

              <p className="mt-4 text-xl font-bold">
                Medi<span className="text-emerald-400">Book</span>
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Smarter healthcare
              </p>

            </div>

            {/* Form Card */}
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">

              {/* Form Header */}
              <div className="mb-7">

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10">

                  <UserRound
                    size={22}
                    className="text-emerald-400"
                  />

                </div>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  Create patient account
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enter your details below to get started with MediBook.
                </p>

              </div>

          

              {/* Error */}
              {error && (
                <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-5 text-red-300">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm leading-5 text-emerald-300">

                  <CheckCircle2
                    size={18}
                    className="shrink-0"
                  />

                  <span>
                    {success}
                  </span>

                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* ============================= */}
                {/* Name */}
                {/* ============================= */}

                <FormField
                  label="Full name"
                  icon={<UserRound size={18} />}
                >

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    type="text"
                    autoComplete="name"
                    placeholder="Rahul Sharma"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 py-4 pl-12 pr-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-600 hover:border-white/20 focus:border-emerald-400/60 focus:bg-slate-950 focus:ring-4 focus:ring-emerald-400/10"
                  />

                </FormField>

                {/* ============================= */}
                {/* Email */}
                {/* ============================= */}

                <FormField
                  label="Email address"
                  icon={<Mail size={18} />}
                >

                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    autoComplete="email"
                    placeholder="rahul.sharma@gmail.com"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 py-4 pl-12 pr-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-600 hover:border-white/20 focus:border-emerald-400/60 focus:bg-slate-950 focus:ring-4 focus:ring-emerald-400/10"
                  />

                </FormField>

                {/* ============================= */}
                {/* Phone */}
                {/* ============================= */}

                <FormField
                  label="Phone number"
                  icon={<Phone size={18} />}
                >

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 py-4 pl-12 pr-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-600 hover:border-white/20 focus:border-emerald-400/60 focus:bg-slate-950 focus:ring-4 focus:ring-emerald-400/10"
                  />

                  <p className="mt-2 text-xs text-slate-600">
                    Enter your 10-digit mobile number.
                  </p>

                </FormField>

                {/* ============================= */}
                {/* Submit */}
                {/* ============================= */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />

                      Creating account...
                    </>
                  ) : (
                    <>
                      Create patient account

                      <ArrowRight
                        size={18}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </>
                  )}

                </button>

              </form>

              {/* Footer */}
              <div className="mt-7 border-t border-white/10 pt-6 text-center">

                <p className="text-sm text-slate-500">
                  Already have an account?
                </p>

                <Link
                  to="/"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
                >
                  Back to home

                  <ArrowRight size={15} />

                </Link>

              </div>

            </div>

            {/* Disclaimer */}
            <p className="mt-5 text-center text-xs leading-5 text-slate-600">
              By creating an account, you agree to use MediBook responsibly.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}


/* ================================= */
/* Feature Card */
/* ================================= */

function Feature({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-white/[0.05]">

      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
        {icon}
      </div>

      <p className="text-sm font-semibold text-slate-200">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-600">
        {text}
      </p>

    </div>
  );
}


/* ================================= */
/* Form Field */
/* ================================= */

function FormField({ label, icon, children }) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <div className="relative">

        <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500">
          {icon}
        </div>

        {children}

      </div>

    </div>
  );
}