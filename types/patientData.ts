export interface PatientDataForm {
    symptoms: string;
    userName?: string;
    doctorNote: string;
    medication: string;
    needHospital: boolean;
    timestamp: string;
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
