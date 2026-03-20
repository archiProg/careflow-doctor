import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Pressable, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, useWindowDimensions, View } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from 'react-native-safe-area-context';

const SignupPage = () => {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const { height, width } = useWindowDimensions();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setBirtdate(date.toString());
    console.log(date);

    hideDatePicker();
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
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);


  return (
    <SafeAreaView className={`h-full bg-white dark:bg-gray-900 justify-center items-center`}
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
        <View className='flex-1 gap-y-4'>
          {/* Account */}
          <Text className="text-lg font-bold text-gray-800 mt-4 mb-2 dark:text-white">
            {t("account_information")}
          </Text>
          <View className='flex-1 gap-y-2'>
            <Text className='px-2'>Email</Text>
            <TextInput
              className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}
              placeholder={t("placeholder_email")}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View className='flex-1 gap-y-2'>
            <Text className='px-2'>Password</Text>
            <TextInput
              className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}
              placeholder={t("password")}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <View className='flex-1 gap-y-2'>
            <Text className='px-2'>Confirm Password</Text>
            <TextInput
              className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}
              placeholder={t("confirm_password")}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          {/* Personal */}
          <Text className="text-lg font-bold text-gray-800 mt-6 mb-2 dark:text-white">
            {t("personal_information")}
          </Text>

          <View className='flex-1 gap-y-2'>
            <Text className='px-2'>ID Card</Text>
            <TextInput
              className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}
              placeholder={t("id_card")}
              keyboardType="numeric"
              value={idCard}
              onChangeText={setIdCard}
            />
          </View>

          <View className='flex-1 gap-y-2'>
            <Text className='px-2'>Name</Text>
            <TextInput
              className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}
              placeholder={t("full_name")}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
          <View className='flex-1 gap-y-2'>
            <Text className='px-2'>Date of Birth</Text>
            <TouchableOpacity className='flex justify-center h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900' onPress={() => showDatePicker()} >
              <Text>
                {birtDate ? birtDate : "Select Birthday"}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />

          </View>
          <View className='flex-1 gap-y-2'>
            <Text className='px-2'>Gender</Text>
            <TextInput
              className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}
              placeholder={t("gender")}
              value={gender}
              onChangeText={setGender}
            />
          </View>

          {/* Professional */}
          <Text className="text-lg font-bold text-gray-800 mt-6 mb-2 dark:text-white">
            {t("professional_information")}
          </Text>

          <View className='flex-1 gap-y-2'>
            <Text className='px-2'>Specialization</Text>
            <TextInput
              className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}

              placeholder={t("specialization")}
              value={specialization}
              onChangeText={setSpecialization}
            />
          </View>
          <View className='flex-1 gap-y-2'>
            <Text className='px-2'>Medical License Number</Text>
            <TextInput
              className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}

              placeholder={t("license_number")}
              value={licenseNumber}
              onChangeText={setLicenseNumber}
            />
          </View>
          <View className='flex-1 gap-y-2'>
            <Text className='px-2'>Gender</Text>
            <TextInput
              className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}

              placeholder={t("experience")}
              keyboardType="numeric"
              value={experience}
              onChangeText={setExperience}
            />
          </View>
          <View className='flex-1 gap-y-2'>
            <Text className='px-2'>Affiliated Hospital</Text>
            <TextInput
              className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}
              placeholder={t("hospital")}
              value={hospital}
              onChangeText={setHospital}
            />
          </View>
          <View className='flex-1 gap-y-2'>
            <Text className='px-2'>Profile Description</Text>
            <TextInput
              className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}

              placeholder={t("profile_description")}
              multiline
              value={profileDesc}
              onChangeText={setProfileDesc}
            />
          </View>
        </View>
        <TouchableOpacity
          disabled={true}
          className={`bg-black py-4 my-8   rounded-[24px] h-[56px] items-center shadow-lg  dark:bg-[#2196F3] ${true ? "opacity-50" : ""}`}
          onPress={() => { }}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold">{t("send")}</Text>
        </TouchableOpacity>
      </ScrollView>



    </SafeAreaView>
  )

}

export default SignupPage


