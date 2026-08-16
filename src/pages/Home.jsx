import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HeartPulse,
  Hospital,
  ShieldCheck,
  Stethoscope,
  UserRound,
  UsersRound,
} from "lucide-react";

const hospitals = [
  {
    name: "CityCare Hospital",
    location: "Mumbai, Maharashtra",
    specialty: "Multi-Specialty Care",
    doctors: "48+",
  },
  {
    name: "Apollo Heights",
    location: "Pune, Maharashtra",
    specialty: "Advanced Medical Care",
    doctors: "35+",
  },
  {
    name: "LifeSpring Medical Center",
    location: "Nashik, Maharashtra",
    specialty: "General & Specialty Care",
    doctors: "27+",
  },
];

const services = [
  {
    icon: Hospital,
    title: "Find the right hospital",
    description:
      "Explore hospitals, specialties and available doctors from one centralized platform.",
  },
  {
    icon: Stethoscope,
    title: "Choose your doctor",
    description:
      "Review doctor profiles, specialties and availability before booking your appointment.",
  },
  {
    icon: CalendarCheck2,
    title: "Book with confidence",
    description:
      "Select an available slot, confirm your appointment and keep your booking details organized.",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose a hospital",
    description:
      "Browse hospitals and find the healthcare facility that matches your requirements.",
  },
  {
    number: "02",
    title: "Select a doctor",
    description:
      "Explore doctors by specialty and check their available appointment slots.",
  },
  {
    number: "03",
    title: "Book your appointment",
    description:
      "Choose a convenient time and receive instant appointment confirmation.",
  },
];

const benefits = [
  "Centralized hospital and doctor discovery",
  "Simple appointment scheduling",
  "Digital appointment confirmation",
  "Dedicated doctor appointment dashboard",
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative isolate border-b border-white/10 bg-slate-950">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />
          <div className="absolute right-[-200px] top-[250px] h-[450px] w-[450px] rounded-full bg-cyan-500/5 blur-[120px]" />
        </div>

        <div className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-60" />

        <div className="mx-auto grid max-w-7xl gap-16 px-5 pb-20 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-28 lg:pt-24">
          {/* Left */}
          <div className="flex flex-col justify-center">
            <div className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-sm font-medium text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              Smarter healthcare appointments
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Healthcare access,
              <span className="block text-emerald-400">
                made simpler.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              MediBook helps patients discover hospitals, find the right
              doctors and book appointments through one simple healthcare
              platform.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/patient/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/10 hover:bg-emerald-400"
              >
                Find a doctor
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/doctor/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white hover:border-white/20 hover:bg-white/[0.07]"
              >
                Join as a doctor
                <ArrowUpRight size={17} className="text-slate-400" />
              </Link>
            </div>

            {/* Trust */}
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-400" />
                Easy appointment booking
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-400" />
                Digital confirmations
              </div>
            </div>
          </div>

          {/* Right dashboard preview */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="absolute -inset-10 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative w-full max-w-lg rounded-[28px] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="rounded-[22px] border border-white/10 bg-slate-900/95 p-5">
                {/* Top bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Patient dashboard
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-white">
                      Good morning, Alex
                    </h2>
                  </div>

                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-400">
                    <HeartPulse size={20} />
                  </div>
                </div>

                {/* Appointment */}
                <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-medium text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Upcoming appointment
                      </div>

                      <h3 className="mt-4 text-xl font-bold text-white">
                        Dr. Ananya Sharma
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        Cardiologist · CityCare Hospital
                      </p>
                    </div>

                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/5 text-emerald-400">
                      <Stethoscope size={20} />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3.5">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CalendarCheck2 size={14} />
                        Date
                      </div>
                      <p className="mt-2 text-sm font-semibold text-white">
                        12 Sep 2026
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3.5">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock3 size={14} />
                        Time
                      </div>
                      <p className="mt-2 text-sm font-semibold text-white">
                        10:30 AM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <Hospital size={18} className="text-slate-400" />
                    <p className="mt-3 text-xl font-bold text-white">120+</p>
                    <p className="mt-1 text-xs text-slate-500">Hospitals</p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <Stethoscope size={18} className="text-slate-400" />
                    <p className="mt-3 text-xl font-bold text-white">850+</p>
                    <p className="mt-1 text-xs text-slate-500">Doctors</p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <UsersRound size={18} className="text-slate-400" />
                    <p className="mt-3 text-xl font-bold text-white">12K+</p>
                    <p className="mt-1 text-xs text-slate-500">Patients</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-400/10 text-emerald-400">
                    <ShieldCheck size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Appointment confirmed
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Your booking is safely recorded
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================== */}
      <section className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto grid max-w-7xl divide-y divide-white/10 px-5 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:px-8">
          {[
            ["120+", "Hospitals"],
            ["850+", "Healthcare professionals"],
            ["12K+", "Patients served"],
            ["24/7", "Platform availability"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="px-5 py-8 text-center sm:py-9"
            >
              <p className="text-3xl font-black tracking-tight text-white">
                {value}
              </p>
              <p className="mt-2 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          SERVICES
      ========================================================== */}
      <section
        id="services"
        className="border-b border-white/10 bg-slate-900/30"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
              One platform
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need to manage an appointment.
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              From discovering a hospital to receiving your appointment
              confirmation, MediBook keeps the entire booking journey simple.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 hover:border-emerald-400/20 hover:bg-white/[0.05]"
                >
                  <div className="absolute right-5 top-5 text-xs font-bold text-slate-700">
                    0{index + 1}
                  </div>

                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-400/10 text-emerald-400">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-7 text-xl font-semibold text-white">
                    {service.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {service.description}
                  </p>

                  <div className="mt-6 flex items-center gap-1 text-sm font-medium text-emerald-400">
                    Learn more
                    <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================== */}
      <section
        id="how-it-works"
        className="border-b border-white/10 bg-slate-950"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
              Simple workflow
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Book an appointment in three steps.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
              No complicated process. Find your hospital, select your doctor
              and choose a convenient appointment slot.
            </p>
          </div>

          <div className="relative mt-14 grid gap-6 md:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-9 hidden border-t border-dashed border-white/10 md:block" />

            {steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-white/10 bg-slate-950 p-7"
              >
                <div className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-emerald-400/20 bg-slate-900 text-sm font-bold text-emerald-400">
                  {step.number}
                </div>

                <h3 className="mt-7 text-xl font-semibold text-white">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          HOSPITALS
      ========================================================== */}
      <section
        id="hospitals"
        className="border-b border-white/10 bg-slate-900/30"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                Healthcare network
              </span>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Explore hospitals and specialists.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                Discover healthcare facilities and the doctors available
                through the MediBook platform.
              </p>
            </div>

            <Link
              to="/patient/register"
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Explore hospitals
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {hospitals.map((hospital) => (
              <div
                key={hospital.name}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-950 hover:border-emerald-400/20"
              >
                {/* Hospital image placeholder */}
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-emerald-500/10 via-slate-900 to-cyan-500/10">
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-emerald-400 backdrop-blur">
                      <Hospital size={30} />
                    </div>
                  </div>

                  <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur">
                    Verified facility
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {hospital.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {hospital.location}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={18}
                      className="text-slate-600 transition-colors group-hover:text-emerald-400"
                    />
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                    <div>
                      <p className="text-xs text-slate-500">Specialization</p>
                      <p className="mt-1 text-sm font-medium text-slate-300">
                        {hospital.specialty}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-500">Doctors</p>
                      <p className="mt-1 text-sm font-semibold text-emerald-400">
                        {hospital.doctors}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          PATIENT / DOCTOR
      ========================================================== */}
      <section className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          {/* Patient */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-8 sm:p-10">
            <div className="absolute right-[-80px] top-[-80px] h-52 w-52 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-400/10 text-emerald-400">
                <UserRound size={24} />
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                For patients
              </p>

              <h2 className="mt-3 max-w-md text-3xl font-bold tracking-tight text-white">
                Your next appointment starts here.
              </h2>

              <p className="mt-4 max-w-lg leading-7 text-slate-400">
                Find hospitals, compare doctors and book appointments without
                unnecessary complexity.
              </p>

              <Link
                to="/patient/register"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400"
              >
                Start as a patient
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          {/* Doctor */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10">
            <div className="absolute right-[-80px] top-[-80px] h-52 w-52 rounded-full bg-cyan-400/5 blur-3xl" />

            <div className="relative">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/5 text-emerald-400">
                <Stethoscope size={24} />
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                For doctors
              </p>

              <h2 className="mt-3 max-w-md text-3xl font-bold tracking-tight text-white">
                Manage your appointments in one place.
              </h2>

              <p className="mt-4 max-w-lg leading-7 text-slate-400">
                Build your professional profile and get a dedicated view of
                upcoming patient appointments.
              </p>

              <Link
                to="/doctor/register"
                className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Register as a doctor
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BENEFITS
      ========================================================== */}
      <section className="border-b border-white/10 bg-slate-900/30">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
              Designed around people
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              A cleaner healthcare booking experience.
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-slate-400">
              MediBook brings patients, doctors and hospitals into a single
              workflow so everyone has the information they need.
            </p>

            <div className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 text-sm text-slate-300"
                >
                  <CheckCircle2
                    size={19}
                    className="shrink-0 text-emerald-400"
                  />
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950 p-6 sm:p-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-400/10 text-emerald-400">
                  <ShieldCheck size={23} />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    Booking confirmation
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Appointment successfully created
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-4">
                {[
                  ["Patient", "Alex Johnson"],
                  ["Doctor", "Dr. Ananya Sharma"],
                  ["Hospital", "CityCare Hospital"],
                  ["Appointment", "12 Sep 2026 · 10:30 AM"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-5 border-b border-white/10 pb-4 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-slate-500">{label}</span>
                    <span className="text-right text-sm font-medium text-white">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-emerald-400/10 p-4 text-center text-sm font-semibold text-emerald-300">
                Appointment confirmed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================== */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center lg:py-28">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
            <HeartPulse size={27} />
          </div>

          <h2 className="mt-7 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Take the next step toward
            <span className="block text-emerald-400">
              simpler healthcare.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
            Find a hospital, choose your doctor and book your appointment with
            MediBook.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/patient/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-emerald-400"
            >
              Get started
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/doctor/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/[0.07]"
            >
              Join as a doctor
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}