export interface PatientDataForm {
    symptoms: string;
    userName?: string;
    doctorNote: string;
    diagnosis: string;
    medication: string;
    needHospital: boolean;
}

export interface PatientInfo {
  patient_id: number;
  name: string;
  age: number;
  birthday: string; 
  sex: number; 
  profile_image_url?: string;
}

export interface ConsultInfo {
  caseId: string;
  patient_info: PatientInfo;
}

export interface AddTreatmentPayload {
  consult_id: string;
  symptoms: string;
  diagnosis: string;
  medication: string;
  need_hospital: boolean;
  note: string;
}

export interface Measurement {
  id: number;
  device_id: string;
  created_at: string;
  values: Record<string, any>;
}

export interface PatientMeasurement {
  bf: Measurement[];
  bmi: Measurement[];
  bo: Measurement[];
  bp: Measurement[];
  bs: Measurement[];
  ecg: Measurement[];
  eye: Measurement[];
  ncg: Measurement[];
  temp: Measurement[];
  thxhdb: Measurement[];
  whr: Measurement[];
  xzsx: Measurement[];
}