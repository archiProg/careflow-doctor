import MatchingLoader from "@/components/matchingLoader";
import { BG } from "@/constants/styles";
import i18n from "@/services/i18nService";
import Provider from "@/services/providerService";
import { AppDispatch, RootState } from "@/stores/index";
import {
  paused_work,
  resetWork,
  resume_work,
  setStartWork,
  setStatus,
  setTimesWork,
} from "@/stores/workSlice";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const SearchPatient = () => {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const { status, startWork, times } = useSelector(
    (state: RootState) => state.work
  );
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);

  const startDate = startWork ? new Date(startWork) : new Date();

  // Animations

  const StartWork = async () => {
    const timeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    await AsyncStorage.setItem("start_work", startDate.toISOString());
    await AsyncStorage.setItem("times_work", timeStr);
    await AsyncStorage.removeItem("paused_work");

    dispatch(setStartWork(startDate.toISOString()));
    dispatch(setTimesWork(timeStr));

    dispatch(setStatus("start_work"));
  };

  const backButton = () => {
    router.back();
  };

  useEffect(() => {
    const backAction = () => {
      backButton();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView className={`${BG.default} flex-1`}>
      <View className="flex items-start">
        <Pressable className="px-3 rounded-full" onPress={backButton}>
          <FontAwesome
            name="angle-left"
            size={36}
            className="text-black dark:text-white"
            color={colorScheme === "dark" ? "#fff" : "#000"}
          />
        </Pressable>
      </View>
      {status === "start_work" || status === "paused_work" ? (
        <View className="flex-1 justify-between">
          <View className="flex-1 justify-center items-center px-6">
            <MatchingLoader
              status={status === "start_work"}
              imageUrl={
                Provider.Profile?.profile_image_url
                  ? Provider.HostApi + Provider.Profile.profile_image_url
                  : ""
              }
              type="doctor"
              title={
                status === "start_work"
                  ? t("waiting-for-patient")
                  : t("search-pause-work")
              }
              subtitle={
                status === "start_work"
                  ? t("waiting-for-patient-description")
                  : t("search-pause-work-description")
              }
            />
          </View>
          {/* Bottom Fixed Button */}
          <View className="flex-row justify-between  pt-4 bg-white dark:bg-gray-900    ">
            <Pressable
              onPress={() => {
                if (status === "start_work") {
                  dispatch(paused_work());
                } else {
                  dispatch(resume_work());
                }
              }}
              className="flex-1 flex-row bg-blue-500 h-14 rounded-2xl justify-center items-center active:scale-95 shadow-lg ml-2"
            >
              <FontAwesome
                name={status === "start_work" ? "pause" : "play"}
                size={16}
                color="white"
              />

              <Text className="text-white font-bold text-lg ml-2">
                {status === "start_work" ? t("paused") : t("resume")}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                dispatch(resetWork());
              }}
              className="flex-1 flex-row bg-gray-500 h-14 rounded-2xl justify-center items-center active:scale-95 shadow-lg ml-2"
            >
              <FontAwesome name="stop" size={16} color="white" />
              <Text className="text-white font-bold text-lg ml-2">{t("end")}</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View className="flex-1">
          <ScrollView className="flex-1 px-6">
            {/* Header */}
            <View className="pt-4 pb-8">
              <Text className="text-3xl font-bold text-black dark:text-white">
                {t("set-work-time")}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 mt-2">
                {t("set-work-time-description")}
              </Text>
            </View>

            {/* Start Time Card */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 ml-1">
                {t("set-work-time-start")}
              </Text>
              <Pressable className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-sm active:scale-98">
                <View className="items-center">
                  <Text className="text-4xl font-bold text-black dark:text-white mb-1">
                    {startDate.toLocaleTimeString(i18n.language, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <Text className="text-base text-gray-500 dark:text-gray-400">
                    {startDate.toLocaleDateString(i18n.language, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Duration Card */}
            <View className="mb-8">
              <Text className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 ml-1">
                {t("set-work-time-duration")}
              </Text>
              <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-sm">
                {/* Display Total Time */}
                <View className="items-center mb-6">
                  <Text className="text-5xl font-bold text-black dark:text-white">
                    {String(hours).padStart(2, "0")}:
                    {String(minutes).padStart(2, "0")}
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {t("hour")} : {t("minute")}
                  </Text>
                </View>

                {/* Hour Controls */}
                <View className="mb-4">
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
                    {t("hour")}
                  </Text>
                  <View className="flex-row items-center justify-center gap-4">
                    <Pressable
                      className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center active:scale-95"
                      onPress={() => setHours((h) => Math.max(0, h - 1))}
                    >
                      <Text className="text-2xl font-bold text-black dark:text-white">
                        −
                      </Text>
                    </Pressable>

                    <View className="w-20 h-14 bg-gray-50 dark:bg-gray-900 rounded-xl items-center justify-center">
                      <Text className="text-2xl font-bold text-black dark:text-white">
                        {hours}
                      </Text>
                    </View>

                    <Pressable
                      className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center active:scale-95"
                      onPress={() => setHours((h) => h + 1)}
                    >
                      <Text className="text-2xl font-bold text-black dark:text-white">
                        +
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* Minute Controls */}
                <View>
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
                    {t("minute")}
                  </Text>
                  <View className="flex-row items-center justify-center gap-4">
                    <Pressable
                      className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center active:scale-95"
                      onPress={() => setMinutes((m) => (m - 15 + 60) % 60)}
                    >
                      <Text className="text-2xl font-bold text-black dark:text-white">
                        −
                      </Text>
                    </Pressable>

                    <View className="w-20 h-14 bg-gray-50 dark:bg-gray-900 rounded-xl items-center justify-center">
                      <Text className="text-2xl font-bold text-black dark:text-white">
                        {minutes}
                      </Text>
                    </View>

                    <Pressable
                      className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center active:scale-95"
                      onPress={() => setMinutes((m) => (m + 5) % 60)}
                    >
                      <Text className="text-2xl font-bold text-black dark:text-white">
                        +
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* Quick Presets */}
                <View className="flex-row gap-2 mt-6">
                  <Pressable
                    className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg active:scale-95"
                    onPress={() => {
                      setHours(1);
                      setMinutes(0);
                    }}
                  >
                    <Text className="text-center text-sm font-medium text-black dark:text-white">
                      1 {i18n.language === "th" ? "ชม" : "hr"}.
                    </Text>
                  </Pressable>
                  <Pressable
                    className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg active:scale-95"
                    onPress={() => {
                      setHours(2);
                      setMinutes(0);
                    }}
                  >
                    <Text className="text-center text-sm font-medium text-black dark:text-white">
                      2 {i18n.language === "th" ? "ชม" : "hr"}.
                    </Text>
                  </Pressable>
                  <Pressable
                    className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg active:scale-95"
                    onPress={() => {
                      setHours(4);
                      setMinutes(0);
                    }}
                  >
                    <Text className="text-center text-sm font-medium text-black dark:text-white">
                      4 {i18n.language === "th" ? "ชม" : "hr"}.
                    </Text>
                  </Pressable>
                  <Pressable
                    className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg active:scale-95"
                    onPress={() => {
                      setHours(8);
                      setMinutes(0);
                    }}
                  >
                    <Text className="text-center text-sm font-medium text-black dark:text-white">
                      8 {i18n.language === "th" ? "ชม" : "hr"}.
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Fixed Button */}
          <View className="px-6 pb-6 pt-4 bg-white dark:bg-gray-900">
            <Pressable
              onPress={StartWork}
              className="bg-blue-500 h-14 rounded-2xl justify-center items-center active:scale-98 shadow-lg"
            >
              <Text className="text-white font-bold text-lg">{t("start")}</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchPatient;
