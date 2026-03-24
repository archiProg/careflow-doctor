import i18n from "i18next";

interface MessageModelResp {
  th: string;
  en: string;
  message?: string;
  [key: string]: string | undefined; // index signature สำหรับ dynamic key
}

const useServerAlert = (rawMessage: string) => {
  const lang = i18n.language || "en";

  if (!rawMessage) return "Unknown error";

  let msg = rawMessage;

  const firstBraceIndex = msg.indexOf("{");
  if (firstBraceIndex !== -1) {
    msg = msg.substring(firstBraceIndex);
  }

  try {
    const messageObj = JSON.parse(msg) as MessageModelResp;
    return messageObj[lang] || messageObj.en || "Unknown error";
  } catch (err) {
    return msg;
  }
};

export { useServerAlert };

