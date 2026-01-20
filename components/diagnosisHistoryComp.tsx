
import { DiagnosisRecord, DoctorInfo } from '@/types/diagnosisHistory';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

interface DiagnosisHistoryScreenProps {
  doctorInfo: DoctorInfo;
  records: DiagnosisRecord[];
  onRecordPress?: (record: DiagnosisRecord) => void;
}

const DiagnosisHistoryComp: React.FC<DiagnosisHistoryScreenProps> = ({
  doctorInfo,
  records,
  onRecordPress,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'hospital'>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const { t } = useTranslation();

  // กรองข้อมูล
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.symptoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'hospital' && record.needHospital);

    // กรองตามวันที่
    const recordDate = new Date(record.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let matchesDateFilter = true;
    if (selectedDateFilter === 'today') {
      const recordDateOnly = new Date(recordDate);
      recordDateOnly.setHours(0, 0, 0, 0);
      matchesDateFilter = recordDateOnly.getTime() === today.getTime();
    } else if (selectedDateFilter === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      matchesDateFilter = recordDate >= weekAgo;
    } else if (selectedDateFilter === 'month') {
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);
      matchesDateFilter = recordDate >= monthAgo;
    }

    return matchesSearch && matchesFilter && matchesDateFilter;
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
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="pt-4 pb-6 px-5">

        {/* Search Bar */}
        <View className="bg-white rounded-[24px] flex-row items-center px-4 py-3 border border-gray-200">
          <FontAwesome5 name="search" size={16} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-3 text-base text-gray-900"
            placeholder="ค้นหาชื่อผู้ป่วย, อาการ, การวินิจฉัย..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <FontAwesome5 name="times-circle" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="px-5 py-3 ">
        {/* Category Filter */}
        <View className="flex-row gap-2 ">
          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${selectedFilter === 'all' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            onPress={() => setSelectedFilter('all')}
            activeOpacity={0.7}
          >
            <Text
              className={`font-semibold ${selectedFilter === 'all' ? 'text-white' : 'text-gray-700'
                }`}
            >
              ทั้งหมด ({records.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${selectedFilter === 'hospital' ? 'bg-orange-400' : 'bg-gray-200'
              }`}
            onPress={() => setSelectedFilter('hospital')}
            activeOpacity={0.7}
          >
            <Text
              className={`font-semibold ${selectedFilter === 'hospital' ? 'text-white' : 'text-gray-700'
                }`}
            >
              ส่งโรงพยาบาล (
              {records.filter((r) => r.needHospital).length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Records List */}
      <ScrollView className="flex-1 px-5 py-4">
        {filteredRecords.length === 0 ? (
          <View className="items-center justify-center py-20">
            <FontAwesome5 name="folder-open" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg mt-4">
              ไม่พบข้อมูลประวัติการวินิจฉัย
            </Text>
          </View>
        ) : (
          filteredRecords.map((record) => (
            <TouchableOpacity
              key={record.id}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm  "
              onPress={() => onRecordPress?.(record)}
              activeOpacity={0.7}
            >
              {/* Patient Info Header */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  <View className="flex justify-center items-center bg-blue-500 w-[40px] h-[40px] rounded-[24px] p-2 mr-3">
                    <FontAwesome5
                      name={getGenderIcon(record.patientGender)}
                      size={20}
                      color="white"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 text-lg font-bold">
                      {record.patientName}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      {t('age')} {record.patientAge} {t('year')}
                    </Text>
                  </View>
                </View>

                {record.needHospital && (
                  <View className="bg-orange-100 rounded-full px-3 py-1">
                    <Text className="text-orange-700 text-xs font-semibold">
                      {t('sendedHospital')}
                    </Text>
                  </View>
                )}
              </View>

              {/* Date */}
              <View className="flex-row items-center mb-3">
                <FontAwesome5 name="calendar" size={12} color="#6B7280" />
                <Text className="text-gray-600 text-sm ml-2">
                  {formatDate(record.date)}
                </Text>
              </View>


              {/* View Details Arrow */}
              <View className="flex-row justify-end items-center mt-3">
                <Text className="text-blue-600 text-sm font-semibold mr-1">
                  {t('detail')}
                </Text>
                <FontAwesome5 name="chevron-right" size={12} color="#3B82F6" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>


    </SafeAreaView>
  );
};

export default DiagnosisHistoryComp;
