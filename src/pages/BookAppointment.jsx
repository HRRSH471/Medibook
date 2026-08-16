import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  CalendarCheck,
  UserRound,
  Mail,
  Phone,
  Stethoscope,
  Building2,
  Hash,
  CalendarDays,
  Clock3,
  FileText,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Loader2,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

import { api } from "../services/api";

/* =========================================================
   INITIAL FORM
========================================================= */

const INITIAL_FORM = {
  patientId: "",
  patientName: "",
  patientEmail: "",
  patientPhone: "",

  doctorId: "",
  doctorName: "",
  specialization: "",

  hospitalId: "",
  hospitalName: "",

  appointmentDate: "",
  appointmentTime: "",
  reason: "",
};

/* =========================================================
   STATIC FALLBACK DATA

   Used only if API fails or returns no records.
========================================================= */

const FALLBACK_PATIENTS = [
  {
    id: "PAT-001",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "9876543210",
  },
  {
    id: "PAT-002",
    name: "Priya Verma",
    email: "priya.verma@example.com",
    phone: "9876543211",
  },
  {
    id: "PAT-003",
    name: "Amit Singh",
    email: "amit.singh@example.com",
    phone: "9876543212",
  },
];

const FALLBACK_DOCTORS = [
  {
    id: "DOC-001",
    name: "Dr. Amit Kumar",
    specialization: "Cardiologist",
  },
  {
    id: "DOC-002",
    name: "Dr. Neha Sharma",
    specialization: "Dermatologist",
  },
  {
    id: "DOC-003",
    name: "Dr. Raj Verma",
    specialization: "Orthopedic",
  },
  {
    id: "DOC-004",
    name: "Dr. Priya Singh",
    specialization: "Pediatrician",
  },
];

const FALLBACK_HOSPITALS = [
  {
    hospitalId: "HOSP-001",
    hospitalName: "City Care Hospital",
  },
  {
    hospitalId: "HOSP-002",
    hospitalName: "Apollo Medical Center",
  },
  {
    hospitalId: "HOSP-003",
    hospitalName: "Medanta Healthcare",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function BookAppointment() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [dataSource, setDataSource] = useState({
    patients: "loading",
    doctors: "loading",
    hospitals: "loading",
  });

  /* =======================================================
     LOAD FORM DATA
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadFormData() {
      setLoadingData(true);
      setError("");

      try {
        const patientResult = await safelyLoadList(
          "patients",
          api?.getPatients,
          FALLBACK_PATIENTS
        );

        if (cancelled) return;

        const doctorResult = await safelyLoadList(
          "doctors",
          api?.getDoctors,
          FALLBACK_DOCTORS
        );

        if (cancelled) return;

        const hospitalResult = await safelyLoadList(
          "hospitals",
          api?.getHospitals,
          FALLBACK_HOSPITALS
        );

        if (cancelled) return;

        setPatients(patientResult.data);
        setDoctors(doctorResult.data);
        setHospitals(hospitalResult.data);

        setDataSource({
          patients: patientResult.source,
          doctors: doctorResult.source,
          hospitals: hospitalResult.source,
        });
      } catch (err) {
        console.error(
          "BookAppointment load error:",
          err
        );
      } finally {
        if (!cancelled) {
          setLoadingData(false);
        }
      }
    }

    loadFormData();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     REFRESH DATA
  ======================================================= */

  async function handleRefreshData() {
    setLoadingData(true);
    setError("");
    setSuccess("");

    try {
      const [
        patientResult,
        doctorResult,
        hospitalResult,
      ] = await Promise.all([
        safelyLoadList(
          "patients",
          api?.getPatients,
          FALLBACK_PATIENTS
        ),

        safelyLoadList(
          "doctors",
          api?.getDoctors,
          FALLBACK_DOCTORS
        ),

        safelyLoadList(
          "hospitals",
          api?.getHospitals,
          FALLBACK_HOSPITALS
        ),
      ]);

      setPatients(patientResult.data);
      setDoctors(doctorResult.data);
      setHospitals(hospitalResult.data);

      setDataSource({
        patients: patientResult.source,
        doctors: doctorResult.source,
        hospitals: hospitalResult.source,
      });
    } catch (err) {
      console.error(
        "Refresh data error:",
        err
      );

      setError(
        getErrorMessage(err)
      );
    } finally {
      setLoadingData(false);
    }
  }

  /* =======================================================
     PATIENT SELECT
  ======================================================= */

  function handlePatientChange(e) {
    const selectedId = e.target.value;

    setError("");
    setSuccess("");

    if (!selectedId) {
      setForm((prev) => ({
        ...prev,

        patientId: "",
        patientName: "",
        patientEmail: "",
        patientPhone: "",
      }));

      return;
    }

    const patient = patients.find(
      (item) =>
        String(
          getValue(
            item,
            [
              "id",
              "patientId",
              "patient_id",
              "_id",
            ],
            ""
          )
        ) === String(selectedId)
    );

    if (!patient) {
      setError(
        "Selected patient could not be found."
      );

      return;
    }

    setForm((prev) => ({
      ...prev,

      patientId: getValue(
        patient,
        [
          "id",
          "patientId",
          "patient_id",
          "_id",
        ],
        selectedId
      ),

      patientName: getValue(
        patient,
        [
          "name",
          "patientName",
          "fullName",
          "full_name",
        ],
        ""
      ),

      patientEmail: getValue(
        patient,
        [
          "email",
          "patientEmail",
          "emailAddress",
        ],
        ""
      ),

      patientPhone: normalizePhone(
        getValue(
          patient,
          [
            "phone",
            "patientPhone",
            "phoneNumber",
            "mobile",
          ],
          ""
        )
      ),
    }));
  }

  /* =======================================================
     DOCTOR SELECT
  ======================================================= */

  function handleDoctorChange(e) {
    const selectedId = e.target.value;

    setError("");
    setSuccess("");

    if (!selectedId) {
      setForm((prev) => ({
        ...prev,

        doctorId: "",
        doctorName: "",
        specialization: "",
      }));

      return;
    }

    const doctor = doctors.find(
      (item) =>
        String(
          getValue(
            item,
            [
              "id",
              "doctorId",
              "doctor_id",
              "_id",
            ],
            ""
          )
        ) === String(selectedId)
    );

    if (!doctor) {
      setError(
        "Selected doctor could not be found."
      );

      return;
    }

    setForm((prev) => ({
      ...prev,

      doctorId: getValue(
        doctor,
        [
          "id",
          "doctorId",
          "doctor_id",
          "_id",
        ],
        selectedId
      ),

      doctorName: getValue(
        doctor,
        [
          "name",
          "doctorName",
          "fullName",
          "full_name",
        ],
        ""
      ),

      specialization: getValue(
        doctor,
        [
          "specialization",
          "specialisation",
          "specialty",
          "speciality",
        ],
        ""
      ),
    }));
  }

  /* =======================================================
     HOSPITAL SELECT
  ======================================================= */

  function handleHospitalChange(e) {
    const selectedId = e.target.value;

    setError("");
    setSuccess("");

    if (!selectedId) {
      setForm((prev) => ({
        ...prev,

        hospitalId: "",
        hospitalName: "",
      }));

      return;
    }

    const hospital = hospitals.find(
      (item) =>
        String(
          getValue(
            item,
            [
              "id",
              "hospitalId",
              "hospital_id",
              "_id",
            ],
            ""
          )
        ) === String(selectedId)
    );

    if (!hospital) {
      setError(
        "Selected hospital could not be found."
      );

      return;
    }

    setForm((prev) => ({
      ...prev,

      hospitalId: getValue(
        hospital,
        [
          "id",
          "hospitalId",
          "hospital_id",
          "_id",
        ],
        selectedId
      ),

      hospitalName: getValue(
        hospital,
        [
          "name",
          "hospitalName",
          "hospital_name",
          "title",
        ],
        ""
      ),
    }));
  }

  /* =======================================================
     NORMAL INPUT
  ======================================================= */

  function handleChange(e) {
    const { name, value } = e.target;

    setError("");
    setSuccess("");

    if (name === "patientPhone") {
      setForm((prev) => ({
        ...prev,
        [name]: normalizePhone(value),
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /* =======================================================
     RESET
  ======================================================= */

  function resetForm() {
    setForm({
      ...INITIAL_FORM,
    });
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const patientName =
      form.patientName.trim();

    const patientEmail =
      form.patientEmail.trim();

    const patientPhone =
      form.patientPhone.trim();

    const doctorId =
      form.doctorId.trim();

    const doctorName =
      form.doctorName.trim();

    const specialization =
      form.specialization.trim();

    const hospitalId =
      form.hospitalId.trim();

    const hospitalName =
      form.hospitalName.trim();

    const appointmentDate =
      form.appointmentDate.trim();

    const appointmentTime =
      form.appointmentTime.trim();

    const reason =
      form.reason.trim();

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!form.patientId) {
      setError(
        "Please select a patient."
      );

      return;
    }

    if (!patientName) {
      setError(
        "Patient name is required."
      );

      return;
    }

    if (!patientEmail) {
      setError(
        "Patient email is required."
      );

      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        patientEmail
      )
    ) {
      setError(
        "Please enter a valid patient email address."
      );

      return;
    }

    if (!patientPhone) {
      setError(
        "Patient phone number is required."
      );

      return;
    }

    if (!/^\d{10}$/.test(patientPhone)) {
      setError(
        "Please enter a valid 10-digit patient phone number."
      );

      return;
    }

    if (!doctorId) {
      setError(
        "Please select a doctor."
      );

      return;
    }

    if (!doctorName) {
      setError(
        "Doctor name is required."
      );

      return;
    }

    if (!specialization) {
      setError(
        "Doctor specialization is required."
      );

      return;
    }

    if (!hospitalId) {
      setError(
        "Please select a hospital."
      );

      return;
    }

    if (!hospitalName) {
      setError(
        "Hospital name is required."
      );

      return;
    }

    if (!appointmentDate) {
      setError(
        "Please select an appointment date."
      );

      return;
    }

    if (!appointmentTime) {
      setError(
        "Please select an appointment time."
      );

      return;
    }

    if (!reason) {
      setError(
        "Please enter the reason for the appointment."
      );

      return;
    }

    /* =====================================================
       DATE/TIME VALIDATION
    ===================================================== */

    const selectedDateTime =
      new Date(
        `${appointmentDate}T${appointmentTime}`
      );

    if (
      Number.isNaN(
        selectedDateTime.getTime()
      )
    ) {
      setError(
        "Please enter a valid appointment date and time."
      );

      return;
    }

    if (
      selectedDateTime < new Date()
    ) {
      setError(
        "Please select a future date and time."
      );

      return;
    }

    /* =====================================================
       API CHECK
    ===================================================== */

    if (
      !api ||
      typeof api.bookAppointment !==
        "function"
    ) {
      setError(
        "Appointment API is not configured. Please check services/api.js."
      );

      return;
    }

    /* =====================================================
       BOOK APPOINTMENT
    ===================================================== */

    try {
      setLoading(true);

      await api.bookAppointment({
        patientId: form.patientId,

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
      });

      /*
       * Booking succeeded.
       *
       * Redirect directly to the appointments page.
       */
      navigate("/appointments", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Appointment booking error:",
        err
      );

      setError(
        getErrorMessage(err)
      );

      setLoading(false);
    }
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.03] blur-[120px]" />

      </div>

      {/* ===================================================
          MAIN
      =================================================== */}

      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-sm text-emerald-300">

              <CalendarCheck size={16} />

              Appointment booking

            </div>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">

              Select the patient, doctor, and
              hospital. Related information will
              automatically fill into the form.

            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={handleRefreshData}
              disabled={loadingData}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >

              <RefreshCw
                size={16}
                className={
                  loadingData
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh

            </button>

            <Link
              to="/appointments"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              Appointments

              <ArrowRight size={16} />

            </Link>

          </div>

        </div>

        {/* =================================================
            DATA STATUS
        ================================================= */}

        {!loadingData && (
          <div className="mb-6 grid gap-3 sm:grid-cols-3">

            <DataStatus
              label="Patients"
              source={dataSource.patients}
            />

            <DataStatus
              label="Doctors"
              source={dataSource.doctors}
            />

            <DataStatus
              label="Hospitals"
              source={dataSource.hospitals}
            />

          </div>
        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loadingData && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-5 py-4 text-sm text-emerald-300">

            <Loader2
              size={19}
              className="animate-spin"
            />

            Loading available patients,
            doctors and hospitals...

          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm leading-6 text-red-300">

            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <span>{error}</span>

          </div>
        )}

        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm leading-6 text-emerald-300">

            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0"
            />

            <span>{success}</span>

          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleSubmit}>

          <div className="grid gap-6 lg:grid-cols-2">

            {/* =================================================
                PATIENT
            ================================================= */}

            <FormSection
              number="01"
              icon={<UserRound size={21} />}
              title="Patient information"
              description="Select a patient and their registered information will be filled automatically."
            >

              <div className="space-y-5">

                <SelectField
                  label="Select patient"
                  value={form.patientId}
                  onChange={handlePatientChange}
                  icon={
                    <UserRound size={18} />
                  }
                  disabled={
                    loadingData ||
                    patients.length === 0
                  }
                  required
                >

                  <option value="">
                    {loadingData
                      ? "Loading patients..."
                      : patients.length === 0
                      ? "No patients available"
                      : "Choose a patient"}
                  </option>

                  {patients.map(
                    (patient, index) => {
                      const id = getValue(
                        patient,
                        [
                          "id",
                          "patientId",
                          "patient_id",
                          "_id",
                        ],
                        `PAT-${index + 1}`
                      );

                      const name = getValue(
                        patient,
                        [
                          "name",
                          "patientName",
                          "fullName",
                          "full_name",
                        ],
                        "Unnamed patient"
                      );

                      return (
                        <option
                          key={String(id)}
                          value={String(id)}
                        >
                          {name}
                        </option>
                      );
                    }
                  )}

                </SelectField>

                <div className="grid gap-5 sm:grid-cols-2">

                  <InputField
                    label="Patient name"
                    name="patientName"
                    value={
                      form.patientName
                    }
                    onChange={handleChange}
                    placeholder="Patient name"
                    icon={
                      <UserRound size={18} />
                    }
                    readOnly
                    required
                  />

                  <InputField
                    label="Patient email"
                    name="patientEmail"
                    value={
                      form.patientEmail
                    }
                    onChange={handleChange}
                    type="email"
                    placeholder="Patient email"
                    icon={
                      <Mail size={18} />
                    }
                    readOnly
                    required
                  />

                  <InputField
                    label="Patient phone"
                    name="patientPhone"
                    value={
                      form.patientPhone
                    }
                    onChange={handleChange}
                    type="tel"
                    placeholder="Patient phone"
                    icon={
                      <Phone size={18} />
                    }
                    readOnly
                    required
                  />

                </div>

              </div>

            </FormSection>

            {/* =================================================
                DOCTOR
            ================================================= */}

            <FormSection
              number="02"
              icon={
                <Stethoscope size={21} />
              }
              title="Doctor information"
              description="Select a doctor and the doctor ID, name, and specialization will be filled automatically."
            >

              <div className="space-y-5">

                <SelectField
                  label="Select doctor"
                  value={form.doctorId}
                  onChange={handleDoctorChange}
                  icon={
                    <Stethoscope size={18} />
                  }
                  disabled={
                    loadingData ||
                    doctors.length === 0
                  }
                  required
                >

                  <option value="">
                    {loadingData
                      ? "Loading doctors..."
                      : doctors.length === 0
                      ? "No doctors available"
                      : "Choose a doctor"}
                  </option>

                  {doctors.map(
                    (doctor, index) => {
                      const id = getValue(
                        doctor,
                        [
                          "id",
                          "doctorId",
                          "doctor_id",
                          "_id",
                        ],
                        `DOC-${index + 1}`
                      );

                      const name = getValue(
                        doctor,
                        [
                          "name",
                          "doctorName",
                          "fullName",
                          "full_name",
                        ],
                        "Unnamed doctor"
                      );

                      const specialization =
                        getValue(
                          doctor,
                          [
                            "specialization",
                            "specialisation",
                            "specialty",
                            "speciality",
                          ],
                          ""
                        );

                      return (
                        <option
                          key={String(id)}
                          value={String(id)}
                        >
                          {name}

                          {specialization
                            ? ` — ${specialization}`
                            : ""}
                        </option>
                      );
                    }
                  )}

                </SelectField>

                <div className="grid gap-5 sm:grid-cols-2">

                  <InputField
                    label="Doctor ID"
                    name="doctorId"
                    value={
                      form.doctorId
                    }
                    onChange={handleChange}
                    placeholder="Doctor ID"
                    icon={
                      <Hash size={18} />
                    }
                    readOnly
                    required
                  />

                  <InputField
                    label="Doctor name"
                    name="doctorName"
                    value={
                      form.doctorName
                    }
                    onChange={handleChange}
                    placeholder="Doctor name"
                    icon={
                      <UserRound size={18} />
                    }
                    readOnly
                    required
                  />

                  <div className="sm:col-span-2">

                    <InputField
                      label="Specialization"
                      name="specialization"
                      value={
                        form.specialization
                      }
                      onChange={handleChange}
                      placeholder="Specialization"
                      icon={
                        <Stethoscope
                          size={18}
                        />
                      }
                      readOnly
                      required
                    />

                  </div>

                </div>

              </div>

            </FormSection>

            {/* =================================================
                HOSPITAL
            ================================================= */}

            <FormSection
              number="03"
              icon={
                <Building2 size={21} />
              }
              title="Hospital information"
              description="Select a hospital and its ID and name will be filled automatically."
            >

              <div className="space-y-5">

                <SelectField
                  label="Select hospital"
                  value={form.hospitalId}
                  onChange={
                    handleHospitalChange
                  }
                  icon={
                    <Building2 size={18} />
                  }
                  disabled={
                    loadingData ||
                    hospitals.length === 0
                  }
                  required
                >

                  <option value="">
                    {loadingData
                      ? "Loading hospitals..."
                      : hospitals.length === 0
                      ? "No hospitals available"
                      : "Choose a hospital"}
                  </option>

                  {hospitals.map(
                    (hospital, index) => {

                      const id = getValue(
                        hospital,
                        [
                          "hospitalId",
                          "id",
                          "hospital_id",
                          "_id",
                        ],
                        `HOSP-${index + 1}`
                      );

                      const name = getValue(
                        hospital,
                        [
                          "hospitalName",
                          "name",
                          "hospital_name",
                          "title",
                        ],
                        "Unnamed hospital"
                      );

                      return (
                        <option
                          key={String(id)}
                          value={String(id)}
                        >
                          {name}
                        </option>
                      );
                    }
                  )}

                </SelectField>

                <div className="grid gap-5 sm:grid-cols-2">

                  <InputField
                    label="Hospital ID"
                    name="hospitalId"
                    value={
                      form.hospitalId
                    }
                    onChange={handleChange}
                    placeholder="Hospital ID"
                    icon={
                      <Hash size={18} />
                    }
                    readOnly
                    required
                  />

                  <InputField
                    label="Hospital name"
                    name="hospitalName"
                    value={
                      form.hospitalName
                    }
                    onChange={handleChange}
                    placeholder="Hospital name"
                    icon={
                      <Building2
                        size={18}
                      />
                    }
                    readOnly
                    required
                  />

                </div>

              </div>

            </FormSection>

            {/* =================================================
                APPOINTMENT
            ================================================= */}

            <FormSection
              number="04"
              icon={
                <CalendarDays size={21} />
              }
              title="Appointment details"
              description="Choose a future date and time for the appointment."
            >

              <div className="grid gap-5 sm:grid-cols-2">

                <InputField
                  label="Appointment date"
                  name="appointmentDate"
                  value={
                    form.appointmentDate
                  }
                  onChange={handleChange}
                  type="date"
                  min={getToday()}
                  icon={
                    <CalendarDays
                      size={18}
                    />
                  }
                  required
                />

                <InputField
                  label="Appointment time"
                  name="appointmentTime"
                  value={
                    form.appointmentTime
                  }
                  onChange={handleChange}
                  type="time"
                  icon={
                    <Clock3 size={18}
                  />
                  }
                  required
                />

              </div>

            </FormSection>

            {/* =================================================
                REASON
            ================================================= */}

            <div className="lg:col-span-2">

              <FormSection
                number="05"
                icon={
                  <FileText size={21} />
                }
                title="Appointment reason"
                description="Provide a short description of why the patient needs this appointment."
              >

                <TextAreaField
                  label="Reason"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="Describe the reason for the appointment..."
                  icon={
                    <FileText size={18} />
                  }
                  required
                />

              </FormSection>

            </div>

          </div>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div className="flex items-start gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">

                  <ShieldCheck
                    size={20}
                    className="text-emerald-400"
                  />

                </div>

                <div>

                  <p className="text-sm font-semibold text-slate-200">
                    Ready to book?
                  </p>

                  <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">

                    Patient, doctor, and hospital
                    information is automatically
                    filled from the selected records.
                    Review everything before booking.

                  </p>

                </div>

              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  loadingData
                }
                className="group flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-7 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 md:w-auto md:min-w-[240px]"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Booking appointment...
                  </>
                ) : (
                  <>
                    <CalendarCheck
                      size={18}
                    />

                    Book appointment

                    <ArrowRight
                      size={18}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </>
                )}

              </button>

            </div>

          </div>

        </form>

        {/* =================================================
            FOOTER
        ================================================= */}

        <p className="mt-6 text-center text-xs leading-5 text-slate-600">

          MediBook appointment booking •
          No password required

        </p>

      </div>

    </section>
  );
}

/* =========================================================
   SAFE API LIST LOADER
========================================================= */

async function safelyLoadList(
  type,
  apiFunction,
  fallbackData
) {
  try {
    if (
      typeof apiFunction !==
      "function"
    ) {
      console.warn(
        `[BookAppointment] ${type} API method is not available. Using fallback data.`
      );

      return {
        data: fallbackData,
        source: "fallback",
      };
    }

    const response =
      await apiFunction();

    console.log(
      `[BookAppointment] ${type} API response:`,
      response
    );

    const list = normalizeList(
      response,
      type
    );

    if (list.length > 0) {
      return {
        data: list,
        source: "api",
      };
    }

    console.warn(
      `[BookAppointment] ${type} API returned no records. Using fallback data.`
    );

    return {
      data: fallbackData,
      source: "fallback",
    };
  } catch (err) {
    console.warn(
      `[BookAppointment] Failed to load ${type}. Using fallback data.`,
      err
    );

    return {
      data: fallbackData,
      source: "fallback",
    };
  }
}

/* =========================================================
   NORMALIZE API RESPONSE
========================================================= */

function normalizeList(
  response,
  type = ""
) {
  if (Array.isArray(response)) {
    return response;
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

  if (
    Array.isArray(
      response?.patients
    )
  ) {
    return response.patients;
  }

  if (
    Array.isArray(
      response?.doctors
    )
  ) {
    return response.doctors;
  }

  if (
    Array.isArray(
      response?.hospitals
    )
  ) {
    return response.hospitals;
  }

  if (
    type &&
    Array.isArray(
      response?.[type]
    )
  ) {
    return response[type];
  }

  return [];
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
   PHONE NORMALIZER
========================================================= */

function normalizePhone(value) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .slice(0, 10);
}

/* =========================================================
   ERROR MESSAGE
========================================================= */

function getErrorMessage(error) {
  if (!error) {
    return "Unable to book the appointment. Please try again.";
  }

  if (
    typeof error ===
    "string"
  ) {
    return error;
  }

  if (
    error?.response?.data?.message
  ) {
    return error.response.data.message;
  }

  if (
    error?.data?.message
  ) {
    return error.data.message;
  }

  if (
    error?.message
  ) {
    return error.message;
  }

  return "Unable to book the appointment. Please try again.";
}

/* =========================================================
   TODAY
========================================================= */

function getToday() {
  const today =
    new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      today.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================================================
   FORM SECTION
========================================================= */

function FormSection({
  number,
  icon,
  title,
  description,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/10 backdrop-blur-xl">

      <div className="border-b border-white/10 px-5 py-5 sm:px-6">

        <div className="flex items-start gap-4">

          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">

            {icon}

            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full border border-slate-950 bg-emerald-500 px-1 text-[9px] font-bold text-slate-950">
              {number}
            </span>

          </div>

          <div>

            <h2 className="text-lg font-bold text-white">
              {title}
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {description}
            </p>

          </div>

        </div>

      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>

    </section>
  );
}

/* =========================================================
   SELECT FIELD
========================================================= */

function SelectField({
  label,
  value,
  onChange,
  icon,
  children,
  disabled = false,
  required = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-slate-300">

        {label}

        {required && (
          <span className="ml-1 text-emerald-400">
            *
          </span>
        )}

      </label>

      <div className="relative">

        <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500">
          {icon}
        </div>

        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-950/80 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition-all duration-200 hover:border-white/20 focus:border-emerald-400/60 focus:bg-slate-950 focus:ring-4 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {children}
        </select>

        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

      </div>

    </div>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  required = false,
  readOnly = false,
  maxLength,
  inputMode,
  min,
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-300"
      >

        {label}

        {required && (
          <span className="ml-1 text-emerald-400">
            *
          </span>
        )}

      </label>

      <div className="relative">

        <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500">
          {icon}
        </div>

        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          maxLength={maxLength}
          inputMode={inputMode}
          min={min}
          className={[
            "w-full rounded-2xl border py-3.5 pl-12 pr-12 text-sm outline-none transition-all duration-200",
            "placeholder:text-slate-600",
            "focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10",

            readOnly
              ? "cursor-default border-white/10 bg-slate-900/70 text-slate-300"
              : "border-white/10 bg-slate-950/80 text-white hover:border-white/20 focus:bg-slate-950",
          ].join(" ")}
        />

        {readOnly &&
          value && (
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">

              <CheckCircle2
                size={16}
                className="text-emerald-500/70"
              />

            </div>
          )}

      </div>

    </div>
  );
}

/* =========================================================
   TEXT AREA
========================================================= */

function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
  required = false,
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-300"
      >

        {label}

        {required && (
          <span className="ml-1 text-emerald-400">
            *
          </span>
        )}

      </label>

      <div className="relative">

        <div className="pointer-events-none absolute left-4 top-4 text-slate-500">
          {icon}
        </div>

        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows={5}
          required={required}
          placeholder={placeholder}
          className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/80 py-4 pl-12 pr-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-600 hover:border-white/20 focus:border-emerald-400/60 focus:bg-slate-950 focus:ring-4 focus:ring-emerald-400/10"
        />

      </div>

      <p className="mt-2 text-xs text-slate-600">
        Please provide a brief description
        of the patient's concern.
      </p>

    </div>
  );
}

/* =========================================================
   DATA STATUS
========================================================= */

function DataStatus({
  label,
  source,
}) {
  const usingApi =
    source === "api";

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">

      <div
        className={[
          "h-2.5 w-2.5 rounded-full",

          usingApi
            ? "bg-emerald-400 shadow-lg shadow-emerald-400/40"
            : "bg-amber-400 shadow-lg shadow-amber-400/40",
        ].join(" ")}
      />

      <div>

        <p className="text-xs font-semibold text-slate-300">
          {label}
        </p>

        <p className="text-[11px] text-slate-600">
          {usingApi
            ? "Loaded from API"
            : "Using fallback data"}
        </p>

      </div>

    </div>
  );
}