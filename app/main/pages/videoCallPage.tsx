// src/app/videoCall.tsx
import ControlButtons from "@/components/rtc/controlButtons";
import LocalVideo from "@/components/rtc/localVideo";
import VideoGrid from "@/components/rtc/videoGrid";
import DiagnosisOverlay from "@/components/videoCall/DiagnosisOverlay";
import HistoryDetailOverlay from "@/components/videoCall/HistoryDetailOverlay";
import HistoryOverlay from "@/components/videoCall/HistoryOverlay";
import PatientMenuSheet from "@/components/videoCall/PatientMenuSheet";
import PatientOverlay from "@/components/videoCall/PatientOverlay";
import { user_role } from "@/constants/enums";
import { usePeerConnection } from "@/hooks/usePeerConnection";
import { PeerReducer } from "@/reducers/peerReducer";
import Provider from "@/services/providerService";
import { RequestApi } from "@/services/requestApiService";
import { RootState } from "@/stores/index";
import { PatientMedicalHistory } from "@/types/diagnosisHistory";
import {
  AddTreatmentPayload,
  ConsultInfo,
  PatientDataForm,
  PatientInfo,
  PatientMeasurement,
} from "@/types/patientData";
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
import { useTranslation } from "react-i18next";
import { Alert, Dimensions, View } from "react-native";
import InCallManager from "react-native-incall-manager";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { mediaDevices, MediaStream } from "react-native-webrtc";
import { useSelector } from "react-redux";

const { height: screenHeight } = Dimensions.get("window");
const videoHeight = Math.max(screenHeight / 3, 280); // h-1/3

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
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [retryAt, setRetryAt] = useState<number | null>(null);
  const [cooldownLeft, setCooldownLeft] = useState<number>(0);
  const [patientMeasurement, setPatientMeasurement] =
    useState<PatientMeasurement | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [peers, dispatch] = useReducer(PeerReducer, {});
  const streamRef = useRef<MediaStream | null>(null);
  const peerConnections = useRef<Record<string, any>>({});
  const [numColumns, setNumColumns] = useState(2);
  const [activeMenu, setActiveMenu] = useState<
    | "patient"
    | "diagnosis"
    | "menu"
    | "sumDiagnosis"
    | "history"
    | "showDetailHistory"
  >("menu");

  const [patientDataForm, setPatientDataForm] =
    useState<PatientDataForm | null>(null);
  const [selectedRecord, setSelectedRecord] =
    useState<PatientMedicalHistory | null>(null);
  const [medicalHistory, setMedicalHistory] = useState<
    PatientMedicalHistory[] | []
  >([]);
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

  const consultInfo = useSelector(
    (state: RootState) => state.consult.info,
  ) as ConsultInfo | null;

  const GetTreatment = async () => {
    const info: PatientInfo | null =
      consultInfo?.patient_info ?? consultInfo?.patientInfo ?? null;
    if (!info) return;
    const api = new RequestApi();
    try {
      const response = await api.postApiJwt(
        "/get-treatment",
        JSON.stringify({
          patient_id: info.patient_id,
          date_start: null,
          date_end: null,
        }),
      );

      if (response.success && response.response) {
        const data = JSON.parse(response.response);
        setMedicalHistory(data);
        setPatientInfo(info);
      }
    } catch (error) {
      console.error("GetTreatment error:", error);
      Alert.alert(t("error.permission"), t("error.loadTreatmentFailed"), [
        { text: t("ok"), style: "cancel" },
      ]);
    }
  };

  useEffect(() => {
    GetTreatment();
  }, []);

  useEffect(() => {
    const updateColumns = () => {
      const screenWidth = Dimensions.get("window").width;

      if (screenWidth > 1200)
        setNumColumns(6); // extra large tablet
      else if (screenWidth > 900)
        setNumColumns(4); // large tablet
      else if (screenWidth > 600)
        setNumColumns(3); // small tablet
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
        const wantAudio = audio === "1";
        const wantVideo = video === "1";

        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        if (!wantAudio) {
          stream.getAudioTracks().forEach((t) => (t.enabled = false));
        }

        if (!wantVideo) {
          stream.getVideoTracks().forEach((t) => (t.enabled = false));
        }

        streamRef.current = stream;
        setLocalStream(stream);
        setStreamReady(true);

        console.log(
          "Tracks:",
          stream.getTracks().map((t) => `${t.kind}:${t.enabled}`),
        );
      } catch (error) {
        console.error("Failed to get local stream:", error);
        Alert.alert(t("error.permission"), t("error.mediaDevicesFailed"), [
          { text: t("ok"), style: "cancel" },
        ]);
      }
    };
    init();

    setIsVideoOn(video === "1");
    setIsMicOn(audio === "1");
    return cleanupConnections;
  }, []);

  const handleLeave = useCallback(() => {
    Alert.alert(t("leave"), t("leave-call-description"), [
      {
        text: t("cancel"),
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: t("ok"),
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
        `📡 Attempting to join room: ${roomId}. Socket ID: ${socket.id}`,
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
            Alert.alert(t("error.permission"), t("error.joinRoomFailed"), [
              { text: t("ok"), style: "cancel" },
            ]);
            return;
          }
          console.log(
            `✅ Joined room successfully. ${others.length} other(s) present.`,
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
            console.log("p : ");
            console.log(p);
          });
        },
      );
    };

    console.log(
      `🔄 Effect triggered: streamReady=${streamReady}, socketConnected=${socket.connected}`,
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

    const onDoctorPatientInfo = (data: any) => {
      console.log("👨‍⚕️ doctor:patient_info", data);

if (data.message) {
  Alert.alert(
    "ไม่ได้รับอนุญาต",
    "ผู้ป่วยไม่อนุญาตให้เข้าถึงข้อมูลสุขภาพย้อนหลัง กรุณาขออนุญาตอีกครั้งหากจำเป็น",
    [{ text: "ปิด" }]
  );
  setStatusReq(false);
  return;
}

      if (data.patient_measurement) {
        console.log("data.patient_measurement : ");
        console.log(data.patient_measurement);
        console.log("data.patient_info : ");
        console.log(data.patient_info);
        setPatientMeasurement(data.patient_measurement);
      } else {
        setStatusReq(false); // ใช้แสดง loading / waiting
        return;
      }
    };
    const onDoctorcooldown = (data: any) => {
      if (data.retryAt) {
        setRetryAt(data.retryAt);
        setStatusReq(false);
      }
    };

    socket.on("connect", handleSocketConnect);

    socket.on("connect_error", (err) => {
      console.error("🔌 Socket Connection Error:", err.message);
      Alert.alert(t("error.permission"), t("error.socketConnectError"), [
        { text: t("ok"), style: "cancel" },
      ]);
    });

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("doctor:req-permission:cooldown", onDoctorcooldown);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("doctor:patient_info", onDoctorPatientInfo);
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
      socket.off("doctor:patient_info", onDoctorPatientInfo);
      socket.off("doctor:req-permission:cooldown", onDoctorcooldown);
    };
  }, [streamReady, roomId, userName, audio, video]);

  useEffect(() => {
    if (!retryAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((retryAt - now) / 1000));

      setCooldownLeft(diff);

      if (diff <= 0) {
        setRetryAt(null);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [retryAt]);

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
      Alert.alert(t("error.permission"), t("error.audioFailed"), [
        { text: t("ok"), style: "cancel" },
      ]);
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

  const handlePatientSubmit = async () => {
    if (!roomId) {
      Alert.alert(t("error.permission"), t("error.generalError"), [
        { text: t("ok"), style: "cancel" },
      ]);
      return;
    }

    if (!patientDataForm) {
      Alert.alert(t("notification"), t("PleaseAddSymptoms"), [
        { text: t("ok"), style: "cancel" },
      ]);
      return;
    }

    const api = new RequestApi();

    const payload: AddTreatmentPayload = {
      consult_id: roomId,
      symptoms: patientDataForm.symptoms ?? "ไม่ระบุ",
      diagnosis: patientDataForm.diagnosis ?? "ไม่ระบุ",
      medication: patientDataForm.medication?.trim() ?? "ไม่ระบุ",
      need_hospital: patientDataForm.needHospital ?? false,
      note: patientDataForm.doctorNote ?? "ไม่ระบุ",
    };

    try {
      const response = await api.postApiJwt(
        "/add-treatment",
        JSON.stringify(payload),
      );

      if (response.success) {
        Alert.alert(t("saveFormSuccess"));
        setActiveMenu("menu");
      } else {
        Alert.alert(t("error.permission"), t("saveFormError"), [
          { text: t("ok"), style: "cancel" },
        ]);
      }
    } catch (error) {
      console.error("add-treatment error:", error);
      Alert.alert(t("error.permission"), t("error.saveFailed"), [
        { text: t("ok"), style: "cancel" },
      ]);
    }
  };

  const onSetPatientDataForm = (data: PatientDataForm) => {
    if (data) {
      setPatientDataForm({
        ...data,
        userName: Object.entries(peers)
          .map(([key, value]) => value.username)
          .join(", "),
      });
      setActiveMenu("sumDiagnosis");
    } else {
      alert(t("PleaseAddSymptoms"));
    }
  };

  const handleRecordPress = (record: PatientMedicalHistory) => {
    console.log("Selected record:", record);
    setSelectedRecord(record);
    setActiveMenu("showDetailHistory");
  };

  const handleRequestPermission = () => {
    if (!roomId) return;
    emitSocket("doctor:req-permission", {
      caseId: roomId,
    });
    setStatusReq(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-black h-full">
      <View className="h-1/3">
        <VideoGrid peers={peers} />
        <LocalVideo
          localID={socket.id}
          localName={Provider.Profile?.name || t("N/A")}
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
      {activeMenu === "menu" && (
        <PatientMenuSheet
          activeMenu={activeMenu}
          overlayTop={overlayTop}
          insets={insets}
          patientInfo={patientInfo}
          setActiveMenu={setActiveMenu}
          handleLeave={handleLeave}
        />
      )}

      {(activeMenu === "diagnosis" || activeMenu === "sumDiagnosis") && (
        <DiagnosisOverlay
          activeMenu={activeMenu}
          overlayTop={overlayTop}
          insets={insets}
          patientDataForm={patientDataForm}
          onSetPatientDataForm={onSetPatientDataForm}
          onBackToMenu={() => setActiveMenu("menu")}
          onReview={() => setActiveMenu("sumDiagnosis")}
          onBackToDiagnosis={() => setActiveMenu("diagnosis")}
          onSubmit={handlePatientSubmit}
        />
      )}

      {activeMenu === "patient" && (
        <PatientOverlay
          overlayTop={overlayTop}
          retryAt={retryAt}
          cooldownLeft={cooldownLeft}
          insets={insets}
          patientInfo={patientInfo}
          statusReq={statusReq}
          patientData={patientMeasurement}
          patientMockData={patientMockData}
          onBackToMenu={() => setActiveMenu("menu")}
          onRequestConsent={handleRequestPermission}
        />
      )}

      {activeMenu === "history" && (
        <HistoryOverlay
          overlayTop={overlayTop}
          retryAt={retryAt}
          cooldownLeft={cooldownLeft}
          insets={insets}
          patientInfo={patientInfo}
          statusReq={statusReq}
          medicalHistory={medicalHistory}
          patientMockData={patientMockData}
          onBackToMenu={() => setActiveMenu("menu")}
          onRequestConsent={handleRequestPermission}
          onPatientRecordPress={handleRecordPress}
        />
      )}

      {activeMenu === "showDetailHistory" && selectedRecord && (
        <HistoryDetailOverlay
          record={selectedRecord}
          onBack={() => setActiveMenu("history")}
        />
      )}
    </SafeAreaView>
  );
}
