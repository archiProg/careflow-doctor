// src/app/videoCall.tsx
import PatientDataCard from "@/components/patientDataCard";
import ControlButtons from "@/components/rtc/controlButtons";
import LocalVideo from "@/components/rtc/localVideo";
import VideoGrid from "@/components/rtc/videoGrid";
import { user_role } from "@/constants/enums";
import { usePeerConnection } from "@/hooks/usePeerConnection";
import { PeerReducer } from "@/reducers/peerReducer";
import Provider from "@/services/providerService";
import { emitSocket, getSocket } from "@/utilitys/socket";
import { FontAwesome } from "@expo/vector-icons";
import { useKeepAwake } from "expo-keep-awake";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { Alert, Dimensions, Image, Pressable, ScrollView, Text, View } from "react-native";
import BlurView from 'react-native-blur-effect';
import InCallManager from "react-native-incall-manager";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { mediaDevices, MediaStream } from "react-native-webrtc";


const { height: screenHeight } = Dimensions.get("window");
const videoHeight = Math.max((screenHeight / 3), 280); // h-1/3

const overlayTop = videoHeight - 8; // เลื่อน overlay ขึ้น 16px


const patientMocData = [
  { title: "Weight", value: "55", unit: "kg" },
  { title: "Height", value: "160", unit: "cm" },
  { title: "BMI", value: "21.5", unit: "bpm" },
  { title: "Heart Rate", value: "72", unit: "Sys/Dia" },
];


export default function DoctorCall() {
  const { roomId, userName, audio, video } = useLocalSearchParams<{
    roomId: string;
    userName: string;
    audio: string;
    video: string;
  }>();
  useKeepAwake();
  const socket = getSocket();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [statusReq, setStatusReq] = useState(false);
  const [streamReady, setStreamReady] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [peers, dispatch] = useReducer(PeerReducer, {});
  const streamRef = useRef<MediaStream | null>(null);
  const peerConnections = useRef<Record<string, any>>({});
  const [numColumns, setNumColumns] = useState(2);

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
          // safeSendWs({
          //   cmd: ws_cmd.CALL_END,
          //   params: { consult_id: roomId },
          // });
          if (Provider.Profile?.role == user_role.d) {
            router.replace({
              pathname: "/main/pages/summarizePage",
              params: {
                consult_id: roomId,
              },
            });
          } else {
            //   router.replace({
            //     pathname: "/patient/Success",
            //     params: {
            //       consult_id: roomId,
            //     },
            //   });
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

  /* AUDIO MANAGEMENT (InCallManager) */
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

      <View
        className="flex flex-col justify-between absolute left-0 right-0 bg-white rounded-t-[16px]"
        style={{
          top: overlayTop,
          bottom: insets.bottom,
        }}
      >
        <ScrollView className="p-4 mt-[16px]">
          <View className="flex-row items-center bg-white p-4">
            {/* Profile Image */}
            <View className="relative h-32 min-w-32 bg-[#EEEEEE] rounded-[16px]">
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
            <View className="flex-1 ml-4">
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
                  <View className="p-4 flex flex-row flex-wrap">
                    <Text>First Text Element</Text>
                    <BlurView backgroundColor="rgba(255, 255, 255, 0.62)" blurRadius={4} />
                  </View>
                </View>

              )}
            </View>
          </View>
          <View className="flex-row border-t border-gray-200 m-4" />
          <View>
            {statusReq ? (
              <View className="p-4 flex flex-row flex-wrap justify-between">
                {patientMocData.map((item, index) => (
                  <PatientDataCard key={index} data={item} loading={loading} />
                ))}
              </View>
            ) : (
              <View className="flex flex-cols items-center m-4">
                <View className="p-4 flex flex-row flex-wrap justify-between">
                  {patientMocData.map((item, index) => (
                    <PatientDataCard key={index} data={item} loading={false} />
                  ))}
                  < BlurView backgroundColor="rgba(255, 255, 255, 0.62)" blurRadius={4} />
                </View>
                <Pressable className="flex-1 items-center justify-center bg-[#33AAE1] py-4 px-8 h-[64px] rounded-[16px]" onPress={() => setStatusReq(true)}>
                  <Text className="text-white">Request Patient Consent</Text>
                </Pressable>
              </View>
            )}
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
      </View>
    </SafeAreaView>
  );
}
