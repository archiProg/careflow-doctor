import Provider from "@/services/providerService";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const ManageProfilePage = () => {
  const { height, width } = useWindowDimensions();
  const BASE_WIDTH = width > height ? height : width;
  const [name, setName] = useState(Provider.Profile?.name || "");
  const [email, setEmail] = useState(Provider.Profile?.email || "");
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const handleSave = () => {
    console.log("Save profile:", { name, email });
  };

  const handleChangePhoto = () => {
    console.log("Change photo");
  };

  const handleBack = () => {
    router.back();
  };


  //back handler
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

  const isDisable = name === Provider.Profile?.name && email === Provider.Profile?.email || !name || !email;

  return (
    <SafeAreaView className="flex-1 h-full bg-white dark:bg-gray-900 justify-center items-center">

      <ScrollView className="flex p-4" style={{ width: BASE_WIDTH }} showsVerticalScrollIndicator={false}
      >
        <View className="flex w-full p-5 justify-start items-start">
          <Pressable
            className="flex-row items-center justify-start px-3 rounded-full"
            onPress={() => {
              router.back();
            }}
          >
            <FontAwesome
              name="angle-left"
              size={36}
              className=" text-black dark:text-white"
              color={colorScheme === "dark" ? "#fff" : "#000"}
            />
          </Pressable>
        </View>
        <View
          className="flex-1"
        >
          {/* Profile Photo */}
          <View className="items-center mb-6">
            <Text className="mt-4 text-2xl font-bold text-gray-800 mb-8 text-center dark:text-white">
              {t("manage_profile")}
            </Text>

            <View className="relative">
              {Provider.Profile?.profile_image_url ? (
                <View>
                  <Image
                    source={{
                      uri: Provider.HostApi + Provider.Profile.profile_image_url,
                    }}
                    className="absolute w-20 h-20 rounded-xl z-10"
                  />
                  <View className="w-20 h-20 rounded-xl bg-blue-500 items-center justify-center">
                    <Text className="text-white text-2xl font-bold">{Provider.Profile?.name.charAt(0).toUpperCase()}</Text>
                  </View>
                </View>
              ) : (
                <View className="w-20 h-20 rounded-xl bg-blue-500 items-center justify-center">
                  <Text className="text-white text-2xl font-bold">{Provider.Profile?.name.charAt(0).toUpperCase()}</Text>
                </View>
              )}

              <TouchableOpacity
                onPress={handleChangePhoto}
                className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2"
              >
                <Ionicons name="camera" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Profile Form */}
          <View className="px-6 pb-6">

            {/* Name Field */}
            <Text className="text-md text-gray-600 mb-2 font-medium">
              {t("profile.full-name")}
            </Text>

            <View className="flex-row items-center bg-white dark:bg-gray-800 rounded-[24px] px-4 py-3 border border-blue-100 dark:border-gray-700">
              <TextInput
                value={name}
                onChangeText={setName}
                className="flex-1 ml-3 text-gray-800 text-md dark:text-white"
                placeholder={t("profile.enter-full-name")}
              />
            </View>

            {/* Email Field */}
            <Text className="text-md text-gray-600 mb-2 font-medium mt-8">
              {t("profile.email")}
            </Text>

            <View className="flex-row items-center bg-white dark:bg-gray-800 rounded-[24px] px-4 py-3 border border-blue-100 dark:border-gray-700">
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 ml-3 text-gray-800 text-md dark:text-white"
                placeholder={t("profile.enter-email")}
              />
            </View>

          </View>

        </View>
        {/* Save Button */}
      </ScrollView>
      <View className="flex p-4" style={{ width: BASE_WIDTH }}
      >
        <TouchableOpacity
          onPress={handleSave}
          disabled={isDisable}
          className={`bg-blue-500 active:bg-blue-700 py-4 rounded-[24px] mb-4 mx-4 ${isDisable ? "opacity-50" : ""}`}
        >
          <Text className="text-white text-base font-semibold text-center">
            {t("common.save")}
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default ManageProfilePage;