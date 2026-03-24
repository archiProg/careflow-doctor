import Provider from "@/services/providerService";
import { RootState } from "@/stores";
import { setConsultId, setConsultInfo } from "@/stores/consultSlice";
import {
  closeSocket,
  emitSocket,
  getSocket,
  listenSocket,
  offSocket,
} from "@/utilitys/socket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";



export default function MainLayout() {
  const { t } = useTranslation();
  const { status } = useSelector((state: RootState) => state.work);
  const { startWork, times } = useSelector(
    (state: RootState) => state.work
  );

  const router = useRouter();
  const dispatch = useDispatch();

  const getStartAndEndTime = () => {
    const startStr = startWork;
    const timeStr = times;


    if (!startStr || !timeStr) return null;

    // 1. starttime → unix ms
    const startTimeMs = new Date(startStr).getTime();

    // 2. แปลง "01:00" → milliseconds
    const [hours, minutes] = timeStr.split(":").map(Number);
    const durationMs = (hours * 60 * 60 + minutes * 60) * 1000;

    // 3. endtime = start + duration
    const endTimeMs = startTimeMs + durationMs;
    console.log("66666666", startTimeMs, endTimeMs);

    return {
      startTimeMs,
      endTimeMs,
    };
  };



  useEffect(() => {
    if (Provider.Token != "") {
      getSocket();
      listenSocket({
        "case:offer": (data) => {
          console.log("📨 case:offer", data)
          dispatch(setConsultInfo(data));
          dispatch(setConsultId(data.caseId));
          router.push({
            pathname: "/main/modals/inComingCall",
            params: {
              consultId: data.caseId,
            },
          });
        },
        "case:ended": (data) => console.log("📴 case:ended", data),
        "case:cancelled": (data) => console.log("❌ case:cancelled", data),
        "case:resume": (data) => {
          console.log("📨 case:resume", data)
          dispatch(setConsultInfo(data));
          dispatch(setConsultId(data.caseId));
          router.push({
            pathname: "/main/modals/reComingCall",
            params: {
              consultId: data.caseId,
            },
          });
        },
        "doctor:status": (data) => console.log("🩺 doctor:status", data),
        "force-logout": () => {
          Alert.alert(
            t("logout"),
            t("account-logged-out-other-device"),
            [
              {
                text: t("ok"),
                onPress: async () => {
                  await AsyncStorage.multiRemove(["email", "password", "token", "user"]);
                  closeSocket();
                  dispatch(setConsultId(null));
                  router.replace("/");
                },
              },
            ]
          );
        },

      });

      return () => {
        offSocket("case:offer");
        offSocket("case:ended");
        offSocket("case:cancelled");
        offSocket("case:resume");
        offSocket("doctor:status");
        offSocket("force-logout");
      };
    }
  }, []);



  useEffect(() => {
    if (!Provider.Token) return;

    const run = async () => {
      if (status === "start_work") {
        const result = await getStartAndEndTime();
        if (!result) return;

        const { startTimeMs, endTimeMs } = result;

        console.log("999999999999999", startTimeMs, endTimeMs);

        emitSocket("doctor:set-availability", {
          available: true,
          shift_time: {
            start: startTimeMs,
            end: endTimeMs,
          },
        });
      }
      else if (status === "paused_work" || status === "end_work") {
        emitSocket("doctor:set-availability", {
          available: false,
          shift_time: null,
        });
      }
    };

    run();
  }, [status]);


  return <Stack
    screenOptions={{
      headerShown: false,
    }}
  >
    {/* Tabs */}
    <Stack.Screen name="(tabs)" />

    {/* Incoming call modal */}
    <Stack.Screen
      name="/main/modals/incomingCall"
      options={{
        presentation: "transparentModal",
        animation: "slide_from_bottom",
      }}
    />
    <Stack.Screen
      name="/main/modals/reComingCall"
      options={{
        presentation: "transparentModal",
        animation: "slide_from_bottom",
      }}
    />
    <Stack.Screen
      name="/main/pages/settingsPage"
      options={{
        presentation: "transparentModal",
        animation: "slide_from_bottom",
      }}
    />


  </Stack>;
}
