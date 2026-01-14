import { RootState } from "@/stores";
import { setConsultId, setConsultInfo } from "@/stores/consultSlice";
import {
    emitSocket,
    getSocket,
    listenSocket,
    offSocket,
} from "@/utilitys/socket";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function MainLayout() {
    const { status } = useSelector((state: RootState) => state.work);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        getSocket();
    }, []);

    useEffect(() => {
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
                console.log("🚪 force-logout");
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
    }, []);

    useEffect(() => {
        if (status === "start_work") {
            emitSocket("doctor:set-availability", { available: true });
        } else if (status === "paused_work" || status === "end_work") {
            emitSocket("doctor:set-availability", { available: false });
        }
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
    </Stack>;
}
