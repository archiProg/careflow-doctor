import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";

import { TEXT } from "@/constants/styles";
import PatientDataCard from "../patientDataCard";
import Provider from "@/services/providerService";

/* ---------- Types ---------- */

interface PatientInfo {
  name?: string;
  age?: number;
  profile_image_url?: string;
}

interface PatientOverlayProps {
  overlayTop: number;
  insets: {
    bottom: number;
  };
  patientInfo: PatientInfo | null;
  statusReq: boolean;
  patientData: any[];
  patientMockData: any[];
  onBackToMenu: () => void;
  onRequestConsent: () => void;
}

/* ---------- Component ---------- */

const PatientOverlay: React.FC<PatientOverlayProps> = ({
  overlayTop,
  insets,
  patientInfo,
  statusReq,
  patientData,
  patientMockData,
  onBackToMenu,
  onRequestConsent,
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
          <View className="relative h-20 min-w-20 bg-black/70 rounded-xl">
            {patientInfo?.profile_image_url ? (
              <Image
                source={{
                  uri: Provider.HostApi + patientInfo.profile_image_url,
                }}
                style={{ height: "100%", borderRadius: 16 }}
                resizeMode="contain"
              />
            ) : (
              <View className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 items-center justify-center">
                <FontAwesome name="user-md" size={32} color="white" />
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

        {/* Patient Data */}
        {statusReq ? (
          <View className="px-4 flex flex-row flex-wrap justify-between gap-y-4 pb-4">
            {patientData.map((item, index) => (
              <PatientDataCard key={index} data={item} loading={false} />
            ))}
          </View>
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
              >
                <Text className="text-white">
                  {t("request-patient-consent")}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PatientOverlay;
