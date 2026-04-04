import Provider from "@/services/providerService";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface Step1PersonalInfoProps {
  isProfileIncomplete: string | string[] | undefined;
  profileImage: any;
  idCardDisplay: string;
  idError: string;
  fullName: string;
  birtDate: string;
  birtDateShow: string;
  gender: number;
  address: string;
  isDatePickerVisible: boolean;
  onPickImage: () => void;
  onIdChange: (text: string) => void;
  onFullNameChange: (text: string) => void;
  onShowDatePicker: () => void;
  onHideDatePicker: () => void;
  onConfirmDate: (date: Date) => void;
  onGenderChange: (value: number) => void;
  onAddressChange: (text: string) => void;
}

const Step1PersonalInfo: React.FC<Step1PersonalInfoProps> = ({
  isProfileIncomplete,
  profileImage,
  idCardDisplay,
  idError,
  fullName,
  birtDate,
  birtDateShow,
  gender,
  address,
  isDatePickerVisible,
  onPickImage,
  onIdChange,
  onFullNameChange,
  onShowDatePicker,
  onHideDatePicker,
  onConfirmDate,
  onGenderChange,
  onAddressChange,
}) => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 gap-y-4">
      {/* Profile Photo */}
      <View className="items-center mb-6">
        {!isProfileIncomplete && (
          <Text className="mt-4 text-2xl font-bold text-[#000000] mb-8 text-center">
            {t("manage_profile")}
          </Text>
        )}

        <View className="relative">
          {Provider.Profile?.profile_image_url || profileImage?.uri ? (
            <View>
              <Image
                source={{
                  uri: profileImage?.uri
                    ? profileImage.uri
                    : Provider.Profile?.profile_image_url
                      ? Provider.HostApi + Provider.Profile.profile_image_url
                      : undefined,
                }}
                className="absolute w-40 h-40 rounded-xl z-10"
              />
              <View className="w-40 h-40 rounded-xl bg-[#2196F3] items-center justify-center">
                <Text className="text-primary-content text-2xl font-bold">
                  {Provider.Profile?.name?.charAt(0)?.toUpperCase()}
                </Text>
              </View>
            </View>
          ) : (
            <View className="w-40 h-40 rounded-xl bg-[#2196F3] items-center justify-center">
              <Text className="text-primary-content text-2xl font-bold">
                {Provider.Profile?.name?.charAt(0)?.toUpperCase() || " "}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={onPickImage}
            className="absolute bottom-0 right-0 bg-[#6abcff] rounded-full p-2 z-20 shadow-xl"
          >
            <Ionicons name="camera" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <Text className="text-lg font-bold text-[#000000] mt-2 mb-2">
        {t("personal_information")}
      </Text>

      {/* ID Card */}
      {isProfileIncomplete && (
        <View className="flex-1 gap-y-2">
          <Text className="px-2 text-[#000000]/60">{t("id-card")}</Text>
          <TextInput
            className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] ${
              idError
                ? "border-[#e20000]"
                : idCardDisplay
                  ? "border-[#1f2937]"
                  : "border-[#9ca3af]"
            }`}
            placeholder={t("id_card_placeholder")}
            keyboardType="numeric"
            value={idCardDisplay}
            onChangeText={onIdChange}
          />
          {idError ? (
            <Text className="text-red-500 px-2 text-sm">{idError}</Text>
          ) : null}
        </View>
      )}

      {/* Full Name */}
      <View className="flex-1 gap-y-2">
        <Text className="px-2 text-[#000000]/60">{t("historyDetail.name")}</Text>
        <TextInput
          className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] placeholder:text-[#9ca3af] focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] ${
            fullName ? "border-[#1f2937]" : "border-[#9ca3af]"
          }`}
          value={fullName}
          placeholder={t("profile.enter-full-name")}
          onChangeText={onFullNameChange}
        />
      </View>

      {/* Date of Birth */}
      <View className="flex-1 gap-y-2">
        <Text className="px-2 text-[#000000]/60">{t("date_of_birth")}</Text>
        <TouchableOpacity
          className={`flex justify-center h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] ${
            birtDate ? "border-[#1f2937]" : "border-[#9ca3af]"
          }`}
          onPress={onShowDatePicker}
        >
          <Text className={birtDate ? "text-[#000000]" : "text-[#9ca3af]"}>
            {birtDate ? birtDateShow : t("date_placeholder")}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          maximumDate={new Date()}
          onConfirm={onConfirmDate}
          onCancel={onHideDatePicker}
        />
      </View>

      {/* Gender */}
      <View className="flex-1 gap-y-2">
        <Text className="px-2 text-[#000000]/60">{t("historyDetail.gender")}</Text>
        <View
          className={`h-[56px] mb-[8px] rounded-[24px] border-[1px] justify-center px-2 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] ${
            gender ? "border-[#1f2937]" : "border-[#9ca3af]"
          }`}
        >
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => onGenderChange(itemValue)}
            dropdownIconColor="#000"
            style={{ color: gender ? "#111827" : "#9ca3af" }}
          >
            <Picker.Item label={t("select_gender")} value={0} enabled={false} />
            <Picker.Item label={t("gender_male")} value={1} />
            <Picker.Item label={t("gender_female")} value={2} />
          </Picker>
        </View>
      </View>

      {/* Address */}
      <View className="flex-1 gap-y-2">
        <Text className="px-2 text-[#000000]/60">{t("address")}</Text>
        <TextInput
          className={`min-h-[120px] p-4 mb-[8px] rounded-[24px] border-[1px] text-[#000000] focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] ${
            address ? "border-[#1f2937]" : "border-[#9ca3af]"
          }`}
          value={address}
          onChangeText={onAddressChange}
          multiline
          numberOfLines={4}
          style={{ textAlignVertical: "top" }}
          placeholder={t("enter_address")}
        />
      </View>
    </View>
  );
};

export default Step1PersonalInfo;