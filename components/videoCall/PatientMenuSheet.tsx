import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import MenuCard from "@/components/menuCard";
import Provider from "@/services/providerService";
import { PatientInfo } from "@/types/patientData";

interface PatientMenuSheetProps {
  activeMenu:
    | "menu"
    | "patient"
    | "diagnosis"
    | "sumDiagnosis"
    | "history"
    | "showDetailHistory";

  overlayTop: number;
  insets: { bottom: number };
  patientInfo: PatientInfo | null;

  setActiveMenu: (
    menu:
      | "menu"
      | "patient"
      | "diagnosis"
      | "sumDiagnosis"
      | "history"
      | "showDetailHistory"
  ) => void;

  handleLeave: () => void;
}


const PatientMenuSheet: React.FC<PatientMenuSheetProps> = ({
  activeMenu,
  overlayTop,
  insets,
  patientInfo,
  setActiveMenu,
  handleLeave,
}) => {
  const { t } = useTranslation();

  if (activeMenu !== "menu") return null;

  return (
    <View
      className="flex flex-col justify-between absolute left-0 right-0 bg-white rounded-t-[16px]"
      style={{
        top: overlayTop,
        bottom: insets.bottom,
      }}
    >
      <ScrollView className="p-4 pt-0 pb-12 mt-[16px]">
        {/* Profile */}
        <View className="flex-1 flex-row items-center mx-4 mt-4">
          <View className="">
            {patientInfo?.profile_image_url ? (
            <View className="relative">
              <Image
                source={{
                  uri: Provider.HostApi + patientInfo.profile_image_url,
                }}
                style={{ height: "100%", borderRadius: 16, position:"absolute" }}
                resizeMode="contain"
              />
                    <View className="w-20 h-20 rounded-xl bg-blue-500  items-center justify-center">
                      <Text className="text-white text-2xl font-bold">{patientInfo?.name?.charAt(0).toUpperCase()}</Text>
                    </View>
                  </View>
            ) : (
                  <View className="w-20 h-20 rounded-xl bg-blue-500 items-center justify-center">
                    <Text className="text-white text-2xl font-bold">{patientInfo?.name?.charAt(0).toUpperCase()}</Text>
                  </View>
            )}
          </View>

          <View className="flex-1 ml-2">
            <Text className="text-black my-1">
              {patientInfo?.name || t("N/A")}
            </Text>
            <Text className="text-gray-500 mb-1">
              {t("age")} : {patientInfo?.age || t("N/A")}
            </Text>
          </View>
        </View>

        <View className="flex-row border-t border-gray-200 m-4 mt-8" />

        {/* Menu */}
        <MenuCard
          title={t("patient-data")}
          detail={t("view-patient-data")}
          icon="user-md"
          onPress={() => setActiveMenu("patient")}
        />

        <MenuCard
          title={t("history")}
          detail={t("MedicalHistory")}
          icon="history"
          onPress={() => setActiveMenu("history")}
        />

        <MenuCard
          title={t("diagnosis")}
          detail={t("clinical-assessment")}
          icon="stethoscope"
          onPress={() => setActiveMenu("diagnosis")}
        />
      </ScrollView>

      {/* End Case */}
      <Pressable
        onPress={handleLeave}
        className="m-4 h-[56px] rounded-[16px] items-center justify-center bg-[#FB6469]"
      >
        <View className="flex-row items-center gap-2">
          <FontAwesome name="phone" size={18} color="white" />
          <Text className="text-white">{t("end-case")}</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default PatientMenuSheet;
