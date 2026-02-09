import { RequestApi } from "@/services/requestApiService";
import { FontAwesome5 } from "@expo/vector-icons";
import { Skeleton } from "moti/skeleton";
import React, { useState } from "react";
import LoadingMini from "@/components/loadingMini";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";

/* ---------- Color Palette (White–Blue) ---------- */
const colors = {
  white: "#FFFFFF",
  offWhite: "#F0F7FF", // card bg subtle
  lightBlue: "#E0EEFF", // grid item bg
  blue100: "#DBEAFE",
  blue300: "#93C5FD",
  blue500: "#3B82F6", // accent / primary blue
  blue600: "#2563EB", // darker blue
  blue700: "#1D4ED8",
  textPrimary: "#1E3A5F", // dark navy for headings
  textSecondary: "#4A7096", // muted blue-grey for labels
  textMuted: "#8AACC9", // lightest text
  border: "#C8DEF0", // subtle blue border
  shadow: "#1E3A5F", // shadow tint
};

/* ---------- Config ---------- */
const TYPE_CONFIG: Record<string, { label: string; unit?: string }> = {
  bmi: { label: "BMI" },
  bp: { label: "Blood Pressure" },
  bo: { label: "Blood Oxygen", unit: "%" },
  temp: { label: "Temperature", unit: "°C" },
  bs: { label: "Blood Sugar" },
  bf: { label: "Body Score" },
  whr: { label: "WHR" },
  ecg: { label: "ECG", unit: "bpm" },
  eye: { label: "Eyesight" },
  thxhdb: { label: "Glycated Hemoglobin" },
};

/* ---------- Utils ---------- */
const EXCLUDE_KEYWORDS = ["_normal", "dw", "ttype", "value_type"];

const isValidValue = (v: any) =>
  v !== undefined && v !== null && v !== "" && !Number.isNaN(v);

const prettifyKey = (key: string) => {
  const map: Record<string, string> = {
    sbp: "SBP",
    dbp: "DBP",
    hr: "HR",
    bpm: "BPM",
    os: "SpO₂",
    tempv: "Temp",
    value: "Value",
  };
  return map[key] ?? key.toUpperCase();
};

const extractDisplayItems = (
  values: any,
  unit?: string,
): { label: string; value: string }[] => {
  if (!values || typeof values !== "object") return [];
  return Object.entries(values)
    .filter(([key, value]) => {
      if (!isValidValue(value)) return false;
      if (EXCLUDE_KEYWORDS.some((k) => key.includes(k))) return false;
      return true;
    })
    .map(([key, value]) => ({
      label: prettifyKey(key),
      value: `${value}${unit ?? ""}`,
    }));
};

/* ---------- Layout ---------- */
const { width: screenWidth } = Dimensions.get("window");
const cardWidth = screenWidth - 20;

interface PatientInfo {
  patient_id?: number;
  name?: string;
  age?: number;
  profile_image_url?: string;
  birthday?: string;
  sex?: number;
}

/* ---------- Props ---------- */
type Props = {
  data?: any;
  loading?: boolean;
  patientInfo?: PatientInfo | null;
};

/* ---------- Grid Metrics ---------- */
function GridMetrics({ items }: { items: { label: string; value: string }[] }) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      {items.map((item, index) => (
        <View
          key={index}
          style={{
            backgroundColor: colors.lightBlue,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: 8,
            paddingHorizontal: 14,
            alignItems: "center",
            justifyContent: "center",
            minWidth: 72,
          }}
        >
          {/* Value */}
          <Text
            numberOfLines={1}
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: colors.blue600,
              textAlign: "center",
            }}
          >
            {item.value}
          </Text>

          {/* Label */}
          <Text
            numberOfLines={1}
            style={{
              fontSize: 10,
              fontWeight: "500",
              color: colors.textSecondary,
              textAlign: "center",
              marginTop: 2,
            }}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

/* ---------- Date Formatter ---------- */
const formatDate = (dateString?: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/* ---------- Component ---------- */
export default function PatientDataCard({
  data,
  loading = false,
  patientInfo,
}: Props) {
  const { t } = useTranslation();
  const type = data?.type;
  const values = data?.values;
  const created_at = data?.created_at;
  const type_id = data?.type_id;
  const patient_id = patientInfo?.patient_id;
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const config = TYPE_CONFIG[type] ?? {
    label: typeof type === "string" ? type.toUpperCase() : "UNKNOWN",
  };

  const displayItems = React.useMemo(
    () => extractDisplayItems(values, config.unit),
    [values, config.unit],
  );

  const getpatientmeasurement = async () => {
    if (!patient_id || !type_id) {
      console.log("patient_id: ", patient_id, "type_id: ", type_id);
      return;
    }
    setLoadingHistory(true)
    const api = new RequestApi();
    try {
      const response = await api.postApiJwt(
        "/getpatientmeasurement",
        JSON.stringify({
          patient_id: patient_id,
          type_id: type_id,
          date_start: null,
          date_end: null,
        }),
      );

      if (response.success && response.response) {
        const data = JSON.parse(response.response);
        setHistory(data);
        setShowHistory(true);
        setLoadingHistory(false)
      }
    } catch (error) {
      console.error("GetTreatment error:", error);
      setLoadingHistory(false)
    }
  };

  /* ---- Render ---- */
  return (
    <View
      style={{
        width: cardWidth,
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 14,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      {/* ---- Loading Skeleton ---- */}
      {loading || !data ? (
        <View style={{ gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width="100%" height={28} />
          ))}
        </View>
      ) : (
        <>
          {/* ---- Header Row: Title + Date ---- */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
              paddingBottom: 10,
              borderBottomWidth: 1,
              borderBottomColor: colors.blue100,
            }}
          >
            {/* Title */}
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: colors.textPrimary,
                letterSpacing: 0.3,
              }}
            >
              {config.label}
            </Text>

            {/* Date badge */}
            <View
              style={{
                backgroundColor: colors.offWhite,
                borderWidth: 1,
                borderColor: colors.blue100,
                borderRadius: 6,
                paddingVertical: 2,
                paddingHorizontal: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "500",
                  color: colors.textSecondary,
                }}
              >
                {formatDate(created_at)}
              </Text>
            </View>
          </View>

          {/* ---- Content ---- */}
          {displayItems.length === 0 ? (
            <Text
              style={{
                fontSize: 13,
                color: colors.textMuted,
                fontStyle: "italic",
              }}
            >
              {t("no-data-available")}
            </Text>
          ) : (
            <GridMetrics items={displayItems} />
          )}

{displayItems.length > 0 &&
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 12,
              paddingTop: 10,
              borderTopWidth: 1,
              borderTopColor: colors.blue100,
            }}
          >
            {/* Title */}
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: colors.textPrimary,
                letterSpacing: 0.3,
              }}
            >
              {/* {config.label} */}
            </Text>

            {/* Date badge */}
            <View
              style={{
                // backgroundColor: colors.offWhite,
                // borderWidth: 1,
                // borderColor: colors.blue100,
                // borderRadius: 6,
                paddingVertical: 2,
                paddingHorizontal: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: colors.blue600,
                }}
                onPress={getpatientmeasurement}
              >
                {t("measurement-history")}
                {" >"}
              </Text>
            </View>
          </View>
}
        </>
      )}
      {showHistory && (
        <Modal visible={showHistory} animationType="slide" transparent>
          {/* Background overlay - แยกออกมา */}
          <Pressable
            onPress={() => setShowHistory(false)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          />

          {/* Content - ไม่ซ้อนใน Pressable */}
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
            }}
            pointerEvents="box-none"
          >
            <View
              style={{
                height: "72%",
                backgroundColor: colors.white,
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
                padding: 14,
                paddingBottom: 48,
              }}
            >
              {/* ---- Header ---- */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Pressable
                  onPress={() => setShowHistory(false)}
                  style={{ padding: 6, marginRight: 8 }}
                >
                  <FontAwesome5
                    name="angle-left"
                    size={22}
                    color={colors.textPrimary}
                  />
                </Pressable>

                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: colors.textPrimary,
                  }}
                >
                  {config.label} {t("history")}
                </Text>
              </View>

              {/* ---- Scrollable content ---- */}
              <ScrollView
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingBottom: 20 }}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
              >
                {loadingHistory ? (
                  <View>
                    <LoadingMini/>
                  </View>
                ) : history.length === 0 ? (
                  <Text
                    style={{
                      textAlign: "center",
                      color: colors.textMuted,
                      marginTop: 20,
                    }}
                  >
                    {t("no-history-available")}
                  </Text>
                ) : (
                  history.map((item, index) => {
                    const items = extractDisplayItems(item.values, config.unit);

                    return (
                      <View
                        key={index}
                        style={{
                          borderWidth: 1,
                          borderColor: colors.border,
                          borderRadius: 12,
                          padding: 12,
                          marginBottom: 10,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 12,
                            paddingBottom: 10,
                            borderBottomWidth: 1,
                            borderBottomColor: colors.blue100,
                          }}
                        >
                          {/* Title */}
                          <Text>{/* {config.label} */}</Text>

                          {/* Date badge */}
                          <View
                            style={{
                              backgroundColor: colors.offWhite,
                              borderWidth: 1,
                              borderColor: colors.blue100,
                              borderRadius: 6,
                              paddingVertical: 2,
                              paddingHorizontal: 8,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 11,
                                fontWeight: "500",
                                color: colors.textSecondary,
                              }}
                            >
                              {formatDate(item.created_at)}
                            </Text>
                          </View>
                        </View>

                        <GridMetrics items={items} />
                      </View>
                    );
                  })
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
