export interface DoctorNewJob {
  additional: string;
  consult_id: string;
  duration: string;
  id_specialty: number;
  patient: Patient;
  severity: string;
  specialty: string;
  status: string;
  symptoms: string;
}

export interface Patient {
  blood_group: any;
  congenital_disease: any;
  drug_allergy: any;
  name: string;
  patient_id: number;
  profile_image_url: any;
  sex: number;
}
