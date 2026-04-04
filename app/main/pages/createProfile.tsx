import LoadingComp from "@/components/loadingComp";
import i18n from "@/services/i18nService";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateProfile = () => {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const { height, width } = useWindowDimensions();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [idCard, setIdCard] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [experience, setExperience] = useState("");
  const [hospital, setHospital] = useState("");
  const [profileDesc, setProfileDesc] = useState("");
  const BASE_WIDTH = width > height ? height : width;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [birtDate, setBirtdate] = useState("");
  const [birtDateShow, setBirtdateShow] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const backAction = () => {
      handleBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, []);

    const handleConfirm = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formatted = `${month}/${day}/${year}`;

    const formatted2 = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    setBirtdate(formatted);
    setBirtdateShow(formatted2);
    console.log(date);

    hideDatePicker();
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView
          className={`h-full bg-white dark:bg-gray-900 justify-center items-center`}
        >
          <View className="flex w-full   justify-start items-start">
            <Pressable
              className="flex-row items-center justify-start px-3 rounded-full"
              onPress={() => {
                handleBack();
              }}
            >
              <FontAwesome
                name="angle-left"
                size={36}
                color={colorScheme === "dark" ? "#fff" : "#000"}
              />
            </Pressable>
          </View>
          <ScrollView className="flex p-4" style={{ width: BASE_WIDTH }}>
            {/* Header */}
            <View className="items-center mb-8">
              <View className="w-16 h-16 rounded-full bg-white items-center justify-center mb-4 shadow-lg">
                <FontAwesome
                  name="address-card"
                  size={36}
                  color={colorScheme === "dark" ? "#fff" : "#000"}
                />
              </View>
              <Text className="text-3xl font-bold text-gray-800 mb-2 text-center dark:text-white">
                {t("create_doctor_account_title")}
              </Text>
              <Text className="text-base text-gray-600 text-center dark:text-gray-400 mb-4">
                {t("create_doctor_account_subtitle")}
              </Text>
            </View>
            <View className="flex-1 gap-y-4">
              {/* Personal */}
              <Text className="text-lg font-bold text-gray-800 mt-6 mb-2 dark:text-white">
                {t("personal_information")}
              </Text>

              <View className='flex-1 gap-y-2'>
                <Text className='px-2 text-gray-600  dark:text-gray-300'>ID Card</Text>
                <TextInput
                  className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}
                  placeholder="1-2345-67890-12-3"
                  keyboardType="numeric"
                  value={idCard}
                  onChangeText={setIdCard}
                />
              </View>

              <View className='flex-1 gap-y-2'>
                <Text className='px-2 text-gray-600  dark:text-gray-300'>{t('historyDetail.name')}</Text>
                <TextInput
                  className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
              <View className='flex-1 gap-y-2'>
                <Text className='px-2 text-gray-600  dark:text-gray-300'>{t('date_of_birth')}</Text>
                <TouchableOpacity className={`flex justify-center h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 ${birtDate ? "" : "text-gray-300"}`} onPress={() => showDatePicker()} >
                  <Text className={` ${birtDate ? "" : "text-gray-400"}`}>
                    {birtDate ? birtDateShow : i18n.language == 'th' ? "ดด/วว/ปปปป" : "mm/dd/yyyy"}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  maximumDate={new Date()}
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />

              </View>
              <View className='flex-1 gap-y-2'>
                <Text className='px-2 text-gray-600  dark:text-gray-300'>{t("historyDetail.gender")}</Text>
                <TextInput
                  className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}
                  value={gender}
                  onChangeText={setGender}
                />
              </View>

              {/* Professional */}
              <Text className="text-lg font-bold text-gray-800 mt-6 mb-2 dark:text-white">
                {t("professional_information")}
              </Text>

              <View className='flex-1 gap-y-2'>
                <Text className='px-2'>{t("specialization")}</Text>
                <TextInput
                  className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}
                  value={specialization}
                  onChangeText={setSpecialization}
                />
              </View>
              <View className='flex-1 gap-y-2'>
                <Text className='px-2 text-gray-600  dark:text-gray-300'>{t("medical_license_number")}</Text>
                <TextInput
                  className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}

                  placeholder={""}
                  value={licenseNumber}
                  onChangeText={setLicenseNumber}
                />
              </View>
              <View className='flex-1 gap-y-2'>
                <Text className='px-2 text-gray-600  dark:text-gray-300'>{t("experience")}</Text>
                <TextInput
                  className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}
                  keyboardType="numeric"
                  value={experience}
                  onChangeText={setExperience}
                />
              </View>
              <View className='flex-1 gap-y-2'>
                <Text className='px-2 text-gray-600  dark:text-gray-300'>{t("affiliated_hospital")}</Text>
                <TextInput
                  className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}
                  value={hospital}
                  onChangeText={setHospital}
                />
              </View>
              <View className='flex-1 gap-y-2'>
                <Text className='px-2 text-gray-600  dark:text-gray-300'>{t("profile_description")}</Text>
                <TextInput
                  className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}
                  multiline
                  value={profileDesc}
                  onChangeText={setProfileDesc}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
      {isLoading && (
        <SafeAreaView className="absolute w-full h-full flex items-center justify-center bg-black/50">
          <View className="w-48 h-48 rounded-xl bg-white overflow-hidden justify-center items-center dark:bg-gray-900">
            <LoadingComp />
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default CreateProfile;
