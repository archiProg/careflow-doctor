import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TextInput, View } from "react-native";

interface Step2ProfessionalInfoProps {
  specialization: string;
  licenseNumber: string;
  experience: string;
  hospital: string;
  profileDesc: string;
  onSpecializationChange: (text: string) => void;
  onLicenseNumberChange: (text: string) => void;
  onExperienceChange: (text: string) => void;
  onHospitalChange: (text: string) => void;
  onProfileDescChange: (text: string) => void;
}

const Step2ProfessionalInfo: React.FC<Step2ProfessionalInfoProps> = ({
  specialization,
  licenseNumber,
  experience,
  hospital,
  profileDesc,
  onSpecializationChange,
  onLicenseNumberChange,
  onExperienceChange,
  onHospitalChange,
  onProfileDescChange,
}) => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 gap-y-4">
      <Text className="text-lg font-bold text-[#000000] mt-6 mb-2">
        {t("professional_information")}
      </Text>

      {/* Specialization */}
      <View className="flex-1 gap-y-2">
        <Text className="px-2 text-[#000000]/60">{t("specialization")}</Text>
        <TextInput
          className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-[#9ca3af] text-[#000000] ${
            specialization ? "border-[#1f2937]" : "border-[#9ca3af]"
          }`}
          value={specialization}
          onChangeText={onSpecializationChange}
        />
      </View>

      {/* Medical License Number */}
      <View className="flex-1 gap-y-2">
        <Text className="px-2 text-[#000000]/60">
          {t("medical_license_number")}
        </Text>
        <TextInput
          className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-[#9ca3af] text-[#000000] ${
            licenseNumber ? "border-[#1f2937]" : "border-[#9ca3af]"
          }`}
          value={licenseNumber}
          onChangeText={onLicenseNumberChange}
        />
      </View>

      {/* Experience */}
      <View className="flex-1 gap-y-2">
        <Text className="px-2 text-[#000000]/60">{t("experience")}</Text>
        <TextInput
          className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-[#9ca3af] text-[#000000] ${
            experience ? "border-[#1f2937]" : "border-[#9ca3af]"
          }`}
          keyboardType="numeric"
          value={experience}
          onChangeText={onExperienceChange}
        />
      </View>

      {/* Affiliated Hospital */}
      <View className="flex-1 gap-y-2">
        <Text className="px-2 text-[#000000]/60">
          {t("affiliated_hospital")}
        </Text>
        <TextInput
          className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-[#9ca3af] text-[#000000] ${
            hospital ? "border-[#1f2937]" : "border-[#9ca3af]"
          }`}
          value={hospital}
          onChangeText={onHospitalChange}
        />
      </View>

      {/* Profile Description */}
      <View className="flex-1 gap-y-2">
        <Text className="px-2 text-[#000000]/60">
          {t("profile_description")}
        </Text>
        <TextInput
          className={`min-h-[100px] py-4 mb-[8px] rounded-[24px] px-4 border-[1px] focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-[#9ca3af] text-[#000000] ${
            profileDesc ? "border-[#1f2937]" : "border-[#9ca3af]"
          }`}
          multiline
          style={{ textAlignVertical: "top" }}
          value={profileDesc}
          onChangeText={onProfileDescChange}
        />
      </View>
    </View>
  );
};

export default Step2ProfessionalInfo;