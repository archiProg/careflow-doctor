export type Sex = 1 | 2;

export type UserRole = "doctor" | "patient" | "admin";

export interface DoctorProfile {
    doctor_id: number;
    specialization_id: number;
    license_number: string | null;
    years_of_experience: number | null;
    affiliated_hospital: string | null;
    profile_detail: string | null;
    status: number;
}

export interface PatientProfile {
    patient_id: number;
    blood_type?: string | null;
    chronic_disease?: string | null;
    congenital_disease?: string | null;
    allergies?: string | null;
    emergency_contact_name?: string | null;
    emergency_contact_relationship?: string | null;
    emergency_contact_phone?: string | null;
    height_cm?: number | null;
    weight_kg?: number | null;
    blood_group?: string | null;
}

export interface User {
    id: number;
    id_card: string;
    name: string;
    sex: number;
    email: string;
    password_hash: string;
    role: string;
    profile_image_url: string;
    auth_image_url: string;
    birthday: string;
    address: string;
    doctor_profile: DoctorProfile | null;
    patient_profile: PatientProfile | null;
}
