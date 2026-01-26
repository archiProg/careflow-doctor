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



export interface VitalSigns {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  oxygenSaturation: string;
}

export interface PatientMedicalHistory {
  id: string;
  patientName: string,
  patientAge: number,
  patientGender: string,
  timestamps: string;
  symptoms: string;
  diagnosis: string;
  medication: string;
  needHospital: boolean;
  doctorNote: string;
  timeSpent: number;
}

