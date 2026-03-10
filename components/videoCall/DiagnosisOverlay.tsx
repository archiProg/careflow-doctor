import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import PatientForm from "@/components/patientForm";
import SumDiagnosisComp from "@/components/sumDiagnosisComp";
import { TEXT } from "@/constants/styles";
import { PatientDataForm } from "@/types/patientData";


/* ---------- Types ---------- */

interface DiagnosisOverlayProps {
  activeMenu: "diagnosis" | "sumDiagnosis";

  patientDataForm: any | null;
  onSetPatientDataForm: (data: any) => void;
  onBackToMenu: () => void;
  onReview: () => void;
  onBackToDiagnosis: () => void;
  onSubmit: (data: PatientDataForm) => void;
}

/* ---------- Component ---------- */

const DiagnosisOverlay: React.FC<DiagnosisOverlayProps> = ({
  activeMenu,

  patientDataForm,
  onSetPatientDataForm,
  onBackToMenu,
  onReview,
  onBackToDiagnosis,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <View
      className="flex flex-col justify-between bg-white h-full"
    >
      {/* ---------- Header ---------- */}
      <View className="p-4 flex-row items-center">
        {activeMenu === "sumDiagnosis" ? (
          <View className="w-10" />
        ) : (
          <Pressable
            onPress={onBackToMenu}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <FontAwesome5 name="angle-left" size={24} color="black" />
          </Pressable>
        )}

        <View className="flex-1 items-center">
          <Text className={`${TEXT.subtitle} font-semibold text-gray-900`}>
            {t("diagnosis")}
          </Text>
        </View>
        <View className="w-10" />
      </View>

      {/* ---------- Content ---------- */}
      {activeMenu === "diagnosis" && (
        <PatientForm
          onSetPatientDataForm={onSetPatientDataForm}
          onReview={onReview}
          onCancel={onBackToDiagnosis}
        />
      )}

      {activeMenu === "sumDiagnosis" && (
        <SumDiagnosisComp
          patientDataForm={patientDataForm!}
          onSend={onSubmit}
          onCancel={onBackToDiagnosis}
        />
      )}
    </View>
  );
};

export default DiagnosisOverlay;
