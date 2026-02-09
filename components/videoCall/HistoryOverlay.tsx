import React from "react";
import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import { PatientMedicalHistory } from "@/types/diagnosisHistory";
import LoadingMini from "@/components/loadingMini";
import { TEXT } from "@/constants/styles";
import Provider from "@/services/providerService";
import PatientDataCard from "../patientDataCard";
import DiagnosisHistoryPatientComp from "../DiagnosisHistoryPatientComp";

/* ---------- Types ---------- */

interface PatientInfo {
  name?: string;
  age?: number;
  profile_image_url?: string;
}

interface HistoryOverlayProps {
  overlayTop: number;
  insets: {
    bottom: number;
  };
  patientInfo: PatientInfo | null;
  statusReq: boolean;
  medicalHistory: PatientMedicalHistory[] | [];
  patientMockData: any[];
  retryAt: number | null;
  cooldownLeft: number;
  onBackToMenu: () => void;
  onRequestConsent: () => void;
  onPatientRecordPress: (record: any) => void;
}

/* ---------- Component ---------- */

const HistoryOverlay: React.FC<HistoryOverlayProps> = ({
  overlayTop,
  insets,
  patientInfo,
  statusReq,
  retryAt,
  cooldownLeft,
  medicalHistory,
  patientMockData,
  onBackToMenu,
  onRequestConsent,
  onPatientRecordPress,
}) => {
  const { t } = useTranslation();

  return (
    <View
      className="flex flex-col absolute left-0 right-0 bg-white rounded-t-[16px]"
      style={{
        top: overlayTop,
        bottom: insets.bottom,
      }}
    >
      {/* ---------- Header ---------- */}
      <View className="p-4 flex-row items-center">
        <Pressable
          onPress={onBackToMenu}
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
        >
          <FontAwesome5 name="angle-left" size={24} color="black" />
        </Pressable>

        <View className="flex-1 items-center">
          <Text className={`${TEXT.subtitle} font-semibold text-gray-900`}>
            {t("patient-data")}
          </Text>
        </View>

        <View className="w-10" />
      </View>

      {/* ---------- Content ---------- */}
      <ScrollView className="flex-1">
        {/* Profile */}
        <View className="flex-1 flex-row items-center mx-4 mt-4">
          <View className="">
            {patientInfo?.profile_image_url ? (
              <View className="relative">
                <Image
                  source={{
                    uri: Provider.HostApi + patientInfo.profile_image_url,
                  }}
                  style={{
                    height: "100%",
                    borderRadius: 16,
                    position: "absolute",
                  }}
                  resizeMode="contain"
                />
                <View className="w-20 h-20 rounded-xl bg-blue-500  items-center justify-center">
                  <Text className="text-white text-2xl font-bold">
                    {patientInfo?.name?.charAt(0).toUpperCase()}
                  </Text>
                </View>
              </View>
            ) : (
              <View className="w-20 h-20 rounded-xl bg-blue-500 items-center justify-center">
                <Text className="text-white text-2xl font-bold">
                  {patientInfo?.name?.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <View className="flex-1 ml-2">
            <Text className="text-black my-1">
              {patientInfo?.name || t("N/A")}
            </Text>
            <Text className="text-gray-500 mb-1">
              {t("age")} : {patientInfo?.age ?? t("N/A")}
            </Text>
          </View>
        </View>

        <View className="flex-row border-t border-gray-200 m-4" />

        {/* History / Locked View */}
        {statusReq ? (
          medicalHistory && medicalHistory.length > 0 ? (
            <View className="px-4 pb-4">
              <DiagnosisHistoryPatientComp
                PatientHistory={medicalHistory}
                onPatientRecordPress={onPatientRecordPress}
              />
            </View>
          ) : (
            <View>
    <LoadingMini/>
            </View>          )
        ) : (
          <View>
            <View className="px-4 flex flex-row flex-wrap justify-between gap-y-4">
              {patientMockData.map((item, index) => (
                <PatientDataCard key={index} data={item} loading={false} />
              ))}
            </View>

            <BlurView
              intensity={100}
              tint="light"
              className="absolute top-0 left-0 right-0 bottom-0 rounded-xl overflow-hidden p-5 mx-4 justify-center"
            />

            <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center mx-4">
              <Pressable
                className="items-center justify-center bg-[#33AAE1] py-4 px-8 rounded-[16px] shadow-lg"
                onPress={onRequestConsent}
                disabled={!!retryAt}
              >
                <Text className="text-white">
                  {retryAt && cooldownLeft > 0
      ? `กรุณารอ ${cooldownLeft} วินาที`
      :t("request-patient-consent")}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HistoryOverlay;
