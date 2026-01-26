
import { CARD, TEXT_SIZE } from '@/constants/styles';
import i18n from '@/services/i18nService';
import { DiagnosisRecord } from '@/types/diagnosisHistory';
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
  records?: DiagnosisRecord[];
  onRecordPress?: (record: DiagnosisRecord) => void;
}


const DiagnosisHistoryComp: React.FC<DiagnosisHistoryScreenProps> = ({
  records = [],
  onRecordPress,
}) => {

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'hospital'>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const { t } = useTranslation();

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.symptoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'hospital' && record.needHospital);

    // กรองตามวันที่
    const recordDate = new Date(record.timestamps);
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
    return date.toLocaleDateString(i18n.language, {
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
    <SafeAreaView className="flex-1 bg-gray-50 mb-10">
      {/* Header */}
      <View className="pb-6 px-5">

        {/* Search Bar */}
        <View className="bg-white rounded-[24px] flex-row items-center px-4 py-3 border border-gray-200">
          <FontAwesome5 name="search" size={16} color="#9CA3AF" />
          <TextInput
            className={`${TEXT_SIZE.medium} flex-1 ml-3 text-gray-900`}
            placeholder={t('placeholder-searchHistory')}
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
      {records.length > 0 && (
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
              {t('all')} ({records.length})
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
              {t('sendedHospital')} (
              {records.filter((r) => r.needHospital).length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
)}

      {/* Records List */}
      <ScrollView className="flex-1 px-5 my-4">
        {filteredRecords.length === 0 ? (
          <View className="items-center justify-center py-20">
            <FontAwesome5 name="folder-open" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg mt-4">
              {t('noData')}
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
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center flex-1">
                  <View className="flex-1">
                    <Text className={`${CARD.title} text-gray-900`}>
                      {record.patientName}
                    </Text>
                    <View className='flex-row items-center gap-2'>
                      <Text className={`${CARD.subtitle} text-gray-600 `}>
                        {t('age')}: {record.patientAge} {t('years')}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="flex-row justify-end items-center mb-4 ">
                  <Text className={`${CARD.subtitle} text-blue-600 font-medium mr-2`}>
                    {t('detail')}
                  </Text>
                  <FontAwesome5 name="chevron-right" size={12} color="#2563eb" />
                </View>
              </View>

              <View className='flex-row items-center gap-4 mt-4'>
                {/* Date */}
                <View className="flex-row items-center">
                  <FontAwesome5 name="calendar" size={12} color="#6B7280" />
                  <Text className={`${CARD.subtitle} text-gray-600 ml-2`}>
                    {formatDate(record.timestamps)}
                  </Text>
                </View>
                {/* เวลาที่ใช้ */}
                <View className="flex-row items-center">
                  <FontAwesome5 name="clock" size={12} color="#6B7280" />
                  <Text className={`${CARD.subtitle} text-gray-600 ml-2`}>
                    {record.timeSpent} {t('minute')}
                  </Text>
                </View>

                {record.needHospital && (
                  <View className="flex-row items-center">
                    <View className="bg-orange-100 rounded-full px-3 py-1  ">
                      <Text className="text-orange-700 text-xs font-semibold">
                        {t('sendedHospital')}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>


    </SafeAreaView>
  );
};

export default DiagnosisHistoryComp;
