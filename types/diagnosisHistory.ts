export interface DiagnosisRecord {
    id: string;
    patientName: string;
    patientAge: number;
    patientGender: 'male' | 'female' | 'other';
    date: string;
    symptoms: string;
    diagnosis: string;
    medication: string;
    needHospital: boolean;
}

export interface DoctorInfo {
    name: string;
    specialization: string;
    licenseNumber: string;
}

