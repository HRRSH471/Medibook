import { useEffect, useMemo, useState } from "react";
import {
  Stethoscope,
  RefreshCw,
  Search,
  LogOut,
  Database,
  Activity,
  Users,
} from "lucide-react";
import { api } from "../services/api";

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [activeTab, setActiveTab] = useState("doctors");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  async function loadData(showRefresh = false) {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [doctorResponse, patientResponse] = await Promise.all([
        api.getDoctors(),
        api.getPatients(),
      ]);

      setDoctors(doctorResponse.doctors || []);
      setPatients(patientResponse.patients || []);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredDoctors = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return doctors;
    }

    return doctors.filter((doctor) =>
      [
        doctor.name,
        doctor.specialization,
        doctor.hospitalName,
        doctor.hospitalId,
        doctor.email,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [doctors, search]);

  const filteredPatients = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) =>
      [
        patient.name,
        patient.email,
        patient.phone,
        patient.id,
        patient.gender,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [patients, search]);

  function handleTabChange(tab) {
    setActiveTab(tab);
    setSearch("");
  }

  return (
    <section className="min-h-screen bg-slate-950 px-5 py-8 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-emerald-500/10 p-3">
                <Database
                  size={25}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  Admin Dashboard
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  MediBook database management
                </p>
              </div>

            </div>
          </div>

          <div className="flex gap-3">

            {/* Refresh */}
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            {/* Logout */}
            <button
              className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/20"
            >
              <LogOut size={17} />
              Logout
            </button>

          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <StatCard
            title="Total Doctors"
            value={doctors.length}
            icon={<Stethoscope size={22} />}
          />

          <StatCard
            title="Total Patients"
            value={patients.length}
            icon={<Users size={22} />}
          />

          <StatCard
            title="Database Status"
            value={error ? "Error" : "Online"}
            icon={<Activity size={22} />}
          />

        </div>

        {/* Tabs */}
        <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] p-2">

          <div className="flex flex-wrap gap-2">

            <button
              onClick={() => handleTabChange("doctors")}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                activeTab === "doctors"
                  ? "bg-emerald-500 text-slate-950"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Stethoscope size={18} />

              Doctors

              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTab === "doctors"
                    ? "bg-black/20"
                    : "bg-white/10"
                }`}
              >
                {doctors.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange("patients")}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                activeTab === "patients"
                  ? "bg-emerald-500 text-slate-950"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Users size={18} />

              Patients

              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTab === "patients"
                    ? "bg-black/20"
                    : "bg-white/10"
                }`}
              >
                {patients.length}
              </span>
            </button>

          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

          {/* Toolbar */}
          <div className="flex flex-col justify-between gap-4 border-b border-white/10 p-5 md:flex-row md:items-center">

            <div>
              <h2 className="text-xl font-semibold">
                {activeTab === "doctors"
                  ? "Registered Doctors"
                  : "Registered Patients"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Live data from Azure Cosmos DB
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  activeTab === "doctors"
                    ? "Search doctors..."
                    : "Search patients..."
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-emerald-400"
              />

            </div>

          </div>

          {/* Loading */}
          {loading ? (

            <div className="flex min-h-64 items-center justify-center">

              <div className="flex items-center gap-3 text-slate-400">

                <RefreshCw
                  size={20}
                  className="animate-spin"
                />

                Loading database...

              </div>

            </div>

          ) : activeTab === "doctors" ? (

            filteredDoctors.length === 0 ? (

              <EmptyState text="No doctors found." />

            ) : (

              <DoctorTable doctors={filteredDoctors} />

            )

          ) : (

            filteredPatients.length === 0 ? (

              <EmptyState text="No patients found." />

            ) : (

              <PatientTable patients={filteredPatients} />

            )

          )}

        </div>

      </div>
    </section>
  );
}


/* -------------------------------- */
/* Stat Card */
/* -------------------------------- */

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <div className="mb-5 flex items-center justify-between">

        <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-400">
          {icon}
        </div>

      </div>

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}


/* -------------------------------- */
/* Doctor Table */
/* -------------------------------- */

function DoctorTable({ doctors }) {
  return (
    <div className="overflow-x-auto">

      <table className="w-full min-w-[900px] text-left">

        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">

            <th className="px-5 py-4">
              Doctor
            </th>

            <th className="px-5 py-4">
              Specialization
            </th>

            <th className="px-5 py-4">
              Hospital
            </th>

            <th className="px-5 py-4">
              Hospital ID
            </th>

            <th className="px-5 py-4">
              Email
            </th>

            <th className="px-5 py-4">
              Created
            </th>

          </tr>
        </thead>

        <tbody>

          {doctors.map((doctor) => (

            <tr
              key={doctor.id}
              className="border-b border-white/5 transition hover:bg-white/[0.04]"
            >

              <td className="px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10 font-semibold text-emerald-400">
                    {doctor.name?.charAt(0)?.toUpperCase() || "D"}
                  </div>

                  <div>

                    <p className="font-medium">
                      {doctor.name || "-"}
                    </p>

                    <p className="text-xs text-slate-500">
                      ID: {doctor.id || "-"}
                    </p>

                  </div>

                </div>

              </td>

              <td className="px-5 py-4 text-sm text-slate-300">
                {doctor.specialization || "-"}
              </td>

              <td className="px-5 py-4 text-sm text-slate-300">
                {doctor.hospitalName || "-"}
              </td>

              <td className="px-5 py-4">

                <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-400">
                  {doctor.hospitalId || "-"}
                </span>

              </td>

              <td className="px-5 py-4 text-sm text-slate-400">
                {doctor.email || "-"}
              </td>

              <td className="px-5 py-4 text-xs text-slate-500">
                {formatDate(doctor.createdAt)}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}


/* -------------------------------- */
/* Patient Table */
/* -------------------------------- */

function PatientTable({ patients }) {
  return (
    <div className="overflow-x-auto">

      <table className="w-full min-w-[850px] text-left">

        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">

            <th className="px-5 py-4">
              Patient
            </th>

            <th className="px-5 py-4">
              Email
            </th>

            <th className="px-5 py-4">
              Phone
            </th>

            <th className="px-5 py-4">
              Gender
            </th>

            <th className="px-5 py-4">
              Patient ID
            </th>

            <th className="px-5 py-4">
              Created
            </th>

          </tr>
        </thead>

        <tbody>

          {patients.map((patient) => (

            <tr
              key={patient.id}
              className="border-b border-white/5 transition hover:bg-white/[0.04]"
            >

              {/* Patient */}
              <td className="px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-400/10 font-semibold text-blue-400">
                    {patient.name?.charAt(0)?.toUpperCase() || "P"}
                  </div>

                  <div>

                    <p className="font-medium">
                      {patient.name || "-"}
                    </p>

                    <p className="text-xs text-slate-500">
                      ID: {patient.id || "-"}
                    </p>

                  </div>

                </div>

              </td>

              {/* Email */}
              <td className="px-5 py-4 text-sm text-slate-400">
                {patient.email || "-"}
              </td>

              {/* Phone */}
              <td className="px-5 py-4 text-sm text-slate-300">
                {patient.phone || "-"}
              </td>

              {/* Gender */}
              <td className="px-5 py-4">

                <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-400">
                  {patient.gender || "-"}
                </span>

              </td>

              {/* Patient ID */}
              <td className="px-5 py-4">

                <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-400">
                  {patient.id || "-"}
                </span>

              </td>

              {/* Created */}
              <td className="px-5 py-4 text-xs text-slate-500">
                {formatDate(patient.createdAt)}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}


/* -------------------------------- */
/* Empty State */
/* -------------------------------- */

function EmptyState({ text }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center text-center">

      <Database
        size={35}
        className="text-slate-700"
      />

      <p className="mt-4 text-slate-500">
        {text}
      </p>

    </div>
  );
}


/* -------------------------------- */
/* Date Formatter */
/* -------------------------------- */

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}