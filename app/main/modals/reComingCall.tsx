import { emitSocket } from "@/utilitys/socket";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReComingCall() {
  const { consultId } = useLocalSearchParams<{
    consultId: string;
  }>();
  const { t } = useTranslation();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft <= 0) {
      router.back();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const acceptCase = () => {
    emitSocket("doctor:accept", { caseId: consultId });

    router.replace({
      pathname: "/main/pages/preCallPage",
      params: {
        consultId: consultId,
        type: "doctor",
      },
    });
  };

  const rejectCase = () => {
    emitSocket("doctor:reject", { caseId: consultId });

    router.back();
  };

  return (
    <SafeAreaView className="flex-1 justify-end bg-black/40">
      {/* Bottom Sheet */}
      <View className="bg-white rounded-t-3xl px-6 pt-6 pb-8">
        {/* Handle */}
        <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4" />

        {/* Title */}
        <Text className="text-xl font-bold text-center text-gray-900">
          {t("comming-call-title")}
        </Text>

        {/* Description */}
        <Text className="text-center text-gray-500 mt-2">
          {t("comming-call-description")}
        </Text>

        {/* Countdown */}
        <View className="mt-4 mb-6 items-center">
          <Text className="text-sm text-gray-500">{t("comming-call-confirm-time")}</Text>
          <Text className="text-4xl font-bold text-blue-600 mt-1">
            {timeLeft}
          </Text>
          <Text className="text-sm text-gray-500">{t("comming-call-seconds")}</Text>
        </View>

        {/* Accept Button */}
        <Pressable
          onPress={acceptCase}
          className="bg-blue-500 py-4 rounded-2xl active:scale-95"
        >
          <Text className="text-white text-center text-lg font-semibold">
            {t("comming-call-accept")}
          </Text>
        </Pressable>

        {/* Reject Button */}
        <Pressable
          onPress={rejectCase}
          className="bg-red-300 py-4 rounded-2xl mt-3 active:scale-95"
        >
          <Text className="text-white text-center text-lg font-semibold">
            {t("comming-call-decline")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
