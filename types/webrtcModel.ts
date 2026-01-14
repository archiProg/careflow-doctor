import { RTCIceCandidate, RTCSessionDescription } from "react-native-webrtc";

export type SignalingEvents = "ready" | "offer" | "answer" | "ice";

export interface OfferPayload extends RTCSessionDescription {}

export interface AnswerPayload extends RTCSessionDescription {}

export interface IcePayload extends RTCIceCandidate {}
