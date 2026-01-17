// src/app/videoCall.tsx
import MenuCard from "@/components/menuCard";
import PatientDataCard from "@/components/patientDataCard";
import PatientForm from "@/components/patientForm";
import ControlButtons from "@/components/rtc/controlButtons";
import LocalVideo from "@/components/rtc/localVideo";
import VideoGrid from "@/components/rtc/videoGrid";
import { user_role } from "@/constants/enums";
import { TEXT } from "@/constants/styles";
import { usePeerConnection } from "@/hooks/usePeerConnection";
import { PeerReducer } from "@/reducers/peerReducer";
import Provider from "@/services/providerService";
import { PatientDataForm } from "@/types/patientData";
import { emitSocket, getSocket } from "@/utilitys/socket";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { BlurView } from 'expo-blur';
import { useKeepAwake } from "expo-keep-awake";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Skeleton } from "moti/skeleton";
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Alert, Dimensions, Image, Pressable, ScrollView, Text, View } from "react-native";
import InCallManager from "react-native-incall-manager";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { mediaDevices, MediaStream } from "react-native-webrtc";

const { height: screenHeight } = Dimensions.get("window");
const videoHeight = Math.max((screenHeight / 3), 280); // h-1/3

const overlayTop = videoHeight - 8; // เลื่อน overlay ขึ้น 16px


const patientMockData = [
  { title: "", value: "", unit: "" },
  { title: "", value: "", unit: "" },
  { title: "", value: "", unit: "" },
  { title: "", value: "", unit: "" },
];

const patientData = [
  { title: "weight", value: "60", unit: "kg" },
  { title: "height", value: "170", unit: "cm" },
  { title: "heart rate", value: "60", unit: "bpm" },
  { title: "blood pressure", value: "120/80", unit: "Sys/Dia" },
  { title: "weight", value: "60", unit: "kg" },
  { title: "height", value: "170", unit: "cm" },
  { title: "heart rate", value: "60", unit: "bpm" },
  { title: "blood pressure", value: "120/80", unit: "Sys/Dia" },
];


export default function DoctorCall() {
  const { roomId, userName, audio, video } = useLocalSearchParams<{
    roomId: string;
    userName: string;
    audio: string;
    video: string;
  }>();
  useKeepAwake();
  const { t } = useTranslation();
  const socket = getSocket();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [statusReq, setStatusReq] = useState(false);
  const [streamReady, setStreamReady] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [peers, dispatch] = useReducer(PeerReducer, {});
  const streamRef = useRef<MediaStream | null>(null);
  const peerConnections = useRef<Record<string, any>>({});
  const [numColumns, setNumColumns] = useState(2);
  const [activeMenu, setActiveMenu] = useState<"patient" | "diagnosis" | "menu" | "review">("menu");

  const {
    createPeer,
    createOffer,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    cleanupConnections,
  } = usePeerConnection({
    socket,
    streamRef,
    peerConnections,
    dispatch,
  });


  useEffect(() => {
    const updateColumns = () => {
      const screenWidth = Dimensions.get("window").width;

      if (screenWidth > 1200) setNumColumns(6); // extra large tablet
      else if (screenWidth > 900) setNumColumns(4); // large tablet
      else if (screenWidth > 600) setNumColumns(3); // small tablet
      else setNumColumns(2); // phone
    };

    updateColumns(); // initial

    const subscription = Dimensions.addEventListener("change", updateColumns);
    return () => subscription.remove();
  }, []);

  /* INIT MEDIA */
  useEffect(() => {
    const init = async () => {
      try {
        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        console.log("Local stream initialized:", stream.toURL());
        console.log(
          "Tracks:",
          stream.getTracks().map((t) => `${t.kind}: ${t.enabled}`)
        );
        streamRef.current = stream;
        setLocalStream(stream);
        setStreamReady(true);
      } catch (error) {
        console.error("Failed to get local stream:", error);
      }
    };

    init();

    setIsVideoOn(video === "1");
    setIsMicOn(audio === "1");
    return cleanupConnections;
  }, []);

  const handleLeave = useCallback(() => {
    Alert.alert("Leave", "Are you sure you want to leave the call?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          setIsMicOn(false);
          setIsVideoOn(false);
          emitSocket("doctor:end-case", { caseId: roomId });

          if (Provider.Profile?.role == user_role.d) {
            router.replace({
              pathname: "/main/pages/summarizePage",
              params: {
                consult_id: roomId,
              },
            });
          }
          cleanupConnections();
        },

      },
    ]);

  }, [cleanupConnections, socket]);

  /* SOCKET EVENTS */
  useEffect(() => {
    if (!streamReady) return;

    const onConnect = () => {
      console.log(
        `📡 Attempting to join room: ${roomId}. Socket ID: ${socket.id}`
      );
      if (!socket.connected) {
        console.warn("⚠️ Socket not connected, waiting for connection...");
        return;
      }

      socket.emit(
        "join-room",
        {
          roomId,
          username: userName,
          hasAudio: audio === "1",
          hasVideo: video === "1",
        },
        (others: any[]) => {
          if (!others) {
            console.error("❌ Join-room failed: No response from server");
            return;
          }
          console.log(
            `✅ Joined room successfully. ${others.length} other(s) present.`
          );
          others.forEach((p) => {
            if (peerConnections.current[p.id]) return;
            const peer = createPeer(p.id);
            dispatch({
              type: "ADD_PEER",
              id: p.id,
              username: p.username,
              hasAudio: p.hasAudio,
              hasVideo: p.hasVideo,
            });
            createOffer(p.id);
          });
        }
      );
    };

    console.log(
      `🔄 Effect triggered: streamReady=${streamReady}, socketConnected=${socket.connected}`
    );

    const handleSocketConnect = () => {
      console.log("💎 Socket connected event fired");
      onConnect();
    };

    if (!socket.connected) {
      console.log("🔌 Forcing socket connection...");
      socket.connect();
    } else {
      onConnect();
    }

    socket.on("connect", handleSocketConnect);

    socket.on("connect_error", (err) => {
      console.error("🔌 Socket Connection Error:", err.message);
    });

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    socket.on("peer-media-updated", ({ id, hasAudio, hasVideo }) => {
      dispatch({
        type: "UPDATE_PEER_MEDIA",
        id,
        hasAudio,
        hasVideo,
      });
    });

    socket.on("user-connected", ({ id, username, hasAudio, hasVideo }) => {
      if (peerConnections.current[id]) return;
      const peer = createPeer(id);

      dispatch({
        type: "ADD_PEER",
        id,
        username,
        hasAudio,
        hasVideo,
      });
    });

    socket.on("user-disconnected", (id) => {
      peerConnections.current[id]?.close();
      delete peerConnections.current[id];
      dispatch({ type: "REMOVE_PEER", id });
    });
    return () => {
      socket.off("connect", handleSocketConnect);
      socket.off("connect_error");
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("peer-media-updated");
      socket.off("user-connected");
      socket.off("user-disconnected");
    };
  }, [streamReady, roomId, userName, audio, video]);


  useEffect(() => {
    if (!streamReady) return;

    try {
      const manager: any = InCallManager;
      if (manager && typeof manager.start === "function") {
        manager.start({ media: "video" });
        if (typeof manager.setSpeakerphoneOn === "function") {
          manager.setSpeakerphoneOn(true);
        }
        console.log("🔊 InCallManager started (Speaker: ON)");
      }
    } catch (e: any) {
      console.warn("❌ InCallManager start failed:", e.message);
    }

    return () => {
      try {
        const manager: any = InCallManager;
        if (manager && typeof manager.stop === "function") {
          manager.stop();
          console.log("🔇 InCallManager stopped");
        }
      } catch (e) {
        console.warn("⚠️ Failed to stop InCallManager");
      }
    };
  }, [streamReady]);


  const handlePatientSubmit = (data: PatientDataForm) => {
    console.log('ข้อมูลผู้ป่วยที่บันทึก:', data);

    // ตัวอย่าง: ส่งข้อมูลไป API
    // fetch('https://example.com/api/patient', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data),
    // });

    Alert.alert('ข้อมูลถูกส่งไปเรียบร้อย', JSON.stringify(data, null, 2));
  };

  return (
    <SafeAreaView className="flex-1 bg-black h-full">
      <View className="h-1/3">
        <VideoGrid peers={peers} />
        <LocalVideo
          localID={socket.id}
          localName={Provider.Profile?.name || "คุณ"}
          stream={localStream}
          isMicOn={isMicOn}
          isVideoOn={isVideoOn}
        />
        {localStream && (
          <ControlButtons
            stream={localStream}
            socket={socket}
            isMicOn={isMicOn}
            isVideoOn={isVideoOn}
            setIsMicOn={setIsMicOn}
            setIsVideoOn={setIsVideoOn}
            onLeave={handleLeave}
          />
        )}
      </View>

      {activeMenu === "menu" && <View
        className="flex flex-col justify-between absolute left-0 right-0 bg-white rounded-t-[16px]"
        style={{
          top: overlayTop,
          bottom: insets.bottom,
        }}
      >
        <ScrollView className="p-4 mt-[16px]">
          <View className="flex-1 flex-row items-center mx-4">
            {/* Profile Image */}
            <View className="relative h-20 min-w-20 bg-black/70 rounded-xl">
              {Provider.Profile?.profile_image_url ? (
                <Image
                  source={{
                    uri: Provider.HostApi + Provider.Profile.profile_image_url,
                  }}
                  style={{ height: "100%", borderRadius: 16 }}
                  resizeMode="contain"
                />
              ) : (
                <View className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 items-center justify-center">
                  <FontAwesome name="user-md" size={32} color="" />
                </View>
              )}

            </View>

            {/* Profile Info */}
            <View className="flex-1 ml-2">
              <Text className={`text-black dark:text-white my-1`}>
                Mr. John Tao
              </Text>
              <Text
                className={`text-gray-500 dark:text-gray-400 mb-1`}
              >
                Age: 30
              </Text>
            </View>
          </View>
          <View className="flex-row border-t border-gray-200 m-4" />
          <View>
            {/* menu */}
            <View>
              <MenuCard
                title="Patient Data"
                detail="View patient data"
                icon="user-md"
                onPress={() => { setActiveMenu("patient") }}
              /><MenuCard
                title="Diagnosis"
                detail="Clinical assessment"
                icon="stethoscope"
                onPress={() => { setActiveMenu("diagnosis") }}
              />
            </View>
          </View>

        </ScrollView>
        <Pressable
          onPress={handleLeave}
          className={`m-4 h-[56px] rounded-[16px] items-center justify-center bg-[#FB6469]`}
        >
          <View className="flex-row items-center gap-2">
            <FontAwesome name="phone" size={18} color="white" />
            <Text className="text-white">End case</Text>
          </View>
        </Pressable>
      </View >
      }
      {(activeMenu === "diagnosis" || activeMenu === "review") &&
        <View className="flex flex-col justify-between absolute left-0 right-0 bg-white rounded-t-[16px]"
          style={{
            top: overlayTop,
            bottom: insets.bottom,
          }}
        >
          <View className="p-4 flex-row items-center">
            {activeMenu === "review" ? <View className="w-10" /> : <Pressable onPress={() => setActiveMenu("menu")} className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
              <FontAwesome5 name="angle-left" size={24} color="black" />
            </Pressable>}

            {/* Center Title */}
            <View className="flex-1 items-center">
              <Text className={`${TEXT.subtitle} font-semibold text-gray-900`}>
                Diagnosis
              </Text>
            </View>

            {/* Spacer to balance left icon */}
            <View className="w-10" />
          </View>
          <PatientForm onSubmit={handlePatientSubmit} onReview={() => setActiveMenu("review")} onCancel={() => setActiveMenu("diagnosis")} />

        </View>}
      {activeMenu === "patient" &&
        <View className="flex flex-col absolute left-0 right-0 bg-white rounded-t-[16px]"
          style={{
            top: overlayTop,
            bottom: insets.bottom,
          }}
        >
          <View className="p-4 flex-row items-center">
            <Pressable onPress={() => setActiveMenu("menu")} className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
              <FontAwesome5 name="angle-left" size={24} color="black" />
            </Pressable>

            {/* Center Title */}
            <View className="flex-1 items-center">
              <Text className={`${TEXT.subtitle} font-semibold text-gray-900`}>
                Patient Data
              </Text>
            </View>

            {/* Spacer to balance left icon */}
            <View className="w-10" />
          </View>

          <ScrollView className="flex-1">
            <View className="flex-row items-center mx-4">
              {/* Profile Image */}
              <View className="relative h-20 min-w-20 bg-black/70 rounded-xl">
                {Provider.Profile?.profile_image_url ? (
                  <Image
                    source={{
                      uri: Provider.HostApi + Provider.Profile.profile_image_url,
                    }}
                    style={{ height: "100%", borderRadius: 16 }}
                    resizeMode="contain"
                  />
                ) : (
                  <View className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 items-center justify-center">
                    <FontAwesome name="user-md" size={32} color="" />
                  </View>
                )}

              </View>
              <View className="flex-1 ml-2">
                <Text className={`text-black dark:text-white my-1`}>
                  Mr. John Tao
                </Text>
                <Text
                  className={`text-gray-500 dark:text-gray-400 mb-1`}
                >
                  Age: 30
                </Text>

                {statusReq ? (
                  <Text className="text-gray-500 dark:text-gray-400 mb-1">
                    PMH : ไม่มี
                  </Text>
                ) : (
                  <View className="flex-row items-center">
                    <Text className="text-gray-500 dark:text-gray-400 mb-1">
                      PMH : </Text>
                    <View className="px-2 flex flex-row flex-wrap">
                      <View className="rounded-xl overflow-hidden">
                        <Skeleton width={100} radius={4} colorMode="light" />
                      </View>
                      <BlurView
                        intensity={100}
                        tint="light"
                        className="absolute top-0 left-0 right-0 bottom-0 rounded-xl overflow-hidden justify-center"
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>
            <View className="flex-row border-t border-gray-200 m-4" />

            {statusReq ? (
              <View className="px-4 flex flex-row flex-wrap justify-between gap-y-4 pb-4">
                {patientData.map((item, index) => (
                  <PatientDataCard key={index} data={item} loading={false} />
                ))}
              </View>
            ) : (
              <View>
                <View className="px-4 flex flex-row flex-wrap justify-between gap-y-4">
                  {patientMockData.map((item, index) => (
                    <PatientDataCard key={index} data={item} loading={false} />
                  ))}
                </View>
                <BlurView
                  intensity={100}
                  tint="light"
                  className="absolute top-0 left-0 right-0 bottom-0 rounded-xl overflow-hidden p-5 mx-4 justify-center"
                />
                <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center mx-4">
                  <Pressable
                    className="items-center justify-center bg-[#33AAE1] py-4 px-8 rounded-[16px] shadow-lg"
                    onPress={() => setStatusReq(true)}
                  >
                    <Text className="text-white">Request Patient Consent</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>

        </View>}
    </SafeAreaView >
  );
}
