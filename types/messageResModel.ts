interface MessageModelResp {
  th: string;
  en: string;
  message?: string;
  [key: string]: string | undefined; // index signature สำหรับ dynamic key
}
