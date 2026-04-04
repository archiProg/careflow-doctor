import LoadingComp from "@/components/loadingComp";
import { formatThaiIdPDPC, isValidThaiIdCard } from "@/hooks/useCheckdata";
import Provider from "@/services/providerService";
import { RequestApi } from "@/services/requestApiService";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Step1PersonalInfo from "@/components/Step1personalinfo ";
import Step2ProfessionalInfo from "@/components/Step2professionalinfo ";

const ManageProfilePage = () => {
  const params = useLocalSearchParams();
  const isProfileIncomplete = params.isProfileIncomplete;
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const { height, width } = useWindowDimensions();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState<any>({});
  const [gender, setGender] = useState<number>(0);
  const [specialization, setSpecialization] = useState("");
  const [idCard, setIdCard] = useState("");
  const [idCardDisplay, setIdCardDisplay] = useState("");
  const [idError, setIdError] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [experience, setExperience] = useState("");
  const [hospital, setHospital] = useState("");
  const [profileDesc, setProfileDesc] = useState("");
  const BASE_WIDTH = width > height ? height : width;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [birtDate, setBirtdate] = useState("");
  const [birtDateShow, setBirtdateShow] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleBackPress = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (!isProfileIncomplete && currentStep === 1) {
      router.back();
    }
  };

  const handleLanguageSelector = () => {
    router.push({
      pathname: "/main/pages/settings/languagePage",
      params: {
        reference_page: "loginPage",
      },
    });
  };

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [currentStep]);

  useEffect(() => {
    if (Provider.Profile) {
      const profile = Provider.Profile;
      const doctor = profile.doctor_profile || {};
      setFullName(profile.name || "");
      setIdCard(profile.id_card || "");
      setAddress(profile.address || "");
      setGender(profile.sex ?? 0);
      setProfileImage({ uri: profile.profile_image_url });
      setSpecialization(doctor.specialization_id ? String(doctor.specialization_id) : "");
      setLicenseNumber(doctor.license_number || "");
      setExperience(doctor.years_of_experience ? String(doctor.years_of_experience) : "");
      setHospital(doctor.affiliated_hospital || "");
      setProfileDesc(doctor.profile_detail || "");
      if (profile.birthday) {
        handleConfirm(new Date(profile.birthday));
      }
    }
  }, [Provider.Profile]);

  const handleConfirm = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    setBirtdate(`${month}/${day}/${year}`);
    setBirtdateShow(
      date.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
    );
    hideDatePicker();
  };

  const getMissingFields = () => {
    const missing: string[] = [];
    if (currentStep === 1) {
      if (!profileImage?.uri) missing.push(t("profile_image"));
      if (isProfileIncomplete) {
        if (!idCard) missing.push(t("id-card"));
        if (idError) missing.push(t("id_card_invalid"));
      }
      if (!fullName) missing.push(t("historyDetail.name"));
      if (!birtDate) missing.push(t("date_of_birth"));
      if (gender === 0) missing.push(t("historyDetail.gender"));
      if (!address) missing.push(t("address"));
    } else {
      if (!specialization) missing.push(t("specialization"));
      if (!licenseNumber) missing.push(t("medical_license_number"));
      if (!experience) missing.push(t("experience"));
      if (!hospital) missing.push(t("affiliated_hospital"));
      if (!profileDesc) missing.push(t("profile_description"));
    }
    return missing;
  };

  const validateCurrentStep = () => {
    const missingFields = getMissingFields();
    if (missingFields.length > 0) {
      Alert.alert(
        t("missing_fields_title"),
        t("missing_fields_message", { fields: missingFields.join(", ") }),
        [{ text: t("common.close") }]
      );
      return false;
    }
    return true;
  };

  let isStep1Disable = !fullName || gender === 0 || !birtDate || !address;
  if (isProfileIncomplete) {
    isStep1Disable = !fullName || gender === null || !birtDate || !address || !idCard || idError !== "";
  }
  const isStep2Disable = !specialization || !licenseNumber || !experience || !hospital || !profileDesc;

  const handleSave = async () => {
    if (!validateCurrentStep()) return;
    if (isStep2Disable) return;
    try {
      setIsLoading(true);
      const api = new RequestApi();
      const res1 = await api.postApiJwt(
        "/updateprofile",
        "",
        { name: fullName, gender: String(gender), dateOfBirth: birtDate, address },
        profileImage.uri ? { image1: profileImage.uri.replace("file://", "") } : undefined
      );
      if (!res1.success) throw new Error(res1.response);
      let data1: any = null;
      try { data1 = JSON.parse(res1.response); } catch { data1 = res1.response; }
      if (data1?.success === false) throw new Error(data1.message || "อัปเดตโปรไฟล์ไม่สำเร็จ");
      Alert.alert("สำเร็จ", "บันทึกข้อมูลเรียบร้อยแล้ว 🎉");
    } catch (error: any) {
      Alert.alert("เกิดข้อผิดพลาด", error?.message || "ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t("permission"), t("photo_permission_required"));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setProfileImage({
        uri: asset.uri,
        name: asset.fileName || `photo-${Date.now()}.jpg`,
        type: asset.mimeType || "image/jpeg",
      });
    }
  };

  const handleIdChange = (text: string) => {
    if (!text) return;
    const clean = text.replace(/\D/g, "");
    if (clean.length > 13) return;
    setIdCard(clean);
    if (clean.length === 13) {
      setIdCardDisplay(formatThaiIdPDPC(clean));
      setIdError(isValidThaiIdCard(clean) ? "" : t("id_card_invalid"));
    } else {
      setIdCardDisplay(clean);
      setIdError("");
    }
  };

  useEffect(() => {
    if (idCardDisplay) {
      setIdCard(idCardDisplay.replace(/\D/g, ""));
    }
  }, [idCardDisplay]);

  const handleCreateProfile = async () => {
    if (!validateCurrentStep()) return;
    if (isStep2Disable) return;
    try {
      setIsLoading(true);
      // API calls here
    } catch (error) {
      console.log("Save Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <SafeAreaView className="flex-1 h-full bg-[#ffffff] justify-center items-center">
        {/* Header */}
        <View className="flex flex-row w-full justify-between items-center px-4">
          <Pressable
            className="flex-row items-center justify-center px-3 rounded-full"
            onPress={handleBackPress}
          >
            <FontAwesome
              name="angle-left"
              size={36}
              color={colorScheme === "dark" ? "#ffffff" : "#000000"}
            />
          </Pressable>

          <Text className="text-sm text-primary font-semibold mt-2 text-start">
            {t("step_title", { current: currentStep, total: 2 })}
          </Text>
                      <View className="flex flex-row ">
                          <Pressable
                            className="flex-row items-center justify-center bg-white px-3 py-2 rounded-full shadow"
                            onPress={() => handleLanguageSelector()}
                          >
                            <FontAwesome
                              name="globe"
                              size={24}
                              className=" text-black dark:text-white"
                            />
                          </Pressable>
                      </View>
        </View>

        <ScrollView className="flex p-4" style={{ width: BASE_WIDTH }}>
          {/* Page Header */}
          <View className="items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-[#ffffff] items-center justify-center mb-4 shadow-lg">
              <FontAwesome
                name="address-card"
                size={36}
                color={colorScheme === "dark" ? "#ffffff" : "#000000"}
              />
            </View>
            {isProfileIncomplete && (
              <Text className="text-3xl font-bold text-[#000000] mb-2 text-center">
                {t("create_doctor_account_title")}
              </Text>
            )}
            <Text className="text-base text-[#000000]/60 text-center">
              {t("create_doctor_account_subtitle")}
            </Text>
          </View>

          {/* Step 1 */}
          {currentStep === 1 && (
            <Step1PersonalInfo
              isProfileIncomplete={isProfileIncomplete}
              profileImage={profileImage}
              idCardDisplay={idCardDisplay}
              idError={idError}
              fullName={fullName}
              birtDate={birtDate}
              birtDateShow={birtDateShow}
              gender={gender}
              address={address}
              isDatePickerVisible={isDatePickerVisible}
              onPickImage={pickImage}
              onIdChange={handleIdChange}
              onFullNameChange={setFullName}
              onShowDatePicker={showDatePicker}
              onHideDatePicker={hideDatePicker}
              onConfirmDate={handleConfirm}
              onGenderChange={setGender}
              onAddressChange={setAddress}
            />
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <Step2ProfessionalInfo
              specialization={specialization}
              licenseNumber={licenseNumber}
              experience={experience}
              hospital={hospital}
              profileDesc={profileDesc}
              onSpecializationChange={setSpecialization}
              onLicenseNumberChange={setLicenseNumber}
              onExperienceChange={setExperience}
              onHospitalChange={setHospital}
              onProfileDescChange={setProfileDesc}
            />
          )}

          {/* Buttons */}
          <View className="flex flex-row justify-between w-full mb-[48px] mt-8 py-4 gap-x-4">
            {currentStep === 1 ? (
              <TouchableOpacity
                onPress={() => { if (validateCurrentStep()) setCurrentStep(2); }}
                className={`py-4 flex-1 rounded-[24px] mb-4 ${
                  isStep1Disable ? "bg-[#e5e7eb]" : "bg-[#2196F3] active:bg-[#2196F3]-focus"
                }`}
              >
                <Text className="text-primary-content text-base font-semibold text-center">
                  {t("common.next")}
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setCurrentStep(1)}
                  className="py-4 flex-1 rounded-[24px] mb-4 bg-[#e5e7eb] active:bg-[#e5e7eb]-focus"
                >
                  <Text className="text-neutral-content text-base font-semibold text-center">
                    {t("common.back")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (validateCurrentStep()) {
                      isProfileIncomplete ? handleCreateProfile() : handleSave();
                    }
                  }}
                  className={`py-4 flex-1 rounded-[24px] mb-4 ${
                    isStep2Disable ? "bg-[#e5e7eb]" : "bg-[#2196F3] active:bg-[#2196F3]-focus"
                  }`}
                >
                  <Text className="text-primary-content text-base font-semibold text-center">
                    {t("common.save")}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>

        {isLoading && (
          <SafeAreaView className="absolute w-full h-full flex items-center justify-center bg-[#00000080]">
            <View className="w-48 h-48 rounded-xl bg-[#ffffff] overflow-hidden justify-center items-center">
              <LoadingComp />
            </View>
          </SafeAreaView>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ManageProfilePage;