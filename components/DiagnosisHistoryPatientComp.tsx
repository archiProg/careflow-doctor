import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PatientMedicalHistory } from '@/types/diagnosisHistory';

interface DiagnosisHistoryPatientCompProps {
  PatientHistory: PatientMedicalHistory[];
  onPatientRecordPress?: (record: PatientMedicalHistory) => void;
}

const DiagnosisHistoryPatientComp: React.FC<DiagnosisHistoryPatientCompProps> = ({
  PatientHistory,
  onPatientRecordPress
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'hospital'>('all');

  const records = PatientHistory;

  const filteredRecords = records.filter((record) => {
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'hospital' && record.needHospital);

    return matchesFilter;
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getGenderIcon = (gender: string): string => {
    switch (gender) {
      case 'male':
        return 'mars';
      case 'female':
        return 'venus';
      default:
        return 'genderless';
    }
  };

  return (
    <SafeAreaView className="flex-1 ">
      {/* Filter */}
      <View className="">
        <View className="flex-row gap-2">
          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              selectedFilter === 'all' ? 'bg-blue-600' : 'bg-gray-200'
            }`}
            onPress={() => setSelectedFilter('all')}
          >
            <Text
              className={`font-semibold ${
                selectedFilter === 'all' ? 'text-white' : 'text-gray-700'
              }`}
            >
              ทั้งหมด ({records.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              selectedFilter === 'hospital' ? 'bg-orange-400' : 'bg-gray-200'
            }`}
            onPress={() => setSelectedFilter('hospital')}
          >
            <Text
              className={`font-semibold ${
                selectedFilter === 'hospital' ? 'text-white' : 'text-gray-700'
              }`}
            >
              ส่งโรงพยาบาล ({records.filter(r => r.needHospital).length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <ScrollView className="flex-1 py-4">
        {filteredRecords.map((record, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white rounded-xl p-4 mb-3 shadow-md"
            onPress={() => onPatientRecordPress?.(record)}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center flex-1">
                {/* <View className="flex justify-center items-center bg-blue-500 w-[40px] h-[40px] rounded-[24px] p-2 mr-3">
                  <FontAwesome5
                    name={getGenderIcon(PatientHistory.patientGender)}
                    size={20}
                    color="white"
                  />
                </View> */}
                <View className="flex-1">
                  {/* <Text className="text-gray-900 text-lg font-bold">
                    {PatientHistory.patientName}
                  </Text> */}
                  <Text className="text-gray-600 text-sm">
                    {formatDate(record.date)}
                  </Text>
                </View>
              </View>

              {record.needHospital && (
                <View className="bg-orange-100 rounded-full px-3 py-1">
                  <Text className="text-orange-700 text-xs font-semibold">
                    ส่งโรงพยาบาล
                  </Text>
                </View>
              )}
            </View>

            {/* Diagnosis */}
            <Text className="text-gray-700">
              {record.diagnosis}
            </Text>

            {/* Arrow */}
            <View className="flex-row justify-end items-center mt-3">
              <Text className="text-blue-600 text-sm font-semibold mr-1">
                ดูรายละเอียด
              </Text>
              <FontAwesome5 name="chevron-right" size={12} color="#3B82F6" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DiagnosisHistoryPatientComp;
