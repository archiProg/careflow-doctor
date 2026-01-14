// src/app/videoCall.tsx
import ControlButtons from "@/components/rtc/controlButtons";
import LocalVideo from "@/components/rtc/localVideo";
import VideoGrid from "@/components/rtc/videoGrid";
import { user_role } from "@/constants/enums";
import { usePeerConnection } from "@/hooks/usePeerConnection";
import { PeerReducer } from "@/reducers/peerReducer";
import Provider from "@/services/providerService";
import { emitSocket, getSocket } from "@/utilitys/socket";
import { useKeepAwake } from "expo-keep-awake";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { View } from "react-native";
import InCallManager from "react-native-incall-manager";
import { SafeAreaView } from "react-native-safe-area-context";
import { mediaDevices, MediaStream } from "react-native-webrtc";
export default function DoctorCall() {
  const router = useRouter();

  useKeepAwake();
  const socket = getSocket();
  const { roomId, userName, audio, video } = useLocalSearchParams<{
    roomId: string;
    userName: string;
    audio: string;
    video: string;
  }>();

  const [streamReady, setStreamReady] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [peers, dispatch] = useReducer(PeerReducer, {});
  const streamRef = useRef<MediaStream | null>(null);
  const peerConnections = useRef<Record<string, any>>({});

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

  /* HANDLE LEAVE */
  const handleLeave = useCallback(() => {
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
    socket.disconnect();
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
    <SafeAreaView className="flex-1 bg-black h-full p-4 ">
      <View className="flex-1 h-full">
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
      <View className="flex-1 h-full bg-red-500"></View>
    </SafeAreaView>
  );
}
