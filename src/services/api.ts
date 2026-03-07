import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// ── Base instance ─────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api",
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

// ── Auto-attach JWT token to every request ────────────────────────
api.interceptors.request.use((config) => {
    const hospitalToken = localStorage.getItem("hospitalToken");
    const donorToken = localStorage.getItem("donorToken");
    const token = hospitalToken || donorToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ── Global error handler ──────────────────────────────────────────
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("hospitalToken");
            localStorage.removeItem("donorToken");
            window.location.href = "/hospital/login";
        }
        return Promise.reject(error);
    }
);

// ================================================================
// TYPES
// ================================================================

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type DonationType = "Whole Blood" | "Platelets" | "Plasma" | "Red Cells";
export type UrgencyLevel = "Low" | "Medium" | "High" | "Critical";
export type RequestStatus = "pending" | "approved" | "rejected" | "completed";

export interface Hospital {
    _id: string;
    name: string;
    city: string;
    address: string;
    location: { coordinates: [number, number] };
}

export interface DonationRequest {
    _id: string;
    patientName: string;
    disease: string;
    bloodGroup: BloodGroup;
    donationType: DonationType;
    urgency: UrgencyLevel;
    status: RequestStatus;
    contactNumber: string;
    hospitalId: Hospital | string;
    hospitalName: string;
    city: string;
    createdAt: string;
    acceptedBy: string | null;
}

export interface Donor {
    _id: string;
    name: string;
    email: string;
    phone: string;
    age: number;
    bloodGroup: BloodGroup;
    donationTypes: DonationType[];
    city: string;
    isAvailable: boolean;
    lastDonationDate: string | null;
    totalDonations: number;
    location: { coordinates: [number, number] };
}

export interface MatchedDonor extends Donor {
    matchScore: number;
    matchPercent: number;
    distanceKm: number;
    breakdown: Record<string, number>;
}

// ================================================================
// AUTH APIs
// ================================================================

export const authAPI = {

    // Hospital login
    hospitalLogin: async (email: string, password: string) => {
        const res = await api.post("/auth/hospital/login", { email, password });
        localStorage.setItem("hospitalToken", res.data.token);
        localStorage.setItem("hospitalName", res.data.hospital.name);
        localStorage.setItem("hospitalId", res.data.hospital.id);
        return res.data;
    },

    // OTP Generation
    sendOtp: async (email: string): Promise<{ otp: string; message: string }> => {
        // Since the Next Route is at /api/auth/otp, we can use standard fetch or relative axios
        // The baseURL in axios is set to http://localhost:5000/api for backend, so we need to use fetch for Next.js endpoints
        const res = await fetch('/api/auth/otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (!res.ok) throw new Error("Failed to send OTP");
        return res.json();
    },

    // Hospital register
    hospitalRegister: async (data: {
        name: string; email: string; password: string;
        phone: string; city: string; address: string; licenseNumber: string;
    }) => {
        const res = await api.post("/auth/hospital/register", data);
        return res.data;
    },

    // Donor register
    donorRegister: async (data: {
        name: string; email: string; password: string; phone: string;
        age: number; bloodGroup: BloodGroup; donationTypes: DonationType[];
        city: string; lat: number; lng: number;
    }) => {
        const res = await api.post("/auth/donor/register", data);
        localStorage.setItem("donorToken", res.data.token);
        localStorage.setItem("donorName", res.data.donor.name);
        localStorage.setItem("donorId", res.data.donor.id);
        return res.data;
    },

    // Donor login
    donorLogin: async (email: string, password: string) => {
        const res = await api.post("/auth/donor/login", { email, password });
        localStorage.setItem("donorToken", res.data.token);
        localStorage.setItem("donorName", res.data.donor.name);
        return res.data;
    },

    // Patient register
    patientRegister: async (data: {
        name: string; email: string; password: string; phone: string; city: string;
    }) => {
        const res = await api.post("/auth/patient/register", data);
        localStorage.setItem("patientToken", res.data.token);
        localStorage.setItem("patientName", res.data.patient.name);
        return res.data;
    },

    // Patient login
    patientLogin: async (email: string, password: string) => {
        const res = await api.post("/auth/patient/login", { email, password });
        localStorage.setItem("patientToken", res.data.token);
        localStorage.setItem("patientName", res.data.patient.name);
        return res.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem("hospitalToken");
        localStorage.removeItem("hospitalName");
        localStorage.removeItem("hospitalId");
        localStorage.removeItem("donorToken");
        localStorage.removeItem("donorName");
        localStorage.removeItem("donorId");
        localStorage.removeItem("patientToken");
        localStorage.removeItem("patientName");
    },

    // Check if hospital is logged in
    isHospitalLoggedIn: (): boolean => {
        return !!localStorage.getItem("hospitalToken");
    },

    // Check if donor is logged in
    isDonorLoggedIn: (): boolean => {
        return !!localStorage.getItem("donorToken");
    },
};

// ================================================================
// REQUEST APIs
// ================================================================

export const requestAPI = {

    // Patient submits a new request
    submit: async (data: {
        patientName: string; disease: string; bloodGroup: BloodGroup;
        donationType: DonationType; contactNumber: string;
        hospitalId: string; hospitalName: string;
        city: string; urgency: UrgencyLevel;
    }): Promise<{ message: string; request: DonationRequest }> => {
        const res = await api.post("/requests", data);
        return res.data;
    },

    // Hospital gets pending requests
    getPending: async (): Promise<DonationRequest[]> => {
        const res = await api.get("/requests/pending");
        return res.data;
    },

    // Get approved requests for map
    getApproved: async (city?: string): Promise<DonationRequest[]> => {
        const res = await api.get("/requests/approved", {
            params: city ? { city } : {},
        });
        return res.data;
    },

    // Hospital approves a request
    approve: async (id: string): Promise<{ message: string; request: DonationRequest }> => {
        const res = await api.put(`/requests/${id}/approve`);
        return res.data;
    },

    // Hospital rejects a request
    reject: async (id: string, reason?: string): Promise<{ message: string }> => {
        const res = await api.put(`/requests/${id}/reject`, { reason });
        return res.data;
    },

    // Mark as completed
    complete: async (id: string): Promise<{ message: string }> => {
        const res = await api.put(`/requests/${id}/complete`);
        return res.data;
    },

    // Get requests by status (for dashboard tabs)
    getByStatus: async (status: RequestStatus): Promise<DonationRequest[]> => {
        const res = await api.get(`/requests/${status}`);
        return res.data;
    },
};

// ================================================================
// DONOR APIs
// ================================================================

export const donorAPI = {

    // Get current donor profile
    getProfile: async (): Promise<Donor> => {
        const res = await api.get("/donors/me");
        return res.data;
    },

    // Toggle availability
    setAvailability: async (isAvailable: boolean): Promise<{ donor: Donor }> => {
        const res = await api.put("/donors/availability", { isAvailable });
        return res.data;
    },

    // Get AI-matched donors for a request
    getMatches: async (params: {
        bloodGroup: BloodGroup;
        donationType: DonationType;
        lat: number;
        lng: number;
        city: string;
    }): Promise<{ matches: MatchedDonor[] }> => {
        const res = await api.get("/donors/match", { params });
        return res.data;
    },

    // Donor accepts a request
    acceptRequest: async (requestId: string): Promise<{ message: string }> => {
        const res = await api.post(`/donors/accept/${requestId}`);
        return res.data;
    },
};

// ================================================================
// HOSPITAL APIs
// ================================================================

export const hospitalAPI = {

    // Get all verified hospitals (for patient form dropdown)
    getAll: async (city?: string): Promise<Hospital[]> => {
        const res = await api.get("/hospitals", {
            params: city ? { city } : {},
        });
        return res.data;
    },

    // Get single hospital
    getById: async (id: string): Promise<Hospital> => {
        const res = await api.get(`/hospitals/${id}`);
        return res.data;
    },
};

// ================================================================
// HOOKS — simple polling helper
// ================================================================

export const createPoller = (
    fn: () => Promise<void>,
    intervalMs: number = 30000
) => {
    fn(); // run immediately
    const id = setInterval(fn, intervalMs);
    return () => clearInterval(id); // return cleanup function
};

export default api;
