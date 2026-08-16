const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export const api = {
  getHospitals: () => request("/hospitals"),
  getDoctors: (hospitalId) => request(`/hospitals/${hospitalId}/doctors`),
  bookAppointment: (payload) =>
    request("/appointments", { method: "POST", body: JSON.stringify(payload) }),
  getDoctorAppointments: (doctorId) =>
    request(`/doctors/${doctorId}/appointments`),
};