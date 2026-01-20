
import DiagnosisHistoryComp from '@/components/diagnosisHistoryComp';
import { DiagnosisRecord, DoctorInfo } from '@/types/diagnosisHistory';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
const HistoryScreen: React.FC = () => {
  const doctorInfo: DoctorInfo = {
    name: 'ดร.สมชาย ใจดี',
    specialization: 'อายุรแพทย์ทั่วไป',
    licenseNumber: 'MD-12345',
  };

  const mockRecords: DiagnosisRecord[] = [
    {
      id: '1',
      patientName: 'นางสาวสมหญิง รักสุขภาพ',
      patientAge: 35,
      patientGender: 'female',
      date: '2024-01-15T10:30:00Z',
      symptoms: 'ไข้สูง ปวดศีรษะ คลื่นไส้ อาเจียน',
      diagnosis: 'ไข้หวัดใหญ่ (Influenza) - แนะนำให้พักผ่อน ดื่มน้ำมากๆ',
      medication: 'พาราเซตามอล 500mg วันละ 3 ครั้ง, วิตามินซี',
      needHospital: false,
    },
    {
      id: '2',
      patientName: 'นายสมชาย แข็งแรง',
      patientAge: 52,
      patientGender: 'male',
      date: '2024-01-14T14:20:00Z',
      symptoms: 'เจ็บหน้าอกรุนแรง หายใจลำบาก เหงือออก',
      diagnosis: 'สงสัยโรคหัวใจ - ต้องส่งโรงพยาบาลเพื่อตรวจเพิ่มเติมด่วน',
      medication: 'Aspirin 300mg, NTG sublingual',
      needHospital: true,
    },
    {
      id: '3',
      patientName: 'เด็กหญิงน้ำฝน ยิ้มแย้ม',
      patientAge: 8,
      patientGender: 'female',
      date: '2024-01-13T09:15:00Z',
      symptoms: 'ไอ มีเสมหะ มีไข้เล็กน้อย',
      diagnosis: 'หวัดธรรมดา - พักผ่อนให้เพียงพอ',
      medication: 'ยาแก้ไอสำหรับเด็ก, ยาลดไข้',
      needHospital: false,
    },
  ];

  const handleRecordPress = (record: DiagnosisRecord) => {
    console.log('Selected record:', record);
    // นำไปยังหน้ารายละเอียด
  };

  return (
    <SafeAreaView className='flex-1'>
      <DiagnosisHistoryComp
        doctorInfo={doctorInfo}
        records={mockRecords}
        onRecordPress={handleRecordPress}
      />
    </SafeAreaView>
  );
};

export default HistoryScreen;
