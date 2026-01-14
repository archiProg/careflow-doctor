import Card from "@/components/card";
import { BG, CARD } from "@/constants/styles";
import FormatWorkTime from "@/hooks/useFormatDate";
import Provider from "@/services/providerService";
import { AppDispatch, RootState } from "@/stores/index";

import {
  paused_work,
  resetWork,
  resume_work,
  setStatus,
} from "@/stores/workSlice";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  Image,
  ScrollView,
  Text,
  useColorScheme,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const DoctorHomeScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const { status, startWork, times } = useSelector(
    (state: RootState) => state.work
  );
  const [description, setDescription] = useState("");
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const router = useRouter();

  const checkWork = async () => {

    const start = await AsyncStorage.getItem("start_work");
    const times = await AsyncStorage.getItem("times_work");
    const paused = await AsyncStorage.getItem("paused_work");

    if (!start || !times) {
      setDescription("ยังไม่ได้เริ่มงาน");
      dispatch(setStatus("end_work"));

      return;
    }

    dispatch(setStatus(paused ? "paused_work" : "start_work"));

    const startDate = new Date(start);
    const [h, m] = times.split(":").map(Number);

    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + h);
    endDate.setMinutes(endDate.getMinutes() + m);

    if (endDate < new Date()) {
      AsyncStorage.removeItem("start_work");
      AsyncStorage.removeItem("times_work");
      AsyncStorage.removeItem("paused_work");
      dispatch(resetWork());
      setDescription("ยังไม่ได้เริ่มงาน");
      dispatch(setStatus("end_work"));

      return;
    }
    const sameDay = startDate.toDateString() === endDate.toDateString();
    const s = FormatWorkTime(startDate.toISOString()).split(" ");
    const e = FormatWorkTime(endDate.toISOString()).split(" ");
    setDescription(
      sameDay
        ? `Shift ${s.slice(1).join(" ")} - ${e.slice(1).join(" ")}`
        : `Shift ${s.slice(1).join(" ")} - ${e.slice(1).join(" ")} (Tomorrow)`
    );


  };

  const handleStartWork = () => router.push("/main/pages/searchPatientPage");

  useEffect(() => {
    checkWork();
    let interval: ReturnType<typeof setInterval> | null = null;
    if (["start_work", "paused_work"].includes(status)) {
      interval = setInterval(checkWork, 60000);
    }

    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [status]);

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const getStatusBadge = () => {
    if (status === "start_work") {
      return (
        <View className="bg-green-500 px-3 py-1 rounded-full flex-row items-center">
          <View className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
          <Text className="text-white text-xs font-semibold">Active</Text>
        </View>
      );
    }
    if (status === "paused_work") {
      return (
        <View className="bg-orange-500 px-3 py-1 rounded-full flex-row items-center">
          <FontAwesome5
            name="pause"
            size={10}
            color={colorScheme === "dark" ? "#fff" : "#000"}
          />
          <Text className="text-white text-xs pl-2 font-semibold">Paused</Text>
        </View>
      );
    }
    return (
      <View className="bg-gray-400 dark:bg-gray-600 px-3 py-1 rounded-full">
        <Text className="text-white text-xs font-semibold">Offline</Text>
      </View>
    );
  };

  return (
    <SafeAreaView className={`${BG.default} bg-secondary flex-1`}>
      <ScrollView className="flex-1 px-2" showsVerticalScrollIndicator={false}>
        {/* Greeting Section */}
        <View className="pt-4 pb-6">
          <Text className="text-gray-500 dark:text-gray-400 text-md mb-1">
            {new Date().getHours() < 12
              ? "Good Morning"
              : new Date().getHours() < 18
                ? "Good Afternoon"
                : "Good Evening"}
          </Text>
          <Text className="text-3xl font-bold text-black dark:text-white">
            Welcome Back
          </Text>
        </View>

        {/* Profile Card */}
        <View
          className={`${CARD.body} bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-800`}
        >
          <View className="flex-row items-center">
            {/* Profile Image */}
            <View className="relative">
              {Provider.Profile?.profile_image_url ? (
                <Image
                  source={{
                    uri: Provider.HostApi + Provider.Profile.profile_image_url,
                  }}
                  className="w-20 h-20 rounded-2xl"
                />
              ) : (
                <View className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 items-center justify-center">
                  <FontAwesome name="user-md" size={32} color="" />
                </View>
              )}
              {/* Status Indicator */}
              <View
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${status === "start_work"
                  ? "bg-green-500"
                  : status === "paused_work"
                    ? "bg-orange-500"
                    : "bg-gray-400"
                  }`}
              />
            </View>

            {/* Profile Info */}
            <View className="flex-1 ml-4">
              <Text className={`${CARD.title} text-black dark:text-white mb-1`}>
                {Provider.Profile?.name || "Doctor"}
              </Text>
              <Text
                className={`${CARD.subtitle} text-gray-500 dark:text-gray-400 mb-2`}
              >
                {Provider.Profile?.role
                  ? Provider.Profile.role[0].toUpperCase() +
                  Provider.Profile.role.slice(1)
                  : "Medical Professional"}
              </Text>
              {getStatusBadge()}
            </View>
          </View>
        </View>

        {/* Main Work Card */}
        <View className="mb-6">
          <Card
            title={t("doctor_title_search")}
            subtitle={description}
            urldetail={`/main/pages/searchPatientPage`}
            className="bg-blue-500 text-white"
            actions={
              status === "start_work" || status === "paused_work"
                ? [
                  status === "start_work"
                    ? {
                      label: "Pause",
                      onPress: () => dispatch(paused_work()),
                    }
                    : {
                      label: "Resume",
                      onPress: () => dispatch(resume_work()),
                    },
                  { label: "End", onPress: () => dispatch(resetWork()) },
                ]
                : [{ label: "Start", onPress: handleStartWork }]
            }
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default DoctorHomeScreen;
