const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* =========================================================
   API REQUEST HELPER
========================================================= */

async function request(path, options = {}) {
  const cleanPath = path.startsWith("/")
    ? path
    : `/${path}`;

  const url = `${API_BASE_URL}${cleanPath}`;

  console.log("[API REQUEST]", {
    method: options.method || "GET",
    url,
  });

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  console.log("[API RESPONSE]", {
    status: response.status,
    url,
    data,
  });

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `API request failed: ${response.status}`
    );
  }

  return data;
}

/* =========================================================
   API
========================================================= */

export const api = {
  /* =======================================================
     HOSPITALS

     Azure Function:
     GET /api/getHospitals

     Expected response:

     {
       success: true,
       count: 2,
       hospitals: [
         {
           hospitalId: "city-hospital-001",
           hospitalName: "City Hospital"
         }
       ]
     }
  ======================================================= */

  getHospitals: () =>
    request("/getHospitals"),

  /* =======================================================
     DOCTORS

     Azure Function:
     GET /api/getDoctors
  ======================================================= */

  getDoctors: () =>
    request("/getDoctors"),

  /* =======================================================
     REGISTER DOCTOR

     Azure Function:
     POST /api/doctorRegister
  ======================================================= */

  registerDoctor: (payload) =>
    request("/doctorRegister", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /* =======================================================
     PATIENTS

     Azure Function:
     GET /api/getPatients
  ======================================================= */

  getPatients: () =>
    request("/getPatients"),

  /* =======================================================
     REGISTER PATIENT

     Azure Function:
     POST /api/patientRegister
  ======================================================= */

  registerPatient: (payload) =>
    request("/patientRegister", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /* =======================================================
     BOOK APPOINTMENT

     Azure Function:
     POST /api/bookAppointment
  ======================================================= */

  bookAppointment: (payload) =>
    request("/bookAppointment", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /* =======================================================
     GET ALL APPOINTMENTS

     Azure Function:
     GET /api/getAppointments

     Expected response from your screenshot:

     {
       success: true,
       count: 2,
       appointments: [
         {
           id: "appointment-1786866657227",
           type: "appointment",
           hospitalId: "city-hospital-001",
           doctorId: "1786710157412",
           doctorName: "Dr. Rahul Sharma",
           patientId: "1786710821820",
           patientName: "Dev",
           appointmentDate: "2026-09-20",
           appointmentTime: "10:30",
           status: "booked",
           createdAt: "2026-08-16T07:50:57.227Z"
         }
       ]
     }
  ======================================================= */

  getAppointments: () =>
    request("/getAppointments"),

  /* =======================================================
     GET DOCTOR APPOINTMENTS

     Azure Function:
     GET /api/doctors/{doctorId}/appointments
  ======================================================= */

  getDoctorAppointments: (doctorId) =>
    request(
      `/doctors/${encodeURIComponent(
        doctorId
      )}/appointments`
    ),
};