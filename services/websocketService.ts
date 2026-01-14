import { ws_cmd } from "@/constants/enums";

let ws: WebSocket | null = null;
let statusWS: "connecting" | "open" | "closed" | "error" = "closed";
let messageHandler: ((data: any) => void) | null = null;
let queue: string[] = [];

export const initWebSocket = (
  url: string,
  token: string,
  onMessage: (data: any) => void
) => {
  messageHandler = onMessage;

  if (
    ws &&
    (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  console.log("🔄 init WS");
  ws = new WebSocket(url);
  statusWS = "connecting";

  ws.onopen = () => {
    statusWS = "open";
    console.log("🟢 WS connected");

    safeSendWs({
      cmd: ws_cmd.LOGIN,
      params: { token },
    });

    queue.forEach((msg) => ws?.send(msg));
    queue = [];
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      messageHandler?.(data);
    } catch {
      console.error("❌ Invalid JSON");
    }
  };

  ws.onclose = () => {
    console.log("🔴 WS closed");
    statusWS = "closed";
    ws = null;
  };

  ws.onerror = (err) => {
    console.error("❌ WS error", err);
    statusWS = "error";
  };
};

export const safeSendWs = (data: any) => {
  const payload = JSON.stringify(data);

  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(payload);
  } else {
    queue.push(payload);
  }
};

export const closeWS = () => {
  if (ws && ws.readyState !== WebSocket.CLOSED) {
    ws.close();
  }
  ws = null;
  statusWS = "closed";
};

export const getWSStatus = () => statusWS;
