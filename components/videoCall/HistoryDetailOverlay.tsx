import { PatientMedicalHistory } from "@/types/diagnosisHistory";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

/* ---------- Types ---------- */

export interface HistoryRecord {
  patientName: string;
  patientAge: number;
  patientGender: "male" | "female";
  needHospital: boolean;
  timestamps: string | number | Date;
  symptoms: string;
  diagnosis: string;
  medication: string;
  doctorNote: string;
  timeSpent: number;
}

interface HistoryDetailOverlayProps {
  record: PatientMedicalHistory;
  onBack: () => void;
}

/* ---------- Small Section Component ---------- */

interface SectionProps {
  icon: string;
  title: string;
  children: React.ReactNode;
}

const InfoSection: React.FC<SectionProps> = ({ icon, title, children }) => (
  <View className="bg-white rounded-xl p-4 mb-3">
    <View className="flex-row items-center mb-1">
      <FontAwesome5 name={icon as any} size={14} color="#6B7280" />
      <Text className="ml-2 font-semibold">{title}</Text>
    </View>
    {children}
  </View>
);

/* ---------- Main Component ---------- */

const HistoryDetailOverlay: React.FC<HistoryDetailOverlayProps> = ({
  record,
  onBack,
}) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <View className="flex flex-col justify-between bg-white h-full p-4">
      {/* Header */}
      <View className="flex-row">
        <TouchableOpacity
          onPress={onBack}
          className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center mb-4"
        >
          <FontAwesome5 name="arrow-left" size={18} color="#333" />
        </TouchableOpacity>
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg font-bold mb-4">{t("historyDetail.title")}</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <InfoSection icon="user" title={t("historyDetail.patientInfo")}>
          <Text>
            {t("historyDetail.name")}: {record.patientName}
          </Text>
          <Text>
            {t("historyDetail.age")}: {record.patientAge}{" "}
            {t("historyDetail.year")}
          </Text>
          <Text>
            {t("historyDetail.gender")}:{" "}
            {t(
              record.patientGender === "female"
                ? "historyDetail.female"
                : "historyDetail.male",
            )}
          </Text>
        </InfoSection>

        {record.needHospital && (
          <View className="bg-red-100 rounded-xl p-4 mb-3 flex-row items-center">
            <FontAwesome5 name="ambulance" size={18} color="#DC2626" />
            <Text className="ml-2 text-red-600 font-semibold">
              {t("historyDetail.needHospital")}
            </Text>
          </View>
        )}

        <InfoSection icon="calendar-alt" title={t("historyDetail.visitDate")}>
          <Text>{formatDate(record.timestamps)}</Text>
        </InfoSection>

        <InfoSection icon="notes-medical" title={t("historyDetail.symptoms")}>
          <Text>{record.symptoms}</Text>
        </InfoSection>

        <InfoSection icon="stethoscope" title={t("historyDetail.diagnosis")}>
          <Text>{record.diagnosis}</Text>
        </InfoSection>

        <InfoSection icon="pills" title={t("historyDetail.medication")}>
          <Text>{record.medication}</Text>
        </InfoSection>

        <InfoSection icon="comment-medical" title={t("historyDetail.doctorNote")}>
          <Text>{record.doctorNote}</Text>
        </InfoSection>

        <InfoSection icon="clock" title={t("historyDetail.timeSpent")}>
          <Text>
            {record.timeSpent} {t("historyDetail.minute")}
          </Text>
        </InfoSection>
      </ScrollView>
    </View>
  );
};

export default HistoryDetailOverlay;
