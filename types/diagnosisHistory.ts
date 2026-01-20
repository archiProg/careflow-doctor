export interface DiagnosisRecord {
    id: string;
    patientName: string;
    patientAge: number;
    patientGender: 'male' | 'female' | 'other';
    timestamps: string;
    symptoms: string;
    diagnosis: string;
    medication: string;
    needHospital: boolean;
    timeSpent: number;
    doctorNote: string;
}


