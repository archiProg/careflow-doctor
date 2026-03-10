import { getLocalStream } from "@/hooks/useLocalStream";
import { PermissionService } from "@/services/permissionService";
import Provider from "@/services/providerService";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MediaStream, RTCView } from "react-native-webrtc";

import { RootState } from "@/stores";
import { useKeepAwake } from "expo-keep-awake";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";


const PreCallPage = () => {
  useKeepAwake();
  const { consultId, type } = useLocalSearchParams<{
    consultId: string;
    type: string;
  }>();
  const consultInfo = useSelector((state: RootState) => state.consult.info);
  const { height, width } = useWindowDimensions();
  const router = useRouter();
  const { t } = useTranslation();
  const [settings, setSettings] = useState({ audio: true, video: true });
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const toggleAudio = () => setSettings(p => ({ ...p, audio: !p.audio }));
  const toggleVideo = () => setSettings(p => ({ ...p, video: !p.video }));
  const handleJoinCall = async () => {
    const camGranted = settings.video
      ? await PermissionService.requestCameraPermission()
      : true;
    const micGranted = settings.audio
      ? await PermissionService.requestMicrophonePermission()
      : true;
    if (!camGranted || !micGranted) {
      Alert.alert(t("error.mediaDevicesFailed"));
      return;
    }
    const stream = await getLocalStream(settings.video, settings.audio);
    if (!stream) {
      Alert.alert(t("error.mediaDevicesFailed"));
      return;
    }
    console.log("Local stream tracks:", stream.getTracks().map(t => t.kind));
    setLocalStream(stream);
  };
  // เริ่ม preview ทันทีที่ component mount
  useEffect(() => {
    handleJoinCall();
    return () => {
      localStream?.getTracks().forEach(t => t.stop());
    };
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 p-4 ">
      <View className={`flex-1 ${height < width ? "flex-row" : "flex-col"}`}>
        {/* Video preview */}
        <View className="flex-1 pt-4 pb-16">
          <View className="bg-black rounded-3xl overflow-hidden flex-1">
            {settings.video && localStream ? (
              <RTCView
                key={localStream?.toURL()}
                streamURL={localStream.toURL()}
                style={{ flex: 1, backgroundColor: "black", width: "100%", height: "100%" }}
                objectFit="cover"
                mirror
              />
            ) : (
              <View className="flex-1 justify-center items-center">
                {/* placeholder / avatar */}
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
                <Text className="text-white text-xl font-medium">{t("you")}</Text>
              </View>
            )}
          </View>
          {/* Controls – อยู่บน video, z‑index สูง */}
          <View className="absolute bottom-28 left-0 right-0 flex-row justify-center z-10">
            <TouchableOpacity
              onPress={toggleAudio}
              className="w-14 h-14 rounded-full items-center justify-center mx-3 bg-gray-800"
            >
              <FontAwesome
                name={settings.audio ? "microphone" : "microphone-slash"}
                size={24}
                color="#FFF"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleVideo}
              className="w-14 h-14 rounded-full items-center justify-center mx-3 bg-gray-800"
            >
              <FontAwesome5
                name={settings.video ? "video" : "video-slash"}
                size={20}
                color="#FFF"
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Bottom button – join call */}
        <View
          className={`${height < width ? "flex-1 justify-center" : ""
            } px-6 pb-6 pt-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800`}
        >
          {/* Title */}
          <View className="mb-4">
            <Text className="text-xl font-bold text-gray-900 dark:text-white text-center">
              เตรียมความพร้อม
            </Text>

            {consultInfo?.patient?.name && (
              <Text className="text-gray-500 text-center mt-1">
                คนไข้: {consultInfo.patient.name}
              </Text>
            )}
          </View>

          {/* Status */}
          <View className="flex-row justify-center mb-6">
            <View className="flex-row items-center mr-4">
              <FontAwesome
                name={settings.audio ? "microphone" : "microphone-slash"}
                size={18}
                color={settings.audio ? "#cececeff" : "#ee4444"}
              />
              <Text className="ml-2 text-gray-700 dark:text-gray-300">
                {settings.audio ? "Mic On" : "Mic Off"}
              </Text>
            </View>

            <View className="flex-row items-center">
              <FontAwesome5
                name={settings.video ? "video" : "video-slash"}
                size={16}
                color={settings.video ? "#cececeff" : "#ee4444"}
              />
              <Text className="ml-2 text-gray-700 dark:text-gray-300">
                {settings.video ? "Camera On" : "Camera Off"}
              </Text>
            </View>
          </View>

          {/* Join Button */}
          <Pressable
            onPress={() => {
              if (!consultId) {
                Alert.alert("Consult not found");
                return;
              }

              router.push({
                pathname: "/main/pages/videoCallPage",
                params: {
                  token: Provider.Token,
                  roomId: consultId,
                  userName: Provider.Profile?.name ?? "Unknown",
                  audio: settings.audio ? "1" : "0",
                  video: settings.video ? "1" : "0",
                },
              });
            }}
            className="bg-blue-500 h-14 rounded-2xl justify-center items-center active:scale-95 shadow-lg"
          >
            <Text className="text-white font-bold text-lg">
              {t("joinCall")}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default PreCallPage;
