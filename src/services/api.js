const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
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

  if (!response.ok) {
    throw new Error(
      data.message || `API request failed: ${response.status}`
    );
  }

  return data;
}

export const api = {
  // Hospitals
  getHospitals: () => request("/hospitals"),

  // Doctors
  getDoctors: () => request("/getDoctors"),

  registerDoctor: (payload) =>
    request("/doctorRegister", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Appointments
  bookAppointment: (payload) =>
    request("/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getDoctorAppointments: (doctorId) =>
    request(`/doctors/${doctorId}/appointments`),
};