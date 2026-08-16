import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Building2,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  FileText,
  Filter,
  HeartPulse,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
  X,
  XCircle,
} from "lucide-react";

import { api } from "../services/api";

/* =========================================================
   CONSTANTS
========================================================= */

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  "All",
  "Scheduled",
  "Confirmed",
  "Completed",
  "Cancelled",
  "Pending",
];

/* =========================================================
   COMPONENT
========================================================= */

export default function AllAppointments() {
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =======================================================
     SEARCH / FILTER
  ======================================================= */

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [doctorFilter, setDoctorFilter] = useState("All");
  const [hospitalFilter, setHospitalFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [sortField, setSortField] = useState("appointmentDate");
  const [sortDirection, setSortDirection] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);

  /* =======================================================
     DETAIL MODAL
  ======================================================= */

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  /* =======================================================
     LOAD
  ======================================================= */

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);
      setError("");

      if (
        !api ||
        typeof api.getAppointments !== "function"
      ) {
        throw new Error(
          "Appointments API is not configured. Please check services/api.js."
        );
      }

      const response = await api.getAppointments();

      const normalized = normalizeAppointments(response);

      setAppointments(normalized);
    } catch (err) {
      console.error(
        "Failed to load appointments:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Unable to load appointments."
        )
      );

      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    try {
      setRefreshing(true);
      setError("");
      setSuccess("");

      await loadAppointments();

      setSuccess(
        "Appointments refreshed successfully."
      );
    } finally {
      setRefreshing(false);
    }
  }

  /* =======================================================
     NORMALIZED DATA
  ======================================================= */

  const normalizedAppointments = useMemo(() => {
    return appointments.map(
      (appointment, index) =>
        normalizeAppointment(
          appointment,
          index
        )
    );
  }, [appointments]);

  /* =======================================================
     UNIQUE DOCTORS
  ======================================================= */

  const doctors = useMemo(() => {
    const values = normalizedAppointments
      .map(
        (appointment) =>
          appointment.doctorName
      )
      .filter(Boolean);

    return [...new Set(values)].sort(
      (a, b) =>
        a.localeCompare(b)
    );
  }, [normalizedAppointments]);

  /* =======================================================
     UNIQUE HOSPITALS
  ======================================================= */

  const hospitals = useMemo(() => {
    const values = normalizedAppointments
      .map(
        (appointment) =>
          appointment.hospitalName
      )
      .filter(Boolean);

    return [...new Set(values)].sort(
      (a, b) =>
        a.localeCompare(b)
    );
  }, [normalizedAppointments]);

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    const total =
      normalizedAppointments.length;

    const scheduled =
      normalizedAppointments.filter(
        (item) =>
          item.status === "Scheduled"
      ).length;

    const confirmed =
      normalizedAppointments.filter(
        (item) =>
          item.status === "Confirmed"
      ).length;

    const completed =
      normalizedAppointments.filter(
        (item) =>
          item.status === "Completed"
      ).length;

    const cancelled =
      normalizedAppointments.filter(
        (item) =>
          item.status === "Cancelled"
      ).length;

    const pending =
      normalizedAppointments.filter(
        (item) =>
          item.status === "Pending"
      ).length;

    return {
      total,
      scheduled,
      confirmed,
      completed,
      cancelled,
      pending,
    };
  }, [normalizedAppointments]);

  /* =======================================================
     FILTERED
  ======================================================= */

  const filteredAppointments = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    let result =
      normalizedAppointments.filter(
        (appointment) => {
          /* SEARCH */

          if (query) {
            const searchable = [
              appointment.appointmentId,
              appointment.patientId,
              appointment.patientName,
              appointment.patientEmail,
              appointment.patientPhone,
              appointment.doctorId,
              appointment.doctorName,
              appointment.specialization,
              appointment.hospitalId,
              appointment.hospitalName,
              appointment.reason,
              appointment.status,
              appointment.appointmentDate,
              appointment.appointmentTime,
            ]
              .join(" ")
              .toLowerCase();

            if (
              !searchable.includes(query)
            ) {
              return false;
            }
          }

          /* STATUS */

          if (
            statusFilter !== "All" &&
            appointment.status !==
              statusFilter
          ) {
            return false;
          }

          /* DOCTOR */

          if (
            doctorFilter !== "All" &&
            appointment.doctorName !==
              doctorFilter
          ) {
            return false;
          }

          /* HOSPITAL */

          if (
            hospitalFilter !== "All" &&
            appointment.hospitalName !==
              hospitalFilter
          ) {
            return false;
          }

          /* DATE */

          if (
            dateFilter &&
            appointment.appointmentDate !==
              dateFilter
          ) {
            return false;
          }

          return true;
        }
      );

    /* SORT */

    result.sort((a, b) => {
      let first = "";
      let second = "";

      if (
        sortField ===
        "appointmentDate"
      ) {
        first =
          `${a.appointmentDate} ${a.appointmentTime}`;
        second =
          `${b.appointmentDate} ${b.appointmentTime}`;
      } else if (
        sortField === "patientName"
      ) {
        first = a.patientName;
        second = b.patientName;
      } else if (
        sortField === "doctorName"
      ) {
        first = a.doctorName;
        second = b.doctorName;
      } else if (
        sortField === "hospitalName"
      ) {
        first = a.hospitalName;
        second = b.hospitalName;
      } else if (
        sortField === "status"
      ) {
        first = a.status;
        second = b.status;
      }

      const comparison =
        String(first)
          .toLowerCase()
          .localeCompare(
            String(second)
              .toLowerCase()
          );

      return sortDirection === "asc"
        ? comparison
        : -comparison;
    });

    return result;
  }, [
    normalizedAppointments,
    search,
    statusFilter,
    doctorFilter,
    hospitalFilter,
    dateFilter,
    sortField,
    sortDirection,
  ]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredAppointments.length /
        PAGE_SIZE
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedAppointments =
    filteredAppointments.slice(
      (safeCurrentPage - 1) *
        PAGE_SIZE,
      safeCurrentPage *
        PAGE_SIZE
    );

  /* =======================================================
     PAGE RESET WHEN FILTER CHANGES
  ======================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    doctorFilter,
    hospitalFilter,
    dateFilter,
  ]);

  /* =======================================================
     SORT
  ======================================================= */

  function handleSort(field) {
    if (sortField === field) {
      setSortDirection(
        (previous) =>
          previous === "asc"
            ? "desc"
            : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
    setDoctorFilter("All");
    setHospitalFilter("All");
    setDateFilter("");
    setCurrentPage(1);
  }

  const hasActiveFilters =
    Boolean(search) ||
    statusFilter !== "All" ||
    doctorFilter !== "All" ||
    hospitalFilter !== "All" ||
    Boolean(dateFilter);

  /* =======================================================
     CSV EXPORT
  ======================================================= */

  function exportCSV() {
    if (
      filteredAppointments.length === 0
    ) {
      setError(
        "There are no appointments to export."
      );
      return;
    }

    const headers = [
      "Appointment ID",
      "Patient ID",
      "Patient Name",
      "Patient Email",
      "Patient Phone",
      "Doctor ID",
      "Doctor Name",
      "Specialization",
      "Hospital ID",
      "Hospital Name",
      "Appointment Date",
      "Appointment Time",
      "Status",
      "Reason",
    ];

    const rows =
      filteredAppointments.map(
        (appointment) => [
          appointment.appointmentId,
          appointment.patientId,
          appointment.patientName,
          appointment.patientEmail,
          appointment.patientPhone,
          appointment.doctorId,
          appointment.doctorName,
          appointment.specialization,
          appointment.hospitalId,
          appointment.hospitalName,
          appointment.appointmentDate,
          appointment.appointmentTime,
          appointment.status,
          appointment.reason,
        ]
      );

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(csvEscape)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download = `medibook-appointments-${getFileDate()}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setSuccess(
      `${filteredAppointments.length} appointment(s) exported successfully.`
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/[0.025] blur-[140px]" />

      </div>

      {/* ===================================================
          MAIN
      =================================================== */}

      <div className="relative mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        {/* =================================================
            HEADER
        ================================================= */}
 <div className="inline-flex items-center mb-3 gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-sm text-emerald-300">

              <CalendarCheck
                size={16}
              />

              Appointment management

            </div>
        

        {/* =================================================
            ALERTS
        ================================================= */}

        {error && (
          <AlertBox
            type="error"
            message={error}
            onClose={() =>
              setError("")
            }
          />
        )}

        {success && (
          <AlertBox
            type="success"
            message={success}
            onClose={() =>
              setSuccess("")
            }
          />
        )}

        {/* =================================================
            KPI CARDS
        ================================================= */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">

          <StatCard
            title="Total"
            value={stats.total}
            icon={
              <CalendarCheck
                size={20}
              />
            }
            color="emerald"
          />

          <StatCard
            title="Scheduled"
            value={stats.scheduled}
            icon={
              <Clock3 size={20} />
            }
            color="cyan"
          />

          <StatCard
            title="Confirmed"
            value={stats.confirmed}
            icon={
              <CheckCircle2
                size={20}
              />
            }
            color="blue"
          />

          <StatCard
            title="Completed"
            value={stats.completed}
            icon={
              <ShieldCheck
                size={20}
              />
            }
            color="violet"
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            icon={
              <Activity size={20} />
            }
            color="amber"
          />

          <StatCard
            title="Cancelled"
            value={stats.cancelled}
            icon={
              <XCircle size={20} />
            }
            color="red"
          />

        </div>

        {/* =================================================
            FILTER PANEL
        ================================================= */}

        <div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl">

          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">

                <Filter size={19} />

              </div>

              <div>

                <h2 className="text-sm font-bold text-white">
                  Search & filters
                </h2>

                <p className="text-xs text-slate-500">
                  Refine the appointment list
                </p>

              </div>

            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="inline-flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white sm:self-auto"
              >

                <X size={14} />

                Clear filters

              </button>
            )}

          </div>

          <div className="grid gap-4 xl:grid-cols-12">

            {/* SEARCH */}

            <div className="xl:col-span-4">

              <FilterLabel>
                Search
              </FilterLabel>

              <div className="relative">

                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search patient, doctor, ID, hospital..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10"
                />

              </div>

            </div>

            {/* STATUS */}

            <div className="xl:col-span-2">

              <FilterLabel>
                Status
              </FilterLabel>

              <FilterSelect
                value={
                  statusFilter
                }
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
              >

                {STATUS_OPTIONS.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}

              </FilterSelect>

            </div>

            {/* DOCTOR */}

            <div className="xl:col-span-2">

              <FilterLabel>
                Doctor
              </FilterLabel>

              <FilterSelect
                value={
                  doctorFilter
                }
                onChange={(e) =>
                  setDoctorFilter(
                    e.target.value
                  )
                }
              >

                <option value="All">
                  All doctors
                </option>

                {doctors.map(
                  (doctor) => (
                    <option
                      key={doctor}
                      value={doctor}
                    >
                      {doctor}
                    </option>
                  )
                )}

              </FilterSelect>

            </div>

            {/* HOSPITAL */}

            <div className="xl:col-span-2">

              <FilterLabel>
                Hospital
              </FilterLabel>

              <FilterSelect
                value={
                  hospitalFilter
                }
                onChange={(e) =>
                  setHospitalFilter(
                    e.target.value
                  )
                }
              >

                <option value="All">
                  All hospitals
                </option>

                {hospitals.map(
                  (hospital) => (
                    <option
                      key={hospital}
                      value={hospital}
                    >
                      {hospital}
                    </option>
                  )
                )}

              </FilterSelect>

            </div>

            {/* DATE */}

            <div className="xl:col-span-2">

              <FilterLabel>
                Appointment date
              </FilterLabel>

              <div className="relative">

                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) =>
                    setDateFilter(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3.5 pl-11 pr-3 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10"
                />

              </div>

            </div>

          </div>

          {/* FILTER SUMMARY */}

          <div className="mt-5 flex flex-col justify-between gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center">

            <p className="text-xs text-slate-500">

              Showing{" "}

              <span className="font-semibold text-slate-300">
                {filteredAppointments.length}
              </span>{" "}

              of{" "}

              <span className="font-semibold text-slate-300">
                {normalizedAppointments.length}
              </span>{" "}

              appointments

            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500">

              <span>
                Sort:
              </span>

              <select
                value={
                  sortField
                }
                onChange={(e) =>
                  setSortField(
                    e.target.value
                  )
                }
                className="rounded-lg border border-white/10 bg-slate-950 px-2 py-1.5 text-xs text-slate-300 outline-none"
              >

                <option value="appointmentDate">
                  Appointment date
                </option>

                <option value="patientName">
                  Patient
                </option>

                <option value="doctorName">
                  Doctor
                </option>

                <option value="hospitalName">
                  Hospital
                </option>

                <option value="status">
                  Status
                </option>

              </select>

              <button
                type="button"
                onClick={() =>
                  setSortDirection(
                    (previous) =>
                      previous ===
                      "asc"
                        ? "desc"
                        : "asc"
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.08] hover:text-white"
              >

                {sortDirection ===
                "asc" ? (
                  <ArrowUp
                    size={14}
                  />
                ) : (
                  <ArrowDown
                    size={14}
                  />
                )}

              </button>

            </div>

          </div>

        </div>

        {/* =================================================
            TABLE CARD
        ================================================= */}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/10 backdrop-blur-xl">

          {/* TABLE HEADER */}

          <div className="flex flex-col justify-between gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:px-6">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">

                  <CalendarCheck
                    size={19}
                  />

                </div>

                <div>

                  <h2 className="text-base font-bold text-white">
                    Appointment records
                  </h2>

                  <p className="text-xs text-slate-500">
                    Complete operational appointment view
                  </p>

                </div>

              </div>

            </div>

            <div className="flex items-center gap-2">

              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400">

                {filteredAppointments.length}{" "}
                records

              </div>

            </div>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="flex min-h-[420px] items-center justify-center">

              <div className="flex flex-col items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10">

                  <Loader2
                    size={26}
                    className="animate-spin text-emerald-400"
                  />

                </div>

                <div className="text-center">

                  <p className="text-sm font-semibold text-slate-200">
                    Loading appointments
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Fetching your appointment records...
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            filteredAppointments.length ===
              0 && (
              <EmptyState
                hasFilters={
                  hasActiveFilters
                }
                onClear={
                  clearFilters
                }
              />
            )}

          {/* DESKTOP TABLE */}

          {!loading &&
            filteredAppointments.length >
              0 && (
              <div className="hidden overflow-x-auto lg:block">

                <table className="w-full min-w-[1200px]">

                  <thead>

                    <tr className="border-b border-white/10 bg-white/[0.02]">

                      <th className="px-5 py-4 text-left">
                        Appointment
                      </th>

                      <th className="px-5 py-4 text-left">
                        Patient
                      </th>

                      <th className="px-5 py-4 text-left">
                        Doctor
                      </th>

                      <th className="px-5 py-4 text-left">
                        Hospital
                      </th>

                      <th className="px-5 py-4 text-left">
                        Date & time
                      </th>

                      <th className="px-5 py-4 text-left">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {paginatedAppointments.map(
                      (appointment) => (
                        <AppointmentRow
                          key={
                            appointment._rowId
                          }
                          appointment={
                            appointment
                          }
                          onView={() =>
                            setSelectedAppointment(
                              appointment
                            )
                          }
                        />
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          {/* MOBILE CARDS */}

          {!loading &&
            filteredAppointments.length >
              0 && (
              <div className="space-y-3 p-4 lg:hidden">

                {paginatedAppointments.map(
                  (appointment) => (
                    <AppointmentMobileCard
                      key={
                        appointment._rowId
                      }
                      appointment={
                        appointment
                      }
                      onView={() =>
                        setSelectedAppointment(
                          appointment
                        )
                      }
                    />
                  )
                )}

              </div>
            )}

          {/* PAGINATION */}

          {!loading &&
            filteredAppointments.length >
              0 && (
              <Pagination
                currentPage={
                  safeCurrentPage
                }
                totalPages={
                  totalPages
                }
                totalItems={
                  filteredAppointments.length
                }
                pageSize={
                  PAGE_SIZE
                }
                onPageChange={
                  setCurrentPage
                }
              />
            )}

        </div>

        {/* FOOTER */}

        <div className="mt-6 flex flex-col justify-between gap-3 text-center text-xs text-slate-600 sm:flex-row sm:text-left">

          <p>
            MediBook appointment management
          </p>

          <p>
            Secure operational dashboard
          </p>

        </div>

      </div>

      {/* ===================================================
          DETAIL MODAL
      =================================================== */}

      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={
            selectedAppointment
          }
          onClose={() =>
            setSelectedAppointment(
              null
            )
          }
        />
      )}

    </section>
  );
}

/* =========================================================
   APPOINTMENT ROW
========================================================= */

function AppointmentRow({
  appointment,
  onView,
}) {
  return (
    <tr className="group border-b border-white/[0.06] transition hover:bg-white/[0.025]">

      {/* APPOINTMENT */}

      <td className="px-5 py-5">

        <div>

          <p className="font-mono text-xs font-semibold text-emerald-400">
            {appointment.appointmentId}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            ID: {appointment._rowId}
          </p>

        </div>

      </td>

      {/* PATIENT */}

      <td className="px-5 py-5">

        <div className="flex items-center gap-3">

          <Avatar
            name={
              appointment.patientName
            }
            color="emerald"
          />

          <div className="min-w-0">

            <p className="truncate text-sm font-semibold text-slate-200">
              {appointment.patientName ||
                "Unknown patient"}
            </p>

            <p className="mt-0.5 truncate text-xs text-slate-500">
              {appointment.patientEmail ||
                "No email"}
            </p>

          </div>

        </div>

      </td>

      {/* DOCTOR */}

      <td className="px-5 py-5">

        <div>

          <p className="text-sm font-semibold text-slate-200">
            {appointment.doctorName ||
              "Unknown doctor"}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {appointment.specialization ||
              "General"}
          </p>

        </div>

      </td>

      {/* HOSPITAL */}

      <td className="px-5 py-5">

        <div className="flex items-center gap-2">

          <Building2
            size={16}
            className="shrink-0 text-slate-600"
          />

          <span className="text-sm text-slate-300">
            {appointment.hospitalId ||
              "Unknown hospital"}
          </span>

        </div>

      </td>

      {/* DATE */}

      <td className="px-5 py-5">

        <div>

          <p className="text-sm font-medium text-slate-200">
            {formatDate(
              appointment.appointmentDate
            )}
          </p>

          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">

            <Clock3
              size={13}
            />

            {formatTime(
              appointment.appointmentTime
            )}

          </p>

        </div>

      </td>

      {/* STATUS */}

      <td className="px-5 py-5">

        <StatusBadge
          status={
            appointment.status
          }
        />

      </td>

      {/* ACTION */}

      <td className="px-5 py-5 text-right">

        <button
          type="button"
          onClick={onView}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300"
        >

          <Eye size={15} />

          View

        </button>

      </td>

    </tr>
  );
}

/* =========================================================
   MOBILE CARD
========================================================= */

function AppointmentMobileCard({
  appointment,
  onView,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <Avatar
            name={
              appointment.patientName
            }
            color="emerald"
          />

          <div>

            <p className="text-sm font-semibold text-slate-200">
              {appointment.patientName ||
                "Unknown patient"}
            </p>

            <p className="mt-0.5 font-mono text-[10px] text-emerald-400">
              {appointment.appointmentId}
            </p>

          </div>

        </div>

        <StatusBadge
          status={
            appointment.status
          }
        />

      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">

        <MiniInfo
          icon={
            <Stethoscope size={15} />
          }
          label="Doctor"
          value={
            appointment.doctorName
          }
          secondary={
            appointment.specialization
          }
        />

        <MiniInfo
          icon={
            <Building2 size={15} />
          }
          label="Hospital"
          value={
            appointment.hospitalName
          }
        />

        <MiniInfo
          icon={
            <CalendarDays size={15} />
          }
          label="Date"
          value={formatDate(
            appointment.appointmentDate
          )}
        />

        <MiniInfo
          icon={
            <Clock3 size={15} />
          }
          label="Time"
          value={formatTime(
            appointment.appointmentTime
          )}
        />

      </div>

      <button
        type="button"
        onClick={onView}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/[0.07] hover:text-white"
      >

        <Eye size={15} />

        View appointment details

      </button>

    </div>
  );
}

/* =========================================================
   DETAILS MODAL
========================================================= */

function AppointmentDetailsModal({
  appointment,
  onClose,
}) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/50">

        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-white/10 px-5 py-5 sm:px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">

              <CalendarCheck
                size={21}
              />

            </div>

            <div>

              <p className="font-mono text-xs font-semibold text-emerald-400">
                {appointment.appointmentId}
              </p>

              <h2 className="mt-1 text-lg font-bold text-white">
                Appointment details
              </h2>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.08] hover:text-white"
          >

            <X size={18} />

          </button>

        </div>

        {/* BODY */}

        <div className="max-h-[calc(92vh-82px)] overflow-y-auto p-5 sm:p-6">

          {/* STATUS */}

          <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.035] p-5 sm:flex-row sm:items-center">

            <div>

              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Appointment status
              </p>

              <div className="mt-2">
                <StatusBadge
                  status={
                    appointment.status
                  }
                />
              </div>

            </div>

            <div className="text-left sm:text-right">

              <p className="text-xs text-slate-500">
                Scheduled for
              </p>

              <p className="mt-1 text-base font-bold text-white">
                {formatDate(
                  appointment.appointmentDate
                )}
              </p>

              <p className="mt-1 text-sm text-emerald-400">
                {formatTime(
                  appointment.appointmentTime
                )}
              </p>

            </div>

          </div>

          {/* PATIENT */}

          <DetailSection
            title="Patient information"
            icon={
              <UserRound size={19} />
            }
          >

            <div className="grid gap-4 sm:grid-cols-2">

              <DetailItem
                label="Patient ID"
                value={
                  appointment.patientId
                }
                mono
              />

              <DetailItem
                label="Patient name"
                value={
                  appointment.patientName
                }
              />

              <DetailItem
                label="Email"
                value={
                  appointment.patientEmail
                }
                icon={
                  <Mail size={15} />
                }
              />

              <DetailItem
                label="Phone"
                value={
                  appointment.patientPhone
                }
                icon={
                  <Phone size={15} />
                }
              />

            </div>

          </DetailSection>

          {/* DOCTOR */}

          <DetailSection
            title="Doctor information"
            icon={
              <Stethoscope size={19} />
            }
          >

            <div className="grid gap-4 sm:grid-cols-3">

              <DetailItem
                label="Doctor ID"
                value={
                  appointment.doctorId
                }
                mono
              />

              <DetailItem
                label="Doctor name"
                value={
                  appointment.doctorName
                }
              />

              <DetailItem
                label="Specialization"
                value={
                  appointment.specialization
                }
              />

            </div>

          </DetailSection>

          {/* HOSPITAL */}

          <DetailSection
            title="Hospital information"
            icon={
              <Building2 size={19} />
            }
          >

            <div className="grid gap-4 sm:grid-cols-2">

              <DetailItem
                label="Hospital ID"
                value={
                  appointment.hospitalId
                }
                mono
              />

              <DetailItem
                label="Hospital name"
                value={
                  appointment.hospitalName
                }
              />

            </div>

          </DetailSection>

          {/* APPOINTMENT */}

          <DetailSection
            title="Appointment information"
            icon={
              <CalendarDays size={19} />
            }
          >

            <div className="grid gap-4 sm:grid-cols-3">

              <DetailItem
                label="Date"
                value={formatDate(
                  appointment.appointmentDate
                )}
              />

              <DetailItem
                label="Time"
                value={formatTime(
                  appointment.appointmentTime
                )}
              />

              <DetailItem
                label="Status"
                value={
                  appointment.status
                }
              />

            </div>

          </DetailSection>

          {/* REASON */}

          <DetailSection
            title="Reason for appointment"
            icon={
              <FileText size={19} />
            }
          >

            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">

              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                {appointment.reason ||
                  "No reason provided."}
              </p>

            </div>

          </DetailSection>

          {/* RAW INFORMATION */}

          <DetailSection
            title="System information"
            icon={
              <Activity size={19} />
            }
          >

            <div className="grid gap-4 sm:grid-cols-2">

              <DetailItem
                label="Internal row ID"
                value={
                  appointment._rowId
                }
                mono
              />

              {appointment.createdAt && (
                <DetailItem
                  label="Created at"
                  value={formatDateTime(
                    appointment.createdAt
                  )}
                />
              )}

              {appointment.updatedAt && (
                <DetailItem
                  label="Updated at"
                  value={formatDateTime(
                    appointment.updatedAt
                  )}
                />
              )}

            </div>

          </DetailSection>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   DETAIL SECTION
========================================================= */

function DetailSection({
  title,
  icon,
  children,
}) {
  return (
    <section className="mb-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5">

      <div className="mb-4 flex items-center gap-2">

        <div className="text-emerald-400">
          {icon}
        </div>

        <h3 className="text-sm font-bold text-white">
          {title}
        </h3>

      </div>

      {children}

    </section>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({
  label,
  value,
  icon,
  mono = false,
}) {
  return (
    <div>

      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <div className="flex items-center gap-2">

        {icon && (
          <span className="text-slate-600">
            {icon}
          </span>
        )}

        <p
          className={[
            "break-words text-sm text-slate-300",
            mono
              ? "font-mono text-emerald-400"
              : "",
          ].join(" ")}
        >
          {value || "—"}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  icon,
  color,
}) {
  const colors = {
    emerald:
      "border-emerald-400/10 bg-emerald-400/[0.035] text-emerald-400",
    cyan:
      "border-cyan-400/10 bg-cyan-400/[0.035] text-cyan-400",
    blue:
      "border-blue-400/10 bg-blue-400/[0.035] text-blue-400",
    violet:
      "border-violet-400/10 bg-violet-400/[0.035] text-violet-400",
    amber:
      "border-amber-400/10 bg-amber-400/[0.035] text-amber-400",
    red:
      "border-red-400/10 bg-red-400/[0.035] text-red-400",
  };

  return (
    <div
      className={[
        "rounded-2xl border p-4 shadow-xl shadow-black/5",
        colors[color] ||
          colors.emerald,
      ].join(" ")}
    >

      <div className="flex items-center justify-between">

        <div className="text-slate-400">
          {icon}
        </div>

        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
          {title}
        </p>

      </div>

      <p className="mt-3 text-3xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-600">
        Appointment records
      </p>

    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}) {
  const normalized =
    normalizeStatus(status);

  const config = {
    Scheduled: {
      className:
        "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
      icon: (
        <Clock3 size={13} />
      ),
    },

    Confirmed: {
      className:
        "border-blue-400/20 bg-blue-400/10 text-blue-300",
      icon: (
        <CheckCircle2
          size={13}
        />
      ),
    },

    Completed: {
      className:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      icon: (
        <ShieldCheck
          size={13}
        />
      ),
    },

    Cancelled: {
      className:
        "border-red-400/20 bg-red-400/10 text-red-300",
      icon: (
        <XCircle size={13} />
      ),
    },

    Pending: {
      className:
        "border-amber-400/20 bg-amber-400/10 text-amber-300",
      icon: (
        <Activity size={13} />
      ),
    },
  };

  const selected =
    config[normalized] ||
    config.Scheduled;

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold",
        selected.className,
      ].join(" ")}
    >
      {selected.icon}

      {normalized}
    </span>
  );
}

/* =========================================================
   AVATAR
========================================================= */

function Avatar({
  name,
}) {
  const initials =
    String(name || "P")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part) =>
          part[0]
      )
      .join("")
      .toUpperCase();

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/10 text-xs font-bold text-emerald-400">
      {initials || "P"}
    </div>
  );
}

/* =========================================================
   MINI INFO
========================================================= */

function MiniInfo({
  icon,
  label,
  value,
  secondary,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">

      <div className="flex items-center gap-2 text-slate-600">

        {icon}

        <span className="text-[10px] font-semibold uppercase tracking-wider">
          {label}
        </span>

      </div>

      <p className="mt-2 truncate text-xs font-semibold text-slate-300">
        {value || "—"}
      </p>

      {secondary && (
        <p className="mt-1 truncate text-[10px] text-slate-600">
          {secondary}
        </p>
      )}

    </div>
  );
}

/* =========================================================
   FILTER LABEL
========================================================= */

function FilterLabel({
  children,
}) {
  return (
    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </label>
  );
}

/* =========================================================
   FILTER SELECT
========================================================= */

function FilterSelect({
  value,
  onChange,
  children,
}) {
  return (
    <div className="relative">

      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-950/70 py-3.5 pl-4 pr-10 text-sm text-slate-300 outline-none transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10"
      >
        {children}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-600"
      />

    </div>
  );
}

/* =========================================================
   PAGINATION
========================================================= */

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) {
  const start =
    totalItems === 0
      ? 0
      : (currentPage - 1) *
          pageSize +
        1;

  const end = Math.min(
    currentPage * pageSize,
    totalItems
  );

  return (
    <div className="flex flex-col justify-between gap-4 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center">

      <p className="text-xs text-slate-500">

        Showing{" "}

        <span className="font-semibold text-slate-300">
          {start}
        </span>{" "}

        to{" "}

        <span className="font-semibold text-slate-300">
          {end}
        </span>{" "}

        of{" "}

        <span className="font-semibold text-slate-300">
          {totalItems}
        </span>

      </p>

      <div className="flex items-center gap-2">

        <button
          type="button"
          disabled={
            currentPage <= 1
          }
          onClick={() =>
            onPageChange(
              currentPage - 1
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >

          <ChevronLeft
            size={17}
          />

        </button>

        <div className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-emerald-500 px-3 text-xs font-bold text-slate-950">
          {currentPage}
        </div>

        <span className="text-xs text-slate-600">
          /
        </span>

        <span className="min-w-5 text-center text-xs text-slate-400">
          {totalPages}
        </span>

        <button
          type="button"
          disabled={
            currentPage >=
            totalPages
          }
          onClick={() =>
            onPageChange(
              currentPage + 1
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >

          <ChevronRight
            size={17}
          />

        </button>

      </div>

    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  hasFilters,
  onClear,
}) {
  return (
    <div className="flex min-h-[420px] items-center justify-center px-5">

      <div className="max-w-md text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-600">

          <CalendarCheck
            size={28}
          />

        </div>

        <h3 className="mt-5 text-lg font-bold text-white">
          {hasFilters
            ? "No appointments found"
            : "No appointments yet"}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">

          {hasFilters
            ? "Try changing your search or filters to find the appointment you are looking for."
            : "Appointments will appear here once they are created."}

        </p>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
          >

            <X size={14} />

            Clear filters

          </button>
        )}

      </div>

    </div>
  );
}

/* =========================================================
   ALERT
========================================================= */

function AlertBox({
  type,
  message,
  onClose,
}) {
  const success =
    type === "success";

  return (
    <div
      className={[
        "mb-5 flex items-start justify-between gap-3 rounded-2xl border px-5 py-4 text-sm",
        success
          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
          : "border-red-400/20 bg-red-400/10 text-red-300",
      ].join(" ")}
    >

      <div className="flex items-start gap-3">

        {success ? (
          <CheckCircle2
            size={19}
            className="mt-0.5 shrink-0"
          />
        ) : (
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />
        )}

        <span>
          {message}
        </span>

      </div>

      <button
        type="button"
        onClick={onClose}
        className="opacity-60 hover:opacity-100"
      >

        <X size={17} />

      </button>

    </div>
  );
}

/* =========================================================
   NORMALIZE APPOINTMENT LIST
========================================================= */

function normalizeAppointments(
  response
) {
  if (Array.isArray(response)) {
    return response;
  }

  if (
    Array.isArray(
      response?.appointments
    )
  ) {
    return response.appointments;
  }

  if (
    Array.isArray(
      response?.data
    )
  ) {
    return response.data;
  }

  if (
    Array.isArray(
      response?.data?.appointments
    )
  ) {
    return response.data.appointments;
  }

  if (
    Array.isArray(
      response?.items
    )
  ) {
    return response.items;
  }

  if (
    Array.isArray(
      response?.results
    )
  ) {
    return response.results;
  }

  return [];
}

/* =========================================================
   NORMALIZE SINGLE APPOINTMENT
========================================================= */

function normalizeAppointment(
  appointment,
  index
) {
  const appointmentId =
    getValue(
      appointment,
      [
        "appointmentId",
        "appointmentID",
        "id",
        "_id",
        "appointment_id",
      ],
      `APT-${String(
        index + 1
      ).padStart(4, "0")}`
    );

  const patientId =
    getValue(
      appointment,
      [
        "patientId",
        "patient_id",
      ],
      ""
    );

  const patientName =
    getValue(
      appointment,
      [
        "patientName",
        "patient_name",
      ],
      "Unknown patient"
    );

  const patientEmail =
    getValue(
      appointment,
      [
        "patientEmail",
        "patient_email",
      ],
      ""
    );

  const patientPhone =
    normalizePhone(
      getValue(
        appointment,
        [
          "patientPhone",
          "patient_phone",
          "phone",
          "mobile",
        ],
        ""
      )
    );

  const doctorId =
    getValue(
      appointment,
      [
        "doctorId",
        "doctor_id",
      ],
      ""
    );

  const doctorName =
    getValue(
      appointment,
      [
        "doctorName",
        "doctor_name",
      ],
      "Unknown doctor"
    );

  const specialization =
    getValue(
      appointment,
      [
        "specialization",
        "specialisation",
        "specialty",
        "speciality",
      ],
      ""
    );

  const hospitalId =
    getValue(
      appointment,
      [
        "hospitalId",
        "hospital_id",
      ],
      ""
    );

  const hospitalName =
    getValue(
      appointment,
      [
        "hospitalName",
        "hospital_name",
      ],
      "Unknown hospital"
    );

  const appointmentDate =
    normalizeDate(
      getValue(
        appointment,
        [
          "appointmentDate",
          "appointment_date",
          "date",
        ],
        ""
      )
    );

  const appointmentTime =
    normalizeTime(
      getValue(
        appointment,
        [
          "appointmentTime",
          "appointment_time",
          "time",
        ],
        ""
      )
    );

  const reason =
    getValue(
      appointment,
      [
        "reason",
        "appointmentReason",
        "description",
        "notes",
      ],
      ""
    );

  const status =
    normalizeStatus(
      getValue(
        appointment,
        [
          "status",
          "appointmentStatus",
          "appointment_status",
        ],
        "Scheduled"
      )
    );

  return {
    ...appointment,

    _rowId: String(
      appointmentId
    ),

    appointmentId,

    patientId,
    patientName,
    patientEmail,
    patientPhone,

    doctorId,
    doctorName,
    specialization,

    hospitalId,
    hospitalName,

    appointmentDate,
    appointmentTime,

    reason,

    status,

    createdAt:
      getValue(
        appointment,
        [
          "createdAt",
          "created_at",
        ],
        ""
      ),

    updatedAt:
      getValue(
        appointment,
        [
          "updatedAt",
          "updated_at",
        ],
        ""
      ),
  };
}

/* =========================================================
   GET VALUE
========================================================= */

function getValue(
  object,
  keys,
  fallback = ""
) {
  for (const key of keys) {
    const value =
      object?.[key];

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      return String(value);
    }
  }

  return String(
    fallback ?? ""
  );
}

/* =========================================================
   STATUS
========================================================= */

function normalizeStatus(
  value
) {
  const status =
    String(
      value || ""
    )
      .trim()
      .toLowerCase();

  if (
    status ===
    "confirmed"
  ) {
    return "Confirmed";
  }

  if (
    status ===
      "completed" ||
    status === "complete"
  ) {
    return "Completed";
  }

  if (
    status ===
      "cancelled" ||
    status === "canceled"
  ) {
    return "Cancelled";
  }

  if (
    status ===
      "pending" ||
    status === "waiting"
  ) {
    return "Pending";
  }

  return "Scheduled";
}

/* =========================================================
   DATE NORMALIZER
========================================================= */

function normalizeDate(
  value
) {
  if (!value) {
    return "";
  }

  const stringValue =
    String(value);

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      stringValue
    )
  ) {
    return stringValue;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return stringValue;
  }

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================================================
   TIME NORMALIZER
========================================================= */

function normalizeTime(
  value
) {
  if (!value) {
    return "";
  }

  const stringValue =
    String(value);

  const match =
    stringValue.match(
      /(\d{1,2}):(\d{2})/
    );

  if (!match) {
    return stringValue;
  }

  return `${String(
    match[1]
  ).padStart(2, "0")}:${match[2]}`;
}

/* =========================================================
   PHONE
========================================================= */

function normalizePhone(
  value
) {
  return String(
    value ?? ""
  )
    .replace(/\D/g, "")
    .slice(-10);
}

/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
  value
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(
      `${value}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(
  value
) {
  if (!value) {
    return "—";
  }

  const match =
    String(value).match(
      /^(\d{1,2}):(\d{2})/
    );

  if (!match) {
    return value;
  }

  const hours =
    Number(match[1]);

  const minutes =
    match[2];

  const suffix =
    hours >= 12
      ? "PM"
      : "AM";

  const displayHour =
    hours % 12 || 12;

  return `${displayHour}:${minutes} ${suffix}`;
}

/* =========================================================
   FORMAT DATE TIME
========================================================= */

function formatDateTime(
  value
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

/* =========================================================
   ERROR
========================================================= */

function getErrorMessage(
  error,
  fallback
) {
  if (!error) {
    return fallback;
  }

  if (
    typeof error ===
    "string"
  ) {
    return error;
  }

  return (
    error?.response?.data
      ?.message ||
    error?.data?.message ||
    error?.message ||
    fallback
  );
}

/* =========================================================
   CSV ESCAPE
========================================================= */

function csvEscape(
  value
) {
  const stringValue =
    String(
      value ?? ""
    );

  return `"${stringValue.replace(
    /"/g,
    '""'
  )}"`;
}

/* =========================================================
   FILE DATE
========================================================= */

function getFileDate() {
  const date =
    new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}